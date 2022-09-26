import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import { invalidateIntel, createIntel, searchIntelByQuery, retrieveIntel, retrieveMultipleIntel} from '#preload';
import type { Intel,  ErrorResult } from '../../../../types';
import type { Context } from 'vuex-smart-module';
import type { Store } from 'vuex';
import { errorState, handleErrors } from './ErrorState';

/**
 * define content for IntelState
 */
 class IntelState {
    intel: Map<string, Intel> = new Map<string, Intel>();
    page: Map<string, Intel> = new Map<string, Intel>();
    searchResult: Map<string, Intel> = new Map<string, Intel>();
    total = 0;
}

/**
 * define getters to access the state
 */
class IntelStateGetters extends Getters<IntelState> {
    get intel() {
        return () => {
            return this.state.intel;
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
 class IntelStateMutations extends Mutations<IntelState> {
    setPage(intel: Intel[]) {
        this.state.page.clear();
        intel.forEach((elem) => this.state.page.set(elem.id, elem));
    }
    
    setIntel(intel: Intel[]) {
        this.state.page.clear();
        this.state.intel.clear();
        intel.forEach((elem) => this.state.intel.set(elem.id, elem));
        intel.forEach((elem) => this.state.page.set(elem.id, elem));
    }
    addIntel(intel: Intel[]) {
        intel.forEach((elem) => this.state.intel.set(elem.id, elem));
        intel.forEach((elem) => this.state.page.set(elem.id, elem));
    }
    addOrUpdateIntel(intel: Intel){
        this.state.intel.set(intel.id, intel);
        this.state.page.set(intel.id, intel);
    }
    setSearchResult(intel: Intel[]){
        this.state.searchResult.clear();
        intel.forEach((elem) => this.state.searchResult.set(elem.id, elem));
    }
    setTotal(total: number) {
        this.state.total = total;
    }
}
/**
 * defince actions for functions that change the state with a sideeffect.
 */
 class IntelStateActions extends Actions<IntelState, IntelStateGetters, IntelStateMutations, IntelStateActions> {
    errorState: Context<typeof errorState> | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $init(store: Store<any>):void {
        this.errorState = errorState.context(store);
    }
    async clearEntries() {
        this.mutations.setIntel([]);
        this.mutations.setPage([]);
    }
    async createEntry(intel: Intel) {
        const createdIntel:ErrorResult<Intel> = await createIntel(intel);
        if(createdIntel.res && !createdIntel.error){
            this.mutations.addOrUpdateIntel(createdIntel.res);
        } else {
            handleErrors(createdIntel.errorMsg, this.errorState);
        }
    }
    async retrieveMultipleIntel({amount, offset, orderBy, orderDir}:{amount?:number, offset?:number, orderBy?:string, orderDir?:string}){
        const retrievedIntel: ErrorResult<Intel[]> = await retrieveMultipleIntel(amount, offset, orderBy, orderDir);
        if(retrievedIntel.res && !retrievedIntel.error && retrievedIntel.total !== undefined){
            this.mutations.setPage(retrievedIntel.res);
            this.mutations.addIntel(retrievedIntel.res);
            this.mutations.setTotal(retrievedIntel.total);
        } else {
            handleErrors(retrievedIntel.errorMsg, this.errorState);
        }
    }
    async retrieveIntelById(entryId: string){
        const retrievedIntel:ErrorResult<Intel> = await retrieveIntel(entryId);
        if(retrievedIntel.res && !retrievedIntel.error){
            this.mutations.addOrUpdateIntel(retrievedIntel.res);
        } else {
            handleErrors(retrievedIntel.errorMsg, this.errorState);
        }
    }
    async searchIntelByQuery({query, limit, offset}:{query: string, limit?: number, offset?: number|undefined}) {
        const searchResult: ErrorResult<Intel[]> = await searchIntelByQuery(query, limit, offset);
        if(searchResult.res && !searchResult.error) {
          this.mutations.setSearchResult(searchResult.res);
          this.mutations.addIntel(searchResult.res);
        } else {
          handleErrors(searchResult.errorMsg, this.errorState);
        }
    }
    async invalidateIntelById(intelId:string){
        const res: ErrorResult<boolean> = await invalidateIntel(intelId);
        if(!res.error){
            this.retrieveIntelById(intelId);
        }else{
            handleErrors(res.errorMsg, this.errorState);
        }
    }
}

export const intelState = new Module({
    state: IntelState,
    getters: IntelStateGetters,
    mutations: IntelStateMutations,
    actions: IntelStateActions,
});

export const useIntelState = createComposable(intelState);