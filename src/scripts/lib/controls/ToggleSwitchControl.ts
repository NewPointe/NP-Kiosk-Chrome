import { Tag } from "../TagBuilder";
import { generateGuid } from "../Util";

export interface ToggleSwitchControlOptions<T, K extends keyof T> {
    label?: string,
    bind?: [T, K]
}

export class ToggleSwitchControl<T, K extends keyof T> extends Tag<"div"> {

    protected inputControl: Tag<"input">;

    constructor({ label, bind }: ToggleSwitchControlOptions<T, K>) {
        super("div");
        this.classes("form-group");

        const inputId = `input-${generateGuid()}`;

        if (label) this.content(Tag.label(inputId, label));

        this.inputControl = Tag.input("checkbox").id(inputId).classes("custom-control-input");

        this.content(
            Tag.div("custom-control", "custom-switch").content(
                this.inputControl,
                Tag.label(inputId, "").classes("custom-control-label")
            )
        );

        if (bind) {
            this.inputControl.bindProperty("checked", bind[0] as any, bind[1] as any);
        }

    }

}
