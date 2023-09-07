import {fakeAsync, tick} from '@angular/core/testing';

import {createRoutingFactory, SpectatorRouting} from "@ngneat/spectator";
import {CoreModule} from "../../../core/core.module";
import {AccessControlService} from "../../../core/services/access-control.service";
import {AccessControlMockService} from "../../../core/services/access-control-mock.service";
import {Subject} from "rxjs";
import {MailboxLayoutComponent} from "./mailbox-layout.component";
import {GroupService} from "../../../core/services/group.service";
import {Group} from "../../../core/model/group";
import {Paginated} from "../../../core/util/store";
import {AuthService} from "../../../core/services/auth.service";

describe('MailboxLayoutComponent', () => {
  let spectator: SpectatorRouting<MailboxLayoutComponent>;
  let component: MailboxLayoutComponent;

  const groupSubject: Subject<Paginated<Group>> = new Subject();
  const group: Group = {
    id: "loggedInRoleId",
    title: "S1",
    description: "description",
    members:["loggedInUserId"]
  };
  const paginatedGroups: Paginated<Group> = new Paginated<Group>([group],{
    total: 1,
    limit: 1,
    offset: 0,
    retrieved: 1,
  })

  const emptyPaginatedGroups: Paginated<Group> = new Paginated<Group>([],{
    total: 0,
    limit: 1,
    offset: 0,
    retrieved: 0,
  })


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
        provide: GroupService,
        useValue: {
          getGroups: ()=> groupSubject,
        },
      },
    ],
    mocks: [
      AuthService,
    ],
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
    groupSubject.next(paginatedGroups);
    tick();
    expect(spectator.component.loggedInRole).toEqual(group);
  }));

  it('should handle no role yet successful', fakeAsync(() => {
    expect(spectator.component.loggedInRole).toBeUndefined();
    groupSubject.next(emptyPaginatedGroups);
    tick();
    expect(spectator.component.loggedInRole).toBeNull();
  }));

});
