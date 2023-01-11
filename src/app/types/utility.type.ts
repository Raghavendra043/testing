export type url = string;
export type Links<T extends string = string> = Record<T, url>;
export type WithLinks<T extends string = string> = { links: Links<T> };
