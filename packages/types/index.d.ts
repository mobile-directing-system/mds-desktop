
interface CachedResult<T> {
  res?: T,  //optional result if a result was received
  cached: boolean, //boolean to indicate whether the returned result was cached
  error: boolean, //boolean to indicate whether there was an error during network communication
  errorMsg?: string, //optional string to specify which error
}

export type { CachedResult };
export type { User, CachedUser } from './User';