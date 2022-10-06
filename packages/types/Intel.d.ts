import type {IntelType} from '../renderer/src/constants/index';
interface Intel {
    id: string,
    created_at: Date,
    created_by: string,
    operation: string,
    type: IntelType,
    content: RadioContent | PlainTextContent,
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



export{Intel, RadioContent, PlainTextContent};