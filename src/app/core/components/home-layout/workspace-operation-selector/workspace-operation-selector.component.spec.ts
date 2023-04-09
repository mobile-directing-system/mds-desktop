import { WorkspaceOperationSelectorComponent } from './workspace-operation-selector.component';
import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../../core.module';
import { WorkspaceService } from '../../../services/workspace.service';
import { OperationService } from '../../../services/operation.service';
import { MatDialog } from '@angular/material/dialog';
import { Operation } from '../../../model/operation';
import { of } from 'rxjs';
import {
  SelectWorkspaceOperationDialogResult,
} from './select-workspace-operation-dialog/select-workspace-operation-dialog.component';


describe('WorkspaceOperationSelectorComponent', () => {
  let spectator: Spectator<WorkspaceOperationSelectorComponent>;
  let component: WorkspaceOperationSelectorComponent;
  const createComponent = createComponentFactory({
    component: WorkspaceOperationSelectorComponent,
    imports: [CoreModule],
    mocks: [WorkspaceService, OperationService, MatDialog],
    detectChanges: false,
  });
  const sampleOperation: Operation = {
    id: 'travel',
    title: 'instant',
    description: 'width',
    start: new Date(Date.parse('2023-04-09T12:00:00Z')),
    end: undefined,
    isArchived: false,
  };

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
    spectator.inject(WorkspaceService).operationChange.and.returnValue(of(sampleOperation.id));
    spectator.inject(OperationService).getOperationById.and.returnValue(of(sampleOperation));
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the operation', async () => {
    await spectator.fixture.whenStable();
    expect(component.operation).toEqual(sampleOperation);
  });

  it('should unload the operation if none is selected', async () => {
    component.ngOnDestroy();
    spectator.inject(WorkspaceService).operationChange.and.returnValue(of(undefined));
    component.ngOnInit();

    await spectator.fixture.whenStable();
    expect(component.operation).toBeFalsy();
  });

  describe('selectOperation', () => {
    it('should open select-dialog', async () => {
      spectator.inject(MatDialog).open.and.returnValue({
        afterClosed: () => of(undefined),
      });

      component.selectOperation();
      await spectator.fixture.whenStable();

      expect(spectator.inject(MatDialog).open).toHaveBeenCalled();
    });

    it('should clear on clear-result', async () => {
      const result: SelectWorkspaceOperationDialogResult = {
        action: 'clear',
      };
      spectator.inject(MatDialog).open.and.returnValue({
        afterClosed: () => of(result),
      });

      component.selectOperation();
      await spectator.fixture.whenStable();

      expect(spectator.inject(WorkspaceService).setOperation).toHaveBeenCalledOnceWith(undefined);
    });

    it('should set operation on submit-result', async () => {
      const result: SelectWorkspaceOperationDialogResult = {
        action: 'submit',
        operationId: 'throw',
      };
      spectator.inject(MatDialog).open.and.returnValue({
        afterClosed: () => of(result),
      });

      component.selectOperation();
      await spectator.fixture.whenStable();

      expect(spectator.inject(WorkspaceService).setOperation).toHaveBeenCalledOnceWith(result.operationId);
    });
  });

  describe('fixture', () => {
    beforeEach(async () => {
      await spectator.fixture.whenStable();
      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();
    });

    it('should show operation title', () => {
      expect(spectator.query(byTextContent(sampleOperation.title, {
        exact: false,
        selector: 'div',
      }))).toBeVisible();
    });

    it('should show show hint when no operation is selected', async () => {
      component.operation = undefined;

      spectator.detectComponentChanges();
      await spectator.fixture.whenStable();

      expect(spectator.query(byTextContent('Click to select', {
        exact: false,
        selector: 'div',
      }))).toBeVisible();
    });
  });
});
