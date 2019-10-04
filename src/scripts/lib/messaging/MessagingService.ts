import { SimpleEventEmiter } from "../SimpleEventEmitter";
import { isMessage } from "./Util";
import { MessageType } from "./MessageType";
import { IMessage, IMessagePartial } from "./IMessage";
import { generateGuid } from "../Util";

export class MessagingService extends SimpleEventEmiter<MessageType, IMessage> {

    private peerWindow?: Window;
    private peerOrigin?: string;

    private messageQueue: IMessage[] = [];

    constructor(peerWindow?: Window, peerOrigin?: string) {

        super();

        // Save the peer if provided
        this.peerWindow = peerWindow;
        this.peerOrigin = peerOrigin;

        // Listen for window message events
        window.addEventListener('message', this.handleWindowMessage.bind(this));

    }

    private handleWindowMessage(event: MessageEvent) {

        // Make sure it's a valid message
        if (isMessage(event.data)) {

            // Check if it's an init message
            if(event.data.type === MessageType.INIT_API) this.handleInitMessage(event);

            // Emit an event for the message
            this.emit(event.data.type, event.data);

        }

    }

    private handleInitMessage(event: MessageEvent) {

        // Check if we're already init'd
        if (!this.peerWindow || !this.peerOrigin) {

            // Save the window and origin so we can talk back
            this.peerWindow = event.source as Window;
            this.peerOrigin = event.origin;

            // Send any queued messages
            let message;
            while (message = this.messageQueue.shift()) {
                this.peerWindow.postMessage(message, this.peerOrigin);
            }

        }

    }

    public bindTo(peerWindow: Window, peerOrigin: string) {
        this.peerWindow = peerWindow;
        this.peerOrigin = peerOrigin;
        this.sendMessage({ type: MessageType.INIT_API });
    }

    public sendMessage<TData>(message: IMessagePartial<TData>) {

        const messageToSend = {
            type: message.type,
            correlationId: message.correlationId || generateGuid(),
            data: message.data
        }

        // See if we've been init'd
        if (this.peerWindow && this.peerOrigin) {

            // Post the message
            this.peerWindow.postMessage(messageToSend, this.peerOrigin);

        }
        else {

            // Queue the message
            this.messageQueue.push(messageToSend);

        }

    }

}
