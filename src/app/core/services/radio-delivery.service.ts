import {Injectable} from '@angular/core';
import {RadioDelivery} from "../model/radio-delivery";
import {NetService} from "./net.service";
import {Observable} from "rxjs";
import {IntelDeliveryAttempt} from "../model/intel-delivery";
import urlJoin from "url-join";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class RadioDeliveryService {

  constructor(private netService: NetService) { }

  getNextRadioDelivery(operationId: string): Observable<RadioDelivery | undefined> {
    return this.netService.get<NetRadioDelivery | undefined>(urlJoin('/radio-deliveries', 'operations', operationId, 'next'), {}).pipe(
      map((res: NetRadioDelivery | undefined): RadioDelivery | undefined => radioDeliveryFromNet(res)),
    );
  }

  releaseRadioDelivery(attemptId: string): Observable<void>{
    return this.netService.post(urlJoin('/radio-deliveries', attemptId, 'release'), {})
  }

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
interface NetRadioDelivery {
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
 * Maps {@link NetIntelDeliveryAttempt} to {@link IntelDeliveryAttempt}.
 * @param net The attempt to map.
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
