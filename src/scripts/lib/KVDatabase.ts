
type DatabaseMigration = (request: IDBOpenDBRequest, event: IDBVersionChangeEvent) => void;

export class LocalDatabase {

    private database: IDBDatabase;

    private constructor(database: IDBDatabase) {
        this.database = database;
    }

    public static async open(name: string, migrations: DatabaseMigration[]): Promise<LocalDatabase> {
        return new Promise((resolve, reject) => {

            // Create a request to open the database
            const request = indexedDB.open(name, migrations.length);

            // Fired when an error caused a request to fail.
            request.onerror = () => {
                reject(request.error);
            };

            // Fired when an IDBRequest succeeds.
            request.onsuccess = () => {
                resolve(new LocalDatabase(request.result));
            };

            // Fired when an open connection to a database is blocking a versionchange transaction on the same database.
            request.onblocked = () => {
                reject(new Error("Could not open database: an open connection to the database is blocking a versionchange transaction."))
            };

            // Fired when an attempt was made to open a database with a version number higher than its current version.
            request.onupgradeneeded = (event) => {

                // Get the db
                const db = request.result;

                // Run all migrations between the old version and the new version
                for(let version = db.version; version < migrations.length; ++version) {
                    migrations[version - 1](request, event);
                }

            };

        });
    }

    public async transaction<T>(
        storeNames: string | string[],
        mode: IDBTransactionMode,
        executer: (transaction: IDBTransaction) => T | Promise<T>
    ): Promise<T> {
        return LocalDatabase.wrapTransaction(this.database.transaction(storeNames, mode), executer);
    }

    public static async wrapRequest<T>(request: IDBRequest<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            request.onerror = () => {
                reject(request.error);
            };
            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    }

    public static async wrapTransaction<T>(transaction: IDBTransaction, executer: (transaction: IDBTransaction) => T | Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            let result: T | Promise<T>;
            transaction.onerror = () => {
                reject(transaction.error);
            };
            transaction.oncomplete = () => {
                resolve(result);
            };
            result = executer(transaction);
        });
    }

}
