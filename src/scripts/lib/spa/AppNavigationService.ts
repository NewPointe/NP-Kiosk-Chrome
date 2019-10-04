import { App } from "./App";
import { INavigationService, INavigationState } from "./INavigationService";

/**
 * A Navigation Service that uses the browser's built-in navigation system.
 */
export class AppNavigationService<TApp extends App> implements INavigationService {

    private app: TApp;

    private navigationTimeline: INavigationState[] = [];
    private currentNavigationIndex: number = -1;

    constructor(app: TApp) {

        this.app = app;

        // Add relevant event listeners
        window.addEventListener("load", this.OnWindowLoad.bind(this));

        // If the window already loaded, fire the load event now
        if (performance.timing.loadEventEnd || document.readyState === "complete") this.OnWindowLoad();

    }

    public navigateBackward() {
        if(this.currentNavigationIndex > 0) {
            this.app.loadPageFromSavedState(this.navigationTimeline[--this.currentNavigationIndex]);
        }
    }

    public navigateForward() {
        if(this.currentNavigationIndex < this.navigationTimeline.length) {
            this.app.loadPageFromSavedState(this.navigationTimeline[++this.currentNavigationIndex]);
        }
    }

    public pushState(state: INavigationState) {
        this.navigationTimeline[++this.currentNavigationIndex] = state;
    }

    public replaceState(state: INavigationState) {
        this.navigationTimeline[this.currentNavigationIndex] = state;
    }

    protected OnWindowPopState(e: PopStateEvent) {
        this.app.loadPageFromSavedState(e.state as INavigationState | null);
    }

    protected OnWindowLoad() {
        this.app.loadPageFromSavedState(null);
    }

}
