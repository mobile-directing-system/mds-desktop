interface AddressbookEntry {
    id: string,
    label: string,
    description: string,
    operation?: string,
    user?: string,
    user_details?: object,
}

interface Channel {
    id: string,
    entry: string,
    label: string,
    type: ChannelType,
    priority: number,
    min_importance: number,
    details: ChannelDetail,
    timeout: number,
}

interface ChannelDetail {
    info?: string,
    email?: string,
    forward_to_group?: string,
    forward_to_user?: string,
    phone?: string,
}

enum ChannelType{
    direct = 'direct',
    email = 'email',
    forward_to_group ='forward-to-group',
    forward_to_user = 'forward-to-user',
    phone_call = 'phone-call',
    push = 'push',
    radio = 'radio',
}

type Channels = Channel[];

export { AddressbookEntry, Channel, Channels, ChannelDetail, ChannelType};