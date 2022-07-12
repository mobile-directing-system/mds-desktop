<template>
  <Topnavbar />

  <div class="bottonmPartwithSideBar">
    <div>
      <Sidebar />
    </div>
    <div>
      <CreateNewUserVue v-if="mainAppState.getters.getCurrenPositionInApp() === CurrentPosition.User_AddUser" />
      <BasicTable v-if="mainAppState.getters.getCurrenPositionInApp() === CurrentPosition.User_AllUsers" />
      <EditUserView v-if="mainAppState.getters.getCurrenPositionInApp() === CurrentPosition.User_EditUser" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useMainAppState } from '../store';
  import  Sidebar from '../components/SideBarMenu.vue';
  import Topnavbar from '../components/TopNavbar.vue';
  import CreateNewUserVue from '../components/CreateNewUser.vue';
  import BasicTable from '../components/BasicComponents/BasicTable.vue';
  import EditUserView from '../components/EditUser.vue';

    const mainAppState = useMainAppState();

//   const users = computed(() => userState.getters.users);
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const permissions = computed(() => permissionsState.getters.getPermissions);
//   const userId = ref('');

//   onMounted(() => {
//     userState.dispatch('retreiveUsers', {});
//   });

//   function fetchUser(userId: string) {
//     userState.dispatch('retreiveUserById', userId);
//   }

//   function updateUser(userId: string) {
//     const updatedUser = users.value().filter((elem) => elem.id === userId)[0];
//     updatedUser.first_name = `${updatedUser.first_name}u`;
//     userState.dispatch('updateUser', updatedUser);
//   }

//   function deleteUser(userId: string) {
//     userState.dispatch('deleteUserById', userId);
//   }

//   function updateUserPw(userId: string) {
//     updateUserPassword(userId, 'testpw');
//   }
// /*
//   function loadPermissions() {
//     users.value().map((user) => permissionsState.dispatch('retrievePermissions', user.id) );
//   }

//   function addCreatePermission(userId: string) {
//     permissionsState.dispatch('addPermissions', {userId, permissions: [{name: PermissionNames.UserCreate}]});
//   }

//   function addDeletePermission(userId: string) {
//     permissionsState.dispatch('addPermissions', {userId, permissions: [{name: PermissionNames.UserDelete}]});
//   }

//   function logout() {
//     loginState.dispatch('logout');
//   }
// */
//   function generateUser() {
//     const name= Math.random().toString(36).substring(2, 15);
//     userState.dispatch('createUser', {
//       id: '',
//       username: name,
//       first_name: 'Test',
//       last_name: 'Testermann',
//       is_admin: false,
//       pass: 'testtest',
//     });
//   }

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
</script>
<style>
  .bottonmPartwithSideBar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--s1);
  }

  .bottonmPartwithSideBar > :first-child {
    flex-grow: 1;
  }

  .bottonmPartwithSideBar > :last-child {
    flex-basis: 0;
    flex-grow: 999;
    min-inline-size: 75%;
  }
</style>