import { computed, onMounted } from 'vue';
import { useLoginState, usePermissionsState, useUserState } from '../store';
import type { Permission } from '../../../types';

/**
 * Composable to create a function and encapsulated state to check user permissions.
 * @returns a function to check wether the logged in user has a set of permissions.
 */
export function usePermissions() {
  const loginState = useLoginState();
  const permissionsState = usePermissionsState();
  const userState = useUserState();

  const allUsers = computed(() => userState.getters.users);
  const allPermissions = computed(() => permissionsState.getters.getPermissions);
  const loggedInUserId = computed(() => loginState.getters.loggedInUserId);
  const loggedInUserPermissions = computed(() => allPermissions.value().get(loggedInUserId.value()));

  // get the permissions for the logged in user when a component with the composable is mounted
  onMounted(() => {
    permissionsState.dispatch('retrievePermissions', loggedInUserId.value());
  });

  /**
   * function to check if the logged in user has the set of passed permissions or is admin
   * @param permissions set of permissions to check for
   * @returns a boolean indicating if the logged in user has the passed set of permissions
   */
  function checkPermissions(permissions: Permission[]): boolean {
    // if the user has administrator status return true as admins have all permissions by default
    if(allUsers.value().has(loggedInUserId.value()) && allUsers.value().get(loggedInUserId.value())?.is_admin) {
      return true;
    }
    let userHasPermissions = false;
    if(loggedInUserPermissions.value) {
      userHasPermissions = true;
      // for each permission to check see if it is in the permission set of the logged in user
      for(const permission of permissions) {
        if(!(loggedInUserPermissions.value?.filter((elem) => elem.name === permission.name).length > 0)) {
          userHasPermissions = false;
        }
      }
    }
    return userHasPermissions;
  }

  return checkPermissions;
}