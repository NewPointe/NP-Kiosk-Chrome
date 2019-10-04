import { Tag } from "../TagBuilder";

export class SpinnerControl extends Tag<"div"> {
    constructor() {
        super("div");
        this.classes("spinner").content(
            Tag.div("rect1"),
            Tag.div("rect2"),
            Tag.div("rect3"),
            Tag.div("rect4"),
            Tag.div("rect5")
        )
    }
}
