type ResolvePromise<T> = (value: T | PromiseLike<T>) => void;
// eslint-disable-next-line @typescript-eslint/no-explicit-any 
type RejectPromise = (reason?: any) => void;

export type WithResolvers<T = void> = {
	promise: Promise<T>;
	resolve: ResolvePromise<T>;
	reject: RejectPromise;
};
