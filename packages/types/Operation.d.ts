interface Operation {
    id: string,
    title: string,
    description: string,
    start: Date,
    end: Date,
    is_archived: boolean,
}

export { Operation };