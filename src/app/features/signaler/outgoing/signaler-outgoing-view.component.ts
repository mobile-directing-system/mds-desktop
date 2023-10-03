import {Component, OnDestroy} from '@angular/core';
import {Message, Participant, Recipient} from "../../../core/model/message";
import {first, map, Observable, of, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {WorkspaceService} from "../../../core/services/workspace.service";
import {NotificationService} from "../../../core/services/notification.service";
import {MessageService} from "../../../core/services/message/message.service";
import {AuthService} from "../../../core/services/auth.service";
import {Channel, ChannelType} from "../../../core/model/channel";
import {AddressBookService} from "../../../core/services/addressbook.service";
import {MatDialog} from "@angular/material/dialog";
import {ResourceService} from "../../../core/services/resource/resource.service";
import {GroupService} from "../../../core/services/group.service";
import {IncidentService} from "../../../core/services/incident/incident.service";
import {ChannelService} from "../../../core/services/channel.service";
import {DeliveryItemComponent} from "./delivery-item/delivery-item.component";
import {FormBuilder} from "@angular/forms";


/**
 * Passed to the DeliveryItemComponent to show a detailed view of the message to deliver
 */
export interface DeliveryItemDialogData {
  message: Message;
  senderLabel: string | undefined,
  incidentLabel: string | undefined,
  recipientLabel: string | undefined,
  recipientChannel: Channel | undefined
}

/**
 * Result options of the DeliveryItemComponent dialog
 */
export enum DeliveryItemDialogAction{
  Cancel,
  MarkAsSend
}


/**
 * Component that allows a signaler to pick up delivery jobs and mark them as completed.
 */
@Component({
  selector: 'app-signaler-outgoing-view',
  templateUrl: './signaler-outgoing-view.component.html',
  styleUrls: ['./signaler-outgoing-view.component.scss']
})
export class SignalerOutgoingView implements OnDestroy{

  /**
   * Currently selected operation in the workspace
   */
  private operationId: string | undefined = undefined;
  /**
   * Currently picked up message if that is the case
   */
  pickedUpMessage: Message | undefined = undefined;
  /**
   * Subscription array for cleaning up on destroy
   */
  private s: Subscription[] = [];

  /**
   * Form control of the selected channel type.
   * That allows a signaler to filter for specific channel types.
   */
  selectedChannelControl = this.fb.nonNullable.control<ChannelType | undefined>(undefined);


  constructor(private router: Router, private route: ActivatedRoute,
              private messageService: MessageService, private workspaceService: WorkspaceService,
              private notificationService: NotificationService,
              private authService: AuthService, private addressBookService: AddressBookService, public dialog: MatDialog,
              private resourceService: ResourceService, private groupService: GroupService,
              private incidentService: IncidentService, private channelService: ChannelService,
              private fb: FormBuilder) {
    this.workspaceService.operationChange().subscribe((operationId: string | undefined)=>{
      this.operationId = operationId;
    });
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());

    // release picked up message to deliver if exists
    if(this.pickedUpMessage){
      this.messageService.releaseMessageToDeliver(this.pickedUpMessage).pipe(first()).subscribe(
        {
          next: _ => {
            this.pickedUpMessage = undefined;
            this.notificationService.notifyUninvasiveShort($localize`Released current radio delivery.`);
          },
          error: _ => {
            this.notificationService.notifyUninvasiveShort($localize`Releasing current radio delivery failed.`);
          }
        }
      )
    }

  }

  /**
   * Picks up next available {@link Message} to deliver for the currently selected operation and opens dialog.
   */
  pickUpNextMessageToDeliver(): void {

    this.getSelectedChannelType();

    // get loggedInUserId
    let loggedInUserId = this.authService.loggedInUser();
    if(!loggedInUserId){
      this.notificationService.notifyUninvasiveShort($localize`Picking up next message to deliver failed, logged in user id not available.`);
      return;
    }

    if(this.operationId){
      // get message
      this.s.push(this.messageService.pickUpNextMessageToDeliver(loggedInUserId, this.getSelectedChannelType()).subscribe({
        next: message => {
          this.pickedUpMessage = message;
          if(message == undefined){
            this.notificationService.notifyUninvasiveShort($localize`Currently no message to deliver available.`);
            return;
          }

          // get sender label
          this.getParticipantLabel(message.senderType, message.senderId).subscribe(senderLabel => {
            //get incident label
            this.getIncidentLabel(message.incidentId).subscribe(incidentLabel => {
              // get recipientLabel
              this.getParticipantLabel(message.recipients.at(0)?.recipientType, message.recipients.at(0)?.recipientId).subscribe(recipientLabel => {
                // get recipientChannel
                this.getChannel(message.recipients.at(0)).subscribe(recipientChannel => {
                  // open dialog
                  this.openDeliveryItemDialog({
                    message: message,
                    senderLabel: senderLabel,
                    incidentLabel: incidentLabel,
                    recipientLabel: recipientLabel,
                    recipientChannel: recipientChannel
                  });
                });
              });
            });
          });


        },
        error: _ => {
          this.notificationService.notifyUninvasiveShort($localize`Picking up next message to deliver failed.`);
        },
      }));
    }else{
      this.notificationService.notifyUninvasiveShort($localize`Please select an operation for this workspace before.`);
    }

  }

  /**
   * Opens the DeliveryItemDialog with the passed data.
   * Subscribes to dialog close event to call markCurrentMessageAsSend or releaseCurrentMessage depending on the result of the dialog
   */
  openDeliveryItemDialog(data: DeliveryItemDialogData){
    const dialogRef = this.dialog.open(DeliveryItemComponent, {
      data: data,
    });
    dialogRef.afterClosed().subscribe((action: DeliveryItemDialogAction) => {
      if(action === DeliveryItemDialogAction.MarkAsSend){
        this.markCurrentMessageAsSend();
      }else{
        this.releaseCurrentMessage();
      }
    });
  }

  /**
   * Releases currently picked up {@link Message}.
   */
  releaseCurrentMessage(){
    if(this.pickedUpMessage){
      this.messageService.releaseMessageToDeliver(this.pickedUpMessage).subscribe(
        {
          next: success => {
            if(success){
              this.pickedUpMessage = undefined;
              this.notificationService.notifyUninvasiveShort($localize`Released current message to deliver.`);
            }else{
              this.notificationService.notifyUninvasiveShort($localize`Releasing current message to deliver failed.`);
            }
          },
          error: _ => {
            this.notificationService.notifyUninvasiveShort($localize`Releasing current message to deliver failed.`);
          }
        }
      )
    }
  }

  /**
   * Marks currently picked up {@link Message} as send.
   */
  markCurrentMessageAsSend(){
    if(this.pickedUpMessage){
      this.s.push(this.messageService.markMessageAsSend(this.pickedUpMessage).subscribe(
        {
          next: success => {
            this.pickedUpMessage = undefined;
            if(success){
              this.notificationService.notifyUninvasiveShort($localize`Confirmed message delivery`);
            }else{
              this.notificationService.notifyUninvasiveShort($localize`Finishing current message delivery failed.`);
            }
          },
          error: _ => {
            this.notificationService.notifyUninvasiveShort($localize`Finishing current message delivery failed.`);
          }
        }
      ));
    }
  }


  /**
   * Returns label of the participant
   *
   * @param senderType: type of the participant
   * @param senderId: id of the participant
   * @returns observableLabel
   */
  getParticipantLabel(senderType?: Participant, senderId?: string): Observable<string | undefined>{
    if (senderId && senderType != undefined) {
      if (senderType === Participant.Resource) {
        return this.resourceService.getResourceById(senderId).pipe(
          map(resource => resource?.label)
        )
      }
      if (senderType === Participant.AddressBookEntry) {
        return this.addressBookService.getAddressBookEntryById(senderId).pipe(
          map(entry => entry.label)
        )
      }
      if (senderType === Participant.Role) {
        return this.groupService.getGroupById(senderId).pipe(
          map(group => group.title)
        )
      }
    }
    return of(undefined);
  }

  /**
   * Returns label of the incident
   *
   * @param incidentId: id of the incident
   * @returns observableLabel
   */
  getIncidentLabel(incidentId: string | undefined): Observable<string | undefined>{
    if(!incidentId) return of(undefined);
    return this.incidentService.getIncidentById(incidentId).pipe(
      map(incident => incident?.name)
    )
  }

  /**
   * Returns channel of the recipient.
   *
   * Applied quick fix:
   * As the backend allows only to get channels by address book entry, the method applies additionally manual filtering.
   * Can be improved by adding an endpoint getChannelByChannelId to the backend.
   *
   * @param recipient: containing channelId and recipientId
   * @returns observableChannel
   */
  getChannel(recipient: Recipient | undefined): Observable<Channel | undefined>{
    if(!recipient || recipient.recipientType !== Participant.AddressBookEntry || !recipient.channelId) return of(undefined);
    return this.channelService.getChannelsByAddressBookEntry(recipient.recipientId).pipe(
      map(channels => channels.filter(
        channel=>channel.id === recipient.channelId
      ).at(0))
    );
  }

  /**
   * Returns the selected channelType.
   * That allows a signaler to filter for specific channel types.
   */
  getSelectedChannelType(){
    return this.selectedChannelControl.getRawValue();
  }


}
