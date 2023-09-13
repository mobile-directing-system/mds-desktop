import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PaginationParams} from "../../../core/util/store";
import {FormBuilder, Validators} from "@angular/forms";
import {NotificationService} from "../../../core/services/notification.service";
import {Loader} from "../../../core/util/loader";
import {forkJoin, map, Observable, of, Subscription, take} from "rxjs";
import {Message, MessageDirection, Participant} from "../../../core/model/message";
import {MessageService} from "../../../core/services/message/message.service";
import {Importance} from "../../../core/model/importance";
import {Incident} from "../../../core/model/incident";
import {IncidentService} from "../../../core/services/incident/incident.service";
import {ResourceService} from "../../../core/services/resource/resource.service";
import {AddressBookService} from "../../../core/services/addressbook.service";
import {GroupService, GroupSort} from "../../../core/services/group.service";
import {Group} from "../../../core/model/group";
import {AuthService} from "../../../core/services/auth.service";
import {ChannelType} from "../../../core/model/channel";


/**
 * Identifiable recipient. A recipient can be a resource, an address book entry or a role.
 *
 * Needed this extra interface for the SearchableMultiChipEntityInputFieldComponent as it requires an
 * identifiable object meaning there has to be the identifiable field 'id'. In our case that is
 * the composed RecipientId.
 */
export interface Recipient {
  label: string;
  id: RecipientId
}

/**
 * Identifies a recipient and is composed of the recipient type and id.
 */
export interface RecipientId{
  type: Participant,
  id: string
}

/**
 * Component for creating and sending a new message
 */
@Component({
  selector: 'app-create-message',
  templateUrl: './create-message.component.html',
  styleUrls: ['./create-message.component.scss']
})
export class CreateMessageComponent implements OnDestroy{



  constructor(private messageService: MessageService, private fb: FormBuilder,
              private router: Router, private route: ActivatedRoute, private notificationService: NotificationService,
              private incidentService: IncidentService, private resourceService: ResourceService,
              private addressBookService: AddressBookService, private groupService: GroupService,
              private authService: AuthService){
    this.loadRole();
  }

  loader = new Loader();

  /**
   * Role of the logged-in user
   */
  loggedInRole: (Group | undefined | null);

  s: Subscription[] = [];

  /**
   * Loads the role of the logged-in user
   */
  loadRole() {
    this.authService.loggedInRole().subscribe((next)=>{
      this.loggedInRole = next;
    }, _ => {
      this.notificationService.notifyUninvasiveShort($localize`Loading role failed.`);
    });
  }

  form = this.fb.nonNullable.group({
    recipients: this.fb.nonNullable.control<RecipientId[]>([], Validators.required),
    priority: this.fb.nonNullable.control<Importance>(Importance.Regular, Validators.required),
    incident: this.fb.nonNullable.control<string | null>(null),
    content: this.fb.nonNullable.control<string>('', Validators.required),
  });

  /**
   * Creates and sends a new message based on the form values
   */
  createEntry(): void {
    const fv = this.form.getRawValue();
    // create new message
    const create: Message = {
      id: "",
      senderId: this.loggedInRole!.id,
      senderType: Participant.Role,
      recipients: fv.recipients.map((recipientId => {
        return {recipientId: recipientId.id, recipientType: recipientId.type, read: false}
      })),
      incomingChannelType: ChannelType.InAppNotification,
      priority: fv.priority,
      incidentId: fv.incident ?? undefined,
      content: fv.content,
      direction: MessageDirection.Outgoing,
      createdAt: new Date(),
    };
    // save/send the message with the message service
    this.messageService.createMessage(create).subscribe({
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

  /**
   * Used by SearchableMultiChipEntityInputFieldComponent to receive the recipients.
   * @param id: identifiable and composed id of a recipient
   * @returns observableRecipient
   */
  getRecipientById(id:RecipientId): Observable<Recipient | undefined> {
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

  /**
   * Used by SearchableMultiChipEntityInputFieldComponent to search the recipients.
   * @param query: searches for that string in the label of the recipients
   * @returns observableRecipientArray
   */
  searchRecipients(query: string): Observable<Recipient[]> {
    // get resources and map them into recipients
    let recipientsResources = this.resourceService.getResources({byLabel: query}).pipe(
      map((resources => {
        return resources.map(resource => {return {label: resource.label, id: {id:resource.id, type: Participant.Resource}} as Recipient})
      }))
    );
    // get address book entries and map them into recipients
    let recipientsAddressBookEntries = this.addressBookService.searchAddressBookEntries({
        query: query,
        limit: 5,
        offset: 0,
      }, {})
      .pipe(map((res => {
        return res.hits.map(entry => {return {label: entry.label, id:{id: entry.id, type: Participant.AddressBookEntry}} as Recipient})
      }))
    );

    // get roles and map them into recipients
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

    // merge recipients from resources, address book entries and roles together while preserving order.
    // flatten the list because otherwise it would be an array of arrays
    return forkJoin(recipientsResources, recipientsAddressBookEntries, recipientsRole).pipe(map(recipients => {
      return recipients.reduce(((acc, cur) => [...acc, ...cur]))
    }));

  }

  cancel() {
    this.router.navigate(['..'], {relativeTo: this.route}).then();
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  protected readonly Participant = Participant;
}
