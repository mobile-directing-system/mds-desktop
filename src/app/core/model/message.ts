import { ChannelType } from "./channel";

/**
 * Participants of the system that are adressable in a message
 */
export enum Participant {
    AddressBookEntry, Resource, Role
}

/**
 * Direction of a message
 */
export enum MessageDirection {
    Incoming, Outgoing
}

/**
 * Recipient of a message
 */
export interface Recipient {
    /**
     * A recipient can be an address book entry, a resource or a role
     */
    recipientType: Participant;
    /**
     * The id of the recipient
     */
    recipientId: string;
    /**
     * The reviewer must select a channel for the recipient when
     * the {@link recipientType} is an address book entry or a resource
     */
    channelId?: string;
    /**
     * Whether the recipient already read the message.
     * This is only relevant for {@link Participant.Role} in the system
     * because for other participants the read status cannot be determined.
     */
    read?: boolean;
    /**
     * Whether the message was sent to the recipient
     */
    send?: boolean;
    /**
     * User id of a signaler if he has picked up the message to send it to the recipient
     */
    signalerId?: string;
}

/**
 * Represents an incoming or an outgoing message in the system
 */
export interface Message {
    /**
     * Identifies the message.
     */
    id: string;
    /**
     * Signals if the message is incoming or outgoing
     */
    direction: MessageDirection;
    /**
     * Type of incoming message (e.g. radio or telephone)
     */
    incomingChannelType?: ChannelType;
    /**
     * A sender can be an address book entry, a resource or a role
     */
    senderType?: Participant;
    /**
     * Id of the sender
     */
    senderId?: string;
    /**
     * Additional information about the sender (e.g. mail address, telephone number)
     */
    info?: string;
    /**
     * Content of the messages
     */
    content: string;
    /**
     * Incident the message is associated with
     */
    incidentId?: string;
    /**
     * Only if the {@link senderType} is a {@link Participant.Resource}:
     * New status code of the resource
     */
    resourceStatusCode?: number;
    /**
     * Timestamp when the message was created
     */
    createdAt: Date;
    /**
     * Signals if an incoming message needs a review from the reviewer
     */
    needsReview?: boolean;
    /**
     * Priority of the message
     */
    priority?: number;
    /**
     * Recipients of the message
     */
    recipients: Recipient[];
}
