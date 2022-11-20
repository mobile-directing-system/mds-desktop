/**
 * Used for creating a {@link Group}
 */
export interface CreateGroup {

  /**
   * Represents the name of the Group.
   */
  title: string;

  /**
   * Description of the group e.g. their purpose.
   */
  description: string;

  /**
   * Optional id of the {@link Operation} the group is associated with.
   */
  operation?: string;

  /**
   * Members of the group.
   */
  members: [string];
}

/**
 * A group represents a collection of {@link User} that can be associated with an operation.
 */
export interface Group {

  /**
   * Identifies the Group.
   */
  id: string;

  /**
   * Represents the name of the Group.
   */
  title: string;

  /**
   * Description of the group e.g. their purpose.
   */
  description: string;

  /**
   * Optional id of the {@link Operation} the group is associated with.
   */
  operation?: string;

  /**
   * Members of the group.
   */
  members: [string];
}
