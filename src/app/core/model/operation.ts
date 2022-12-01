/**
 * Used for creating an {@link Operation}.
 */
export  interface  CreateOperation {
  /**
   * Title of the operation.
   */
  title: string;
  /**
   * Description of the operation. Holds further human-readable information.
   */
  description: string;
  /**
   * Start date of the operation.
   */
  start: Date;
  /**
   * End date of the operation. This is optional but if the end date is set, this needs to be after the start date.
   */
  end?: Date;
  /**
   * Indicates whether the operation is archived. This means that it is no longer visible and used instead of deleting it.
   */
  is_archived: boolean;
}

/**
 * Operations represent events.
 */
export interface Operation {
  /**
   * Identifies the operation.
   */
  id: string;
  /**
   * Title of the operation.
   */
  title: string;
  /**
   * Description of the operation. Holds further human-readable information.
   */
  description: string;
  /**
   * Start date of the operation.
   */
  start: Date;
  /**
   * End date of the operation. This is optional but if the end date is set, this needs to be after the start date.
   */
  end?: Date;
  /**
   * Indicates whether the operation is archived. This means that it is no longer visible and used instead of deleting it.
   */
  is_archived: boolean;
}
