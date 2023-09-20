import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectChannelDialog } from './select-channel-dialog.component';

describe('SelectChannelDialog', () => {
  let component: SelectChannelDialog;
  let fixture: ComponentFixture<SelectChannelDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectChannelDialog ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectChannelDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
