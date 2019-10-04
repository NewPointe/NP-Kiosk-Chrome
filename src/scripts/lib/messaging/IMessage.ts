import { MessageType } from "./MessageType";


export interface IMessagePartial<TData = any> {
    type: MessageType;
    correlationId?: string;
    data?: TData;
}

export interface IMessage<TData = any> {
    type: MessageType;
    correlationId: string;
    data?: TData;
}
