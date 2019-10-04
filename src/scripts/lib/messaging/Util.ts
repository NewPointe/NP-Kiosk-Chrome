import { IMessage } from "./IMessage";

export function isMessage(thing: Partial<IMessage> | null | undefined): thing is IMessage {
    return thing !== null
        && typeof thing === 'object'
        && 'type' in thing
        && thing.type !== null
        && typeof thing.type === 'string'
        && 'correlationId' in thing
        && thing.correlationId !== null
        && typeof thing.correlationId === 'string';
}
