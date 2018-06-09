import { Builder } from "./Query/Builder";
import { Grammar } from "./Grammar/Grammar";
import { Raw } from "./Helpers/raw";

export interface Adapter {}

export interface QueryLog {}

export class Connection {
    constructor(adapter: Adapter);

    table(tableName: string): Builder;

    enableQueryLog(): void;

    disableQueryLog(): void;

    logging(): boolean;

    getTablePrefix(): string;

    setTablePrefix(prefix: string): void;

    withTablePrefix(grammar: Grammar): Grammar;

    getQueryLog(): QueryLog[];

    flushQueryLog(): void;

    raw<T>(): Raw<T>;

    query(): Builder;

    select<R>(query: Builder, bindings: any): Promise<R[]>;

    insert(query: Builder, bindings: any): Promise<number>;

    update(query: Builder, bindings: any): Promise<number>;

    delete(query: Builder, bindings: any): Promise<number>;

    beginTransaction(): Promise<true>;

    commitTransaction(): Promise<true>;

    rollbackTransaction(): Promise<true>;

    transaction<T>(callback: () => T): Promise<T>;

    disconnect(): Promise<true>;
}
