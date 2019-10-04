import { IScreen } from "./IScreen";
import { applyAutofocus, clearChildNodes } from "./Util";

/**
 * Manages the display of a screen within the DOM.
 */
export interface IScreenManager<TScreen extends IScreen> {

    /**
     * Sets the current screen.
     * @param screen The screen to display.
     */
    set(screen: TScreen): Promise<void>;

    /**
     * Gets the currently displayed screen.
     */
    get(): TScreen | null | undefined;

    /**
     * Returns if there is a screen currently being displayed.
     */
    isSet(): boolean;

    /**
     * Clears the current screen.
     */
    clear(): Promise<void> ;

}

/**
 * Manages the display of a screen within the DOM.
 */
export class ScreenManager<TScreen extends IScreen> implements IScreenManager<TScreen> {

    /**
     * The parent element of the Screen Manager.
     */
    private parent: HTMLElement;

    /**
     * The screen root element of the Screen Manager.
     */
    private root: HTMLDivElement;

    /**
     * The active screen.
     */
    private screen?: TScreen | null;

    /**
     * The css class for the screen manager.
     */
    private managerCssClass: string;

    constructor(parent: HTMLElement, managerCssClass: string) {

        // Save the parent
        this.parent = parent;

        // Save the managerCssClass
        this.managerCssClass = managerCssClass;

        // Setup the screen manager root
        this.root = document.createElement("div");
        this.root.classList.add(`${this.managerCssClass}-root`);
        this.parent.appendChild(this.root);

    }

    public async set(screen: TScreen): Promise<void> {

        // Clear any existing instance
        this.clear();

        // Render the screen's content
        const screenContent = await screen.render();

        // Create a root for the overlay's content
        const screenInstanceRoot = document.createElement("div");

        // Append the screen content
        screenInstanceRoot.appendChild(screenContent);

        // Add the default classes
        screenInstanceRoot.classList.add(`${this.managerCssClass}-instance`);

        // Add the screen's root to the DOM
        this.root.appendChild(screenInstanceRoot);

        // Apply autofocus since some browsers don't do it for us.
        applyAutofocus(screenInstanceRoot);

        // Save the screen
        this.screen = screen;

    }

    public get(): TScreen | null | undefined {
        return this.screen;
    }

    public isSet() {
        return !!this.screen;
    }

    public async clear(): Promise<void> {
        clearChildNodes(this.root);
        this.screen = null;
    }

}
