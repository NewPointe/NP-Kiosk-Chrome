import { ICheck } from "./ICheck";
import { ZabbixError } from "../ZabbixError";

export class SystemSwArchCheck implements ICheck {

    public readonly key = "system.sw.arch";

    async run(): Promise<string> {
        return new Promise((resolve, reject) => {
            chrome.runtime.getPlatformInfo((info) => {
                if(chrome.runtime.lastError) {
                    reject(new ZabbixError("UNKNOWN",`There was an error retrieving the information: ${chrome.runtime.lastError}`));
                }
                else {
                    resolve(info.arch);
                }
            });
        });
    }

}
