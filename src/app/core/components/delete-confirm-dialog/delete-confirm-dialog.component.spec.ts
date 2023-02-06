import { DeleteConfirmDialog } from './delete-confirm-dialog.component';
import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { MatDialogRef } from '@angular/material/dialog';

describe('DeleteConfirmDialog', () => {
  let spectator: Spectator<DeleteConfirmDialog>;
  let component: DeleteConfirmDialog;
  const createComponent = createComponentFactory({
    component: DeleteConfirmDialog,
    imports: [CoreModule],
    mocks: [MatDialogRef<DeleteConfirmDialog>],
  });

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default message', () => {
    expect(spectator.query(byTextContent('Do you really want to delete this entity?', {
      exact: false,
      selector: 'mat-dialog-content',
    }))).toBeVisible();
  });

  it('should display default delete-button label', () => {
    expect(spectator.query(byTextContent('Delete', {
      exact: false,
      selector: 'button',
    }))).toBeVisible();
  });

  it('should display cancel-button', () => {
    expect(spectator.query(byTextContent('Cancel', {
      exact: false,
      selector: 'button',
    }))).toBeVisible();
  });

  it('should close unconfirmed when cancel-button is pressed', () => {
    spectator.click(byTextContent('Cancel', {
      exact: false,
      selector: 'button',
    }));
    expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledOnceWith(false);
  });

  it('should close confirmed when delete-button is pressed', () => {
    spectator.click(byTextContent('Delete', {
      exact: false,
      selector: 'button',
    }));
    expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledOnceWith(true);
  });

  it('should display custom message if set', async () => {
    const customMessage = 'Hello World!';
    component.message = customMessage;
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent(customMessage, {
      exact: false,
      selector: 'mat-dialog-content',
    }))).toBeVisible();
  });

  it('should display custom delete-button label if set', async () => {
    const customLabel = 'Hello World!';
    component.deleteLabel = customLabel;
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();

    expect(spectator.query(byTextContent(customLabel, {
      exact: false,
      selector: 'button',
    }))).toBeVisible();
  });
});
