import { Getters, Mutations,  Module, createComposable } from 'vuex-smart-module';

class MainAppState {
    currentPostionInApp = CurrentPosition.Main; 
}

class MainAppStateGetters extends Getters<MainAppState>{
    get getCurrenPositionInApp() {
        return () => {
            return this.state.currentPostionInApp;
        };
    }
} 

class MainAppStateMutations extends Mutations<MainAppState> {
    setCurrentPositionInApp(currentPostionInApp: CurrentPosition) {this.state.currentPostionInApp = currentPostionInApp;}
}

enum CurrentPosition {
    User_AddUser = 'User_AddUser',
    User_AllUsers ='User_AllUsers',
    Operation_AddOperation ='Operation_AddOperation',
    Operation_AllOperations ='Operation_AllOperations',
    Groups_AddGroup ='Groups_AddGroup',
    Groups_AllGroups ='Groups_AllGroups',
    Ressources ='Ressources',
    Intelligence ='Intelligence',
    Settings ='Settings',
    Main ='Main'
}

export const mainAppState = new Module({
    state: MainAppState,
    getters: MainAppStateGetters,
    mutations: MainAppStateMutations,
} );

export const useMainAppState = createComposable(mainAppState);