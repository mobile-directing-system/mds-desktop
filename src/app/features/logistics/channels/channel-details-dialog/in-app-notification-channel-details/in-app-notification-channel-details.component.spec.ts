import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InAppNotificationChannelDetails } from '../../../../../core/model/channel';
import { CoreModule } from '../../../../../core/core.module';
import { LogisticsModule } from '../../../logistics.module';
import { InAppNotificationChannelDetailsComponent } from './in-app-notification-channel-details.component';

@Component({
  template: `
    <app-in-app-notification-channel-details [formControl]="fc"></app-in-app-notification-channel-details>`,
})
class TestHostComponent {
  fc = new FormControl<InAppNotificationChannelDetails>({}, { nonNullable: true });
}

describe('InAppNotificationChannelDetailsComponent.integration', () => {
  let spectator: Spectator<TestHostComponent>;
  let host: TestHostComponent;
  const createComponent = createComponentFactory({
    component: TestHostComponent,
    imports: [CoreModule, LogisticsModule],
    declarations: [InAppNotificationChannelDetailsComponent],
  });

  beforeEach(async () => {
    spectator = createComponent();
    host = spectator.component;
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should display information message for nothing to configure', () => {
    expect(spectator.query(byTextContent('Nothing to configure', {
      exact: false,
      selector: 'span',
    }))).toBeVisible();
  });
});
