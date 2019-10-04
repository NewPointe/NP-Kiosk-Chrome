import { ContextColor } from "./ContextColor";
import { Tag } from "../TagBuilder";

export interface AlertControlOptions {
    type: ContextColor;
    title?: string;
    message?: string;
    dismissible?: boolean;
}

export class AlertControl extends Tag<"div"> {
    constructor({ type, title, message, dismissible }: AlertControlOptions) {

        super("div");

        this.classes("alert", `alert-${type}`);

        if (title) this.content(Tag.b(title), " ");

        if (message) this.content(message);

        if (dismissible) {
            this.classes("alert-dismissible", "fade", "show");
            this.content(
                Tag.button("button").classes("close").data("dismiss", "alert").aria("label", "Close").content(
                    Tag.span("×").aria("hidden", "true")
                )
            );
        }

    }
}
