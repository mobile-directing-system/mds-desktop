
interface CachedResult<T> {
  res?: T,
  cached: boolean,
  error: boolean,
  errorMsg?: string,
}

export type { CachedResult };
export type { User, CachedUser } from './User';