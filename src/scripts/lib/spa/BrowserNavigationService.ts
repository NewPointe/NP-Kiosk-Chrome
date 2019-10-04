import { App } from "./App";
import { INavigationService, INavigationState } from "./INavigationService";

/**
 * A Navigation Service that uses the browser's built-in navigation system.
 */
export class BrowserNavigationService<TApp extends App> implements INavigationService {

    private hadInitialPop = false;

    private app: TApp;

    constructor(app: TApp) {

        this.app = app;

        // Add relevant event listeners
        window.addEventListener("popstate", this.OnWindowPopState.bind(this));
        window.addEventListener("load", this.OnWindowLoad.bind(this));

        // If the window already loaded, fire the load event now
        if (performance.timing.loadEventEnd || document.readyState === "complete") this.OnWindowLoad();

    }

    public navigateBackward() {
        window.history.back();
    }

    public navigateForward() {
        window.history.forward();
    }

    public pushState(state: INavigationState) {
        window.history.pushState(state, "", `#/${state.pageTypeId}`);
    }

    public replaceState(state: INavigationState) {
        window.history.replaceState(state, "", `#/${state.pageTypeId}`);
    }

    protected OnWindowPopState(e: PopStateEvent) {
        this.hadInitialPop = true;
        this.app.loadPageFromSavedState(e.state as INavigationState | null);
    }

    protected OnWindowLoad() {
        if (!this.hadInitialPop) {

            this.hadInitialPop = true;
            this.app.loadPageFromSavedState(window.history.state as INavigationState | null);

        }
    }

}
