import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatStepper } from '@angular/material/stepper';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of } from 'rxjs';
import { AddressBookEntry } from 'src/app/core/model/address-book-entry';
import { ChannelType } from 'src/app/core/model/channel';
import { MessageDirection, Participant } from 'src/app/core/model/message';
import { Resource } from 'src/app/core/model/resource';
import { AddressBookService } from 'src/app/core/services/addressbook.service';
import { IncidentService } from 'src/app/core/services/incident/incident.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { WorkspaceService } from 'src/app/core/services/workspace.service';
import { SignalerModule } from '../signaler.module';
import { SignalerIncomingView } from './signaler-incoming-view.component';

describe('SignalerIncomingView', () => {

  const selectedOperationId = "123";

  const exampleAddresBookEntry: AddressBookEntry = {
    id: '1',
    label: 'RTW 123',
    description: '1234',
    operation: '123'
  };

  const exampleResource: Resource = {
    id: '1',
    label: 'RTW 123',
    description: '1234',
    operation: '123',
    statusCode: 0
  };

  let component: SignalerIncomingView;
  let fixture: ComponentFixture<SignalerIncomingView>;
  let addressBookService: AddressBookService;
  let resourceService: ResourceService;
  let incidentService: IncidentService;
  let messageService: MessageService;
  let workspaceService: WorkspaceService;
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
    workspaceService = jasmine.createSpyObj("WorkspaceService", {
      operationChange: new BehaviorSubject(selectedOperationId)
    });
    notificationService = jasmine.createSpyObj("NotificationService", ["notifyUninvasiveShort"]);

    TestBed.configureTestingModule({
      imports: [SignalerModule],
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
        },
        {
          provide: WorkspaceService,
          useValue: workspaceService
        }
      ],
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

  it('should display incident and status stepper when resource is selected as sender', () => {
    component.senderSelected(exampleResource);
    fixture.detectChanges();
    const elements = fixture.debugElement.queryAll(By.css("#incident-step, #status-step"));
    expect(elements).toBeTruthy();
    expect(elements.length).toBe(2);
  });

  describe('submit', () => {

    it('should call submitMessage() when submit button is clicked', () => {
      spyOn(component, "submitMessage");
      let button = fixture.debugElement.query(By.css("button#submit-message-button"));
      console.log(button.nativeElement);
      expect(button).toBeTruthy();
      button.triggerEventHandler("click", null);
      expect(component.submitMessage).toHaveBeenCalled();
    });

    it('should submit message correctly for an address book entry', () => {
      spyOn(component, "resetStepper");
      component.channelForm.patchValue({ channelType: ChannelType.Email });
      component.senderForm.setValue({
        sender: exampleAddresBookEntry,
        info: "mail@mail.de"
      });
      component.contentForm.setValue({ content: "Test content" });
      component.selectedSender = exampleAddresBookEntry;

      component.submitMessage();
      expect(messageService.createMessage).toHaveBeenCalledWith(jasmine.objectContaining({
        direction: MessageDirection.Incoming,
        incomingChannelType: ChannelType.Email,
        senderType: Participant.AddressBookEntry,
        senderId: exampleAddresBookEntry.id,
        info: "mail@mail.de",
        content: "Test content",
        operationId: selectedOperationId,
        needsReview: true,
        recipients: []
      }));
      expect(component.resetStepper).toHaveBeenCalled();
    });

    it('should set info correctly when radio channel is selected', () => {
      component.channelForm.setValue({ channelType: ChannelType.Radio, radioChannel: component.selectableRadioChannels[0] });
      component.senderForm.setValue({
        sender: exampleAddresBookEntry,
        info: "mail@mail.de"
      });
      component.contentForm.setValue({ content: "Test content" });
      component.selectedSender = exampleAddresBookEntry;
      component.submitMessage();

      expect(messageService.createMessage).toHaveBeenCalledWith(jasmine.objectContaining({
        incomingChannelType: ChannelType.Radio,
        info: component.selectableRadioChannels[0].name
      }));
      
    });

    it('should not submit message when no operation is selected', () => {
      component.selectedSender = undefined;
      component.submitMessage();
      expect(messageService.createMessage).not.toHaveBeenCalled();
    });

    it('should not submit message when no sender is selected', () => {
      const entry: AddressBookEntry = {
        id: '1',
        label: 'RTW 123',
        description: '1234',
        operation: '123'
      };
      component.selectedSender = entry;
      component.currentOperationId = undefined;
      component.submitMessage();
      expect(notificationService.notifyUninvasiveShort).toHaveBeenCalled();
      expect(messageService.createMessage).not.toHaveBeenCalled();
    });
  });
});
