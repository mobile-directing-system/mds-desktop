import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiddenComponent } from './hidden.component';
import { CoreModule } from '../../core.module';
import { AngularMaterialModule } from '../../util/angular-material.module';

describe('HiddenComponent', () => {
  let component: HiddenComponent;
  let fixture: ComponentFixture<HiddenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HiddenComponent],
      imports: [CoreModule, AngularMaterialModule],
    })
      .compileComponents();

    fixture = TestBed.createComponent(HiddenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
