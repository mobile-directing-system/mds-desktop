import { SimplePermissionControlComponent } from './simple-permission-control.component';
import { byTextContent, createComponentFactory, Spectator, SpectatorOptions } from '@ngneat/spectator';
import { Permission, PermissionName } from '../../../../../core/permissions/permissions';
import { CoreModule } from '../../../../../core/core.module';
import { AngularMaterialModule } from '../../../../../core/util/angular-material.module';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ManagementModule } from '../../../management.module';
import { FeaturesModule } from '../../../../features.module';
import { fakeAsync, tick } from '@angular/core/testing';
import createSpy = jasmine.createSpy;

function genFactoryOptions(): SpectatorOptions<SimplePermissionControlComponent> {
  return {
    component: SimplePermissionControlComponent,
    imports: [CoreModule, AngularMaterialModule, ManagementModule, FeaturesModule],
  };
}

describe('SimplePermissionControlComponent', () => {
  let spectator: Spectator<SimplePermissionControlComponent>;
  let component: SimplePermissionControlComponent;
  const createComponent = createComponentFactory({
    ...genFactoryOptions(),
  });
  const permissionName = PermissionName.ViewOperationMembers;

  beforeEach(() => {
    spectator = createComponent({
      props: {
        permissionName: permissionName,
      },
    });
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register correctly on-touched-listeners', () => {
    const listenerSpy = createSpy();
    component.registerOnTouched(listenerSpy);

    component.setGranted(true);

    expect(listenerSpy).toHaveBeenCalledOnceWith();
  });

  it('should register correctly on-change-listeners', () => {
    const expectPermission: Permission = { name: permissionName };
    const listenerSpy = createSpy();
    component.registerOnChange(listenerSpy);

    component.setGranted(true);

    expect(listenerSpy).toHaveBeenCalledOnceWith(expectPermission);
  });

  it('should apply value correctly for permission', () => {
    component.writeValue({ name: PermissionName.UpdateUser });
    expect(component.isGranted).toBeTrue();
  });

  it('should apply value correctly for null', () => {
    component.writeValue(null);
    expect(component.isGranted).toBeFalse();
  });

  it('should set disabled-state correctly', () => {
    component.setDisabledState(true);
    expect(component.isDisabled).toBeTrue();
    component.setDisabledState(false);
    expect(component.isDisabled).toBeFalse();
  });

  describe('setGranted', () => {
    it('should throw an error when no permission name is set', () => {
      component.permissionName = undefined;
      expect(() => component.setGranted(true)).toThrowError();
    });

    it('should update granted-state when granted', () => {
      component.setGranted(true);
      expect(component.isGranted).toBeTrue();
    });

    it('should update granted-state when not granted', () => {
      component.setGranted(false);
      expect(component.isGranted).toBeFalse();
    });

    it('should notify on-touched-listeners', () => {
      const listeners: jasmine.Spy[] = [];
      for (let i = 0; i < 10; i++) {
        const l = jasmine.createSpy();
        listeners.push(l);
        component.registerOnTouched(l);
      }

      component.setGranted(true);

      listeners.forEach(l => expect(l).toHaveBeenCalledOnceWith());
    });

    it('should notify on-change-listeners when granted', () => {
      const listeners: jasmine.Spy[] = [];
      for (let i = 0; i < 10; i++) {
        const l = jasmine.createSpy();
        listeners.push(l);
        component.registerOnChange(l);
      }
      const expectPermission: Permission = { name: permissionName };

      component.setGranted(true);

      listeners.forEach(l => expect(l).toHaveBeenCalledOnceWith(expectPermission));
    });

    it('should notify on-change-listeners when not granted', () => {
      const listeners: jasmine.Spy[] = [];
      for (let i = 0; i < 10; i++) {
        const l = jasmine.createSpy();
        listeners.push(l);
        component.registerOnChange(l);
      }

      component.setGranted(false);

      listeners.forEach(l => expect(l).toHaveBeenCalledOnceWith(null));
    });
  });

  describe('fixture', () => {
    beforeEach(async () => {
      await spectator.fixture.whenStable();
    });

    it('should show slide-toggle', () => {
      expect(spectator.query('mat-slide-toggle')).toBeVisible();
    });

    it('should disable slide-toggle when disabled', async () => {
      component.setDisabledState(true);
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();

      expect(spectator.query('mat-slide-toggle button')).toBeDisabled();
    });

    it('should set granted-state when toggle is clicked', () => {
      const setGrantedSpy = spyOn(component, 'setGranted');
      spectator.click('mat-slide-toggle button');
      expect(setGrantedSpy).toHaveBeenCalledOnceWith(true);
      setGrantedSpy.calls.reset();
      spectator.click('mat-slide-toggle button');
      expect(setGrantedSpy).toHaveBeenCalledOnceWith(false);
    });
  });
});

@Component({
  template: `
    <app-simple-permission-control
      [formControl]="fc"
      [permissionName]="PermissionName.CreateUser">
      Hello World!
    </app-simple-permission-control>`,
})
class TestHostComponent {
  PermissionName = PermissionName;
  fc = new FormControl<Permission | null>(null);
}

describe('SimplePermissionControlComponent.integration', () => {
  let spectator: Spectator<TestHostComponent>;
  let host: TestHostComponent;
  const createComponent = createComponentFactory<TestHostComponent>({
    ...genFactoryOptions(),
    component: TestHostComponent,
    declarations: [SimplePermissionControlComponent, TestHostComponent],
  });

  beforeEach(async () => {
    spectator = createComponent();
    host = spectator.component;
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should show content', () => {
    expect(spectator.query(byTextContent('Hello World!', { selector: 'mat-slide-toggle' }))).toBeVisible();
  });

  it('should set permission when enabled', fakeAsync(() => {
    spectator.click(`button`);
    tick();
    expect(host.fc.value).toEqual({ name: PermissionName.CreateUser });
  }));

  it('should set null when disabled', fakeAsync(() => {
    spectator.click(`button`);
    spectator.click(`button`);
    tick();
    expect(host.fc.value).toBeNull();
  }));
});
