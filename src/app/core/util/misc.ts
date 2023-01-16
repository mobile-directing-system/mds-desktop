import { SimpleChange, SimpleChanges } from '@angular/core';

export type SimpleChangeTyped<T> = Omit<SimpleChange, 'previousValue' | 'currentValue'>
  & {
  previousValue: T;
  currentValue: T;
};

export type SimpleChangesTyped<T> = {
  [K in keyof T]: SimpleChangeTyped<T[K]>;
} & SimpleChanges;

export interface Identifiable<T> {
  id: T;
}

export function getEnumKeyByValue<T extends { [index: string]: string }>(myEnum: T, enumValue: string): keyof T | null {
  let keys = Object.keys(myEnum).filter(x => myEnum[x] == enumValue);
  return keys.length > 0 ? keys[0] : null;
}
