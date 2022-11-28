import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoFullComponent } from './logo-full.component';

describe('LogoFullComponent', () => {
  let component: LogoFullComponent;
  let fixture: ComponentFixture<LogoFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoFullComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
