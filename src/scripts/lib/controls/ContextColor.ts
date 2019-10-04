
enum ContextColorEnum {
    PRIMARY = "primary",
    SECONDARY = "secondary",
    SUCCESS = "success",
    INFO = "info",
    WARNING = "warning",
    DANGER = "danger",
    LIGHT = "light",
    DARK = "dark"
}

type ContextColorUnion = "primary" | "secondary" | "success" | "info" | "warning" | "danger" | "light" | "dark";

export type ContextColor = ContextColorEnum | ContextColorUnion;
