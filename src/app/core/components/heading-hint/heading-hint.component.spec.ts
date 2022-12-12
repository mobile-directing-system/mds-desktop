import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingHintComponent } from './heading-hint.component';

describe('HeadingHintComponent', () => {
  let component: HeadingHintComponent;
  let fixture: ComponentFixture<HeadingHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeadingHintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadingHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
