import { KeyInfoBarComponent } from './key-info-bar.component';
import {byText, createComponentFactory, Spectator} from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import {KeyInfoEntry, KeyInfoService} from "../../services/key-info.service";
import {Subject} from "rxjs";
import {fakeAsync, flush, tick} from "@angular/core/testing";

describe('KeyInfoBarComponent', () => {
  let spectator: Spectator<KeyInfoBarComponent>;
  let component: KeyInfoBarComponent;
  const createComponent = createComponentFactory({
    component: KeyInfoBarComponent,
    mocks: [KeyInfoService],
    imports: [CoreModule,],
  });

  const keyInfosSubject = new Subject<(KeyInfoEntry | null)[]>();
  const action = ()=>{alert()};

  const keyInfos: (KeyInfoEntry | null)[] = [
    new KeyInfoEntry("k", "label1", action, false, true),
    null, null
  ];

  beforeEach(fakeAsync (() => {
    spectator = createComponent({
      providers: [
        {
          provide: KeyInfoService,
          useValue: {
            getKeyInfosSubscription: () => keyInfosSubject,
          },
        },
      ],
    });
    component = spectator.component;
    spectator.detectChanges();
    tick();
    keyInfosSubject.next(keyInfos);
    tick();
  }));

  it('should create', fakeAsync( () => {
    expect(component).toBeTruthy();
  }));

  it('should show key infos', fakeAsync( () => {
    spectator.detectChanges();
    expect(spectator.query(byText('label1'))).toBeVisible();
  }));

  it('should activate function when pressing the corresponding key', fakeAsync( () => {
    spectator.detectChanges();
    const keyEvent = new KeyboardEvent("keypress",{
        "key": "k",
    });
    spyOn(window, 'alert');
    tick();
    component.handleKeyboardEvent(keyEvent)
    expect(window.alert).toHaveBeenCalled();
    flush();
  }));
});
