import { Tag } from "../TagBuilder";
import { ContextColor } from "./ContextColor";

export interface SubmitButtonControlOptions {
    type: ContextColor;
    label?: string;
}

export class SubmitButtonControl extends Tag<"button"> {
    constructor({type, label}: SubmitButtonControlOptions) {
        super("button");
        this.property("type", "submit");
        this.classes("btn", `btn-${type}`);
        if(label) this.content(label);
    }
}
