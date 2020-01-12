
export interface FancyErrorOptions {
    component?: string;
    message?: string;
    causedBy?: Error;
}

export class FancyError extends Error {
    public readonly component: string;
    public readonly causedBy?: Error;
    constructor({ component, message, causedBy}: FancyErrorOptions) {
        super(message);
        this.component = component || "";
        this.causedBy = causedBy;
    }
}
