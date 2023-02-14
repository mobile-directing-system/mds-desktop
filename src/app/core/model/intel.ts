/**
 * Supported intel types, based on
 * https://mobile-directing-system.github.io/mds-server/sites/intelligence.html#intel-types.
 */
export enum IntelType {
  /**
   * Used for radio messages, received via analog radio.
   */
  AnalogRadioMessage = 'analog-radio-message',
  /**
   * Used for plaintext content.
   */
  PlainTextMessage = 'plaintext-message',
}

/**
 * Intel lays the fundamentals for information delivery in MDS. Intel is always tied to an {@link Operation},
 * defines to whom the information will be delivered and at what importance. The intel content, which contains
 * the messages, is based on the respective {@link IntelType}s.
 */
export type Intel = AnalogRadioMessageIntel | PlaintextMessageIntel;

/**
 * Used to create {@link Intel}
 */
export type CreateIntel = CreateAnalogRadioMessageIntel | CreatePlaintextMessageIntel;

export interface IntelBase {
  /**
   * Identifies the intel.
   */
  id: string;
  /**
   * Timestamp of when the intel was created.
   */
  createdAt: Date;
  /**
   * Id of the user that created this intel.
   */
  createdBy: string;
  /**
   * Id of the associated operation.
   */
  operation: string;
  /**
   * Type, used for distinguishing the intel's {@link content}.
   */
  type: IntelType;
  /**
   * Content, based on {@link type}.
   */
  content: object;
  /**
   * Text used for searching this particular intel.
   */
  searchText: string;
  /**
   * Importance of the intel.
   */
  importance: number;
  /**
   * Indicates whether the intel is valid. This means that the intel is no longer visible
   * and is used instead of deleting.
   */
  isValid: boolean;
}

export interface CreateIntelBase {
  /**
   * The id of the associated operation.
   */
  operation: string;
  /**
   * Type, used for distinguishing the intel's {@link content}.
   */
  type: IntelType;
  /**
   * Importance of the intel.
   */
  importance: number;
  /**
   * Content, based on {@link type}.
   */
  content: object;
  /**
   * List of address book entry ids, to which the respective intel will be delivered.
   */
  initialDeliverTo: string[];
}

/**
 * Content for intel with type {@link IntelType.AnalogRadioMessage}.
 */
export interface AnalogRadioMessageIntelContent {
  /**
   * Channel over which the analog radio message was received.
   */
  channel: string;
  /**
   * Callsign of the analog radio messages sender.
   */
  callsign: string;
  /**
   * The analog radio messages head.
   */
  head: string;
  /**
   * Actual content of the analog radio message.
   */
  content: string;
}

/**
 * Content for intel with type {@link IntelType.PlainTextMessage}
 */
export interface PlaintextMessageIntelContent {
  /**
   * Text content of the message.
   */
  text: string;
}

/**
 * Intel with type {@link IntelType.AnalogRadioMessage}.
 */
export interface AnalogRadioMessageIntel extends IntelBase {
  type: IntelType.AnalogRadioMessage;
  content: AnalogRadioMessageIntelContent;
}

/**
 * Intel with type {@link IntelType.AnalogRadioMessage}.
 */
export interface CreateAnalogRadioMessageIntel extends CreateIntelBase {
  type: IntelType.AnalogRadioMessage;
  content: AnalogRadioMessageIntelContent;
}

/**
 * Used to create intel with type {@link IntelType.PlainTextMessage}.
 */
export interface PlaintextMessageIntel extends IntelBase {
  type: IntelType.PlainTextMessage;
  content: PlaintextMessageIntelContent;
}

/**
 * Used to create intel with type {@link IntelType.PlainTextMessage}.
 */
export interface CreatePlaintextMessageIntel extends CreateIntelBase {
  type: IntelType.PlainTextMessage;
  content: PlaintextMessageIntelContent;
}
