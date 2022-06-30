interface User {
  id: string,
  username: string,
  first_name: string,
  last_name: string,
  is_admin: boolean,
  pass: string,
}

interface CachedUser {
  user?: User,
  cached: boolean,
  success: boolean,
}



export { User, CachedUser };