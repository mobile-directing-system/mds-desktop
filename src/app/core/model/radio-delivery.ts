import {Intel} from "./intel";

export interface RadioDelivery{

  id: string,
  intel: string,
  intel_operation: string,
  intel_importance: number,
  assigned_to: string,
  assigned_to_label: string,
  delivery: string,
  channel: string,
  created_at: Date,
  status_ts: Date,
  note: string,
  accepted_at: Date
}

export interface DetailedRadioDelivery{
  radioDelivery: RadioDelivery,
  intel: Intel
}
