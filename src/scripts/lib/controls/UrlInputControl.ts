import { Tag } from "../TagBuilder";
import { generateGuid } from "../Util";

import { InputGroupControl } from "./InputGroupControl";

export interface UrlInputControlOptions<T, K extends keyof T> {
    label?: string,
    placeholder?: string,
    bind?: [T, K]
}

export class UrlInputControl<T, K extends keyof T> extends Tag<"div"> {
    private inputControl: Tag<"input">;
    constructor({ label, placeholder, bind }: UrlInputControlOptions<T, K>) {
        super("div");
        this.classes("form-group");

        const inputId = `input-${generateGuid()}`;

        this.inputControl = Tag.input("text")
            .id(inputId)
            .classes("form-control")
            .properties({
                autocapitalize: "off",
                placeholder: placeholder || ""
            });

        const inputElement = this.inputControl.get();
        inputElement.addEventListener('input', () => {
            try {
                if(inputElement.value) new URL("https://" + inputElement.value);
                inputElement.setCustomValidity('');
            }
            catch(e) {
                inputElement.setCustomValidity("Please enter a valid URL");
            }
        });

        if (label) this.content(Tag.label(inputId, label));

        this.content(new InputGroupControl(this.inputControl).prepend("https://"));

        if (bind) {
            // Using `as any` here because the typing is too complex to reasonably fix
            // As long as the bound property is string-ish it will be fine
            this.inputControl.bindProperty("value", bind[0] as any, bind[1] as any);
        }
    }
}
