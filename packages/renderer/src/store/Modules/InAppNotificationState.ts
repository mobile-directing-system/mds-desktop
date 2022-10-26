import { Getters, Mutations, Actions, Module, createComposable } from 'vuex-smart-module';
import type { InAppNotification, IntelNotification } from '../../../../types';
import type { Context } from 'vuex-smart-module';
import type { Store } from 'vuex';
import { errorState } from './ErrorState';
import { root, modulesStore } from '../index';
import type { intelState } from './IntelState';
import { handleIncomingInAppNotifications } from '#preload';

/**
 * define the content of the InAppNotificationState
 */
class InAppNotificationState {
  // array of all received in app notifications
  inAppNotifications: InAppNotification[] = [];
  // arrray of in app notifications to be shown, associated with a generated notification id
  shownInAppNotifications:{notificationId: string, inAppNotification: InAppNotification}[]  = [];
  // Map of timeouts associated with in app notifications
  shownInAppNotificationTimeouts: Map<string, number> = new Map<string, number>();
  // map of intel notifications (subset of all in app notifications)
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
  /**
   * function to clear the inAppNotifications by setting it to an empty array
   */
  clearNotifications() {
    this.state.inAppNotifications = [];
  }
  /**
   * function to clear the intelNotifications by setting it to an empty array
   */
  clearIntelNotifications() {
    this.state.intelNotifications.clear();
  }
  /**
   * function to append the passed notifcations to the end of the in app notification state
   * @param notifications for appending to the in app notification state
   */
  addNotifications(notifications: InAppNotification[]) {
    this.state.inAppNotifications = [...this.state.inAppNotifications, ...notifications];
  }
  /**
   * function to append a single notification to the end of the in app notification state
   * @param notification to append to tthe in app notification state
   */
  addNotification(notification: InAppNotification) {
    this.state.inAppNotifications = [...this.state.inAppNotifications, notification];
  }
  /**
   * function to append a single notification to the shown in app notification state
   * @param notificationObject object consisting of the notification to add and its generated notification id
   */
  addShownNotification({notificationId, notification}:{notificationId: string, notification: InAppNotification}) {
    this.state.shownInAppNotifications = [{notificationId, inAppNotification: notification}, ...this.state.shownInAppNotifications];
  }
  /**
   * function to add a timeout associated with a notification to the timeout state
   * @param timeoutObject object consisting of a timeout with the notificationId of the notification it is associated with
   */
  addShownNotificationTimeout({notificationId, timeoutHandler}:{notificationId: string, timeoutHandler: number}) {
    this.state.shownInAppNotificationTimeouts.set(notificationId, timeoutHandler);
  }
  /**
   * function to remove the timeout associated with a notificationId from the timeout state
   * @param notificationId for which to remove the associated timeout
   */
  removeShownNotificationTimeout(notificationId: string) {
    this.state.shownInAppNotificationTimeouts.delete(notificationId);
  }
  /**
   * function to remove a notification form the inAppNotification state
   * @param notificationId of the notification to remove
   */
  removeShownNotification(notificationId: string) {
    this.state.shownInAppNotifications = this.state.shownInAppNotifications.filter((elem) => elem.notificationId !== notificationId);
  }
  /**
   * function to append intel notifications to the intel notification state
   * @param notifications intel notifications to append
   */
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
  /**
   * function to append a single intel notification to the intel notification state
   * @param notification intel notification to append
   */
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

  // reference to the error state
  errorState: Context<typeof errorState> | undefined;

  // root context to be able to get permission context
  ctx: Context<typeof root> | undefined;
  // user context to be able to use permission store actions
  intelCtx: Context<typeof intelState> | undefined; //maybe use a function exported from the vuex-module similar to the handle error function

  // called on the initialization of the InAppNotification store to register a callback for IPC calls from the main part of the app
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $init(store: Store<any>): void {
    this.errorState = errorState.context(store);
    // register callback for notification ipc calls from the main part of the app
    handleIncomingInAppNotifications(async (_, inAppNotification) => {
      // generate notification id
      const notificationId = crypto.randomUUID();
      // add notification to in app notification state
      this.mutations.addNotification(inAppNotification);
      // add notification to notification type specific state
      if(inAppNotification.type === 'intel-notification') {
        if(!this.intelCtx && !this.ctx){
          // Add members to the users store
          this.ctx = root.context(modulesStore);
          this.intelCtx = this.ctx.modules.intelState;
        }
        await this.intelCtx?.actions.retrieveIntelById(inAppNotification.payload.intel_to_deliver.id);
        this.mutations.addIntelNotification(inAppNotification.payload);

      }
      // add notification to shown notification state to be displayed and create a timeout
      this.mutations.addShownNotification({notificationId, notification: inAppNotification});
      this.mutations.addShownNotificationTimeout({notificationId, timeoutHandler: window.setTimeout(() => {this.actions.removeShownNotification(notificationId);}, 10_000)});
    });
  }

  /**
   * function to remove notifications fromt he shown notification state by their id
   * @param notificationId of the notification to be removed
   */
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
