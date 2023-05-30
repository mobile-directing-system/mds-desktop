import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioDeliveryItemComponent } from './radio-delivery-item.component';
import {CoreModule} from "../../../../core/core.module";
import {LogisticsModule} from "../../logistics.module";
import {IntelType} from "../../../../core/model/intel";

describe('RadioDeliveryItemComponent', () => {
  let component: RadioDeliveryItemComponent;
  let fixture: ComponentFixture<RadioDeliveryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadioDeliveryItemComponent ],
      imports: [
        CoreModule,
        LogisticsModule,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioDeliveryItemComponent);
    component = fixture.componentInstance;
    component.detailedRadioDelivery={
      radioDelivery:{
        id: "id",
        intel: "intel",
        intel_operation: "intel_operation",
        intel_importance: 2,
        assigned_to: "assigned_to",
        assigned_to_label: "assigned_to_label",
        delivery: "delivery",
        channel: "channel",
        created_at: new Date(),
        status_ts: new Date(),
        note: "note",
        accepted_at: new Date(),
      },
      intel:{
        createdAt: new Date(),
        createdBy: "createdBy",
        id: "id",
        importance: 0,
        isValid: true,
        operation: "operation",
        searchText: "searchText",
        type: IntelType.PlainTextMessage,
        content: {text: "text"},
      }
    }
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
