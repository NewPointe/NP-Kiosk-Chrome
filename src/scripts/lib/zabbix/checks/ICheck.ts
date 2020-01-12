
export interface ICheck<TArgs extends Array<string | undefined> = Array<string>, TReturn = any> {
    readonly key: string;
    run(...args: TArgs): TReturn | PromiseLike<TReturn>;
}
