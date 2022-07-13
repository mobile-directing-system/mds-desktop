<template>
  <Topnavbar />
  <Sidebar />
  <h3>Main Application Goes Here</h3>
  <div
    class="cursor-pointer"
    @click.prevent="logout()"
  >
    Go Back
  </div>
  <div
    v-for="user in users()"
    :key="user.id"
  >
    <div>{{ user }}:{{ permissions().get(user.id) }}</div>
    <NormalButton
      :btn-text="`Update ${user.username}`"
      @click.prevent="updateUser(user.id)"
    />
    <NormalButton
      :btn-text="`Update Password for ${user.username}`"
      @click.prevent="updateUserPw(user.id)"
    />
    <NormalButton
      :btn-text="`Delete ${user.username}`"
      @click.prevent="deleteUser(user.id)"
    />
    <NormalButton
      :btn-text="`Add user.create Permission to ${user.username}`"
      @click.prevent="addCreatePermission(user.id)"
    />
    <NormalButton
      :btn-text="`Add user.delete Permission to ${user.username}`"
      @click.prevent="addDeletePermission(user.id)"
    />
  </div>
  <NormalButton
    btn-text="Generate New User"
    @click.prevent="generateUser()"
  />
  <form>
    <FormInput
      id="user_id"
      v-model="userId"
      label="Username"
    />
    <NormalButton
      id="submit"
      btn-text="Fetch User By Id"
      type="submit"
      @click.prevent="fetchUser(userId)"
    />
  </form>
  <NormalButton
    btn-text="Load Permissions"
    @click.prevent="loadPermissions()"
  />
  <div
    v-for="operation in operations()"
    :key="operation.id"
  >
    <div>{{ operation }}</div>
    <NormalButton
      :btn-text="`Update ${operation.title}`"
      @click.prevent="updateOperation(operation.id)"
    />
  </div>
  <NormalButton
    btn-text="Generate New Operation"
    @click.prevent="generateOperation()"
  />
  <form>
    <FormInput
      id="opertion_id"
      v-model="operationId"
      label="Operation"
    />
    <NormalButton
      id="submit"
      btn-text="Fetch Operation By Id"
      type="submit"
      @click.prevent="fetchOperation(operationId)"
    />
  </form>
  <div
    v-for="group in groups()"
    :key="group.id"
  >
    <div>{{ group }}</div>
    <NormalButton
      :btn-text="`Update ${group.title}`"
      @click.prevent="updateGroup(group.id)"
    />
    <NormalButton
      :btn-text="`Delete ${group.title}`"
      @click.prevent="deleteGroup(group.id)"
    />
  </div>
  <NormalButton
    btn-text="Generate New Group"
    @click.prevent="generateGroup()"
  />
  <form>
    <FormInput
      id="group_id"
      v-model="groupId"
      label="Group"
    />
    <NormalButton
      id="submit"
      btn-text="Fetch Group By Id"
      type="submit"
      @click.prevent="fetchGroup(groupId)"
    />
  </form>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { useLoginState, useUserState, usePermissionsState, useOperationsState, useGroupState } from '../store';
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import { updateUserPassword } from '#preload';
  import { PermissionNames } from '../constants';
  import  Sidebar from '../components/SideBarMenu.vue';
  import Topnavbar from '../components/TopNavbar.vue';
import FormInput from '../components/BasicComponents/FormInput.vue';
  /**
   * load router and logininfo store to check
   * if already logged in and if so navigate to
   * the main application view
   */
  const loginState = useLoginState();
  const userState = useUserState();
  const permissionsState = usePermissionsState();
  const operationsState = useOperationsState();
  const groupState = useGroupState();

  const users = computed(() => userState.getters.users);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const permissions = computed(() => permissionsState.getters.getPermissions);
  const operations = computed(() => operationsState.getters.operations);
  const groups = computed(() => groupState.getters.groups);
  const userId = ref('');
  const operationId = ref('');
  const groupId = ref('');

  onMounted(() => {
    userState.dispatch('retreiveUsers', {});
    operationsState.dispatch('retrieveOperations', {});
    groupState.dispatch('retrieveGroups', {});
  });

  function fetchUser(userId: string) {
    userState.dispatch('retreiveUserById', userId);
  }

  function updateUser(userId: string) {
    const updatedUser = users.value().filter((elem) => elem.id === userId)[0];
    userState.dispatch('updateUser', {...updatedUser, first_name: `${updatedUser.first_name}u`});
  }

  function deleteUser(userId: string) {
    userState.dispatch('deleteUserById', userId);
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

</script>