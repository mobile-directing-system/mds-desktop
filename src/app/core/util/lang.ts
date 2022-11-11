/**
 * Returns `singular` if `val` is 1, `plural` otherwise.
 *
 * @param val The numeric amount value.
 * @param singular The singular string.
 * @param plural The plural string.
 */
export function singPlural(val: number, singular: string, plural: string): string {
  return val === 1 ? singular : plural;
}
