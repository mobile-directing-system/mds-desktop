import { DeleteConfirmButtonComponent } from './delete-confirm-button.component';
import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { MatDialog } from '@angular/material/dialog';
import { Component, EventEmitter } from '@angular/core';
import { newMatDialogRefMock } from '../../testutil/testutil';
import { DeleteConfirmDialog } from '../delete-confirm-dialog/delete-confirm-dialog.component';

describe('DeleteConfirmButtonComponent', () => {
  let spectator: Spectator<DeleteConfirmButtonComponent>;
  let component: DeleteConfirmButtonComponent;
  const createComponent = createComponentFactory({
    component: DeleteConfirmButtonComponent,
    imports: [CoreModule],
    mocks: [MatDialog],
  });
  let deleteConfirmed: jasmine.SpyObj<EventEmitter<any>>;

  beforeEach(async () => {
    deleteConfirmed = jasmine.createSpyObj({
      next: void 0,
    });
    spectator = createComponent({
      props: {
        deleteConfirmed: deleteConfirmed,
      },
    });
    component = spectator.component;
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display button', () => {
    expect(spectator.query('button')).toBeVisible();
  });

  it('should display confirm-dialog when button is clicked', () => {
    spectator.inject(MatDialog).open.and.returnValue(newMatDialogRefMock(undefined));
    spectator.click('button');

    expect(spectator.inject(MatDialog).open).toHaveBeenCalledOnceWith(DeleteConfirmDialog);
  });

  it('should not emit an event when not confirmed', () => {
    spectator.inject(MatDialog).open.and.returnValue(newMatDialogRefMock(undefined));
    spectator.click('button');

    expect(deleteConfirmed.next).not.toHaveBeenCalled();
  });

  it('should emit an event when confirmed', () => {
    spectator.inject(MatDialog).open.and.returnValue(newMatDialogRefMock(true));
    spectator.click('button');

    expect(deleteConfirmed.next).toHaveBeenCalledOnceWith(void 0);
  });
});

@Component({
  template: `
    <app-delete-confirm-button (deleteConfirmed)="deleteConfirmed()">
      Hello World!
    </app-delete-confirm-button>`,
})
class TestHostComponent {
  deleteConfirmed = jasmine.createSpy();
}

describe('DeleteConfirmButtonComponent.integration', () => {
  let spectator: Spectator<TestHostComponent>;
  const createComponent = createComponentFactory({
    component: TestHostComponent,
    imports: [CoreModule],
  });

  beforeEach(async () => {
    spectator = createComponent();
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should display content', () => {
    expect(spectator.query(byTextContent('Hello World!', { selector: 'app-delete-confirm-button' }))).toBeVisible();
  });
});
