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
    entries: Map<string, AddressbookEntry> = new Map<string, AddressbookEntry>();
    page: Map<string, AddressbookEntry> = new Map<string, AddressbookEntry>();
    searchResult: Map<string, AddressbookEntry> = new Map<string, AddressbookEntry>();
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
    setPage(entries: AddressbookEntry[]) {
        this.state.page.clear();
        entries.forEach((elem) => this.state.page.set(elem.id, elem));
    }
    
    setEntries(entries: AddressbookEntry[]) {
        this.state.page.clear();
        entries.forEach((elem) => this.state.entries.set(elem.id, elem));
    }
    addOrUpdateEntries(entries: AddressbookEntry[]) {
        entries.forEach((elem) => this.state.entries.set(elem.id, elem));
    }
    addOrUpdateEntry(entry: AddressbookEntry){
        this.state.entries.set(entry.id, entry);
    }
    setSearchResult(entries: AddressbookEntry[]){
        this.state.searchResult.clear();
        entries.forEach((entry) => this.state.searchResult.set(entry.id, entry));
    }
    setTotal(total: number) {
        this.state.total = total;
    }
    deleteEntries(entryId: string){
        this.state.entries.delete(entryId);
    }
}

/**
 * defince actions for functions that change the state with a sideeffect.
 */
class AddressbookStateActions extends Actions<AddressbookState, AddressbookStateGetters, AddressbookStateMutations, AddressbookStateActions> {
    errorState: Context<typeof errorState> | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $init(store: Store<any>):void {
        this.errorState = errorState.context(store);
    }
    async clearEntries() {
        this.mutations.setEntries([]);
        this.mutations.setPage([]);
    }
    async createEntry(entry: AddressbookEntry) {
        const createdEntry:ErrorResult<AddressbookEntry> = await createAddressbookEntry(entry);
        if(createdEntry.res && !createdEntry.error){
            this.mutations.addOrUpdateEntry(createdEntry.res);
        } else {
            handleErrors(createdEntry.errorMsg, this.errorState);
        }
    }
    async updateEntries(entry: AddressbookEntry) {

        const updateEntry:ErrorResult<boolean> = await updateAddressbookEntry(entry);
        console.log(updateEntry);
        if(!updateEntry.error){
            this.actions.retrieveEntryById(entry.id);
        } else {
            handleErrors(updateEntry.errorMsg, this.errorState);
        }
    }
    async deleteEntryById(entryId:string){
        const entryDeleted:ErrorResult<boolean> = await deleteAddressbookEntry(entryId);
        if(!entryDeleted.error){
            this.mutations.deleteEntries(entryId);
        }else{
            handleErrors(entryDeleted.errorMsg, this.errorState);
        }
    }
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
    async retrieveEntryById(entryId: string){
        const retrievedEntry:ErrorResult<AddressbookEntry> = await retrieveAddressbookEntry(entryId);
        if(retrievedEntry.res && !retrievedEntry.error){
            this.mutations.addOrUpdateEntry(retrievedEntry.res);
        } else {
            handleErrors(retrievedEntry.errorMsg, this.errorState);
        }
    }
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