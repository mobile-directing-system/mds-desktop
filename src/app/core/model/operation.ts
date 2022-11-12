/**
 * Used for creating a {@link Operation}.
 */
export  interface  CreateOperation {
  /**
   * Title of the Operation.
   */
  title: string;
  /**
   * Description of the operation. Holds further textual information.
   */
  description: string;
  /**
   * Start date of the operation.
   */
  start: Date;
  /**
   * End date of the operation. This is optional but the end date if set, needs to after the start date.
   */
  end?: Date;
  /**
   * Flag representing whether the operation is 'deleted'.
   */
  is_archived: boolean;
}

/**
 * Operations represent events. They can not be deleted but can be marked as inactive.
 */
export interface Operation {
  /**
   * Identifies the operation.
   */
  id: string;
  /**
   * Title of the Operation.
   */
  title: string;
  /**
   * Description of the operation. Holds further textual information.
   */
  description: string;
  /**
   * Start date of the operation.
   */
  start: Date;
  /**
   * End date of the operation. This is optional but the end date if set, needs to after the start date.
   */
  end?: Date;
  /**
   * Flag representing whether the operation is 'deleted'.
   */
  is_archived: boolean;
}
