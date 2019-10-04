import { Store, set, get, del } from 'idb-keyval';

export type CacheUpdater<TKey extends IDBValidKey, TValue> = (key: TKey) => Promise<ICacheItem<TValue>>;

export interface ICacheItem<TValue> {
    expiresAt: number;
    value: TValue;
}

export interface ICacheEntry<TKey extends IDBValidKey, TValue> extends ICacheItem<TValue> {
    key: TKey;
}

export class IDBCache<TKey extends IDBValidKey, TValue> {

    private store: Store;

    private activeUpdates = new Map<TKey, Promise<ICacheItem<TValue>>>();

    constructor(name: string) {

        this.store = new Store("cache-storage-" + name, "items");

    }

    public async getOrUpdate(key: TKey, updater: CacheUpdater<TKey, TValue>): Promise<TValue> {

        const existingEntry: ICacheEntry<TKey, TValue> | undefined = await get(key, this.store);
        if (existingEntry) {
            if (existingEntry.expiresAt < Date.now()) {
                return existingEntry.value;
            }
            else {
                await del(key, this.store);
            }
        }

        const existingUpdate = this.activeUpdates.get(key);
        if(existingUpdate) {
            return existingUpdate.then(x => x.value);
        }
        else {
            const newRequest = updater(key);
            this.activeUpdates.set(key, newRequest);
            newRequest.then(result => {
                this.activeUpdates.delete(key);
                set(key, result, this.store);
            });
            return newRequest.then(x => x.value);
        }

    }

}
