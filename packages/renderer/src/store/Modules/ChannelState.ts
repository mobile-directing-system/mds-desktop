import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import { setChannels, retrieveChannels} from '#preload';
import type { Channel, Channels,  ErrorResult } from '../../../../types';
import type { Context } from 'vuex-smart-module';
import type { Store } from 'vuex';
import { errorState, handleErrors } from './ErrorState';

function undom(channel: Channel):Channel {
    return {...channel, details:{ ...channel.details}};
}
/**
 * define content for AddressbookState
 */
class ChannelState {
    // map containing all retrieved channels
    channels: Map<string, Channel> = new Map<string, Channel>();
    // total number of retrievable channels
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
    /**
     * function to clear the channel state and add passed entries to it
     * @param entries to be added to the channel state
     */
    setChannels(entries: Channels) {
        this.state.channels.clear();
        entries.forEach((elem) => this.state.channels.set(elem.id, elem));
    }
    /**
     * function to set the total number of retrievable channels state
     * @param total to the the total state to
     */
    setTotal(total: number) {
        this.state.total = total;
    }
}

/**
 * defince actions for functions that change the state with a sideeffect.
 */
class ChannelStateActions extends Actions<ChannelState, ChannelStateGetters, ChannelStateMutations, ChannelStateActions> {
    // error state reference to display errors in the addressbook state
    errorState: Context<typeof errorState> | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $init(store: Store<any>):void {
        this.errorState = errorState.context(store);
    }
    /**
     * function the clear the channel state
     */
    async clearEntries() {
        this.mutations.setChannels([]);
    }
    /**
     * function to set the channels for a entry in the backend end then update the channel and total state
     * @param param0 object with entry id of the entry for which the channels should be set and the channels that should be set
     */
    async setChannels({entryId, channels}:{entryId: string, channels: Channels}) {
        const setChannelsRes: ErrorResult<boolean> = await setChannels(entryId, channels.map(x => x = undom(x)));
        if(!setChannelsRes.error){
            this.mutations.setChannels(channels);
            this.mutations.setTotal(channels.length);
        } else {
            handleErrors(setChannelsRes.errorMsg, this.errorState);
        }
    }
    /**
     * function to retrieve the channels for a given entry and set the channel state
     * @param entryId of the entry for which to retrieve the channels
     */
    async retrieveChannels (entryId:string) {
        const retrievedChannels: ErrorResult<Channels> = await retrieveChannels(entryId);
        if(retrievedChannels.res && !retrievedChannels.error){
            this.mutations.setChannels(retrievedChannels.res);
        } else {
            handleErrors(retrievedChannels.errorMsg, this.errorState);
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