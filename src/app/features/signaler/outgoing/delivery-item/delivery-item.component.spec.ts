import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryItemComponent } from './delivery-item.component';
import {CoreModule} from "../../../../core/core.module";
import {IntelType} from "../../../../core/model/intel";
import {LogisticsModule} from "../../../logistics/logistics.module";

describe('RadioDeliveryItemComponent', () => {
  let component: DeliveryItemComponent;
  let fixture: ComponentFixture<DeliveryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryItemComponent ],
      imports: [
        CoreModule,
        LogisticsModule,
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryItemComponent);
    component = fixture.componentInstance;
    component.detailedDelivery={
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
