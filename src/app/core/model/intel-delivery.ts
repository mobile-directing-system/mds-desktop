import { Channel } from './channel';
import { Importance } from './importance';

/**
 * Intel delivery that is open for being scheduled over a channel.
 */
export interface OpenIntelDelivery {
  delivery: {
    /**
     * Id of the delivery.
     */
    id: string;
    /**
     * Id of the intel to deliver.
     */
    intel: string;
    /**
     * Id of the target address book entry.
     */
    to: string;
    /**
     * Optional note.
     */
    note?: string;
  },
  /**
   * Intel to deliver.
   */
  intel: {
    /**
     * Identifies the intel.
     */
    id: string;
    /**
     * Timestamp when the intel was created.
     */
    createdAt: Date;
    /**
     * Id of the user that created the intel.
     */
    createdBy: string;
    /**
     * Id of the associated operation.
     */
    operation: string;
    /**
     * Intel importance.
     */
    importance: number;
    /**
     * Whether the intel is still valid.
     */
    isValid: boolean;
  }
}

export enum IntelDeliveryAttemptStatus {
  Open,
  AwaitingDelivery,
  Delivering,
  AwaitingAck,
  Delivered,
  Timeout,
  Canceled,
  Failed,
  Unknown
}

/**
 * Attempt of delivering intel to a recipient address book entry.
 */
export interface IntelDeliveryAttempt {
  /**
   * Identifies the attempt.
   */
  id: string;
  /**
   * Id of the intel delivery the attempt was for.
   */
  delivery: string;
  /**
   * Id of the channel being used.
   */
  channel: string;
  /**
   * Timestamp when the attempt was created.
   */
  createdAt: Date;
  /**
   * Whether the attempt is still active.
   */
  isActive: boolean;
  /**
   * The current status.
   */
  status: IntelDeliveryAttemptStatus;
  /**
   * Timestamp when {@link status} was last modified.
   */
  statusTS: Date;
  /**
   * Optional note regarding the attempt.
   */
  note?: string;
}

interface DeliverChannelBase {
  channel: Channel;
  noRecommendReason?: DeliverChannelNoRecommendReason;
  details?: any;
}

export enum DeliverChannelNoRecommendReason {
  MinImportanceNotSatisfied,
  FailedAttempt,
  ChannelInactive,
}

/**
 * Recommended channel for delivery.
 */
export interface DeliverChannelRecommended extends DeliverChannelBase {
  noRecommendReason: undefined;
  details: undefined;
}

/**
 * Unrecommended channel for delivery because of {@link DeliverChannelNoRecommendReason.MinImportanceNotSatisfied}.
 */
export interface DeliverChannelMinImportanceNotSatisfied extends DeliverChannelBase {
  noRecommendReason: DeliverChannelNoRecommendReason.MinImportanceNotSatisfied;
  details: {
    intelImportance: Importance;
    channelMinImportance: Importance;
  };
}

/**
 * Unrecommended channel for delivery because of {@link DeliverChannelNoRecommendReason.FailedAttempt}.
 */
export interface DeliverChannelFailedAttempt extends DeliverChannelBase {
  noRecommendReason: DeliverChannelNoRecommendReason.FailedAttempt;
  details: {
    attempt: IntelDeliveryAttempt;
  };
}

/**
 * Unrecommended channel for delivery because of {@link DeliverChannelNoRecommendReason.ChannelInactive}.
 */
export interface DeliverChannelChannelInactive extends DeliverChannelBase {
  noRecommendReason: DeliverChannelNoRecommendReason.ChannelInactive;
  details: {};
}

export type DeliverChannel =
  DeliverChannelRecommended
  | DeliverChannelMinImportanceNotSatisfied
  | DeliverChannelFailedAttempt
  | DeliverChannelChannelInactive
