// import { Builder } from "./Builder";
//
// export class JoinClause extends Builder {
//     constructor(parentQuery, type, table) {
//         super(parentQuery.getConnection(), parentQuery.getGrammar());
//         this._parentQuery = parentQuery;
//         this._type = type;
//         this._table = table;
//     }
//
//     on(first, operator = null, second = null, boolean = "and") {
//         if (typeof first === "function") {
//             return this.whereNested(first, boolean);
//         }
//         return this.whereColumn(first, operator, second, boolean);
//     }
// }
"use strict";