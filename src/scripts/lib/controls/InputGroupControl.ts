import { Tag } from "../TagBuilder";

export class InputGroupControl extends Tag<"div"> {
    constructor(private input: Tag<"input">) {
        super("div");
        this.classes("input-group", "mb-3").content(input);
    }
    public prepend(content: string) {
        this.get().insertBefore(
            Tag.div("input-group-prepend").content(
                Tag.div("input-group-text").content(content)
            ).get(),
            this.input.get()
        )
        return this;
    }
    public append(content: string) {
        this.content(
            Tag.div("input-group-append").content(
                Tag.div("input-group-text").content(content)
            )
        )
        return this;
    }
}
