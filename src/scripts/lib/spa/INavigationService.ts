
export interface INavigationData {
    [key: string]: string;
}

export interface INavigationState {
    pageTypeId: string;
    navigationData?: INavigationData | null;
}

export interface INavigationService {
    navigateBackward(): void;
    navigateForward(): void;
    pushState(state: INavigationState): void;
    replaceState(state: INavigationState): void;
}
