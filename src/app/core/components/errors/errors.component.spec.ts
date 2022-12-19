import { Component } from '@angular/core';
import { byTextContent, createComponentFactory, Spectator } from '@ngneat/spectator';
import { CoreModule } from '../../core.module';
import { AngularMaterialModule } from '../../util/angular-material.module';

@Component({
  template: `
    <app-errors>
      <mat-error>Error 1</mat-error>
      <mat-error>Error 2</mat-error>
      <mat-error>Error 3</mat-error>
    </app-errors>`,
})
class TestHostComponent {
}

describe('ErrorsComponent.integration', () => {
  let spectator: Spectator<TestHostComponent>;
  let host: TestHostComponent;
  const createComponent = createComponentFactory<TestHostComponent>({
    component: TestHostComponent,
    imports: [CoreModule, AngularMaterialModule],
  });
  beforeEach(async () => {
    spectator = createComponent();
    host = spectator.component;
    await spectator.fixture.whenStable();
  });

  it('should create', () => {
    expect(host).toBeTruthy();
  });

  it('should show first error', () => {
    expect(spectator.query(byTextContent('Error 1', {selector: 'mat-error'}))).toBeVisible()
  });

  it('should hide errors not being first', () => {
    expect(spectator.query(byTextContent('Error 2', {selector: 'mat-error'}))).not.toBeVisible()
    expect(spectator.query(byTextContent('Error 3', {selector: 'mat-error'}))).not.toBeVisible()
  });
});
