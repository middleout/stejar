import { Connection } from "../Connection";
import { Grammar } from "../Grammar/Grammar";

export class Builder {
    constructor(connection: Connection, grammar: Grammar);

    clone(): Builder;

    getColumns(): string[];

    columns(columns: string[]): Builder;

    getAggregate(): any;

    getDistinct(): boolean;

    getOrders(): any[];

    getFrom(): string;

    getLimit(): number;

    getOffset(): number;

    from(table: string): Builder;

    table(table: string): Builder;

    getWheres(): any[];

    where(column: string, operator?: string, value?: any, boolean?: "and" | "or"): Builder;

    orWhere(column: string, operator?: string, value?: any): Builder;

    whereIn(column: string, values?: any[], boolean?: "and" | "or", not?: boolean): Builder;

    orWhereIn(column: string, values: any[]): Builder;

    whereNotIn(column: string, values: any[], boolean?: "and" | "or"): Builder;

    // TODO
    // whereNull(column, boolean = "and", not = false) {
    // orWhereNull(column) {
    // whereNotNull(column, boolean = "and") {
    // whereExists(callback, boolean = "and", not = false) {
    // orWhereExists(callback, not = false) {
    // whereNotExists(callback, boolean = "and") {
    // orWhereNotExists(callback) {
    // orderBy(column, direction) {
    // orderByDesc(column) {
    // orderByAsc(column) {
    // latest(column = "created_at") {
    // oldest(column = "created_at") {
    // inRandomOrder(seed = "") {
    // orderByRaw(sql, bindings = []) {

    // skip(value) {
    // offset(value) {
    // take(value) {
    // limit(value) {
    // forPage(page, perPage = 15) {
    // forPageAfterId(perPage = 15, lastId = 0, column = "id") {
    // toSql(withBindings = false) {
    // raw(value) {
    // count(column = ["*"]) {
    // min(column) {
    // max(column) {
    // sum(column) {
    // avg(column) {
    // average(column) {
    // aggregate(func, columns = ["*"]) {
    get<T>(): Promise<T[]>;

    first<T>(): Promise<T>;

    find<T>(id: string | number): Promise<T>;

    insert(Object): Promise<number | string>;

    update(values: Object, value?: string | number): Promise<boolean>;

    delete(id?: string | number): Promise<boolean>;
}
