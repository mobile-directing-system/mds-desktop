import { AddressBookEntry, CreateAddressBookEntry } from "./address-book-entry";

/**
 * A resource is a {@link AddressBookEntry} with additional fields
 */
export interface Resource extends AddressBookEntry {
    /**
     * Current status code of the resource
     */
    statusCode?: number

    /**
     * The incident id the resource is attached to
     */
    incident?: string
}

/**
 * Translate a status code to a text
 * 
 * @param statusCode 
 */
export function getStatusCodeText(statusCode: number): string {
    switch(statusCode){
        case 1:
            return $localize`:@@status-code-1:Free over radio`;
    }
    return "";
}