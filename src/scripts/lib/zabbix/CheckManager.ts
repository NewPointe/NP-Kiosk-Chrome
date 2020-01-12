import { ICheck } from "./checks";
import { ZabbixError } from "./ZabbixError";
import { ZabbixAgent } from "./ZabbixAgent";

export class CheckManager {

    private checks = new Map<string, ICheck>();

    private agent: ZabbixAgent;

    constructor(agent: ZabbixAgent) {
        this.agent = agent;
    }

    public registerCheck(...checks: Array<ICheck>) {
        checks.forEach(c => this.checks.set(c.key, c));
    }

    public registerCheckType(...checkTypes: Array<new (agent: ZabbixAgent) => ICheck>) {
        this.registerCheck(...checkTypes.map(t => new t(this.agent)));
    }

    public async runCheck<T>(key: string): Promise<T> {
        const check = this.checks.get(key);
        if(check) {
            return check.run();
        }
        else {
            throw new ZabbixError("ZBX_NOTSUPPORTED", "Unsupported agent item.");
        }
    }

}
