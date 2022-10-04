<template>
  <div class="border-blue-700 border-l-2 pt-10">
    <h1 class=" ml-4 text-3xl font-bold text-on_background mb-2">
      Edit Permissions
    </h1>
    <form class="divide-y ml-4">
      <div>
        <h1 class="text-1xl font-bold text-on_background">
          User Permissions
        </h1>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="user-view-checkbox"
          >
            View
          </label>
          <input
            id="user-view-checkbox"
            v-model="userViewPermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="user-create-checkbox"
          >
            Create
          </label>
          <input
            id="user-create-checkbox"
            v-model="userCreatePermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="user-update-checkbox"
          >
            Update
          </label>
          <input
            id="user-update-checkbox"
            v-model="userUpdatePermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="user-set_active-checkbox"
          >
            Set Active
          </label>
          <input
            id="user-set_active-checkbox"
            v-model="userSetActivePermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="user-set_admin-checkbox"
          >
            Set Admin
          </label>
          <input
            id="user-set_admin-checkbox"
            v-model="userSetAdminPermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="user-update_pass-checkbox"
          >
            Update Password
          </label>
          <input
            id="user-update_pass-checkbox"
            v-model="userUpdatePassPermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
      </div>
      <div>
        <h1 class="text-1xl font-bold text-on_background">
          Operation Permissions
        </h1>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="operation-view-checkbox"
          >
            View
          </label>
          <input
            id="operation-view-checkbox"
            v-model="operationViewPermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="operation-create-checkbox"
          >
            Create
          </label>
          <input
            id="operation-create-checkbox"
            v-model="operationCreatePermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="operation-update-checkbox"
          >
            Update
          </label>
          <input
            id="operation-update-checkbox"
            v-model="operationUpdatePermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="operation-member-view-checkbox"
          >
            View Members
          </label>
          <input
            id="operation-member-view-checkbox"
            v-model="operationMemberViewPermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="operation-member-update-checkbox"
          >
            Update Members
          </label>
          <input
            id="operation-member-update-checkbox"
            v-model="operationMemberUpdatePermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
      </div>
      <div>
        <h1 class="text-1xl font-bold text-on_background">
          Group Permissions
        </h1>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="group-view-checkbox"
          >
            View
          </label>
          <input
            id="group-view-checkbox"
            v-model="groupViewPermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="group-creat-checkbox"
          >
            Create
          </label>
          <input
            id="group-create-checkbox"
            v-model="groupCreatePermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="group-update-checkbox"
          >
            Update
          </label>
          <input
            id="group-update-checkbox"
            v-model="groupUpdatePermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="group-delete-checkbox"
          >
            Delete
          </label>
          <input
            id="group-delete-checkbox"
            v-model="groupDeletePermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
      </div>
      <div>
        <h1 class="text-1xl font-bold text-on_background">
          Permission Permissions
        </h1>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="permissions-view-checkbox"
          >
            View
          </label>
          <input
            id="permissions-view-checkbox"
            v-model="permissionsViewPermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="permissions-update-checkbox"
          >
            Update
          </label>
          <input
            id="permissions-update-checkbox"
            v-model="permissionsUpdatePermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
      </div>
      <div>
        <h1 class="text-1xl font-bold text-on_background">
          Address Book Entry Permissions
        </h1>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="address-book-view-checkbox"
          >
            View
          </label>
          <input
            id="address-book-view-checkbox"
            v-model="addressBookViewPermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="address-book-create-checkbox"
          >
            Create
          </label>
          <input
            id="address-book-create-checkbox"
            v-model="addressBookCreatePermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="address-book-update-checkbox"
          >
            Update
          </label>
          <input
            id="address-book-update-checkbox"
            v-model="addressBookUpdatePermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="address-book-delete-checkbox"
          >
            Delete
          </label>
          <input
            id="address-book-delete-checkbox"
            v-model="addressBookDeletePermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
      </div>
      <div>
        <h1 class="text-1xl font-bold text-on_background">
          Intelligence Permissions
        </h1>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="intelligence-view-checkbox"
          >
            View
          </label>
          <input
            id="intelligence-view-checkbox"
            v-model="intelligenceViewPermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="intelligence-create-checkbox"
          >
            Create
          </label>
          <input
            id="intelligence-create-checkbox"
            v-model="intelligenceCreatePermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="intelligence-invalidate-checkbox"
          >
            Invalidate
          </label>
          <input
            id="intelligence-invalidate-checkbox"
            v-model="intelligenceInvalidatePermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
      </div>
      <div>
        <h1 class="text-1xl font-bold text-on_background">
          Other Permissions
        </h1>
        <div class="flex justify-between">
          <label
            class="mb-1 text-sm font-medium text-gray-900 dark:text-gray-300 mr-2 "
            for="other-rebuild-search-index-checkbox"
          >
            Rebuild Search Index
          </label>
          <input
            id="other-rebuild-search-index-checkbox"
            v-model="otherRebuildSearchIndexPermission"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="checkbox"
            :disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? undefined:'true'"
            :aria-disabled="checkPermissions([{name: PermissionNames.PermissionsUpdate}])? 'false':'true'"
          >
        </div>
      </div>
      <div class="flex justify-between gap-3 pt-1">
        <NormalButton
          id="update-permissions-update-button"
          :disabled="!checkPermissions([{name: PermissionNames.PermissionsUpdate}])"
          @click.prevent="updatePermissions()"
        >
          Update Permissions
        </NormalButton>
        <NormalButton
          id="update-permissions-cancel-button"
          @click.prevent="leaveEditPermissions()"
        >
          Cancel
        </NormalButton>
      </div>
    </form>
  </div>
</template>
<script lang="ts" setup>
  // eslint-disable vue/html-self-closing
  import NormalButton from '../components/BasicComponents/NormalButton.vue';
  import { ref, computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { usePermissionsState } from '../store';
  import { PermissionNames } from '../constants';
  import { usePermissions } from '../composables';

  import type { Permission } from '../../../types';

  const userViewPermission = ref(false);
  const userCreatePermission = ref(false);
  const userUpdatePermission = ref(false);
  const userSetActivePermission = ref(false);
  const userSetAdminPermission = ref(false);
  const userUpdatePassPermission = ref(false);
  const operationViewPermission = ref(false);
  const operationCreatePermission = ref(false);
  const operationUpdatePermission = ref(false);
  const operationMemberViewPermission = ref(false);
  const operationMemberUpdatePermission = ref(false);
  const groupViewPermission = ref(false);
  const groupCreatePermission = ref(false);
  const groupUpdatePermission = ref(false);
  const groupDeletePermission = ref(false);
  const permissionsViewPermission = ref(false);
  const permissionsUpdatePermission = ref(false);
  const addressBookViewPermission = ref(false);
  const addressBookCreatePermission = ref(false);
  const addressBookUpdatePermission = ref(false);
  const addressBookDeletePermission = ref(false);
  const intelligenceViewPermission = ref(false);
  const intelligenceCreatePermission = ref(false);
  const intelligenceInvalidatePermission = ref(false);
  const otherRebuildSearchIndexPermission = ref(false);

  const checkPermissions = usePermissions();
  const router = useRouter();
  const route = useRoute();
  const permissionsState = usePermissionsState();
  const selectedUserID = route.params.userId as string;
  const usersPermissions = computed(() => permissionsState.getters.getPermissions().get(selectedUserID));
  usersPermissions.value?.forEach((elem) => {
    if(elem.name === PermissionNames.UserView) {
      userViewPermission.value = true;
    }
    if(elem.name === PermissionNames.UserCreate) {
      userCreatePermission.value = true;
    }
    if(elem.name === PermissionNames.UserUpdate) {
      userUpdatePermission.value = true;
    }
    if(elem.name === PermissionNames.UserSetActive) {
      userSetActivePermission.value = true;
    }
    if(elem.name === PermissionNames.UserSetAdmin) {
      userSetAdminPermission.value = true;
    }
    if(elem.name === PermissionNames.UserUpdatePass) {
      userUpdatePassPermission.value = true;
    }
    if(elem.name === PermissionNames.OperationViewAny) {
      operationViewPermission.value = true;
    }
    if(elem.name === PermissionNames.OperationCreate) {
      operationCreatePermission.value = true;
    }
    if(elem.name === PermissionNames.OperationUpdate) {
      operationUpdatePermission.value = true;
    }
    if(elem.name === PermissionNames.OperationMembersView) {
      operationMemberViewPermission.value = true;
    }
    if(elem.name === PermissionNames.OperationMembersUpdate) {
      operationMemberUpdatePermission.value = true;
    }
    if(elem.name === PermissionNames.GroupView) {
      groupViewPermission.value = true;
    }
    if(elem.name === PermissionNames.GroupCreate) {
      groupCreatePermission.value = true;
    }
    if(elem.name === PermissionNames.GroupUpdate) {
      groupUpdatePermission.value = true;
    }
    if(elem.name === PermissionNames.GroupDelete) {
      groupDeletePermission.value = true;
    }
    if(elem.name === PermissionNames.PermissionsView) {
      permissionsViewPermission.value = true;
    }
    if(elem.name === PermissionNames.PermissionsUpdate) {
      permissionsUpdatePermission.value = true;
    }
    if(elem.name === PermissionNames.AddressBookViewEntry) {
      addressBookViewPermission.value = true;
    }
    if(elem.name === PermissionNames.AddressBookCreateEntry) {
      addressBookCreatePermission.value = true;
    }
    if(elem.name === PermissionNames.AddressBookUpdateEntry) {
      addressBookUpdatePermission.value = true;
    }
    if(elem.name === PermissionNames.AddressBookDeleteEntry) {
      addressBookDeletePermission.value = true;
    }
    if(elem.name === PermissionNames.IntelligenceView) {
      intelligenceViewPermission.value = true;
    }
    if(elem.name === PermissionNames.IntelligenceCreate) {
      intelligenceCreatePermission.value = true;
    }
    if(elem.name === PermissionNames.IntelligenceInvalidate) {
      intelligenceInvalidatePermission.value = true;
    }
    if(elem.name === PermissionNames.SearchRebuildIndex) {
      otherRebuildSearchIndexPermission.value = true;
    }
  });

  function updatePermissions() {
    const permissions:Permission[] = [];
    if(userViewPermission.value) {
      permissions.push({name: PermissionNames.UserView});
    }
    if(userUpdatePermission.value) {
      permissions.push({name: PermissionNames.UserUpdate});
    }
    if(userCreatePermission.value) {
      permissions.push({name: PermissionNames.UserCreate});
    }
    if(userSetActivePermission.value) {
      permissions.push({name: PermissionNames.UserSetActive});
    }
    if(userSetAdminPermission.value) {
      permissions.push({name: PermissionNames.UserSetAdmin});
    }
    if(userUpdatePassPermission.value) {
      permissions.push({name: PermissionNames.UserUpdatePass});
    }
    if(operationViewPermission.value) {
      permissions.push({name: PermissionNames.OperationViewAny});
    }
    if(operationCreatePermission.value) {
      permissions.push({name: PermissionNames.OperationCreate});
    }
    if(operationUpdatePermission.value) {
      permissions.push({name: PermissionNames.OperationUpdate});
    }
    if(operationMemberViewPermission.value) {
      permissions.push({name: PermissionNames.OperationMembersView});
    }
    if(operationMemberUpdatePermission.value) {
      permissions.push({name: PermissionNames.OperationMembersUpdate});
    }
    if(groupViewPermission.value) {
      permissions.push({name: PermissionNames.GroupView});
    }
    if(groupCreatePermission.value) {
      permissions.push({name: PermissionNames.GroupCreate});
    }
    if(groupUpdatePermission.value) {
      permissions.push({name: PermissionNames.GroupUpdate});
    }
    if(groupDeletePermission.value) {
      permissions.push({name: PermissionNames.GroupDelete});
    }
    if(permissionsViewPermission.value) {
      permissions.push({name: PermissionNames.PermissionsView});
    }
    if(permissionsUpdatePermission.value) {
      permissions.push({name: PermissionNames.PermissionsUpdate});
    }
    if(addressBookViewPermission.value) {
      permissions.push({name: PermissionNames.AddressBookViewEntry});
    }
    if(addressBookCreatePermission.value) {
      permissions.push({name: PermissionNames.AddressBookCreateEntry});
    }
    if(addressBookUpdatePermission.value) {
      permissions.push({name: PermissionNames.AddressBookUpdateEntry});
    }
    if(addressBookDeletePermission.value) {
      permissions.push({name: PermissionNames.AddressBookDeleteEntry});
    }
    if(intelligenceViewPermission.value) {
      permissions.push({name: PermissionNames.IntelligenceView});
    }
    if(intelligenceCreatePermission.value) {
      permissions.push({name: PermissionNames.IntelligenceCreate});
    }
    if(intelligenceInvalidatePermission.value) {
      permissions.push({name: PermissionNames.IntelligenceInvalidate});
    }
    if(otherRebuildSearchIndexPermission.value) {
      permissions.push({name: PermissionNames.SearchRebuildIndex});
    }
    permissionsState.dispatch('updateAllPermissions', {userId: selectedUserID, permissions});
    router.push({name: 'Permissions'});
  }

  function leaveEditPermissions() {
    router.push({name: 'Permissions'});
  }

</script>