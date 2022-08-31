import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import { setChannels, retrieveChannels} from '#preload';
import type { Channel, Channels,  ErrorResult } from '../../../../types';
import type { Context } from 'vuex-smart-module';
import type { Store } from 'vuex';
import { errorState, handleErrors } from './ErrorState';

/**
 * define content for AddressbookState
 */
class ChannelState {
    channels: Map<string, Channel> = new Map<string, Channel>();
    total = 0;
}

/**
 * define getters to access the state
 */
class ChannelStateGetters extends Getters<ChannelState> {
    get channels() {
        return () => {
            return this.state.channels;
        };
    }
    get total() {
        return () => {
            return this.state.total;
        };
    }
}

/**
 * define mutations to change the state
 */
class ChannelStateMutations extends Mutations<ChannelState> {
    setChannels(entries: Channels) {
        this.state.channels.clear();
        entries.forEach((elem) => this.state.channels.set(elem.id, elem));
    }
    setTotal(total: number) {
        this.state.total = total;
    }
}

/**
 * defince actions for functions that change the state with a sideeffect.
 */
class ChannelStateActions extends Actions<ChannelState, ChannelStateGetters, ChannelStateMutations, ChannelStateActions> {
    errorState: Context<typeof errorState> | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $init(store: Store<any>):void {
        this.errorState = errorState.context(store);
    }
    async clearEntries() {
        this.mutations.setChannels([]);
    }
    async setChannels({entryId, channels}:{entryId: string, channels: Channels}) {
        const setChannelsRes: ErrorResult<boolean> = await setChannels(entryId, channels);
        if(setChannelsRes.res && ! setChannelsRes.error && setChannelsRes.total !== undefined){
            this.mutations.setChannels(channels);
            this.mutations.setTotal(channels.length);
        } else {
            handleErrors(setChannelsRes.errorMsg, this.errorState);
        }
    }
    async retrieveChannels (entryId:string) {
        const retrievedChannels: ErrorResult<Channels> = await retrieveChannels(entryId);
        if(retrievedChannels.res && !retrievedChannels.error && retrievedChannels.total !== undefined){
            this.mutations.setChannels(retrievedChannels.res);
            this.mutations.setTotal(retrievedChannels.total);
        }
    }
    
}

export const channelState = new Module({
    state: ChannelState,
    getters: ChannelStateGetters,
    mutations: ChannelStateMutations,
    actions: ChannelStateActions,
});

export const useChannelState = createComposable(channelState);