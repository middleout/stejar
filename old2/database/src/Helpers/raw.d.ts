export interface RawResult<T> {
    $raw: true;
    getValue(): T;
}

export function raw<T>(item: T): RawResult<T>;
