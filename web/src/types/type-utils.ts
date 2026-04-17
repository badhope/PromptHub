export type DeepReadonly<T> = T extends Primitive
  ? T
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>>
  : T extends Set<infer U>
  ? ReadonlySet<DeepReadonly<U>>
  : T extends (...args: never[]) => unknown
  ? T
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

type Primitive = string | number | boolean | bigint | symbol | undefined | null;

export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

export type Brand<K, T> = K & { __brand: T };

export type SkillId = Brand<string, 'skill-id'>;
export type CategoryId = Brand<string, 'category-id'>;
export type SearchQuery = Brand<string, 'search-query'>;

export type Exact<T, U> = T extends U
  ? U extends T
    ? T
    : never
  : never;

export type UnionToIntersection<U> = 
  (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void 
    ? I 
    : never;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Awaitable<T> = T | Promise<T>;

export type Nullable<T> = T | null | undefined;

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> 
  & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>>
  & {
    [K in Keys]-?:
      Required<Pick<T, K>>
      & Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys];
