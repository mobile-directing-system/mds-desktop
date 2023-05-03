import { Injectable, OnDestroy } from '@angular/core';
import { IntelService } from './intel.service';
import { CreateIntel } from '../model/intel';
import { Observable, Subscription } from 'rxjs';
import { AddressBookService } from './addressbook.service';
import { map } from 'rxjs/operators';
import { SearchResult } from '../util/store';
import { FormBuilder } from '@angular/forms';
import { Operation } from '../model/operation';
import { OperationService } from './operation.service';
import { AddressBookEntry } from '../model/address-book-entry';

@Injectable({
  providedIn: 'root',
})
export class IntelCreationService implements OnDestroy {

  /**
   * List of "buffered" {@link CreateIntel} until the whole list is sent.
   */
  intelInCreation: CreateIntel[] = [];

  loadedEntries: AddressBookEntry [] = [];

  selectedOperation = this.fb.nonNullable.control<string | null>(null);

  inIntelCreation = false;

  s: Subscription[] = [];

  constructor(private intelService: IntelService, private addressBookEntryService: AddressBookService,
              private fb: FormBuilder, private operationService: OperationService) {
  }

  ngOnDestroy(): void {
    this.s.forEach(s => s.unsubscribe());
  }

  /**
   * Adds the given {@link CreateIntel} to list of intel in creation
   * and retrieves the respective {@link AddressBookEntry}s.
   * @param createIntel The intel to be added.
   */
  addCreateIntel(createIntel: CreateIntel): void {
    this.intelInCreation.push(createIntel);
    this.retrieveAddressBookEntriesFromCreateIntel(createIntel);
  }

  /**
   * Sends all {@link CreateIntel} in {@link intelInCreation} and then clears the list.
   */
  sendIntelInCreation() {
    for (let createIntel of this.intelInCreation) {
      this.s.push(this.intelService.createIntel(createIntel).subscribe());
    }
    this.intelInCreation = [];
  }

  /**
   * Searches {@link AddressBookEntry}s based on the given query.
   * @param query The search term.
   */
  searchAddressBookEntry(query: string): Observable<AddressBookEntry[]> {
    return this.addressBookEntryService.searchAddressBookEntries({
      query: query,
      limit: 5,
      offset: 0,
    }, {}).pipe(
      map((res: SearchResult<AddressBookEntry>): AddressBookEntry[] => {
        return res.hits;
      }));
  }

  /**
   * Retrieves {@link AddressBookEntry} with the given id.
   * @param entryId The id of the entry.
   */
  getAddressBookEntryById(entryId: string): Observable<AddressBookEntry> {
    return this.addressBookEntryService.getAddressBookEntryById(entryId);
  }

  /**
   * Retrieves {@link Operation} with the given id.
   * @param operationId The id of the operation.
   */
  getOperationById(operationId: string): Observable<Operation> {
    return this.operationService.getOperationById(operationId);
  }

  /**
   * Gets the {@link AddressBookEntry} with the given id, from the list of loaded entries.
   * @param entryId The id of the {@link AddressBookEntry}.
   */
  getLoadedAddressBookEntryById(entryId: string): AddressBookEntry | undefined {
    return this.loadedEntries.find(entry => entry.id === entryId);
  }

  /**
   * Retrieves the address book entries associated with the given {@link createIntel}.
   * @param createIntel Intel in creation for which the address book entries are to be retrieved.
   */
  private retrieveAddressBookEntriesFromCreateIntel(createIntel: CreateIntel) {
    createIntel.initialDeliverTo.forEach(entryId => {
      if (!this.loadedEntries.some(entry => entry.id === entryId)) {
        this.s.push(
          this.addressBookEntryService.getAddressBookEntryById(entryId).subscribe(entry => {
            this.loadedEntries.push(entry);
          }),
        );
      }
    });
  }
}
