interface Intel {
    id: string,
    created_at: Date,
    created_by: string,
    operation: string,
    type: IntelType,
    content: RadioContent[] | PlainTextContent[],
    importance: number,
    initial_deliver_to: string[],
    search_text: string,
    is_valid: boolean
}

interface RadioContent {
    channel: string,
    callsign: string,
    head: string,
    content: string
}

interface PlainTextContent {
    text: string
}

declare enum IntelType {
    analog_radio_message = 'analog-radio-message',
    plaintext_message = 'plaintext-message'
}

export{Intel, RadioContent, PlainTextContent, IntelType};