import { InputControl } from "./InputControl";
import { str2num } from "../Util";

export interface NumberInputControlOptions<T, K extends keyof T> {
    label?: string,
    placeholder?: string,
    minimum?: number,
    maximum?: number,
    prefix?: string,
    suffix?: string,
    bind?: [T, K]
}

export class NumberInputControl<T, K extends keyof T> extends InputControl<T, K> {
    constructor({ label, placeholder, minimum, maximum, prefix, suffix, bind }: NumberInputControlOptions<T, K>) {
        super({
            type: "number",
            label, placeholder, prefix, suffix
        });

        const inputElement = this.inputControl.get();

        if(typeof minimum === 'number') inputElement.min = minimum.toString(10);
        if(typeof maximum === 'number') inputElement.max = maximum.toString(10);

        if (bind) {
            Object.defineProperty(inputElement, "value", {
                get: () => str2num(inputElement.value, null),
                set: (newVal: number | null) => inputElement.value = newVal !== null ? newVal.toString(10) : "",
            });
        }
    }
}
