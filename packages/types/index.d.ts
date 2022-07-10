
interface ErrorResult<T> {
  res?: T,  //optional result if a result was received
  error: boolean, //boolean to indicate whether there was an error during network communication
  errorMsg?: string, //optional string to specify which error
}

export type { ErrorResult };
export type { User } from './User';
export type { Permission, Permissions } from './Permissions';
export type { Operation } from './Operation';
export type { Group } from './Group.d';