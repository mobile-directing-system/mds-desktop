// read-only permission strings in one place for quality of life reasons
class PermissionNames {
  // Permissions Permissions
  public static readonly PermissionsUpdate = 'permissions.update';
  public static readonly PermissionsView = 'permissions.view';
  // Group Permissions
  public static readonly GroupCreate = 'group.create';
  public static readonly GroupUpdate = 'group.update';
  public static readonly GroupDelete = 'group.delete';
  public static readonly GroupView = 'group.view';
  // Operations Permissions
  public static readonly OperationViewAny = 'operation.view.any';
  public static readonly OperationCreate = 'operation.create';
  public static readonly OperationUpdate = 'operation.update';
  public static readonly OperationMembersView = 'operation.members.view';
  public static readonly OperationMembersUpdate = 'operation.members.update';
  // Users Permissions
  public static readonly UserCreate = 'user.create';
  public static readonly UserUpdate = 'user.update';
  public static readonly UserUpdatePass = 'user.update-pass';
  public static readonly UserSetAdmin = 'user.set-admin';
  public static readonly UserSetActive = 'user.set-active-state';
  public static readonly UserView = 'user.view';
  // Address Book Permissions
  public static readonly AddressBookCreateEntry = 'logistics.address-book.entry.create.any';
  public static readonly AddressBookUpdateEntry = 'logistics.address-book.entry.update.any';
  public static readonly AddressBookDeleteEntry = 'logistics.address-book.entry.delete.any';
  public static readonly AddressBookViewEntry = 'logistics.address-book.entry.view.any';
  // Intelligence Permissions
  public static readonly IntelligenceCreate = 'intelligence.intel.create';
  public static readonly IntelligenceInvalidate = 'intelligence.intel.invalidate';
  public static readonly IntelligenceView = 'intelligence.intel.view';
  //
  public static readonly SearchRebuildIndex = 'core.search.rebuild-index';
}

// readonly strings for available order dirs
class OrderDir {
  public static readonly Ascending = 'asc';
  public static readonly Descending = 'desc';
}

// readonly strings for available order_by fields
class OrderBy {
  // OrderBy for Users
  public static readonly UserUsername = 'username';
  public static readonly UserFirstName = 'first_name';
  public static readonly UserLastname = 'last_name';
  public static readonly UserIsAdmin = 'is_admin';
  // OrderBy for Groups
  public static readonly GroupTitle = 'title';
  public static readonly GroupDescription = 'description';
  // OrderBy for Operations
  public static readonly OperationTitle = 'title';
  public static readonly OperationDescription = 'description';
  public static readonly OperationStartTime = 'start';
  public static readonly OperationEndtime = 'end';
  public static readonly OperationIsArchived = 'is_archived';
}

// readonly strings for available intel types
class IntelType {
  public static readonly analog_radio_message = 'analog-radio-message';
  public static readonly plaintext_message = 'plaintext-message';
}

export { PermissionNames, OrderDir, OrderBy, IntelType };