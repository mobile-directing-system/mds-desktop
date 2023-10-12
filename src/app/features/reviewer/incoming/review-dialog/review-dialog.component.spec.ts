import { DatePipe } from '@angular/common';
import { fakeAsync } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Spectator, byText, byTextContent, createComponentFactory } from '@ngneat/spectator';
import { of } from 'rxjs';
import { ImportanceSelectComponent } from 'src/app/core/components/importance-select/importance-select.component';
import { CoreModule } from 'src/app/core/core.module';
import { ChannelType } from 'src/app/core/model/channel';
import { Group } from 'src/app/core/model/group';
import { Incident } from 'src/app/core/model/incident';
import { Message, MessageDirection, Participant, Recipient } from 'src/app/core/model/message';
import { AddressBookService } from 'src/app/core/services/addressbook.service';
import { GroupService } from 'src/app/core/services/group.service';
import { MessageService } from 'src/app/core/services/message/message.service';
import { ResourceService } from 'src/app/core/services/resource/resource.service';
import { Paginated } from 'src/app/core/util/store';
import { ReviewerIncomingMessageRow } from '../incoming-messages-view/incoming-messages-view.component';
import { ReviewDialog } from './review-dialog.component';
import { Importance } from 'src/app/core/model/importance';

describe('ReviewDialog', () => {

  const senderName: string = "Example name";

  const exampleMessage: Message = {
    id: "0",
    direction: MessageDirection.Incoming,
    incomingChannelType: ChannelType.Email,
    info: "example@example.com",
    senderId: "1",
    operationId: "123",
    senderType: Participant.AddressBookEntry,
    content: "Example content",
    needsReview: true,
    createdAt: new Date(),
    recipients: []
  };

  const exampleIncident: Incident = {
    id: "0",
    name: "Example incident",
    description: "Incident description",
    operation: "1",
    isCompleted: false
  };

  const exampleGroups: Group[] = [
    {
      id: "0",
      title: "S1",
      description: "S1 description",
      members: []
    },
    {
      id: "1",
      title: "S2",
      description: "S2 description",
      members: []
    }
  ];
  
  const createComponent = createComponentFactory({
    component: ReviewDialog,
    imports: [CoreModule],
    mocks: [MatDialogRef<ReviewDialog>, AddressBookService],
    detectChanges: false
  });

  let spectator: Spectator<ReviewDialog>;
  let component: ReviewDialog;
  let dialogRef: MatDialogRef<ReviewDialog>;
  let messageService: MessageService;

  beforeEach(async () => {
    spectator = createComponent({
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: <ReviewerIncomingMessageRow>{
            message: exampleMessage,
            incident: exampleIncident
          }
        },
        {
          provide: MessageService,
          useValue: jasmine.createSpyObj("MessageService", {
            getMessageById: of(exampleMessage),
            updateMessage: of(true)
          })
        },
        {
          provide: ResourceService,
          useValue: {}
        },
        {
          provide: GroupService,
          useValue: jasmine.createSpyObj("GroupService", {
            getGroups: of(new Paginated<Group>(exampleGroups, {
              total: exampleGroups.length,
              retrieved: exampleGroups.length,
              limit: 1000,
              offset: 0
            }))
          })
        }
      ]
    });

    component = spectator.component;
    spyOn(component, "getParticipantLabel").and.returnValue(of(senderName));
    dialogRef = spectator.inject(MatDialogRef);
    messageService = spectator.inject(MessageService);
    spectator.detectChanges();
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain message id', ()=> {
    expect(spectator.query(byText(exampleMessage.id, {
      exact: false
    }))).toBeVisible();
  });

  it('should contain sender name', ()=> {
    expect(spectator.query(byText(senderName, {
      exact: false
    }))).toBeVisible();
  });

  it('should display date correctly', ()=> {
    let dateString = new DatePipe("en").transform(exampleMessage.createdAt, "medium");
    expect(spectator.query(byText(dateString!, {
      exact: false
    }))).toBeVisible();
  });

  it('should contain sender info', ()=> {
    expect(spectator.query(byText(exampleMessage.info!, {
      exact: false
    }))).toBeVisible();
  });

  it('should contain content of message', ()=> {
    expect(spectator.query(byText(exampleMessage.content, {
      exact: true
    }))).toBeVisible();
  });

  it('should not display incident when it is not set', fakeAsync(()=> {
    component.data.incident = undefined;
    spectator.detectChanges();
    expect(spectator.query(byText(exampleIncident.name, {
      exact: false
    }))).not.toBeVisible();
  }));

  it('should display status code when its set', fakeAsync(()=> {
    let statusCode = 1;
    component.data.message.resourceStatusCode = statusCode;
    spectator.detectChanges();
    expect(spectator.query(byText(component.getStatusText(statusCode), {
      exact: false
    }))).toBeVisible();
  }));

  it('should not display status code when its not set', fakeAsync(()=> {
    component.data.message.resourceStatusCode = undefined;
    spectator.detectChanges();
    expect(spectator.query(byText("Status:", {
      exact: false
    }))).not.toBeVisible();
  }));

  it('should display priority selection form field', ()=> {
    expect(spectator.query(ImportanceSelectComponent)).toBeVisible();
  });

  it('should display `forward to` form field', ()=> {
    expect(spectator.query(byText("Forward to", {
      selector: "mat-label",
      exact: true
    }))).toBeVisible();
    expect(spectator.query(".app-edit-input.forward-to mat-select")).toBeVisible();
  });

  it('should close when cancel button was clicked', ()=> {
    spyOn(component, "cancelClicked").and.callThrough();

    spectator.click(byTextContent("Cancel", {
      selector: "button",
      exact: true
    }));
    
    expect(component.cancelClicked).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should call submitClicked() when submit button was clicked', ()=> {
    spyOn(component, "submitClicked").and.callFake(()=>{});
    spectator.click(byTextContent("Submit", {
      selector: "button",
      exact: true
    }));
    expect(component.submitClicked).toHaveBeenCalled();
  });

  it('should update message correctly when submitClicked() is called', fakeAsync(()=> {
    component.form.controls.priority.setValue(Importance.Regular);
    let recipientRoles = exampleGroups.slice(0, 2);
    component.form.controls.roles.setValue(recipientRoles.map(role => role.id));

    let updatedMessage: Message = {
      ...exampleMessage,
      priority: Importance.Regular,
      needsReview: false,
      recipients: recipientRoles.map(role => <Recipient>{
        recipientType: Participant.Role,
        recipientId: role.id,
        read: false
      })
    };

    component.submitClicked();
    expect(messageService.updateMessage).toHaveBeenCalledOnceWith(updatedMessage);
  }));
});
