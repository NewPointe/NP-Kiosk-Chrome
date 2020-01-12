export type AsyncEventHandler<TData = unknown> = (data: TData) => void | boolean | PromiseLike<void | boolean>;

export class AsyncEventEmiter<TEventMap = any> {

    /** The registered event listeners. */
    public readonly listeners = new Map<keyof TEventMap, Set<AsyncEventHandler<any>>>();

    /**
     * Registers an event handler.
     * @param event The event id.
     * @param handler The event handler.
     */
    public on<TKey extends keyof TEventMap>(event: TKey, handler: AsyncEventHandler<TEventMap[TKey]>) {
        const handlers = this.listeners.get(event);
        if (handlers) handlers.add(handler);
        else this.listeners.set(event, new Set([handler]));
    }

    /**
     * Unegisters an event handler.
     * @param event The event id.
     * @param handler The event handler.
     */
    public off<TKey extends keyof TEventMap>(event: TKey, handler: AsyncEventHandler<TEventMap[TKey]>) {
        const handlers = this.listeners.get(event);
        if (handlers) handlers.delete(handler);
        if (handlers && handlers.size === 0) this.listeners.delete(event);
    }

    /**
     * Emits an event to all it's registered handlers.
     * @param event The event id.
     * @param data The event data.
     */
    protected async emit<TKey extends keyof TEventMap>(event: TKey, data: TEventMap[TKey]) {
        const handlers = this.listeners.get(event);
        if (handlers) {
            let result;
            for(const handler of handlers) {
                result = await handler(data);
                if(result === false) return result;
            }
            return result;
        }
        return;
    }
}
