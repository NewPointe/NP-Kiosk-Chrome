import { ICheck } from "./ICheck";

export class AgentPingCheck implements ICheck {

    public readonly key = "agent.ping";

    run() {
        return 1;
    }

}
