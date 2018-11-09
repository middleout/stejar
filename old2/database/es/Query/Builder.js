"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Builder = void 0;

var _Arr = require("../Helpers/Arr");

var _isExpression = require("../Helpers/isExpression");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Builder =
/*#__PURE__*/
function () {
  /**
   * @param connection
   * @param grammar
   */
  function Builder(connection, grammar) {
    _classCallCheck(this, Builder);

    /**
     * @type Connection
     * @private
     */
    this._connection = connection;
    /**
     * @type Grammar
     * @private
     */

    this._grammar = grammar;
    /**
     * @type {string}
     * @private
     */

    this._identifier = "id";
    /**
     * @type {null|Array}
     * @private
     */

    this._orders = null;
    /**
     * @type {null|Array}
     * @private
     */

    this._unionOrders = null;
    /**
     * @type {null}
     * @private
     */

    this._groups = null;
    /**
     * @type {string[]}
     * @private
     */

    this._operators = ["=", "<", ">", "<=", ">=", "<>", "!=", "<=>", "like", "like binary", "not like", "ilike", "&", "|", "^", "<<", ">>", "rlike", "regexp", "not regexp", "~", "~*", "!~", "!~*", "similar to", "not similar to", "not ilike", "~~*", "!~~*"];
    /**
     * @type {Array<{
     *  type: "Basic"|"NotIn"|"In"|"NotNull"|"Null","NotExists","Exists"
     *  column?: string,
     *  query?: Builder,
     *  operator?: string,
     *  value?: string|number,
     *  values?: string|number,
     *  boolean: "and"|"or"
     * }>}
     * @private
     */

    this._wheres = [];
    /**
     * @type {Array}
     * @private
     */

    this._unions = null;
    /**
     * @type {{
     *  select: Array,
     *  from: Array,
     *  join: Array,
     *  where: Array,
     *  having: Array,
     *  order: Array,
     *  union: Array
     * }}
     * @private
     */

    this._bindings = {
      select: [],
      from: [],
      join: [],
      where: [],
      having: [],
      order: [],
      union: []
    };
    /**
     * @type {Null|string}
     * @private
     */

    this._from = null;
    /**
     * @type {undefined|Array<*>}
     * @private
     */

    this._columns = null;
    /**
     * @type {undefined|*}
     * @private
     */

    this._aggregate = null;
    /**
     * @type {boolean}
     * @private
     */

    this._distinct = false;
    /**
     * @type {Null|number}
     * @private
     */

    this._offset = null;
    /**
     * @type {Null|number}
     * @private
     */

    this._unionOffset = null;
    /**
     * @type {Null|number}
     * @private
     */

    this._limit = null;
    /**
     * @type {Null|number}
     * @private
     */

    this._unionLimit = null;
  }
  /**
   * @return {Builder}
   */


  _createClass(Builder, [{
    key: "clone",
    value: function clone() {
      var _this = this;

      var query = new Builder(this._connection, this._grammar);
      query._identifier = this._identifier;

      if (this._orders) {
        query._orders = this._orders.map(function (item) {
          return Object.assign({}, item);
        });
      }

      if (this._unionOrders) {
        query._unionOrders = this._unionOrders.map(function (item) {
          return Object.assign({}, item);
        });
      }

      if (this._groups) {
        query._groups = this._groups.map(function (item) {
          return Object.assign({}, item);
        });
      }

      if (this._wheres) {
        query._wheres = this._wheres.map(function (item) {
          return Object.assign({}, item);
        });
      }

      if (this._unions) {
        query._unions = this._unions.map(function (item) {
          return Object.assign({}, item);
        });
      }

      Object.keys(this._bindings).forEach(function (type) {
        query._bindings[type] = _this._bindings[type].slice();
      });

      if (this._columns) {
        query._columns = this._columns.map(function (item) {
          return item;
        });
      }

      if (this._aggregate) {
        query._aggregate = Object.assign({}, this._aggregate);
        query._aggregate.columns = query._aggregate.columns.slice();
      }

      query._from = this._from;
      query._distinct = this._distinct;
      query._offset = this._offset;
      query._unionOffset = this._unionOffset;
      query._limit = this._limit;
      query._unionLimit = this._unionLimit;
      return query;
    }
    /**
     * @return {Array<*>}
     */

  }, {
    key: "getColumns",
    value: function getColumns() {
      return this._columns;
    }
    /**
     * @param columns
     * @return {Builder}
     */

  }, {
    key: "columns",
    value: function columns(_columns) {
      var query = this.clone();
      query._columns = _columns;
      return query;
    }
    /**
     * @return {*}
     */

  }, {
    key: "getAggregate",
    value: function getAggregate() {
      return this._aggregate;
    }
    /**
     * @return {boolean}
     */

  }, {
    key: "getDistinct",
    value: function getDistinct() {
      return this._distinct;
    }
    /**
     * @return {Array}
     */

  }, {
    key: "getOrders",
    value: function getOrders() {
      return this._orders;
    }
    /**
     * @return {string|Null}
     */

  }, {
    key: "getFrom",
    value: function getFrom() {
      return this._from;
    }
    /**
     * @return {Null|number}
     */

  }, {
    key: "getLimit",
    value: function getLimit() {
      return this._limit;
    }
    /**
     * @return {Null|number}
     */

  }, {
    key: "getOffset",
    value: function getOffset() {
      return this._offset;
    }
    /**
     * Set the table which the query is targeting.
     *
     * @param table
     * @returns {Builder}
     */

  }, {
    key: "from",
    value: function from(table) {
      var query = this.clone();
      query._from = table;
      return query;
    }
    /**
     * Set the table which the query is targeting.
     *
     * @param table
     * @returns {Builder}
     */

  }, {
    key: "table",
    value: function table(_table) {
      return this.from(_table);
    }
    /**
     * @return {Array<{type: string, column: string, operator?: string, value?: string|number, values?: string|number, boolean: string}>|Null}
     */

  }, {
    key: "getWheres",
    value: function getWheres() {
      return this._wheres;
    }
    /**
     * Add a basic where clause to the query.
     *
     * @param args
     * @returns {Builder}
     */

  }, {
    key: "where",
    value: function where() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var column = args[0],
          _args$ = args[1],
          operator = _args$ === void 0 ? null : _args$,
          _args$2 = args[2],
          value = _args$2 === void 0 ? null : _args$2,
          _args$3 = args[3],
          boolean = _args$3 === void 0 ? "and" : _args$3; // Here we will make some assumptions about the operator. If only 2 values are
      // passed to the method, we will assume that the operator is an equals sign
      // and keep going. Otherwise, we'll require the operator to be passed in.

      var _this$_prepareValueAn = this._prepareValueAndOperator(value, operator, args.length === 2);

      var _this$_prepareValueAn2 = _slicedToArray(_this$_prepareValueAn, 2);

      value = _this$_prepareValueAn2[0];
      operator = _this$_prepareValueAn2[1];

      // If the columns is actually a Closure instance, we will assume the developer
      // wants to begin a nested where statement which is wrapped in parenthesis.
      // We'll add that Closure to the query then return back out immediately.
      if (typeof column === "function") {
        // TODO
        return this;
      } // If the given operator is not found in the list of valid operators we will
      // assume that the developer is just short-cutting the '=' operators and
      // we will set the operators to '=' and set the values appropriately.


      if (this._invalidOperator(operator)) {
        var _ref = [operator, "="];
        value = _ref[0];
        operator = _ref[1];
      } // If the value is a Closure, it means the developer is performing an entire
      // sub-select within the query and we will need to compile the sub-select
      // within the where clause to get the appropriate query record results.


      if (typeof value === "function") {
        // TODO
        return this;
      } // If the value is "null", we will just assume the developer wants to add a
      // where null clause to the query. So, we will allow a short-cut here to
      // that method for convenience so the developer doesn't have to check.


      if (value === null) {
        return this.whereNull(column, boolean, operator !== "=");
      }

      var type = "Basic";
      var query = this.clone();

      query._wheres.push({
        type: type,
        column: column,
        operator: operator,
        value: value,
        boolean: boolean
      });

      if (!(0, _isExpression.isExpression)(value)) {
        query = query._addBinding(value, "where");
      }

      return query;
    }
    /**
     * Add an "or where" clause to the query.
     *
     * @param args
     * @returns {Builder}
     */

  }, {
    key: "orWhere",
    value: function orWhere() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var column = args[0],
          _args$4 = args[1],
          operator = _args$4 === void 0 ? null : _args$4,
          _args$5 = args[2],
          value = _args$5 === void 0 ? null : _args$5;

      var _this$_prepareValueAn3 = this._prepareValueAndOperator(value, operator, args.length === 2);

      var _this$_prepareValueAn4 = _slicedToArray(_this$_prepareValueAn3, 2);

      value = _this$_prepareValueAn4[0];
      operator = _this$_prepareValueAn4[1];
      return this.where(column, operator, value, "or");
    }
    /**
     * Add a "where in" clause to the query.
     *
     * @param args
     * @returns {Builder}
     */

  }, {
    key: "whereIn",
    value: function whereIn() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      var column = args[0],
          values = args[1],
          _args$6 = args[2],
          boolean = _args$6 === void 0 ? "and" : _args$6,
          _args$7 = args[3],
          not = _args$7 === void 0 ? false : _args$7;
      var type = not ? "NotIn" : "In"; // If the value is a query builder instance we will assume the developer wants to
      // look for any values that exists within this given query. So we will add the
      // query accordingly so that this query is properly executed when it is run.

      if (values instanceof Builder) {
        // TODO
        return this;
      } // If the value of the where in clause is actually a Closure, we will assume that
      // the developer is using a full sub-select for this "in" statement, and will
      // execute those Closures, then we can re-construct the entire sub-selects.


      if (typeof values === "function") {
        // TODO
        return this;
      }

      if (values.length === 0) {
        return this;
      }

      var query = this.clone();

      query._wheres.push({
        type: type,
        column: column,
        values: values,
        boolean: boolean
      });

      values.forEach(function (value) {
        if (!(0, _isExpression.isExpression)(value)) {
          query = query._addBinding(value, "where");
        }
      });
      return query;
    }
    /**
     * Add an "or where in" clause to the query.
     *
     * @param column
     * @param values
     * @returns {Builder}
     */

  }, {
    key: "orWhereIn",
    value: function orWhereIn(column, values) {
      return this.whereIn(column, values, "or");
    }
    /**
     * Add a "where not in" clause to the query.
     *
     * @param column
     * @param values
     * @param boolean
     * @returns {Builder}
     */

  }, {
    key: "whereNotIn",
    value: function whereNotIn(column, values) {
      var boolean = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "and";
      return this.whereIn(column, values, boolean, true);
    }
    /**
     * Add an "or where not in" clause to the query.
     *
     * @param column
     * @param values
     * @returns {Builder}
     */

  }, {
    key: "orWhereNotIn",
    value: function orWhereNotIn(column, values) {
      return this.whereNotIn(column, values, "or");
    }
    /**
     * Add an "where null" clause to the query.
     *
     * @param column
     * @param boolean
     * @param not : boolean
     * @returns {Builder}
     */

  }, {
    key: "whereNull",
    value: function whereNull(column) {
      var boolean = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "and";
      var not = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var type = not ? "NotNull" : "Null";
      var query = this.clone();

      query._wheres.push({
        type: type,
        column: column,
        boolean: boolean
      });

      return query;
    }
    /**
     * Add an "or where null" clause to the query.
     *
     * @param column
     * @returns {Builder}
     */

  }, {
    key: "orWhereNull",
    value: function orWhereNull(column) {
      return this.whereNull(column, "or");
    }
    /**
     * Add a "where not null" clause to the query.
     *
     * @param column
     * @param boolean
     * @returns {Builder}
     */

  }, {
    key: "whereNotNull",
    value: function whereNotNull(column) {
      var boolean = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "and";
      return this.whereNull(column, boolean, true);
    }
    /**
     * Add an exists clause to the query.
     *
     * @param callback
     * @param boolean : "and"|"or"
     * @param not : boolean
     * @return {Builder}}
     */

  }, {
    key: "whereExists",
    value: function whereExists(callback) {
      var boolean = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "and";
      var not = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var query = this._forSubQuery(); // Similar to the sub-select clause, we will create a new query instance so
      // the developer may cleanly specify the entire exists query and we will
      // compile the whole thing in the grammar and insert it into the SQL.


      query = callback(query);
      return this._addWhereExistsQuery(query, boolean, not);
    }
    /**
     * Add an or exists clause to the query.
     *
     * @param callback
     * @param not : boolean
     * @return {Builder}
     */

  }, {
    key: "orWhereExists",
    value: function orWhereExists(callback) {
      var not = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return this.whereExists(callback, "or", not);
    }
    /**
     * Add a where not exists clause to the query.
     *
     * @param callback
     * @param boolean
     * @return {Builder}
     */

  }, {
    key: "whereNotExists",
    value: function whereNotExists(callback) {
      var boolean = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "and";
      return this.whereExists(callback, boolean, true);
    }
    /**
     * Add a where not exists clause to the query.
     *
     * @param callback
     * @return {Builder}
     */

  }, {
    key: "orWhereNotExists",
    value: function orWhereNotExists(callback) {
      return this.orWhereExists(callback, true);
    }
    /**
     * @param query
     * @param boolean : "and"|"or"
     * @param not
     * @return {Builder}
     * @private
     */

  }, {
    key: "_addWhereExistsQuery",
    value: function _addWhereExistsQuery(query) {
      var boolean = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "and";
      var not = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var type = not ? "NotExists" : "Exists";
      var clone = this.clone();

      clone._wheres.push({
        type: type,
        query: query,
        boolean: boolean
      });

      clone = clone._addBinding(query._getBindings(), "where");
      return clone;
    }
    /**
     * @return {Builder}
     * @private
     */

  }, {
    key: "_forSubQuery",
    value: function _forSubQuery() {
      return this._newQuery();
    }
    /**
     * @return {Builder}
     * @private
     */

  }, {
    key: "_newQuery",
    value: function _newQuery() {
      return new Builder(this._connection, this._grammar);
    }
    /**
     *  Add an "order by" clause to the query.
     *
     * @param column : string
     * @param direction : string
     * @return {Builder}
     */

  }, {
    key: "orderBy",
    value: function orderBy(column, direction) {
      var item = {
        column: column,
        direction: direction.toLowerCase() === "asc" ? "asc" : "desc"
      };
      var clone = this.clone();

      if (clone._unions) {
        if (null === clone._unionOrders) {
          clone._unionOrders = [];
        }

        clone._unionOrders.push(item);
      } else {
        if (null === clone._orders) {
          clone._orders = [];
        }

        clone._orders.push(item);
      }

      return clone;
    }
    /**
     * Add a descending "order by" clause to the query.
     *
     * @param column : string
     * @return {Builder}
     */

  }, {
    key: "orderByDesc",
    value: function orderByDesc(column) {
      return this.orderBy(column, "desc");
    }
    /**
     * Add a ascneding "order by" clause to the query.
     *
     * @param column : string
     * @return {Builder}
     */

  }, {
    key: "orderByAsc",
    value: function orderByAsc(column) {
      return this.orderBy(column, "asc");
    }
    /**
     * Add an "order by" clause for a timestamp to the query.
     *
     * @param column : string
     * @return {Builder}
     */

  }, {
    key: "latest",
    value: function latest() {
      var column = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "created_at";
      return this.orderBy(column, "desc");
    }
    /**
     * Add an "order by" clause for a timestamp to the query.
     *
     * @param column : string
     * @return {Builder}
     */

  }, {
    key: "oldest",
    value: function oldest() {
      var column = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "created_at";
      return this.orderBy(column, "asc");
    }
    /**
     * Put the query's results in random order.
     *
     * @param seed : string
     * @return {*}
     */

  }, {
    key: "inRandomOrder",
    value: function inRandomOrder() {
      var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      return this.orderByRaw(this._grammar.compileRandom(seed));
    }
    /**
     * Add a raw "order by" clause to the query.
     *
     * @param sql : string
     * @param bindings : Array
     * @return {Builder}
     */

  }, {
    key: "orderByRaw",
    value: function orderByRaw(sql) {
      var bindings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var type = "Raw";
      var clone = this.clone();

      if (this._unions) {
        if (null === this._unionOrders) {
          clone._unionOrders = [];
        }

        this._unionOrders.push({
          type: type,
          sql: sql
        });
      } else {
        if (null === this._orders) {
          clone._orders = [];
        }

        clone._orders.push({
          type: type,
          sql: sql
        });
      }

      clone = clone._addBinding(bindings, "order");
      return clone;
    }
    /**
     * Alias to set the "offset" value of the query.
     *
     * @param value : number
     * @return {Builder}
     */

  }, {
    key: "skip",
    value: function skip(value) {
      return this.offset(value);
    }
    /**
     * Set the "offset" value of the query.
     *
     * @param value : number
     * @return {Builder}
     */

  }, {
    key: "offset",
    value: function offset(value) {
      var clone = this.clone();

      if (this._unions) {
        clone._unionOffset = Math.max(0, value);
      } else {
        clone._offset = Math.max(0, value);
      }

      return clone;
    }
    /**
     * Alias to set the "limit" value of the query.
     *
     * @param value : number
     * @return {Builder}
     */

  }, {
    key: "take",
    value: function take(value) {
      return this.limit(value);
    }
    /**
     * Set the "limit" value of the query.
     *
     * @param value : number
     * @return {Builder}
     */

  }, {
    key: "limit",
    value: function limit(value) {
      var clone = this.clone();

      if (this._unions) {
        if (value >= 0) {
          clone._unionLimit = value;
        }
      } else {
        if (value >= 0) {
          clone._limit = value;
        }
      }

      return clone;
    }
    /**
     * Set the limit and offset for a given page.
     *
     * @param page : number
     * @param perPage : number
     * @return {Builder}
     */

  }, {
    key: "forPage",
    value: function forPage(page) {
      var perPage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 15;
      return this.skip((page - 1) * perPage).take(perPage);
    }
    /**
     * Constrain the query to the next "page" of results after a given ID.
     *
     * @param perPage : number
     * @param lastId : *
     * @param column : string
     * @return {Builder}
     */

  }, {
    key: "forPageAfterId",
    value: function forPageAfterId() {
      var perPage = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 15;
      var lastId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var column = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "id";
      var clone = this.clone();
      clone._orders = clone._removeExistingOrdersFor(column);
      return clone.where(column, ">", lastId).orderByAsc(column).take(perPage);
    }
    /**
     * @param column : string
     * @return {*}
     * @private
     */

  }, {
    key: "_removeExistingOrdersFor",
    value: function _removeExistingOrdersFor(column) {
      return this._orders.filter(function (order) {
        return order.column !== column;
      });
    }
    /**
     * Get the SQL representation of the query.
     *
     * @returns {string|Array<string|*>}
     */

  }, {
    key: "toSql",
    value: function toSql() {
      var withBindings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (withBindings) {
        return [this._grammar.compileSelect(this), this._cleanBindings(this._getBindings())];
      }

      return this._grammar.compileSelect(this);
    }
    /**
     * @param value
     * @return {*}
     */

  }, {
    key: "raw",
    value: function raw(value) {
      return this._connection.raw(value);
    }
    /**
     * @param column
     * @returns {Promise<Number>}
     */

  }, {
    key: "count",
    value: function count() {
      var column = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ["*"];
      return this.aggregate("count", Array.isArray(column) ? column : [column]);
    }
    /**
     * @param column
     * @returns {Promise<Number>}
     */

  }, {
    key: "min",
    value: function min(column) {
      return this.aggregate("min", Array.isArray(column) ? column : [column]);
    }
    /**
     * @param column
     * @returns {Promise<Number>}
     */

  }, {
    key: "max",
    value: function max(column) {
      return this.aggregate("max", Array.isArray(column) ? column : [column]);
    }
    /**
     * @param column
     * @returns {Promise<Number>}
     */

  }, {
    key: "sum",
    value: function sum(column) {
      return this.aggregate("sum", Array.isArray(column) ? column : [column]);
    }
    /**
     * @param column
     * @returns {Promise<Number>}
     */

  }, {
    key: "avg",
    value: function avg(column) {
      return this.aggregate("avg", Array.isArray(column) ? column : [column]);
    }
    /**
     * @param column
     * @returns {Promise<Number>}
     */

  }, {
    key: "average",
    value: function average(column) {
      return this.avg(column);
    }
    /**
     * @param func : string
     * @param columns : Array
     * @return {Promise<Number|Null>}
     */

  }, {
    key: "aggregate",
    value: function aggregate(func) {
      var columns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ["*"];

      var query = this._resetColumns()._resetBindings(["select"])._setAggregate(func, columns);

      return query.get().then(function (results) {
        if (results.length === 0) {
          return 0;
        }

        return results[0].aggregate;
      });
    }
    /**
     * Execute the query as a "select" statement.
     *
     * @return {Promise<*>}
     */

  }, {
    key: "get",
    value: function get() {
      return this._runSelect();
    }
    /**
     * @param id
     * @return {Promise<*>}
     */

  }, {
    key: "first",
    value: function first() {
      return this.get().then(function (results) {
        return results.length > 0 ? results[0] : null;
      });
    }
    /**
     * @param id
     * @return {Promise<*>}
     */

  }, {
    key: "find",
    value: function find(id) {
      var query = this;

      if (Array.isArray(id)) {
        query = this.whereIn(this._identifier, id);
        return query.get();
      }

      query = this.where(this._identifier, id);
      return query.first();
    }
    /**
     * Insert a new record into the database.
     *
     * @param values
     * @return {Promise<*>}
     */

  }, {
    key: "insert",
    value: function insert(values) {
      // Since every insert gets treated like a batch insert, we will make sure the
      // bindings are structured in a way that is convenient when building these
      // inserts statements by verifying these elements are actually an array.
      if (Array.isArray(values)) {
        if (values.length === 0) {
          return Promise.resolve(true);
        }
      } else {
        if (Object.keys(values).length === 0) {
          return Promise.resolve(true);
        }

        values = [values];
      } // Finally, we will run this query against the database connection and return
      // the results. We will need to also flatten these bindings before running
      // the query so they are all in one huge, flattened array for execution.


      return this._connection.insert(this._grammar.compileInsert(this, values), this._cleanBindings(_Arr.Arr.flatten(values)));
    }
    /**
     * Update a record in the database.
     *
     * @param values
     * @param value
     * @return {Promise<boolean>}
     */

  }, {
    key: "update",
    value: function update(values) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

      if (value !== undefined) {
        if (_typeof(values) === "object") {
          throw new Error("Cannot update with object key");
        }

        values = _defineProperty({}, values, value);
      }

      return this._connection.update(this._grammar.compileUpdate(this, values), this._cleanBindings(this._grammar.prepareBindingsForUpdate(this._bindings, values)));
    }
    /**
     * Delete a record from the database.
     *
     * @param id
     * @return {Promise<*>}
     */

  }, {
    key: "delete",
    value: function _delete() {
      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var query = this; // If an ID is passed to the method, we will set the where clause to check the
      // ID to let developers to simply and quickly remove a single row from this
      // database without manually specifying the "where" clauses on the query.

      if (id) {
        query = this.where(this._from + ".id", "=", id);
      }

      return query._connection.delete(query._grammar.compileDelete(query), query._cleanBindings(query._grammar.prepareBindingsForDelete(query._bindings)));
    } /////////////

    /**
     * Prepare the value and operator for a where clause.
     *
     * @param value
     * @param operator
     * @param useDefault
     * @returns {*[]}
     * @private
     */

  }, {
    key: "_prepareValueAndOperator",
    value: function _prepareValueAndOperator(value, operator) {
      var useDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (useDefault) {
        return [operator, "="];
      }

      if (this._invalidOperatorAndValue(operator, value)) {
        throw new Error("Illegal operator and value combination.");
      }

      return [value, operator];
    }
    /**
     * Determine if the given operator and value combination is legal.
     * Prevents using Null values with invalid operators.
     *
     * @param operator
     * @param value
     * @returns {boolean}
     * @private
     */

  }, {
    key: "_invalidOperatorAndValue",
    value: function _invalidOperatorAndValue(operator, value) {
      return value === null && this._operators.includes(operator) && !["=", "<>", "!="].includes(operator);
    }
    /**
     * Determine if the given operator is supported.
     *
     * @param operator
     * @returns {boolean|*}
     */

  }, {
    key: "_invalidOperator",
    value: function _invalidOperator(operator) {
      return !this._operators.includes(operator.toLowerCase());
    }
    /**
     * Add a binding to the query.
     *
     * @param value
     * @param type
     * @returns {Builder}
     * @private
     */

  }, {
    key: "_addBinding",
    value: function _addBinding(value) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "where";

      if (!Object.keys(this._bindings).includes(type)) {
        throw new Error("Invalid binding type: ".concat(type, ".\""));
      }

      var query = this.clone();

      if (Array.isArray(value)) {
        query._bindings[type] = this._bindings[type].concat(value);
      } else {
        query._bindings[type].push(value);
      }

      return query;
    }
    /**
     * Get the current query value bindings in a flattened array.
     *
     * @return {Array}
     * @private
     */

  }, {
    key: "_getBindings",
    value: function _getBindings() {
      return _Arr.Arr.flatten(this._bindings);
    }
    /**
     * Run the query as a "select" statement against the connection.
     *
     * @return {Promise<*>}
     * @private
     */

  }, {
    key: "_runSelect",
    value: function _runSelect() {
      var sql = this.toSql();
      return this._connection.select(sql, this._cleanBindings(this._getBindings()));
    }
    /**
     * @return {Builder}
     * @private
     */

  }, {
    key: "_resetColumns",
    value: function _resetColumns() {
      return this.columns(null);
    }
    /**
     * Remove query given bindings.
     *
     * @param properties
     * @return {Builder}
     * @private
     */

  }, {
    key: "_resetBindings",
    value: function _resetBindings(properties) {
      var clone = this.clone();
      properties.forEach(function (property) {
        clone._bindings[property] = [];
      });
      return clone;
    }
    /**
     * Clone the query without the given bindings.
     *
     * @param func
     * @param columns
     * @returns {Builder}
     */

  }, {
    key: "_setAggregate",
    value: function _setAggregate(func, columns) {
      var clone = this.clone();
      clone._aggregate = {
        function: func,
        columns: columns
      };

      if (!clone._groups) {
        clone._orders = null;
        clone._bindings.order = [];
      }

      return clone;
    }
    /**
     * @param bindings
     * @private
     */

  }, {
    key: "_cleanBindings",
    value: function _cleanBindings(bindings) {
      return Object.keys(bindings).filter(function (key) {
        return !(0, _isExpression.isExpression)(bindings[key]);
      }).map(function (key) {
        return bindings[key];
      });
    }
  }]);

  return Builder;
}();

exports.Builder = Builder;