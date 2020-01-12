import { ICheck } from "./ICheck";
import { ZabbixAgent } from "../ZabbixAgent";

export class AgentHostnameCheck implements ICheck {

    public readonly key = "agent.hostname";

    constructor(private agent: ZabbixAgent) { }

    run() {
        return this.agent.config.Hostname;
    }

}
