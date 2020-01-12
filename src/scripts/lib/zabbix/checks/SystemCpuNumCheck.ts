import { ICheck } from "./ICheck";
import { ZabbixError } from "../ZabbixError";

export class SystemCpuNumCheck implements ICheck {

    public readonly key = "system.cpu.num";

    async run() {
        return new Promise((resolve, reject) => {
            chrome.system.cpu.getInfo((info) => {
                if(chrome.runtime.lastError) {
                    reject(new ZabbixError("UNKNOWN",`There was an error retrieving the information: ${chrome.runtime.lastError}`));
                }
                else {
                    resolve(info.numOfProcessors);
                }
            });
        });
    }

}
