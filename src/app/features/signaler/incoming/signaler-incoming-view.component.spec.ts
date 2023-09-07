import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { AddressBookEntry } from 'src/app/core/model/address-book-entry';
import { ChannelType } from 'src/app/core/model/channel';
import { AddressBookService } from 'src/app/core/services/addressbook.service';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { SignalerModule } from '../signaler.module';
import { SignalerIncomingView } from './signaler-incoming-view.component';
import { MessageDirection, Participant } from 'src/app/core/model/message';
import { By } from '@angular/platform-browser';
import { MatStepper } from '@angular/material/stepper';
import { Resource } from 'src/app/core/model/resource';

describe('SignalerIncomingView', () => {
  let component: SignalerIncomingView;
  let fixture: ComponentFixture<SignalerIncomingView>;
  let addressBookService: AddressBookService;
  let resourceService: ResourceService;
  let incidentService: IncidentService;
  let messageService: MessageService;
  let notificationService: NotificationService;

  beforeEach(async () => {

    // Create mocks
    addressBookService = jasmine.createSpyObj("AddressBookService", {
      searchAddressBookEntries: of([])
    });
    resourceService = jasmine.createSpyObj("ResourceService", {
      getResources: of([])
    });
    incidentService = jasmine.createSpyObj("IncidentService", {
      getIncidents: of([])
    });
    messageService = jasmine.createSpyObj("MessageService", {
      getMessages: of([]),
      createMessage: of({})
    });
    notificationService = jasmine.createSpyObj("NotificationService", ["notifyUninvasiveShort"]);

    TestBed.configureTestingModule({
      imports: [ SignalerModule ],
      declarations: [SignalerIncomingView],
      providers: [
        {
          provide: AddressBookService,
          useValue: addressBookService
        },
        {
          provide: ResourceService,
          useValue: resourceService
        },
        {
          provide: IncidentService,
          useValue: incidentService
        },
        {
          provide: MessageService,
          useValue: messageService
        },
        {
          provide: NotificationService,
          useValue: notificationService
        }
      ]
    });
    
    fixture = TestBed.createComponent(SignalerIncomingView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a material stepper', () => {
    let stepper = fixture.debugElement.query(By.directive(MatStepper));
    expect(stepper).toBeTruthy();
  });

  it('should call resetStepper() when reset button is clicked', () => {
    spyOn(component, "resetStepper");
    let button = fixture.debugElement.query(By.css("button#reset-message-button"));
    expect(button).toBeTruthy();
    button.triggerEventHandler("click", null);
    expect(component.resetStepper).toHaveBeenCalled();
  });

  it('should call submitMessage() when submit button is clicked', () => {
    spyOn(component, "submitMessage");
    let button = fixture.debugElement.query(By.css("button#submit-message-button"));
    console.log(button.nativeElement);
    expect(button).toBeTruthy();
    button.triggerEventHandler("click", null);
    expect(component.submitMessage).toHaveBeenCalled();
  });

  it('should display incident and status stepper when resource is selected as sender', () => {
    const entry: Resource = {
      id: '1',
      label: 'RTW 123',
      description: '1234',
      operation: '123',
      statusCode: 0
    };
    component.senderSelected(entry);
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(By.css("#incident-step, #status-step"));
    expect(elements).toBeTruthy();
    expect(elements.length).toBe(2);
  });

  it('should submit message correctly for an address book entry', () => {
    spyOn(component, "resetStepper");
    const entry: AddressBookEntry = {
      id: '1',
      label: 'RTW 123',
      description: '1234',
      operation: '123'
    };
    component.channelForm.setValue({channel: ChannelType.Email});
    component.senderForm.setValue({
      sender: entry,
      info: "mail@mail.de"
    });
    component.selectedSender = entry;
    component.contentForm.setValue({content: "Test content"});

    component.submitMessage();
    expect(messageService.createMessage).toHaveBeenCalledWith(jasmine.objectContaining({
      direction: MessageDirection.Incoming,
      incomingChannelType: ChannelType.Email,
      senderType: Participant.AddressBookEntry,
      senderId: entry.id,
      info: "mail@mail.de",
      content: "Test content",
      needsReview: true,
      recipients: []
    }));
    expect(component.resetStepper).toHaveBeenCalled();
  });
});
