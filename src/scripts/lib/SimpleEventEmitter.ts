export type SimpleEventHandler<TData = unknown> = (data: TData) => void;

export class SimpleEventEmiter<TKey extends string, TData = unknown> {

    /** The registered event listeners. */
    public readonly listeners = new Map<TKey, Set<SimpleEventHandler<TData>>>();

    /**
     * Registers an event handler.
     * @param event The event id.
     * @param handler The event handler.
     */
    public on(event: TKey, handler: SimpleEventHandler<TData>) {
        const handlers = this.listeners.get(event);
        if (handlers) handlers.add(handler);
        else this.listeners.set(event, new Set([handler]));
    }

    /**
     * Unegisters an event handler.
     * @param event The event id.
     * @param handler The event handler.
     */
    public off(event: TKey, handler: SimpleEventHandler<TData>) {
        const handlers = this.listeners.get(event);
        if (handlers) handlers.delete(handler);
        if (handlers && handlers.size === 0) this.listeners.delete(event);
    }

    /**
     * Emits an event to all it's registered handlers.
     * @param event The event id.
     * @param data The event data.
     */
    protected emit(event: TKey, data: TData) {
        const handlers = this.listeners.get(event);
        if (handlers) handlers.forEach(h => h(data));
    }
}
