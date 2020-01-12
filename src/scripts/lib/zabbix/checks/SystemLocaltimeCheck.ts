import { ICheck } from "./ICheck";

export class SystemLocaltimeCheck implements ICheck {

    public readonly key = "system.localtime";

    run(type: string = "utc"): string | number {
        if(type === "local") return new Date().toISOString();
        else return Math.round(Date.now() / 1000);
    }

}
