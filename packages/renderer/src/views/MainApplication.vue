<template>
  <div class="flex flex-col">
    <Topnavbar />
  
    <div class="flex flex-row">
      <Sidebar class=" overflow-x-hidden" />
      <router-view class=" w-4/5 ml-4" />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted } from 'vue';
  import {  useUserState,  useOperationsState, useGroupState } from '../store';
  import  Sidebar from '../components/SideBarMenu.vue';
  import Topnavbar from '../components/TopNavbar.vue';
//import FormInput from '../components/BasicComponents/FormInput.vue';
  /**
   * load router and logininfo store to check
   * if already logged in and if so navigate to
   * the main application view
   */
 // const loginState = useLoginState();
  const userState = useUserState();
//  const permissionsState = usePermissionsState();
  const operationsState = useOperationsState();
  const groupState = useGroupState();
  //const router = useRouter();

/*  const users = computed(() => userState.getters.users);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const permissions = computed(() => permissionsState.getters.getPermissions);
  const operations = computed(() => operationsState.getters.operations);
  const groups = computed(() => groupState.getters.groups);
  const userId = ref('');
  const operationId = ref('');
  const groupId = ref('');
*/
  onMounted(() => {
    userState.dispatch('retreiveUsers', {});
    operationsState.dispatch('retrieveOperations', {});
    groupState.dispatch('retrieveGroups', {});
    //router.push('/main/user');
  });

/*

  function updateUser(userId: string) {
    const updatedUser = users.value().filter((elem) => elem.id === userId)[0];
    userState.dispatch('updateUser', {...updatedUser, username: `${updatedUser.username}u`});
  }


  function updateUserPw(userId: string) {
    updateUserPassword(userId, 'testpw');
  }

  function loadPermissions() {
    users.value().map((user) => permissionsState.dispatch('retrievePermissions', user.id) );
  }

  function addCreatePermission(userId: string) {
    permissionsState.dispatch('addPermissions', {userId, permissions: [{name: PermissionNames.UserCreate}, {name: PermissionNames.GroupView}, 
    {name: PermissionNames.OperationViewAny}, {name: PermissionNames.UserView}, {name: PermissionNames.PermissionsView}]});
  }

  function addDeletePermission(userId: string) {
    permissionsState.dispatch('addPermissions', {userId, permissions: [{name: PermissionNames.UserDelete}]});
  }

  function logout() {
    loginState.dispatch('logout');
  }

  function generateOperation() {
    const title = Math.random().toString(36).substring(2, 15);
    const start: Date = new Date();
    const end:Date = new Date(start.toISOString());
    end.setHours(end.getHours() + 5);
    operationsState.dispatch('createOperation', {
      id: '',
      title,
      description: 'This is a test operation',
      start,
      end,
      is_archived: false,
    });
  }

  function updateOperation(operationId: string) {
      const operationToUpdate = operations.value().filter((elem) => elem.id === operationId)[0];
      operationsState.dispatch('updateOperation', {... operationToUpdate, description: `${operationToUpdate.description}u`});
  }

  function fetchOperation(operationId: string) {
    operationsState.dispatch('retrieveOperation', operationId);
  }

  function updateGroup(groupId: string) {
    const groupToUpdate = groups.value().filter((elem) => elem.id === groupId )[0];
    groupState.dispatch('updateGroup', {... groupToUpdate, description: `${groupToUpdate.description}u`});
  }

  function generateGroup() {
    if(!(operations.value().length > 0)) {
      return;
    }
    const title = Math.random().toString(36).substring(2, 15);
    groupState.dispatch('createGroup', {
      id:'',
      title,
      description: `This is a Test Group with the name ${title}`,
      operation: operations.value()[0].id,
      members: users.value().map((elem) => elem.id),
    });
  }

  function fetchGroup(groupId: string) {
    groupState.dispatch('retrieveGroupById', groupId);
  }

  function deleteGroup(groupId: string) {
    groupState.dispatch('deleteGroupById', groupId);
  }

  function generateUser() {
    const name= Math.random().toString(36).substring(2, 15);
    userState.dispatch('createUser', {
      id: '',
      username: name,
      first_name: 'Test',
      last_name: 'Testermann',
      is_admin: false,
      pass: 'testtest',
    });
  }
*/
</script>
<style>
  .bottomPartwithSidebar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--1);
  }
  .bottomPartwithSidebar > :first-child{
    flex-basis: 1;
  }
  .bottomPartwithSidebar > :last-child{
    flex-basis: 0;
    flex-grow: 999;
    min-inline-size: 75%;
  }
</style>
