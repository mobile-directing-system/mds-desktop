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
 * Returns all available status codes
 */
export const statusCodes: Record<number, string> = {
    0: $localize`:@@status-code-0:Emergency call`,
    1: $localize`:@@status-code-1:Free over radio`,
    2: $localize`:@@status-code-2:Free on station`,
    3: $localize`:@@status-code-3:Operation accepted`,
    4: $localize`:@@status-code-4:Arrived at destination`,
    5: $localize`:@@status-code-5:Request to talk`,
    6: $localize`:@@status-code-6:Out of service`,
    7: $localize`:@@status-code-7:Taken over at operation place`,
    8: $localize`:@@status-code-8:Arrived at hospital`,
    9: $localize`:@@status-code-9:Approved`
}

/**
 * Translates a status code to a text
 * 
 * @param statusCode
 */

export function getStatusCodeText(statusCode: number): string {
    return statusCodes[statusCode] ?? $localize`:@@status-code-unkown:Status code unknown`;
}