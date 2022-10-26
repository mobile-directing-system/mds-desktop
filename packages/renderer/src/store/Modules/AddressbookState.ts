import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import { createAddressbookEntry, updateAddressbookEntry, deleteAddressbookEntry, retrieveAddressbookEntries, retrieveAddressbookEntry, searchEntries} from '#preload';
import type { AddressbookEntry,  ErrorResult } from '../../../../types';
import type { Context } from 'vuex-smart-module';
import type { Store } from 'vuex';
import { errorState, handleErrors } from './ErrorState';

/**
 * define content for AddressbookState
 */
class AddressbookState {
    // map containing all retrieved entries
    entries: Map<string, AddressbookEntry> = new Map<string, AddressbookEntry>();
    // map containing all entries retrieved on the most recent page
    page: Map<string, AddressbookEntry> = new Map<string, AddressbookEntry>();
    // map containing the search results from the entries search endpoint
    searchResult: Map<string, AddressbookEntry> = new Map<string, AddressbookEntry>();
    // total number of entries retrievable
    total = 0;
}

/**
 * define getters to access the state
 */
class AddressbookStateGetters extends Getters<AddressbookState> {
    get entries() {
        return () => {
            return this.state.entries;
        };
    }
    get page() {
        return () => {
            return this.state.page;
        };
    }
    get total() {
        return () => {
            return this.state.total;
        };
    }
    get searchResults() {
        return () => {
          return this.state.searchResult;
        };
    }
}

/**
 * define mutations to change the state
 */
class AddressbookStateMutations extends Mutations<AddressbookState> {
    /**
     * function to clear the page state and add the passed entries to it
     * @param entries to be added to the page state
     */
    setPage(entries: AddressbookEntry[]) {
        this.state.page.clear();
        entries.forEach((elem) => this.state.page.set(elem.id, elem));
    }
    /**
     * function to clear the page and entries state and add the entries to both
     * @param entries to be added to the page and entries states
     */
    setEntries(entries: AddressbookEntry[]) {
        this.state.page.clear();
        this.state.entries.clear();
        entries.forEach((elem) => this.state.entries.set(elem.id, elem));
        entries.forEach((elem) => this.state.page.set(elem.id, elem));
    }
    /**
     * function to add new or update existing entries in the page and entries state
     * @param entries to be added to or used to update elements of the page and entries state
     */
    addOrUpdateEntries(entries: AddressbookEntry[]) {
        entries.forEach((elem) => this.state.entries.set(elem.id, elem));
        entries.forEach((elem) => this.state.page.set(elem.id, elem));
    }
    /**
     * function to add new or update an existing single entry in the page and entries states
     * @param entry  to be added to or used to update a single entry in the page and entries state
     */
    addOrUpdateEntry(entry: AddressbookEntry){
        this.state.entries.set(entry.id, entry);
        this.state.page.set(entry.id, entry);
    }
    /**
     * function to clear and set the search result state
     * @param entries to set the search result state to
     */
    setSearchResult(entries: AddressbookEntry[]){
        this.state.searchResult.clear();
        entries.forEach((entry) => this.state.searchResult.set(entry.id, entry));
    }
    /**
     * function to set the number of total retrievable entries state
     * @param total to set the total state to
     */
    setTotal(total: number) {
        this.state.total = total;
    }
    /**
     * function to delete an entry from the entries and page state
     * @param entryId of the entry to be deleted
     */
    deleteEntries(entryId: string){
        this.state.entries.delete(entryId);
        this.state.page.delete(entryId);
    }
}

/**
 * defince actions for functions that change the state with a sideeffect.
 */
class AddressbookStateActions extends Actions<AddressbookState, AddressbookStateGetters, AddressbookStateMutations, AddressbookStateActions> {
    // error state reference to display errors in the addressbook state
    errorState: Context<typeof errorState> | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $init(store: Store<any>):void {
        this.errorState = errorState.context(store);
    }
    /**
     * function to clear the entries and page state
     */
    async clearEntries() {
        this.mutations.setEntries([]);
        this.mutations.setPage([]);
    }
    /**
     * function to create a addressbook entry in the backend and add it to the entries state
     * @param entry to be created
     */
    async createEntry(entry: AddressbookEntry) {
        const createdEntry:ErrorResult<AddressbookEntry> = await createAddressbookEntry(entry);
        if(createdEntry.res && !createdEntry.error){
            this.mutations.addOrUpdateEntry(createdEntry.res);
        } else {
            handleErrors(createdEntry.errorMsg, this.errorState);
        }
    }
    /**
     * function to update an existing addressbook entry in the backend and then update it in the entry state
     * @param entry to be updated
     */
    async updateEntries(entry: AddressbookEntry) {

        const updateEntry:ErrorResult<boolean> = await updateAddressbookEntry(entry);
        if(!updateEntry.error){
            this.actions.retrieveEntryById(entry.id);
        } else {
            handleErrors(updateEntry.errorMsg, this.errorState);
        }
    }
    /**
     * function to delete an addressbook entry in the backend and then remove it from entry state
     * @param entryId of the entry to be deleted
     */
    async deleteEntryById(entryId:string){
        const entryDeleted:ErrorResult<boolean> = await deleteAddressbookEntry(entryId);
        if(!entryDeleted.error){
            this.mutations.deleteEntries(entryId);
        }else{
            handleErrors(entryDeleted.errorMsg, this.errorState);
        }
    }
    /**
     * function to retrieve addressbook entries in a paginated way
     * @param param0 Object with amount, offfset, orderBy and orderDir fields for configure the pagination
     */
    async retrieveEntries({amount, offset, orderBy, orderDir}:{amount?:number, offset?:number, orderBy?:string, orderDir?:string}){
        const retrievedEntries: ErrorResult<AddressbookEntry[]> = await retrieveAddressbookEntries(amount, offset, orderBy, orderDir);
        if(retrievedEntries.res && !retrievedEntries.error && retrievedEntries.total !== undefined){
            this.mutations.setPage(retrievedEntries.res);
            this.mutations.addOrUpdateEntries(retrievedEntries.res);
            this.mutations.setTotal(retrievedEntries.total);
        } else {
            handleErrors(retrievedEntries.errorMsg, this.errorState);
        }
    }
    /**
     * function to retrieve a single addressbook entry
     * @param entryId of the entry to be retrieved
     */
    async retrieveEntryById(entryId: string){
        const retrievedEntry:ErrorResult<AddressbookEntry> = await retrieveAddressbookEntry(entryId);
        if(retrievedEntry.res && !retrievedEntry.error){
            this.mutations.addOrUpdateEntry(retrievedEntry.res);
        } else {
            handleErrors(retrievedEntry.errorMsg, this.errorState);
        }
    }
    /**
     * function to call the addressbook entry search endpoint
     * @param param0 object with query, limit and offset to configure and use the search endpoint
     */
    async searchEntryByQuery({query, limit, offset}:{query: string, limit?: number, offset?: number|undefined}) {
        const searchResult: ErrorResult<AddressbookEntry[]> = await searchEntries(query, limit, offset);
        if(searchResult.res && !searchResult.error) {
          this.mutations.setSearchResult(searchResult.res);
          this.mutations.addOrUpdateEntries(searchResult.res);
        } else {
          handleErrors(searchResult.errorMsg, this.errorState);
        }
    }
}

export const addressbookState = new Module({
    state: AddressbookState,
    getters: AddressbookStateGetters,
    mutations: AddressbookStateMutations,
    actions: AddressbookStateActions,
});

export const useAddressbookState = createComposable(addressbookState);