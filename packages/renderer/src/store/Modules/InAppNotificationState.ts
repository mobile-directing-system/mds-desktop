import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import type { InAppNotification, IntelNotification } from '../../../../types';
import type { Context } from 'vuex-smart-module';
import type { Store } from 'vuex';
import { errorState } from './ErrorState';
import { root, modulesStore } from '../index';
import type { intelState } from './IntelState';
import { handleIncomingInAppNotifications } from '#preload';

/**
 * define the content of the LoginInfoState
 */
class InAppNotificationState {
  inAppNotifications: InAppNotification[] = [];
  shownInAppNotifications:{notificationId: string, inAppNotification: InAppNotification}[]  = [];
  shownInAppNotificationTimeouts: Map<string, number> = new Map<string, number>();
  intelNotifications: Map<string,IntelNotification[]> = new Map<string, IntelNotification[]>();
}

/**
 * define getters to access the state
 */
class InAppNotificationStateGetters extends Getters<InAppNotificationState> {
  get notifications() {
    return () => {
      return this.state.inAppNotifications;
    };
  }
  get shownNotifications() {
    return () => {
      return this.state.shownInAppNotifications;
    };
  }
  get intelNotifications() {
    return () => {
      return this.state.intelNotifications;
    };
  }
}

/**
 * define mutations to change the state
 */
class InAppNotificationStateMutations extends Mutations<InAppNotificationState> {
  clearNotifications() {
    this.state.inAppNotifications = [];
  }
  clearIntelNotifications() {
    this.state.intelNotifications.clear();
  }
  addNotifications(notifications: InAppNotification[]) {
    this.state.inAppNotifications = [...this.state.inAppNotifications, ...notifications];
  }
  addNotification(notification: InAppNotification) {
    this.state.inAppNotifications = [...this.state.inAppNotifications, notification];
  }
  addShownNotification({notificationId, notification}:{notificationId: string, notification: InAppNotification}) {
    this.state.shownInAppNotifications = [{notificationId, inAppNotification: notification}, ...this.state.shownInAppNotifications];
  }
  addShownNotificationTimeout({notificationId, timeoutHandler}:{notificationId: string, timeoutHandler: number}) {
    this.state.shownInAppNotificationTimeouts.set(notificationId, timeoutHandler);
  }
  removeShownNotificationTimeout(notificationId: string) {
    this.state.shownInAppNotificationTimeouts.delete(notificationId);
  }
  removeShownNotification(notificationId: string) {
    this.state.shownInAppNotifications = this.state.shownInAppNotifications.filter((elem) => elem.notificationId !== notificationId);
  }
  addIntelNotifications(notifications: IntelNotification[]) {
    notifications.forEach((elem) => {
      if(this.state.intelNotifications.has(elem.intel_to_deliver.id)) {
        const existingNotifications = this.state.intelNotifications.get(elem.intel_to_deliver.id);
        this.state.intelNotifications.set(elem.intel_to_deliver.id, [...existingNotifications?existingNotifications:[], elem]);
      } else {
        this.state.intelNotifications.set(elem.intel_to_deliver.id, [elem]);
      }
    });
  }
  addIntelNotification(notification: IntelNotification) {
    if(this.state.intelNotifications.has(notification.intel_to_deliver.id)) {
      const existingNotifications = this.state.intelNotifications.get(notification.intel_to_deliver.id);
      this.state.intelNotifications.set(notification.intel_to_deliver.id, [...existingNotifications?existingNotifications:[], notification]);
    } else {
      this.state.intelNotifications.set(notification.intel_to_deliver.id, [notification]);
    }
  }
}

/**
 * define actions for functions which change the state as a side effect.
 * setLoggingIn function only changes the loggingIn state to the passed
 * boolean. login function calls the login glue code of the preload script.
 */
class InAppNotificationStateActions extends Actions<InAppNotificationState, InAppNotificationStateGetters, InAppNotificationStateMutations, InAppNotificationStateActions> {

  errorState: Context<typeof errorState> | undefined;

  // root context to be able to get permission context
  ctx: Context<typeof root> | undefined;
  // user context to be able to use permission store actions
  intelCtx: Context<typeof intelState> | undefined; //maybe use a function exported from the vuex-module similar to the handle error function

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $init(store: Store<any>): void {
    this.errorState = errorState.context(store);
    handleIncomingInAppNotifications(async (_, inAppNotification) => {
      const notificationId = crypto.randomUUID();
      this.mutations.addNotification(inAppNotification);
      if(inAppNotification.type === 'intel-notification') {
        if(!this.intelCtx && !this.ctx){
          // Add members to the users store
          this.ctx = root.context(modulesStore);
          this.intelCtx = this.ctx.modules.intelState;
        }
        await this.intelCtx?.actions.retrieveIntelById(inAppNotification.payload.intel_to_deliver.id);
        this.mutations.addIntelNotification(inAppNotification.payload);

      }
      this.mutations.addShownNotification({notificationId, notification: inAppNotification});
      this.mutations.addShownNotificationTimeout({notificationId, timeoutHandler: window.setTimeout(() => {this.actions.removeShownNotification(notificationId);}, 10_000)});
    });
  }
  removeShownNotification(notificationId: string) {
    this.mutations.removeShownNotification(notificationId);
    this.mutations.removeShownNotificationTimeout(notificationId);
  }
}

/**
 * generate a Module based on the state, getters, mutations and actions
 */
export const inAppNotificationState = new Module({
  state: InAppNotificationState,
  getters: InAppNotificationStateGetters,
  mutations: InAppNotificationStateMutations,
  actions: InAppNotificationStateActions,
});

/**
 * export a composable function to be able to use this module in .vue files
 */
export const useInAppNotificationState = createComposable(inAppNotificationState);
