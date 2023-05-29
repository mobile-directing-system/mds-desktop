import {Injectable} from '@angular/core';
import {RadioDelivery} from "../model/radio-delivery";
import {NetService} from "./net.service";
import {Observable} from "rxjs";
import urlJoin from "url-join";
import {map} from "rxjs/operators";

/**
 * Service for sending and receiving radio delivery requests.
 * {@link RadioDelivery} can be picked up, released and finished.
 */
@Injectable({
  providedIn: 'root'
})
export class RadioDeliveryService {

  constructor(private netService: NetService) { }

  /**
   * Picks up next available {@link RadioDelivery} for the passed operation.
   *
   * @param operationId: The id of the operation to pick up from
   */
  getNextRadioDelivery(operationId: string): Observable<RadioDelivery | undefined> {
    return this.netService.get<NetRadioDelivery | undefined>(urlJoin('/radio-deliveries', 'operations', operationId, 'next'), {}).pipe(
      map((res: NetRadioDelivery | undefined): RadioDelivery | undefined => radioDeliveryFromNet(res)),
    );
  }

  /**
   * Releases the passed {@link RadioDelivery}
   *
   * @param attemptId: The id of the radio delivery to release
   */
  releaseRadioDelivery(attemptId: string): Observable<void>{
    return this.netService.post(urlJoin('/radio-deliveries', attemptId, 'release'), {})
  }

  /**
   * Finishes the passed {@link RadioDelivery}
   *
   * @param attemptId: The id of the radio delivery to release
   * @param success If the delivery should be marked as successfully or unsuccessfully
   */
  finishRadioDelivery(attemptId: string, success: boolean): Observable<void>{
    return this.netService.postJSON(urlJoin('/radio-deliveries', attemptId, 'finish'), {
      "success": success,
      "note": ""
    },{})
  }
}


/**
 * Net representation of {@link RadioDelivery}.
 */
export interface NetRadioDelivery {
  id: string,
  intel: string,
  intel_operation: string,
  intel_importance: number,
  assigned_to: string,
  assigned_to_label: string,
  delivery: string,
  channel: string,
  created_at: string,
  status_ts: string,
  note: string,
  accepted_at: string
}

/**
 * Maps {@link NetRadioDelivery} to {@link RadioDelivery}.
 * @param net The radio delivery to map.
 */
function radioDeliveryFromNet(net: NetRadioDelivery | undefined): RadioDelivery | undefined {
  if(net == undefined) return undefined;
  return {
    id: net.id,
    intel: net.intel,
    intel_operation: net.intel_operation,
    intel_importance: net.intel_importance,
    assigned_to: net.assigned_to,
    assigned_to_label: net.assigned_to_label,
    delivery: net.delivery,
    channel: net.channel,
    created_at: new Date(Date.parse(net.created_at)),
    status_ts: new Date(Date.parse(net.status_ts)),
    note: net.note,
    accepted_at: new Date(Date.parse(net.accepted_at))
  };
}
