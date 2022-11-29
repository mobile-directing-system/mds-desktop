import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavTitleComponent } from './side-nav-title.component';

describe('SideNavTitleComponent', () => {
  let component: SideNavTitleComponent;
  let fixture: ComponentFixture<SideNavTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideNavTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SideNavTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
