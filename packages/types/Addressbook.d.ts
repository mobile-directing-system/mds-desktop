interface AddressbookEntry {
    id: string,
    label: string,
    description: string,
    user: string,
    user_details: object,
}

interface Channel {
    id: string,
    entry: string,
    label: string,
    type: object,
    priority: number,
    min_importance: number,
    details: object,
    timeout: number,
}

type Channels = Channel[];

export { AddressbookEntry, Channel, Channels};