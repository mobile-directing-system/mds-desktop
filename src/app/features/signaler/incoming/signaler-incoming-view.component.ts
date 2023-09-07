import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Observable, debounceTime, forkJoin, map, mergeMap, of, startWith } from 'rxjs';
import { AddressBookEntry } from 'src/app/core/model/address-book-entry';
import { ChannelType, localizeChannelType } from 'src/app/core/model/channel';
import { Incident } from 'src/app/core/model/incident';
import { Message, MessageDirection, Participant } from 'src/app/core/model/message';
import { Resource, statusCodes, getStatusCodeText } from 'src/app/core/model/resource';
import { AddressBookService } from 'src/app/core/services/addressbook.service';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';

@Component({
  selector: 'app-signaler-incoming-view',
  templateUrl: './signaler-incoming-view.component.html',
  styleUrls: ['./signaler-incoming-view.component.scss']
})
export class SignalerIncomingView implements OnInit {

  channelForm = this.fb.group({
    channel: this.fb.nonNullable.control<ChannelType>(ChannelType.Email)
  });

  senderForm = this.fb.group({
    sender: this.fb.control<AddressBookEntry | string>(""),
    info: this.fb.control<string>(""),
  });

  contentForm = this.fb.group({
    content: this.fb.nonNullable.control<string>("")
  });

  incidentForm = this.fb.group({
    incident: this.fb.nonNullable.control<Incident | string>("")
  });

  statusForm = this.fb.group({
    statusCode: this.fb.control<number | null>(null)
  });

  selectedSender: AddressBookEntry | null = null;
  filteredSenderOptions: Observable<AddressBookEntry[]> = of([]);

  selectedIncident: Incident | null = null;
  filteredIncidents: Observable<Incident[]> = of([]);

  @ViewChild(MatStepper) stepper!: MatStepper

  readonly channelTypes: ChannelType[] = Object.values(ChannelType);
  readonly localizeChannel = localizeChannelType

  constructor(private fb: FormBuilder, private addressBookService: AddressBookService,
    private resourceService: ResourceService, private incidentService: IncidentService,
    private messageService: MessageService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.filteredSenderOptions = this.senderForm.controls.sender.valueChanges.pipe(
      startWith(""),
      debounceTime(250),
      mergeMap(value => {
        const label = typeof value === 'string' ? value : value?.label;
        return this.searchEntries(label as string);
      }));

    this.filteredIncidents = this.incidentForm.controls.incident.valueChanges.pipe(
      startWith(""),
      debounceTime(250),
      mergeMap(value => {
        const label = typeof value === 'string' ? value : value?.name;
        return this.searchIncidents(label as string);
      })
    );
  }

  /**
   * Searches for address book entries and resources
   * 
   * @param query Label to search for
   */
  searchEntries(query: string): Observable<AddressBookEntry[]> {
    let resources: Observable<AddressBookEntry[]> = this.resourceService.getResources({
      byLabel: query
    }).pipe(map(resources => resources as AddressBookEntry[]));

    let addressBookEntries = this.addressBookService.searchAddressBookEntries({
      query: query,
      limit: 3,
      offset: 0
    }, {})
      .pipe(map(result => result.hits));

    return forkJoin([resources, addressBookEntries]).pipe(map(([a, b]) => [...a.slice(0, 3), ...b.slice(0, 3)]));
  }

  /**
   * Searches for available incidents
   * 
   * @param query Label to search for
   */
  searchIncidents(query: string): Observable<Incident[]> {
    return this.incidentService.getIncidents({
      byName: query,
      isCompleted: false
    });
  }

  /**
   * Submits new incoming message with the data of the stepper
   */
  submitMessage() {
    if(!this.selectedSender) return;

    let msg: Message = {
      id: "",
      direction: MessageDirection.Incoming,
      incomingChannelType: this.channelForm.getRawValue().channel,
      senderType: this.isResource(this.selectedSender) ? Participant.Resource : Participant.AddressBookEntry,
      senderId: this.selectedSender.id,
      info: this.senderForm.getRawValue().info ?? "",
      content: this.contentForm.getRawValue().content,
      createdAt: new Date(),
      needsReview: true,
      recipients: []
    }

    // Set resource specific fields
    if(this.isResource(this.selectedSender)) {
      msg.incidentId = this.selectedIncident?.id;
      msg.resourceStatusCode = this.statusForm.getRawValue().statusCode ?? undefined;
    }

    this.messageService.createMessage(msg).subscribe(msg => {
      console.log(msg);
      this.notificationService.notifyUninvasiveShort($localize`:@@signaler-message-submitted:Message successfully submitted.`);
      this.resetStepper();
    });
  }

  displayEntry(entry: AddressBookEntry): string {
    return entry && entry.label ? entry.label : "";
  }

  displayIncident(incident: Incident): string {
    return incident && incident?.name;
  }

  /**
   * Checks whether an object is a resource or not
   */
  isResource(entry: any): entry is Resource {
    return entry && 'statusCode' in entry;
  }

  getStatusCodes() {
    return statusCodes;
  }

  getStatusText(statusCode: number): string {
    if(statusCode == -1) return getStatusCodeText(statusCode);
    return `${statusCode} - ${getStatusCodeText(statusCode)}`;
  }

  senderSelected(entity: AddressBookEntry) {
    this.selectedSender = entity;
  }

  incidentSelected(incident: Incident) {
    this.selectedIncident = incident;
  }

  asResource(entry: AddressBookEntry): Resource {
    return entry as Resource;
  }

  asIncident(incident: any): Incident {
    return incident as Incident;
  }

  resetStepper() {
    this.selectedIncident = null;
    this.selectedSender = null;
    this.senderForm.reset();
    this.contentForm.reset();
    this.incidentForm.reset();
    this.statusForm.reset();
    this.stepper.reset();
  }
}
