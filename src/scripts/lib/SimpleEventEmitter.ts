export type SimpleEventHandler<TData = unknown> = (data: TData) => void | boolean;

export class SimpleEventEmiter<TEventMap = any> {

    /** The registered event listeners. */
    public readonly listeners = new Map<keyof TEventMap, Set<SimpleEventHandler<any>>>();

    /**
     * Registers an event handler.
     * @param event The event id.
     * @param handler The event handler.
     */
    public on<TKey extends keyof TEventMap>(event: TKey, handler: SimpleEventHandler<TEventMap[TKey]>) {
        const handlers = this.listeners.get(event);
        if (handlers) handlers.add(handler);
        else this.listeners.set(event, new Set([handler]));
    }

    /**
     * Unegisters an event handler.
     * @param event The event id.
     * @param handler The event handler.
     */
    public off<TKey extends keyof TEventMap>(event: TKey, handler: SimpleEventHandler<TEventMap[TKey]>) {
        const handlers = this.listeners.get(event);
        if (handlers) handlers.delete(handler);
        if (handlers && handlers.size === 0) this.listeners.delete(event);
    }

    /**
     * Emits an event to all it's registered handlers in the order they were registered.
     * @param event The event id.
     * @param data The event data.
     */
    protected emit<TKey extends keyof TEventMap>(event: TKey, data: TEventMap[TKey]): boolean | void {
        const handlers = this.listeners.get(event);
        if (handlers) return Array.from(handlers).every(h => h(data) !== false);
    }
}
