import { ICheck } from "./ICheck";

export class AgentVersionCheck implements ICheck {

    public readonly key = "agent.version";

    run() {
        return chrome.runtime.getManifest().version;
    }

}
