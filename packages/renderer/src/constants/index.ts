class PermissionNames {
    // Permissions Permissions
    static readonly PermissionsUpdate = 'permissions.update';
    static readonly PermissionsView = 'permissions.view';
    // Group Permissions
    static readonly GroupCreate = 'group.create';
    static readonly GroupUpdate = 'group.update';
    static readonly GroupDelete = 'group.delete';
    static readonly GroupView = 'group.view';
    // Operations Permissions
    static readonly OperationViewAny = 'operations.view.any';
    static readonly OperationCreate = 'operations.create';
    static readonly OperationUpdate = 'operations.update';
    // Users Permissions
    static readonly UserCreate = 'user.create';
    static readonly UserDelete = 'user.delete';
    static readonly UserUpdate = 'user.update';
    static readonly UserUpdatePass = 'user.update-pass';
    static readonly serSetAdmin = 'user.set-admin';
    static readonly UserView = 'user.view';
}

class OrderDir {
    static readonly Ascending = 'asc';
    static readonly Descending = 'desc';
}

class OrderBy {
    static readonly UserUsername = 'username';
    static readonly UserFirstName = 'first_name';
    static readonly UserLastname = 'last_name';
    static readonly serIsAdmin = 'is_admin';
}

export { PermissionNames, OrderDir, OrderBy };