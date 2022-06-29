
interface CachedResult<T> {
  res?: T,
  cached: boolean,
  success: boolean
}

export type { CachedResult };
export type { User, CachedUser } from './User';