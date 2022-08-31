interface Group {
  id: string,
  title: string,
  description?: string,
  operation?: string,
  members: string[],
}

export { Group };