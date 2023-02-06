/**
 * Constants for intel importance. Usage of {@link Importance} is expected but cannot be relied on.
 */
export enum Importance {
  None = 0,
  Low = 500,
  /**
   * Default importance.
   */
  Regular = 1000,
  Urgent = 5000,
  /**
   * Danger for life or important assets.
   */
  Strike = 10000,
  NationalEmergency = 900000
}


/**
 * Returns the localized string of the given {@link Importance}.
 * @param t The importance to localize.
 */
export function localizeImportance(t: Importance): string {
  switch (t) {
    case Importance.None:
      return $localize`:@@importance-none:None`;
    case Importance.Low:
      return $localize`:@@importance-low:Low`;
    case Importance.Regular:
      return $localize`:@@importance-regular:Regular`;
    case Importance.Urgent:
      return $localize`:@@importance-urgent:Urgent`;
    case Importance.Strike:
      return $localize`:@@importance-strike:Strike`;
    case Importance.NationalEmergency:
      return $localize`:@@importance-national-emergency:National Emergency`;
  }
}
