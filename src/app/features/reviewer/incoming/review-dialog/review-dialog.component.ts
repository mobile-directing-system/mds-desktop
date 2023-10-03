import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscription, interval, map, of, switchMap, tap } from 'rxjs';
import { Group } from 'src/app/core/model/group';
import { Importance } from 'src/app/core/model/importance';
import { Participant, Recipient } from 'src/app/core/model/message';
import { AddressBookService } from 'src/app/core/services/addressbook.service';
import { GroupService, GroupSort } from 'src/app/core/services/group.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { getParticipantLabel } from 'src/app/core/util/service';
import { OrderDir, PaginationParams } from 'src/app/core/util/store';
import { ReviewerIncomingMessageRow } from '../incoming-messages-view/incoming-messages-view.component';
import { MessageService } from 'src/app/core/services/message/message.service';

@Component({
  selector: 'app-review-dialog',
  templateUrl: './review-dialog.component.html',
  styleUrls: ['./review-dialog.component.scss']
})
export class ReviewDialog implements OnInit {

  form = this.fb.group({
    priority: this.fb.nonNullable.control<Importance>(Importance.None),
    roles: this.fb.nonNullable.control<string[]>([])
  });

  senderName: string = "";
  roles: Group[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: ReviewerIncomingMessageRow, private dialogRef: MatDialogRef<ReviewDialog>,
  private resourceService: ResourceService, private addressBookService: AddressBookService, private groupServerice: GroupService, private messageService: MessageService,
  private fb: FormBuilder) {}

  ngOnInit(): void {
    this.fetchRoles().subscribe(roles => this.roles = roles);
    this.getParticipantLabel(this.data.message.senderType, this.data.message.senderId).subscribe(name => {
      this.senderName = name ?? "";
    });
  }

  /**
   * Fetches the label of a participant by its id
   * 
   * @param type of the participant
   * @param id of the participant
   * @returns label of participant or undefined when the participant does not exist
   */
  getParticipantLabel(type?: Participant, id?: string): Observable<string | undefined> {
    return getParticipantLabel(this.resourceService, this.addressBookService, this.groupServerice, type, id);
  }

  /**
   * Fetch all available roles
   * 
   * @returns roles
   */
  fetchRoles(): Observable<Group[]> {
    return this.groupServerice.getGroups(new PaginationParams<GroupSort>(100, 0, GroupSort.ByTitle, OrderDir.Asc), {}).pipe(map(paginatedGroups => paginatedGroups.entries));
  }


  /**
   * Is called when submit button was clicked
   */
  submitClicked() {
    let updateMessage = this.messageService.getMessageById(this.data.message.id).pipe(switchMap(msg => {
      if(msg === undefined) return of(false);

      // Update message with fields of dialog
      msg.priority = this.form.controls.priority.value;
      let recipients: Recipient[] = this.form.controls.roles.value.map(roleId => <Recipient>{
        recipientType: Participant.Role,
          recipientId: roleId,
          read: false
      });
      msg.recipients = recipients;
      msg.needsReview = false;
      return this.messageService.updateMessage(msg);
    }));
    updateMessage.subscribe(successful => this.dialogRef.close(successful));
  }

  /**
   * Is called when cancel button was clicked
   */
  cancelClicked() {
    this.dialogRef.close();
  }
}
