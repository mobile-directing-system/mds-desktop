import { CreateOperationView } from './create-operation-view.component';
import { byTextContent, createRoutingFactory, SpectatorRouting, SpectatorRoutingOptions } from '@ngneat/spectator';
import { ManagementModule } from '../../management.module';
import { NotificationService } from '../../../../core/services/notification.service';
import { OperationService } from '../../../../core/services/operation.service';
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { CoreModule } from '../../../../core/core.module';
import * as moment from 'moment';
import { FeaturesModule } from '../../../features.module';


function genFactoryOptions(): SpectatorRoutingOptions<CreateOperationView> {
  return {
    component: CreateOperationView,
    imports: [
      FeaturesModule,
      ManagementModule,
      CoreModule,
    ],
    mocks: [
      NotificationService,
      OperationService,
    ],
    detectChanges: false,
  };
}

describe('CreateOperationViewComponent', () => {
  let spectator: SpectatorRouting<CreateOperationView>;
  let component: CreateOperationView;
  const createComponent = createRoutingFactory(genFactoryOptions());

  const title = 'spring';
  const description = 'step';
  const startDate = moment(new Date(2024, 9, 9, 12, 0, 0, 0));
  const endDateSmallerThanStartDate = moment(new Date(2024, 8, 8, 12, 0, 0, 0));
  const endDateGreaterThanStartDate = moment(new Date(2024, 10, 10, 12, 0, 0, 0));
  const endDateExactlyEqualToStartDate = moment(new Date(2024, 9, 9, 12, 0, 0, 0));
  const endDateWithEqualDateButSmallerTime = moment(new Date(2024, 9, 9, 11, 0, 0, 0));
  const endDateWithEqualDateButGreaterTime = moment(new Date(2024, 9, 9, 14, 0, 0, 0));
  const isArchived = false;

  beforeEach(async () => {
    spectator = createComponent();
    component = spectator.component;
    spectator.router.navigate = jasmine.createSpy().and.callFake(spectator.router.navigate).and.resolveTo();
    spectator.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to /operations/ when click on close', fakeAsync(() => {
    spectator.click(byTextContent('Cancel', { selector: 'button' }));
    tick();
    expect(spectator.router.navigate).toHaveBeenCalledOnceWith(['..'], { relativeTo: spectator.activatedRouteStub });
  }));

  it('should disable operation creation without values', () => {
    expect(component.form.valid).toBeFalse();
  });

  it('should disable operation creation without title', fakeAsync(() => {
    component.form.setValue({
      title: '',
      description: description,
      start: startDate,
      end: endDateGreaterThanStartDate,
      isArchived: isArchived,
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should disable operation creation without description', fakeAsync(() => {
    component.form.setValue({
      title: title,
      description: '',
      start: startDate,
      end: endDateGreaterThanStartDate,
      isArchived: isArchived,
    });
    tick();
    expect(component.form.valid).toBeTrue();
  }));

  it('should disable operation creation without valid end date 1', fakeAsync(() => {
    component.form.setValue({
      title: title,
      description: description,
      start: startDate,
      end: endDateSmallerThanStartDate,
      isArchived: isArchived,
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should disable operation creation without valid end date 2', fakeAsync(() => {
    component.form.setValue({
      title: title,
      description: description,
      start: startDate,
      end: endDateWithEqualDateButSmallerTime,
      isArchived: isArchived,
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should disable operation creation without valid end date 2', fakeAsync(() => {
    component.form.setValue({
      title: title,
      description: description,
      start: startDate,
      end: endDateExactlyEqualToStartDate,
      isArchived: isArchived,
    });
    tick();
    expect(component.form.valid).toBeFalse();
  }));

  it('should allow operation creation with all valid values 1', fakeAsync(() => {
    component.form.patchValue({
      title: title,
      description: description,
      start: startDate,
      end: undefined,
      isArchived: isArchived,
    });
    tick();
    expect(component.form.valid).toBeTrue();
  }));

  it('should allow operation creation with all valid values 2', fakeAsync(() => {
    component.form.setValue({
      title: title,
      description: description,
      start: startDate,
      end: endDateWithEqualDateButGreaterTime,
      isArchived: isArchived,
    });
    tick();
    expect(component.form.valid).toBeTrue();
  }));

  it('should allow operation creation with all valid values 3', fakeAsync(() => {
    component.form.setValue({
      title: title,
      description: description,
      start: startDate,
      end: endDateWithEqualDateButGreaterTime,
      isArchived: isArchived,
    });
    tick();
    expect(component.form.valid).toBeTrue();
  }));

  describe('createOperation', () => {
    it('should fail without title', fakeAsync(() => {
      component.form.setValue({
        title: '',
        description: description,
        start: startDate,
        end: endDateGreaterThanStartDate,
        isArchived: isArchived,
      });
      tick();
      expect(component.createOperation).toThrowError();
    }));

    it('should fail without description', fakeAsync(() => {
      component.form.setValue({
        title: title,
        description: '',
        start: startDate,
        end: endDateGreaterThanStartDate,
        isArchived: isArchived,
      });
      tick();
      expect(component.createOperation).toThrowError();
    }));

    it('should create operation correctly 1', fakeAsync(() => {
      component.form.patchValue({
        title: title,
        description: description,
        start: startDate,
        end: endDateGreaterThanStartDate,
        isArchived: isArchived,
      });
      tick();
      spectator.inject(OperationService).createOperation.and.returnValue(of({
        id: 'thank',
        title: title,
        description: description,
        start: startDate.toDate(),
        end: endDateGreaterThanStartDate.toDate(),
        isAchived: isArchived,
      }));

      component.createOperation();
      tick();

      expect(spectator.inject(OperationService).createOperation).toHaveBeenCalledOnceWith({
        title: title,
        description: description,
        start: startDate.toDate(),
        end: endDateGreaterThanStartDate.toDate(),
        isArchived: isArchived,
      });
    }));

    it('should create operation correctly 2', fakeAsync(() => {
      component.form.patchValue({
        title: title,
        description: description,
        start: startDate,
        end: undefined,
        isArchived: isArchived,
      });
      tick();
      spectator.inject(OperationService).createOperation.and.returnValue(of({
        id: 'thank',
        title: title,
        description: description,
        start: startDate,
        isArchived: isArchived,
      }));

      component.createOperation();
      tick();

      expect(spectator.inject(OperationService).createOperation).toHaveBeenCalledOnceWith({
        title: title,
        description: description,
        start: startDate.toDate(),
        end: undefined,
        isArchived: isArchived,
      });
    }));

    it('should show an error message if operation creation failed', fakeAsync(() => {
      component.form.patchValue(({
        title: title,
        description: description,
        start: startDate,
        end: undefined,
        isArchived: isArchived,
      }));
      tick();
      spectator.inject(OperationService).createOperation.and.returnValue(of(void 0));

      component.createOperation();
      tick();
      expect(spectator.inject(NotificationService).notifyUninvasiveShort).toHaveBeenCalled();
    }));
  });

  it('should disable operation create button when creation is not allowed', fakeAsync(async () => {
    component.form.patchValue({
      title: '',
      description: '',
      start: startDate,
      end: endDateGreaterThanStartDate,
      isArchived: isArchived,
    });
    tick();

    await spectator.fixture.whenStable();
    expect(spectator.query(byTextContent('Create', {
      exact: false,
      selector: 'button',
    }))).toBeDisabled();
  }));
});
