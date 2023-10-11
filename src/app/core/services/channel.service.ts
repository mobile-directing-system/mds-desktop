import { Injectable } from '@angular/core';
import { NetService } from './net.service';
import { Channel, ChannelBase, ChannelType, RadioChannel, MailChannel, PhoneChannel } from '../model/channel';
import { Observable } from 'rxjs';
import { MDSError, MDSErrorCode } from '../util/errors';
import urlJoin from 'url-join';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

/**
 * Net representation of {@link Channel}.
 */
export type NetChannel = NetRadioChannel | NetMailChannel | NetPhoneChannel

/**
 * Net representation of {@link NetChannelBase}.
 */
interface NetChannelBase {
  id?: string;
  entry: string;
  is_active: boolean;
  label: string;
  type: string;
  priority: number;
  min_importance: number;
  /**
   * Timeout in nanoseconds.
   */
  timeout: number;
  details: object;
}

/**
 * Net representation of {@link RadioChannel}.
 */
interface NetRadioChannel extends NetChannelBase {
  type: 'radio',
  details: {
    info: string;
  }
}

/**
 * Net representation of {@link MailChannel}.
 */
interface NetMailChannel extends NetChannelBase {
  type: 'email',
  details: {
    email: string;
  }
}

/**
 * Net representation of {@link PhoneChannel}.
 */
interface NetPhoneChannel extends NetChannelBase {
  type: 'phone-call',
  details: {
    phone: string;
  }
}

/**
 * Maps {@link ChannelBase} to {@link NetChannelBase}.
 * @param a The channel to map.
 */
function netChannelBaseFromApp(a: ChannelBase): NetChannelBase {
  return {
    id: a.id,
    entry: a.entry,
    is_active: a.isActive,
    label: a.label,
    type: a.type,
    min_importance: a.minImportance,
    priority: a.priority,
    details: {},
    timeout: a.timeout.asMilliseconds() * 1000 * 1000,
  };
}

/**
 * Converts channel type from {@link NetChannel} to {@link ChannelType}.
 * @param n The channel to convert the type from.
 */
function appChannelTypeFromNet(n: NetChannel): ChannelType {
  switch (n.type) {
    case 'radio':
      return ChannelType.Radio;
    case 'email':
      return ChannelType.Email;
    case 'phone-call':
      return ChannelType.Phone;
    default:
      throw new MDSError(MDSErrorCode.AppError, `unsupported channel type while converting to app representation: ${(n as Channel).type }`);
  }
}

/**
 * Maps {@link NetChannelBase} to {@link ChannelBase}.
 * @param n The channel to map.
 */
function appChannelBaseFromNet(n: NetChannel): ChannelBase {
  return {
    id: n.id,
    entry: n.entry,
    isActive: n.is_active,
    label: n.label,
    type: appChannelTypeFromNet(n),
    minImportance: n.min_importance,
    priority: n.priority,
    details: {},
    timeout: moment.duration(n.timeout / 1000 / 1000, 'milliseconds'),
  };
}

/**
 * Maps {@link RadioChannel} to {@link NetRadioChannel}.
 * @param a The channel to map.
 */
function netRadioChannelFromApp(a: RadioChannel): NetRadioChannel {
  return {
    ...netChannelBaseFromApp(a),
    type: 'radio',
    details: {
      info: a.details.info,
    },
  };
}

/**
 * Maps {@link MailChannel} to {@link NetMailChannel}.
 * @param a The channel to map.
 */
function netMailChannelFromApp(a: MailChannel): NetMailChannel {
  return {
    ...netChannelBaseFromApp(a),
    type: 'email',
    details: {
      email: a.details.email
    },
  };
}

/**
 * Maps {@link PhoneChannel} to {@link NetPhoneChannel}.
 * @param a The channel to map.
 */
function netPhoneChannelFromApp(a: PhoneChannel): NetPhoneChannel {
  return {
    ...netChannelBaseFromApp(a),
    type: 'phone-call',
    details: {
      phone: a.details.phoneNumber
    },
  };
}

/**
 * Maps {@link NetRadioChannel} to {@link RadioChannel}.
 * @param n The channel to map.
 */
function appRadioChannelFromNet(n: NetRadioChannel): RadioChannel {
  return {
    ...appChannelBaseFromNet(n),
    type: ChannelType.Radio,
    details: {
      info: n.details.info,
    },
  };
}

/**
 * Maps {@link NetRadioChannel} to {@link RadioChannel}.
 * @param n The channel to map.
 */
function appMailChannelFromNet(n: NetMailChannel): MailChannel {
  return {
    ...appChannelBaseFromNet(n),
    type: ChannelType.Email,
    details: {
      email: n.details.email
    },
  };
}

/**
 * Maps {@link NetRadioChannel} to {@link RadioChannel}.
 * @param n The channel to map.
 */
function appPhoneChannelFromNet(n: NetPhoneChannel): PhoneChannel {
  return {
    ...appChannelBaseFromNet(n),
    type: ChannelType.Phone,
    details: {
      phoneNumber: n.details.phone
    },
  };
}

/**
 * Maps {@link Channel} to {@link NetChannel}.
 * @param a The channel to map.
 */
export function netChannelFromApp(a: Channel): NetChannel {
  switch (a.type) {
    case ChannelType.Radio:
      return netRadioChannelFromApp(a);
    case ChannelType.Email:
      return netMailChannelFromApp(a);
    case ChannelType.Phone:
      return netPhoneChannelFromApp(a);
    default:
      throw new MDSError(MDSErrorCode.AppError, `unsupported channel type while converting to net representation: ${ (a as Channel).type }`);
  }
}

/**
 * Maps {@link NetChannel} to {@link Channel}.
 * @param n The channel to map.
 */
export function appChannelFromNet(n: NetChannel): Channel {
  switch (n.type) {
    case 'radio':
      return appRadioChannelFromNet(n);
    case 'email':
      return appMailChannelFromNet(n);
    case 'phone-call':
      return appPhoneChannelFromNet(n);
    default:
      throw new MDSError(MDSErrorCode.AppError, `unsupported channel type while converting to app representation: ${ (n as NetChannel).type }`);
  }
}

/**
 * Service for managing and retrieving channels of address book entries.
 */
@Injectable({
  providedIn: 'root',
})
export class ChannelService {

  constructor(private netService: NetService) {
  }

  /**
   * Retrieves the channels for the address book entry with the given id.
   * @param entryId The id of the address book entry to retrieve channels for.
   */
  getChannelsByAddressBookEntry(entryId: string): Observable<Channel[]> {
    return this.netService.get<NetChannel[]>(urlJoin('/address-book', 'entries', entryId, 'channels'), {}).pipe(
      map((res: NetChannel[]): Channel[] => {
        const appChannels = res.map(appChannelFromNet);
        // TODO: Remove when server-side sorting is implemented.
        appChannels.sort((a, b): number => b.priority - a.priority);
        return appChannels;
      }),
    );
  }

  /**
   * Updates the channels for the address book entry with the given id.
   * @param entryId The id of the address book entry to update channels for.
   * @param channels The new channels to replace old ones with.
   */
  updateChannelsByAddressBookEntry(entryId: string, channels: Channel[]): Observable<void> {
    const body: NetChannel[] = channels.map(netChannelFromApp);
    return this.netService.putJSON(urlJoin('/address-book', 'entries', entryId, 'channels'), body, {});
  }
}
