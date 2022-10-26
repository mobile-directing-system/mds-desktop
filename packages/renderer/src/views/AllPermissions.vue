<template>
  <div id="all-permissions">
    <div class="grid bg-white  rounded-lg h-full">
      <div class="flex justify-between gap-2">
        <div class="my-10">
          <div class="flex justify-between">
            <!-- Header -->
            <h1 class=" ml-4 text-4xl font-bold text-black ">
              All Permissions
            </h1>
          </div>
          <div class="">
            <!-- All Users Table -->
            <TableContainer
              id="users-table"
              :contents="userPage().values()"
              id-identifier="id"
            >
              <template #tableHeader>
                <TableHeader :num-of-cols="8">
                  <template #header1>
                    Username
                  </template>
                  <template #header2>
                    User Permissions
                  </template>
                  <template #header3>
                    Operation Permissions
                  </template>
                  <template #header4>
                    Group Permissions
                  </template>
                  <template #header5>
                    Permission Permissions
                  </template>
                  <template #header6>
                    Address Book Premissions
                  </template>
                  <template #header7>
                    Intelligence Permissions
                  </template>
                  <template #header8>
                    Other Permissions
                  </template>
                </TableHeader>
              </template>

              <template #tableRow="{rowData}:{rowData:User}">
                <TableRow
                  :row-data="rowData"
                  :num-of-cols="8"
                  :identifier="rowData.id"
                  @click="selectRow($event)"
                >
                  <template #data1="{data}:{data:User}">
                    {{ data.username }}
                  </template>
                  <template #data2="{data}:{data:User}">
                    {{ userPermissionsStrings.get(data.id) }}
                  </template>
                  <template #data3="{data}:{data:User}">
                    {{ operationPermissionsStrings.get(data.id) }}
                  </template>
                  <template #data4="{data}:{data:User}">
                    {{ groupPermissionsStrings.get(data.id) }}
                  </template>
                  <template #data5="{data}:{data:User}">
                    {{ permissionPermissionsStrings.get(data.id) }}
                  </template>
                  <template #data6="{data}:{data:User}">
                    {{ addressbookPermissionsStrings.get(data.id) }}
                  </template>
                  <template #data7="{data}:{data:User}">
                    {{ intelligencePermissionsStrings.get(data.id) }}
                  </template>
                  <template #data8="{data}:{data:User}">
                    {{ otherPermissionsStrings.get(data.id) }}
                  </template>
                </TableRow>
              </template>
            </TableContainer>
            <!-- Pagination Bar -->
            <PaginationBar
              id="users-table-pagination"
              :total-retrievable-entities="totalUserAmount()"
              :page-size="5"
              @update-page="updatePage($event.amount, $event.offset)"
            />
          </div>
        </div>
        <router-view class="min-w-fit" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import PaginationBar from '../components/BasicComponents/PaginationBar.vue';
  import TableContainer from '../components/BasicComponents/TableContainer.vue';
  import TableRow from '../components/BasicComponents/TableRow.vue';
  import TableHeader from '../components/BasicComponents/TableHeader.vue';
  import { useUserState, usePermissionsState } from '../store';
  import { useRouter } from 'vue-router';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import type { User }  from '../../../types';
  import type { Ref } from 'vue';
  import { OrderBy, OrderDir, PermissionNames } from '../constants';


  const userState = useUserState();
  const permissionsState = usePermissionsState();
  const userPage = computed(() => userState.getters.page);
  const totalUserAmount = computed(() => userState.getters.total);
  const permissions = computed(() => permissionsState.getters.getPermissions);
  const router = useRouter();
  const userPermissionsStrings:Ref<Map<string, string>> = ref(new Map<string, string>());
  const operationPermissionsStrings:Ref<Map<string, string>> = ref(new Map<string, string>());
  const groupPermissionsStrings:Ref<Map<string, string>> = ref(new Map<string, string>());
  const permissionPermissionsStrings:Ref<Map<string, string>> = ref(new Map<string, string>());
  const addressbookPermissionsStrings:Ref<Map<string, string>> = ref(new Map<string, string>());
  const intelligencePermissionsStrings:Ref<Map<string, string>> = ref(new Map<string, string>());
  const otherPermissionsStrings:Ref<Map<string, string>> = ref(new Map<string, string>());

  /**
   * update page handler for pagination bar
   * @param amount number of users to be retrieved
   * @param offset offset beginning at which users are retrieved
   */
  async function updatePage(amount: number, offset: number) {
    await userState.dispatch('retrieveUsers', {amount, offset, orderBy: OrderBy.UserUsername, orderDir: OrderDir.Ascending});
    for(const user of userPage.value().values()) {
      await permissionsState.dispatch('retrievePermissions', user.id);
    }
    await buildPermissionStrings(userPage.value().values());
  }

  // update the permission strings if the permissions are updated
  watch(permissions.value(), async () => {
    await buildPermissionStrings(userPage.value().values());
  });

  /**
   * function to generate permission strings to be shown in the users table
   * @param users for which to build the permission strings
   */
  async function buildPermissionStrings(users: IterableIterator<User>) {
    for(const user of users) {
      let userPermissionString = '';
      let operationPermissionString = '';
      let groupPermissionString = '';
      let permissionPermissionString = '';
      let addressbookPermissionString = '';
      let intelligencePermissionString = '';
      let otherPermissionString = '';

      // loop over the permissions for each passed user
      permissions.value().get(user.id)?.forEach((elem) => {
        //set user permissions
        if(elem.name === PermissionNames.UserView) {
          userPermissionString += 'View, ';
        }
        if(elem.name === PermissionNames.UserCreate) {
          userPermissionString += 'Create, ';
        }
        if(elem.name === PermissionNames.UserUpdate) {
          userPermissionString += 'Update, ';
        }
        if(elem.name === PermissionNames.UserSetActive) {
          userPermissionString += 'Change Active State, ';
        }
        if(elem.name === PermissionNames.UserSetAdmin) {
          userPermissionString += 'Change Admin State, ';
        }
        if(elem.name === PermissionNames.UserUpdatePass) {
          userPermissionString += 'Update User Passwords, ';
        }
        //set operation permissions
        if(elem.name === PermissionNames.OperationViewAny) {
          operationPermissionString += 'View, ';
        }
        if(elem.name === PermissionNames.OperationCreate) {
          operationPermissionString += 'Create, ';
        }
        if(elem.name === PermissionNames.OperationUpdate) {
          operationPermissionString += 'Update, ';
        }
        if(elem.name === PermissionNames.OperationMembersView) {
          operationPermissionString += 'View Members, ';
        }
        if(elem.name === PermissionNames.OperationMembersUpdate) {
          operationPermissionString += 'Update Members, ';
        }
        //set group permissions
        if(elem.name === PermissionNames.GroupView) {
          groupPermissionString += 'View, ';
        }
        if(elem.name === PermissionNames.GroupCreate) {
          groupPermissionString += 'Create, ';
        }
        if(elem.name === PermissionNames.GroupUpdate) {
          groupPermissionString += 'Update, ';
        }
        if(elem.name === PermissionNames.GroupDelete) {
          groupPermissionString += 'Delete, ';
        }
        //set permission permissions
        if(elem.name === PermissionNames.PermissionsView) {
          permissionPermissionString += 'View, ';
        }
        if(elem.name === PermissionNames.PermissionsUpdate) {
          permissionPermissionString += 'Update, ';
        }
        //set address book permissions
        if(elem.name === PermissionNames.AddressBookViewEntry) {
          addressbookPermissionString += 'View, ';
        }
        if(elem.name === PermissionNames.AddressBookCreateEntry) {
          addressbookPermissionString += 'Create, ';
        }
        if(elem.name === PermissionNames.AddressBookUpdateEntry) {
          addressbookPermissionString += 'Update, ';
        }
        if(elem.name === PermissionNames.AddressBookDeleteEntry) {
          addressbookPermissionString += 'Delete, ';
        }
        //set intelligence permissions
        if(elem.name === PermissionNames.IntelligenceView) {
          intelligencePermissionString += 'View, ';
        }
        if(elem.name === PermissionNames.IntelligenceCreate) {
          intelligencePermissionString += 'Create, ';
        }
        if(elem.name === PermissionNames.IntelligenceInvalidate) {
          intelligencePermissionString += 'Invalidate, ';
        }
        //set other permissions
        if(elem.name === PermissionNames.SearchRebuildIndex) {
          otherPermissionString += 'Rebuild Search Index, ';
        }
      });

      // trim string end to remove the trainling comma
      userPermissionString = userPermissionString === ''? userPermissionString : userPermissionString.substring(0, userPermissionString.length - 2);
      operationPermissionString = operationPermissionString === ''? operationPermissionString : operationPermissionString.substring(0, operationPermissionString.length - 2);
      groupPermissionString = groupPermissionString === ''? groupPermissionString : groupPermissionString.substring(0, groupPermissionString.length - 2);
      permissionPermissionString = permissionPermissionString === ''? permissionPermissionString : permissionPermissionString.substring(0, permissionPermissionString.length - 2);
      addressbookPermissionString = addressbookPermissionString === ''? addressbookPermissionString : addressbookPermissionString.substring(0, addressbookPermissionString.length - 2);
      intelligencePermissionString = intelligencePermissionString === ''? intelligencePermissionString : intelligencePermissionString.substring(0, intelligencePermissionString.length - 2);
      otherPermissionString = otherPermissionString === ''? otherPermissionString : otherPermissionString.substring(0, otherPermissionString.length - 2);

      // set permissionsString to the maps to be shown
      userPermissionsStrings.value.set(user.id, userPermissionString);
      operationPermissionsStrings.value.set(user.id, operationPermissionString);
      groupPermissionsStrings.value.set(user.id, groupPermissionString);
      permissionPermissionsStrings.value.set(user.id, permissionPermissionString);
      addressbookPermissionsStrings.value.set(user.id, addressbookPermissionString);
      intelligencePermissionsStrings.value.set(user.id, intelligencePermissionString);
      otherPermissionsStrings.value.set(user.id, otherPermissionString);
    }
  }

  /**
   * click handler for the table row which route to user views
   * @param userId id of user to route to
   */
  function selectRow(userId: string) {
    router.push({name: 'EditCurrentUserPermissions', params:{ userId: userId}});
  }
</script>