import { Getters, Mutations,  Module, createComposable } from 'vuex-smart-module';

class MainAppState {
    currentPostionInApp = CurrentPosition.Main; 
    selectedUserId ='';
    selectedUserUserName ='';
    selectedUserLastName ='';
    selectedUserFirstName = '';
}

class MainAppStateGetters extends Getters<MainAppState>{
    get getCurrenPositionInApp() {
        return () => {
            return this.state.currentPostionInApp;
        };
    }
    get getSelectedUserId(){
        return() => {
            return this.state.selectedUserId;
        };
    }
    get getSelectedUserUserName(){
        return() => {
            return this.state.selectedUserUserName;
        };
    }
    get getSelectedUserFirstName(){
        return() => {
            return this.state.selectedUserFirstName;
        };
    }

    get getSelectedUserLastName(){
        return() => {
            return this.state.selectedUserLastName;
        };
    }
} 

class MainAppStateMutations extends Mutations<MainAppState> {
    setCurrentPositionInApp(currentPostionInApp: CurrentPosition) {this.state.currentPostionInApp = currentPostionInApp;}
    setSelectedUserId(selectedUserId: string) {this.state.selectedUserId = selectedUserId;}
    setSelectedUserUserName(selectedUserUserName: string) {this.state.selectedUserUserName = selectedUserUserName;}
    setSelectedUserFirstName(selectedUserFirstName: string) {this.state.selectedUserFirstName = selectedUserFirstName;}
    setSelectedUserLastName(selectedUserLastName: string) {this.state.selectedUserLastName = selectedUserLastName;}
}

enum CurrentPosition {
    User_AddUser = 'User_AddUser',
    User_EditUser = 'EditUser',
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