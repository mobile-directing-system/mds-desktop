import * as moment from 'moment';
import { Importance } from './importance';

/**
 * Supported channel types, based on
 * https://mobile-directing-system.github.io/mds-server/sites/address-book.html#channels-in-general.
 */
export enum ChannelType {
  InAppNotification = 'in-app-notification',
  Radio = 'radio',
}

/**
 * Channels are ways of delivering intel to recipients. For example, an email channel is used for sending an email
 * containing the intel to a target email address. A radio channel might forward intel to a radio operator, that calls
 * the recipient. Each channel has a unique priority, timeout and minimum importance for intel.
 */
export type Channel = InAppNotificationChannel | RadioChannel

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
 * Channel with type {@link ChannelType.InAppNotification}.
 */
export interface InAppNotificationChannel extends ChannelBase {
  type: ChannelType.InAppNotification,
  details: InAppNotificationChannelDetails
}

/**
 * Channel with type {@link ChannelType.Radio}.
 */
export interface RadioChannel extends ChannelBase {
  type: ChannelType.Radio,
  details: RadioChannelDetails
}

/**
 * Channel details for channels with type {@link ChannelType.InAppNotification}.
 */
export interface InAppNotificationChannelDetails {
}

export interface RadioChannelDetails {
  info: string;
}

/**
 * Returns the localized string of the given {@link ChannelType}.
 * @param t The channel type to localize.
 */
export function localizeChannelType(t: ChannelType): string {
  switch (t) {
    case ChannelType.InAppNotification:
      return $localize`:@@channel-type-in-app-notification:In-App Notification`;
    case ChannelType.Radio:
      return $localize`:@@channel-type-radio:Radio`;
  }
}

export function defaultChannel(entryId: string): Channel {
  const c: RadioChannel = {
    entry: entryId,
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
