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
