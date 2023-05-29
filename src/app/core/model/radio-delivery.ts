import {Intel} from "./intel";

/**
 * Model of a {@link RadioDelivery}.
 * Radio deliveries are for radio channels. Delivery requests are added to queues and assigned to radio operators, if they request one.
 */
export interface RadioDelivery{

  /**
   * id of the attempt
   */
  id: string,
  /**
   * id of the related intel
   */
  intel: string,
  /**
   * id of the related operation
   */
  intel_operation: string,
  /**
   * importance of the related intel
   */
  intel_importance: number,
  /**
   * address book entry of the assigned to
   */
  assigned_to: string,
  /**
   * name of assigned address book entry
   */
  assigned_to_label: string,
  /**
   * delivery id
   */
  delivery: string,
  /**
   * channel id
   */
  channel: string,
  /**
   * creation timestamp
   */
  created_at: Date,
  /**
   * timestamp of status change
   */
  status_ts: Date,
  /**
   * optional radio delivery note
   */
  note: string,
  /**
   * attempt accepts timestamp
   */
  accepted_at: Date
}


/**
 * More detailed and composed model of a {@link RadioDelivery}.
 * Includes the {@link RadioDelivery} itself and the related {@link Intel}
 */
export interface DetailedRadioDelivery{
  radioDelivery: RadioDelivery,
  intel: Intel
}
