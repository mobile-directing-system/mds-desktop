import {
  SelectWorkspaceOperationDialog,
  SelectWorkspaceOperationDialogData,
} from './select-workspace-operation-dialog.component';
import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../../../core.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkspaceService } from '../../../../services/workspace.service';
import { OperationService } from '../../../../services/operation.service';
import { AuthService } from '../../../../services/auth.service';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Operation } from '../../../../model/operation';
import { Paginated, SearchResult } from '../../../../util/store';
import { firstValueFrom, of } from 'rxjs';
import { fakeAsync } from '@angular/core/testing';

describe('SelectWorkspaceOperationDialog', () => {
  let spectator: Spectator<SelectWorkspaceOperationDialog>;
  let component: SelectWorkspaceOperationDialog;
  const createComponent = createComponentFactory({
    component: SelectWorkspaceOperationDialog,
    imports: [CoreModule],
    mocks: [MatDialogRef, WorkspaceService, OperationService, AuthService],
    detectChanges: false,
  });
  let harnessLoader: HarnessLoader;
  let dialogData: SelectWorkspaceOperationDialogData;
  const sampleOperations: Operation[] = [
    {
      id: 'ladder',
      title: 'satisfy',
      description: 'give',
      start: new Date('2001-01-01'),
      end: new Date('2001-01-02'),
      isArchived: true,
    },
    {
      id: 'music',
      title: 'diamond',
      description: '',
      start: new Date('2002-01-01'),
      end: undefined,
      isArchived: false,
    },
    {
      id: 'apply',
      title: 'saucer',
      description: 'urgent',
      start: new Date('2023-01-01'),
      end: new Date('2023-01-02'),
      isArchived: false,
    },
  ];
  const samplePaginatedOperations: Paginated<Operation> = new Paginated<Operation>(sampleOperations, {
    limit: 3,
    retrieved: 3,
    total: 42,
    offset: 0,
  });
  const sampleSearchResultOperations: SearchResult<Operation> = new SearchResult<Operation>(sampleOperations, {
    limit: 3,
    offset: 0,
    query: '',
    processingTime: 0,
    estimatedTotalHits: 10,
  });
  const userId = 'approve';

  beforeEach(async () => {
    dialogData = {
      operationId: sampleOperations[1].id,
    };
    spectator = createComponent({
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: dialogData,
        },
      ],
    });
    component = spectator.component;
    spectator.inject(OperationService).getOperationById.and.returnValue(of(sampleOperations[1]));
    spectator.inject(OperationService).getOperations.and.returnValue(of(samplePaginatedOperations));
    spectator.inject(OperationService).searchOperations.and.returnValue(of(sampleSearchResultOperations));
    spectator.inject(AuthService).userChange.and.returnValue(of(userId));
    spectator.detectComponentChanges();
    await spectator.fixture.whenStable();
    harnessLoader = await TestbedHarnessEnvironment.loader(spectator.fixture);
    spectator.inject(MatDialogRef).close.and.returnValue(undefined);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('searchOperations', () => {
    it('should call operation service and return correct value', fakeAsync(async () => {
      let searchOperationsResult = await firstValueFrom(component.searchOperations(''));
      expect(searchOperationsResult).toEqual(sampleOperations);
      expect(spectator.inject(OperationService).searchOperations).toHaveBeenCalledWith({
        query: '',
        limit: 5,
        offset: 0,
      }, {
        forUser: userId,
      });
    }));
  });

  describe('apply', () => {
    it('should close with clear-action when no operation selected', () => {
      component.operationFC.setValue(null);
      component.apply();
      expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledOnceWith({
        action: 'clear',
      });
    });

    it('should close with submit-action when operation selected', () => {
      component.operationFC.setValue(sampleOperations[0].id);
      component.apply();
      expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledOnceWith({
        action: 'submit',
        operationId: sampleOperations[0].id,
      });
    });
  });

  describe('cancel', () => {
    it('should close', () => {
      component.cancel();
      expect(spectator.inject(MatDialogRef).close).toHaveBeenCalledOnceWith();
    });
  });

  describe('fixture', () => {
    it('should allow disable apply button if no operation selected', async () => {
      await spectator.fixture.whenStable();
      component.operationFC.setValue('');
      spectator.detectChanges();
      await spectator.fixture.whenStable();

      expect(component.operationFC.valid).toBeFalse();
      expect(spectator.query(byTextContent('Submit', {
        exact: false,
        selector: 'button',
      }))).toBeDisabled();
    });
  });
});
