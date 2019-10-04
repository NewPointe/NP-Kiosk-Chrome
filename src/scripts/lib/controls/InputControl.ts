import { Tag } from "../TagBuilder";
import { generateGuid } from "../Util";

import { InputGroupControl } from "./InputGroupControl";

export interface InputControlOptions<T, K extends keyof T> {
    type: "button" | "checkbox" | "color" | "date" | "datetime" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week",
    label?: string,
    placeholder?: string,
    validationPattern?: string,
    validationMessage?: string | ((value: string, input: HTMLInputElement) => string),
    prefix?: string,
    suffix?: string,
    bind?: [T, K]
}

export class InputControl<T, K extends keyof T> extends Tag<"div"> {

    protected inputControl: Tag<"input">;

    constructor({ type, label, placeholder, validationPattern, validationMessage, prefix, suffix, bind }: InputControlOptions<T, K>) {
        super("div");
        this.classes("form-group");

        const inputId = `input-${generateGuid()}`;

        this.inputControl = Tag.input(type)
            .id(inputId)
            .classes("form-control")
            .properties({
                placeholder: placeholder || "",
                pattern: validationPattern || ""
            });

        const inputElement = this.inputControl.get();

        if (typeof validationMessage === 'function') {

            inputElement.addEventListener("input", () => inputElement.setCustomValidity(''));
            inputElement.addEventListener("invalid", () => validationMessage(inputElement.value, inputElement));

        }
        else if (typeof validationMessage === 'string') {

            inputElement.addEventListener("input", () => inputElement.setCustomValidity(''));
            this.inputControl.on("invalid", () => inputElement.setCustomValidity(validationMessage));

        }

        if (label) this.content(Tag.label(inputId, label));

        if (prefix || suffix) {
            const controlGroup = new InputGroupControl(this.inputControl);
            if (prefix) controlGroup.prepend(prefix);
            if (suffix) controlGroup.append(suffix);
            this.content(controlGroup);
        }
        else {
            this.content(this.inputControl);
        }

        if (bind) {
            // Using `as any` here because the typing is too complex to reasonably fix
            // As long as the bound property is string-ish it will be fine
            this.inputControl.bindProperty("value", bind[0] as any, bind[1] as any);
        }
    }

}
