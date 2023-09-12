import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PaginationParams} from "../../../core/util/store";
import {FormBuilder, Validators} from "@angular/forms";
import {NotificationService} from "../../../core/services/notification.service";
import {Loader} from "../../../core/util/loader";
import {forkJoin, map, Observable, of, take} from "rxjs";
import {Message, MessageDirection, Participant} from "../../../core/model/message";
import {MessageService} from "../../../core/services/message/message.service";
import {Importance} from "../../../core/model/importance";
import {Incident} from "../../../core/model/incident";
import {IncidentService} from "../../../core/services/incident/incident.service";
import {ResourceService} from "../../../core/services/resource/resource.service";
import {AddressBookService} from "../../../core/services/addressbook.service";
import {GroupService, GroupSort} from "../../../core/services/group.service";


export interface Recipient {
  label: string;
  id: {type: Participant, id: string,}
}

@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.scss']
})
export class CreateMessageComponent {



  constructor(private messageService: MessageService, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute, private notificationService: NotificationService,
              private incidentService: IncidentService, private resourceService: ResourceService,
              private addressBookService: AddressBookService, private groupService: GroupService) {
  }

  loader = new Loader();

  form = this.fb.nonNullable.group({
    recipients: this.fb.nonNullable.control<Recipient[] | null>(null, Validators.required),
    priority: this.fb.nonNullable.control<Importance>(Importance.Regular, Validators.required),
    incident: this.fb.nonNullable.control<string | null>(null),
    content: this.fb.nonNullable.control<string>('', Validators.required),
  });

  createEntry(): void {
    const fv = this.form.getRawValue();
    const create: Message = {
      id: "",
      recipients: fv.recipients!.map((recipient=>{
        return {recipientId:recipient.id.id, recipientType: recipient.id.type}
      })),//fv.label,
      priority: fv.priority,
      incidentId: fv.incident ?? undefined,
      content: fv.content,
      direction: MessageDirection.Outgoing,
      createdAt: new Date(),
    };
    this.loader.load(this.messageService.createMessage(create)).subscribe({
      next: _ => {
        this.notificationService.notifyUninvasiveShort($localize`Message send.`);
        this.cancel();
      },
      error: _ => {
        this.notificationService.notifyUninvasiveShort($localize`Sending message failed.`);
      },
    });
  }

  getIncidentById(id: string): Observable<Incident | undefined> {
    return this.incidentService.getIncidentById(id);
  }


  getRecipientById(id:{id: string, type: Participant}): Observable<Recipient | undefined> {
    if (id.type === Participant.Resource) {
      return this.resourceService.getResourceById(id.id).pipe(
        map(resource => resource ? {label: resource.label, id:id} : undefined)
      )
    }
    if (id.type === Participant.AddressBookEntry) {
      return this.addressBookService.getAddressBookEntryById(id.id).pipe(
        map(entry => entry ? {label: entry.label, id:id} : undefined)
      )
    }
    if (id.type === Participant.Role) {
      return this.groupService.getGroupById(id.id).pipe(
        map(group => group ? {label: group.title, id:id} : undefined)
      )
    }
    return of(undefined);
  }

  asRecipient(entity: Recipient): Recipient {
    return entity;
  }

  asIncident(entity: Incident): Incident {
    return entity;
  }

  searchIncidents(query: string): Observable<Incident[]> {
    return this.incidentService.getIncidents({byName:query}).pipe(take(5));
  }

  searchRecipients(query: string): Observable<Recipient[]> {

    let recipientsResources = this.resourceService.getResources({byLabel: query}).pipe(
      map((resources => {
        return resources.map(resource => {return {label: resource.label, id: {id:resource.id, type: Participant.Resource}} as Recipient})
      }))
    );
    let recipientsAddressBookEntries = this.addressBookService.searchAddressBookEntries({
        query: query,
        limit: 5,
        offset: 0,
      }, {})
      .pipe(map((res => {
        return res.hits.map(entry => {return {label: entry.label, id:{id: entry.id, type: Participant.AddressBookEntry}} as Recipient})
      }))
    );

    // Attention: non-sustainable quick fix. Long term solution: Adapting backend to improve quick fix
    // Add a filter like recipientsResources or a search endpoint like recipientsAddressBookEntries in the backend to allow searching for groups.
    // The current quickfix below sets the pagination limit to 100000 and searches the groups in memory which can hide larger data
    let recipientsRole = this.groupService.getGroups(
      new PaginationParams<GroupSort>(10000,0), {})
      .pipe(map((res => {
          return res.entries
            .filter(group => group.title.toLowerCase().includes(query.toLowerCase()))
            .slice(0,5)
            .map(group => {return {label: group.title, id:{id:group.id, type: Participant.Role}} as Recipient})
        }))
      );

    let recipients = forkJoin(recipientsResources, recipientsAddressBookEntries, recipientsRole).pipe(map( recipients =>{
          return recipients.reduce(((acc, cur) => [...acc, ...cur]))
        }));

    recipients.subscribe(next=> {console.log("MMV " + next)});

    return recipients;

  }

  cancel() {
    this.router.navigate(['..'], {relativeTo: this.route}).then();
  }

  protected readonly Participant = Participant;
}
