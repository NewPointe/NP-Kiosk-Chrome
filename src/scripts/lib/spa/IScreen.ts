import { INavigationData } from "./INavigationService";

export type IScreenRenderResult = HTMLElement | DocumentFragment | Promise<HTMLElement | DocumentFragment>;

/**
 * A screen that can be rendered to the DOM.
 */
export interface IScreen {

    /**
     * Runs when the screen is loaded.
     * @param navigationData The navigation data that was passed to the screen.
     */
    onload(navigationData?: INavigationData | null): void | Promise<void>;

    /**
     * Runs when the screen is unloaded. In some cases, you can return `false` to abort the navigation.
     */
    onunload(): boolean | void | Promise<boolean | void>;

    /**
     * Renders the content of the screen and returns a `DocumentFragment` with the content to display.
     */
    render(): IScreenRenderResult;

}

/**
 * A loading screen that can be rendered to the DOM.
 */
export interface ILoadingScreen extends IScreen {

    /**
     * Sets the status text to show on the screen.
     * @param text The ststus text.
     */
    setStatusText(text: string): void;

}
