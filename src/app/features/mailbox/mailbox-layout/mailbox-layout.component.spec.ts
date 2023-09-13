import {fakeAsync, tick} from '@angular/core/testing';

import {byTextContent, createRoutingFactory, SpectatorRouting} from "@ngneat/spectator";
import {CoreModule} from "../../../core/core.module";
import {AccessControlService} from "../../../core/services/access-control.service";
import {AccessControlMockService} from "../../../core/services/access-control-mock.service";
import {Subject} from "rxjs";
import {MailboxLayoutComponent} from "./mailbox-layout.component";
import {Group} from "../../../core/model/group";
import {AuthService} from "../../../core/services/auth.service";

describe('MailboxLayoutComponent', () => {
  let spectator: SpectatorRouting<MailboxLayoutComponent>;
  let component: MailboxLayoutComponent;

  const groupSubject: Subject<Group | undefined> = new Subject();
  const group: Group = {
    id: "loggedInRoleId",
    title: "S1",
    description: "description",
    members:["loggedInUserId"]
  };


  const createComponent = createRoutingFactory({
    component: MailboxLayoutComponent,
    imports: [
      CoreModule,
    ],
    providers: [
      {
        provide: AccessControlService,
        useExisting: AccessControlMockService,
      },
      {
        provide: AuthService,
        useValue: {
          loggedInRole: ()=> groupSubject,
        },
      },
    ],
    mocks: [],
    detectChanges: false,
  });


  beforeEach(fakeAsync(() => {
    spectator = createComponent();
    component = spectator.component;
    spectator.router.navigate = jasmine.createSpy().and.callFake(spectator.router.navigate).and.resolveTo();
    spectator.detectComponentChanges();
    tick();
  }));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should load loggedInRole successful', fakeAsync(() => {
    expect(spectator.component.loggedInRole).toBeUndefined();
    groupSubject.next(group);
    tick();
    expect(spectator.component.loggedInRole).toEqual(group);
    spectator.detectComponentChanges();
    expect(spectator.query(byTextContent('', {
      exact: false,
      selector: 'app-incoming-messages-view',
    }))).toBeVisible();
  }));


  it('should handle no role yet successful', fakeAsync(() => {
    expect(spectator.component.loggedInRole).toBeUndefined();
    groupSubject.next(undefined);
    tick();
    expect(spectator.component.loggedInRole).toBeUndefined();
    spectator.detectComponentChanges();
    expect(spectator.query(byTextContent('', {
      exact: false,
      selector: 'app-incoming-messages-view',
    }))).not.toBeVisible();
  }));

});
