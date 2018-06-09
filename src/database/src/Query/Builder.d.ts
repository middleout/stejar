export class Builder {
    clone(): Builder;

    getColumns(): string[];

    columns(columns: string[]): Builder;

    getAggregate(): any;
}
