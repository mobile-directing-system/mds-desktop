
interface CachedResult<T> {
  res?: T,
  cached: boolean,
  success: boolean
  errorMsg?: string,
}

export type { CachedResult };
export type { User, CachedUser } from './User';