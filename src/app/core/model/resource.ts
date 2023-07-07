import { AddressBookEntry, CreateAddressBookEntry } from "./address-book-entry";

/**
 * A resource is a {@link AddressBookEntry} with additional fields
 */
export interface Resource extends AddressBookEntry {
    /**
     * Current status code of the resource
     */
    statusCode: number
}

/**
 * Used to create a {@link Resource}
 */
export interface CreateResource extends CreateAddressBookEntry {
    /**
     * Current status code of the resource
     */
    statusCode: number
}