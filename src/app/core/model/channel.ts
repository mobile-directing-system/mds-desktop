import * as moment from 'moment';
import { Importance } from './importance';

/**
 * Supported channel types, based on
 * https://mobile-directing-system.github.io/mds-server/sites/address-book.html#channels-in-general.
 */
export enum ChannelType {
  Radio = 'radio',
  Phone = 'phone-call',
  Email = 'email'
}

/**
 * Channels are ways of delivering messages to recipients. For example, an email channel is used for sending an email
 * containing the message to a target email address. A radio channel might forward a message to a radio operator, that calls
 * the recipient.
 */
export type Channel = RadioChannel | MailChannel | PhoneChannel

export interface ChannelBase {
  /**
   * Identifies the channel.
   */
  id?: string;
  /**
   * Id of the associated address book entry.
   */
  entry: string;
  /**
   * Whether the channel is active and available for intel delivery.
   */
  isActive: boolean;
  /**
   * Human-readable label of the channel.
   */
  label: string;
  /**
   * Type that is used also used for distinguishing {@link details}.
   */
  type: ChannelType;
  /**
   * Priority in which to use the channel. Higher priority (e.g., 200) means that it will be used first before ones with
   * lower values (e.g., 100).
   */
  priority: number;
  /**
   * Minimum importance of intel that must be given in order to suggest this channel for intel delivery.
   */
  minImportance: number;
  /**
   * Timeout after no successful response, intel delivery will be considered failed.
   */
  timeout: moment.Duration;
  /**
   * Details, depending on {@link type}.
   */
  details: object;
}

/**
 * Channel with type {@link ChannelType.Radio}.
 */
export interface RadioChannel extends ChannelBase {
  type: ChannelType.Radio,
  details: RadioChannelDetails
}

export interface RadioChannelDetails {
  info: string;
}

/**
 * Channel with type {@link ChannelType.Email}.
 */
export interface MailChannel extends ChannelBase {
  type: ChannelType.Email,
  details: MailChannelDetails
}

export interface MailChannelDetails {
  email: string;
}

/**
 * Channel with type {@link ChannelType.Phone}.
 */
export interface PhoneChannel extends ChannelBase {
  type: ChannelType.Phone,
  details: PhoneChannelDetails
}

export interface PhoneChannelDetails {
  phoneNumber: string;
}

/**
 * Returns the localized string of the given {@link ChannelType}.
 * @param t The channel type to localize.
 */
export function localizeChannelType(t: ChannelType): string {
  switch (t) {
    case ChannelType.Radio:
      return $localize`:@@channel-type-radio:Radio`;
    case ChannelType.Email:
      return $localize`:@@channel-type-email:Email`;
    case ChannelType.Phone:
      return $localize`:@@channel-type-phone:Phone`;
  }
}

/**
 * Get channel details as a string representation
 */
export function getChannelDetailsText(c: Channel): string {
  switch(c.type) {
    case ChannelType.Email:
      return c.details.email;
    case ChannelType.Phone:
      return c.details.phoneNumber;
    case ChannelType.Radio:
      return c.details.info;
    default:
      return "?";
  }
}

export function defaultChannel(entryId: string): Channel {
  const c: RadioChannel = {
    entry: entryId,
    isActive: true,
    label: '',
    type: ChannelType.Radio,
    minImportance: Importance.None,
    priority: 50,
    timeout: moment.duration(10, 'minutes'),
    details: {
      info: '',
    },
  };
  return c;
}
