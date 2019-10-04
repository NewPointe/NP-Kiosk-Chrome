
export enum Setting {
    CHECKIN_ADDRESS = "checkin_address",
    ENABLE_LABEL_CACHING = "enable_label_caching",
    CACHE_DURATION = "cache_duration",
    PRINTER_OVERRIDE = "printer_override",
    PRINTER_TIMEOUT = "printer_timeout",
    BLUETOOTH_PRINTING = "bluetooth_printing",
    ENABLE_INAPP_SETTINGS = "enable_inapp_settings",
    INAPP_SETTINGS_DELAY = "inapp_settings_delay",
    INAPP_SETTINGS_PIN = "inapp_settings_pin",
    MANAGED_OVERRIDES_LOCAL = "managed_overrides_local"
}

export type SettingTypeMap = {
    [Setting.CHECKIN_ADDRESS]: string,
    [Setting.ENABLE_LABEL_CACHING]: boolean,
    [Setting.CACHE_DURATION]: number,
    [Setting.PRINTER_OVERRIDE]: string,
    [Setting.PRINTER_TIMEOUT]: number,
    [Setting.BLUETOOTH_PRINTING]: boolean,
    [Setting.ENABLE_INAPP_SETTINGS]: boolean,
    [Setting.INAPP_SETTINGS_DELAY]: number,
    [Setting.INAPP_SETTINGS_PIN]: string,
    [Setting.MANAGED_OVERRIDES_LOCAL]: boolean
}

type SettingOfType<T> = { [K in keyof SettingTypeMap]: SettingTypeMap[K] extends T ? K : never }[keyof SettingTypeMap];

type StorableType = boolean | number | string | StorableTypeArray | Date | RegExp;
interface StorableTypeArray extends Array<StorableType> { }

type StorageArea = "sync" | "local" | "managed";

export class SettingsService {

    private async internalGet<S extends Setting, T extends SettingTypeMap[S]>(storageArea: StorageArea, key: S, defaultValue?: T | null): Promise<T | null> {
        return new Promise((resolve, reject) => {
            chrome.storage[storageArea].get(key, (items) => {
                if(chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
                else {
                    if(key in items && typeof items[key] !== 'undefined') {
                        resolve(items[key]);
                    }
                    else {
                        if(typeof defaultValue !== "undefined") resolve(defaultValue);
                        else resolve(null);
                    }
                }
            })
        });
    }

    public async get<S extends Setting, R extends SettingTypeMap[S] | null>(key: S, defaultValue: R): Promise<SettingTypeMap[S] | R> {

        const [isOverriden, managedVal, localVal] = await Promise.all([
            this.internalGet("managed", Setting.MANAGED_OVERRIDES_LOCAL, false),
            this.internalGet("managed", key),
            this.internalGet("local", key)
        ]);

        let rtnVal: SettingTypeMap[S] | null;

        if(isOverriden) {
            rtnVal = managedVal !== null ? managedVal : localVal;
        }
        else {
            rtnVal = localVal !== null ? localVal : managedVal;
        }

        return rtnVal !== null ? rtnVal : defaultValue;

    }

    public async set<T extends StorableType>(key: SettingOfType<T>, value: T | null): Promise<void> {
        return new Promise((resolve, reject) => {

            if(value !== null) {
                chrome.storage.local.set({ [key]: value }, () => {
                    if(chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
                    else resolve();
                });
            }
            else {
                chrome.storage.local.remove(key,  () => {
                    if(chrome.runtime.lastError) reject(new Error(chrome.runtime.lastError.message));
                    else resolve();
                });
            }
        });
    }

}
