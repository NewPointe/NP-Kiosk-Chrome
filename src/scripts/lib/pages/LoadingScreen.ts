import { ILoadingScreen } from "../spa";
import { SpinnerControl } from "../controls";
import { Tag } from "../TagBuilder";

export class LoadingScreen implements ILoadingScreen {

    static typeId = "loading";

    onload() { }
    onunload() { }
    setStatusText() { }

    render() {
        return Tag.div("flex-vertical-center", "spinner-backdrop").content(new SpinnerControl()).get();
    }

}
