import { Observable, map, of } from "rxjs";
import { Participant } from "../model/message";
import { ResourceService } from "../services/resource/resource.service";
import { AddressBookService } from "../services/addressbook.service";
import { GroupService } from "../services/group.service";

/**
 * Returns label of the participant
 *
 * @param type: type of the participant
 * @param id: id of the participant
 * @returns label of the participant or undefined when participant does not exist
 */
export function getParticipantLabel(resourceService: ResourceService, addressBookService: AddressBookService,
    groupService: GroupService, type?: Participant, id?: string): Observable<string | undefined> {
    if (id && type != undefined) {
        if (type === Participant.Resource) {
            return resourceService.getResourceById(id).pipe(
                map(resource => resource?.label)
            )
        }
        if (type === Participant.AddressBookEntry) {
            return addressBookService.getAddressBookEntryById(id).pipe(
                map(entry => entry.label)
            )
        }
        if (type === Participant.Role) {
            return groupService.getGroupById(id).pipe(
                map(group => group.title)
            )
        }
    }
    return of(undefined);
}