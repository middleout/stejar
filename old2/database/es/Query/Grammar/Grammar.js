"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Grammar = void 0;

var _Grammar = require("../../Grammar/Grammar");

var _Arr = require("../../Helpers/Arr");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Grammar =
/*#__PURE__*/
function (_BaseGrammar) {
  _inherits(Grammar, _BaseGrammar);

  function Grammar() {
    var _this;

    _classCallCheck(this, Grammar);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Grammar).call(this));
    _this._selectComponents = ["aggregate", "columns", "from", "joins", "wheres", "groups", "havings", "orders", "limit", "offset", "unions", "lock"];
    return _this;
  }
  /**
   * @param queryBuilder : Builder
   * @return string
   */


  _createClass(Grammar, [{
    key: "compileSelect",
    value: function compileSelect(queryBuilder) {
      // If the query does not have any columns set, we'll set the columns to the
      // * character to just get all of the columns from the database. Then we
      // can build the query and concatenate all the pieces together as one.
      var original = queryBuilder.getColumns();

      if (null === original) {
        queryBuilder = queryBuilder.columns(["*"]);
      } // To compile the query, we'll spin through each component of the query and
      // see if that component exists. If it does we'll just call the compiler
      // function for the component which is responsible for making the SQL.


      var compiled = Object.values(this.compileComponents(queryBuilder)).filter(function (i) {
        return !!i;
      });

      var sql = this._concatenate(compiled).trim();

      queryBuilder.columns(original);
      return sql;
    }
    /**
     * @param query : Builder
     * @param values : Array
     * @returns {string}
     */

  }, {
    key: "compileInsert",
    value: function compileInsert(query, values) {
      var _this2 = this;

      // Essentially we will force every insert to be treated as a batch insert which
      // simply makes creating the SQL easier for us since we can utilize the same
      // basic routine regardless of an amount of records given to us to insert.
      var table = this._wrapTable(query.getFrom());

      if (!Array.isArray(values)) {
        values = [values];
      } // We assume the smae columns are in the whole VALUES array


      var columns = this.columnize(Object.keys(values[0]));
      var parameters = values.map(function (record) {
        return "(" + _this2.parameterize(Object.values(record)) + ")";
      }).join(", ");
      return "insert into ".concat(table, " (").concat(columns, ") values ").concat(parameters);
    }
    /**
     * Compile an update statement into SQL.
     *
     * @param query : Builder
     * @param values : Array
     * @returns {string}
     */

  }, {
    key: "compileUpdate",
    value: function compileUpdate(query, values) {
      var _this3 = this;

      var table = this._wrapTable(query.getFrom()); // Each one of the columns in the update statements needs to be wrapped in the
      // keyword identifiers, also a place-holder needs to be created for each of
      // the values in the list of bindings so we can make the sets statements.


      var columns = Object.keys(values).map(function (key) {
        return _this3.wrap(key) + " = " + _this3.parameter(values[key]);
      }).join(", ");
      var joins = ""; // TODO
      // if (query.getJoins()) {}
      // Of course, update queries may also be constrained by where clauses so we'll
      // need to compile the where clauses and attach it to the query so only the
      // intended records are updated by the SQL statements we generate to run.

      var wheres = this._compileWheres(query);

      return "update ".concat(table).concat(joins, " set ").concat(columns, " ").concat(wheres).trim();
    }
    /**
     * @param query : Builder
     * @return {string}
     */

  }, {
    key: "compileDelete",
    value: function compileDelete(query) {
      var wheres = Array.isArray(query.getWheres()) ? this._compileWheres(query) : "";
      return "delete from ".concat(this._wrapTable(query.getFrom()), " ").concat(wheres).trim();
    }
    /**
     * @param bindings
     * @param values
     * @return {*}
     */

  }, {
    key: "prepareBindingsForUpdate",
    value: function prepareBindingsForUpdate(bindings, values) {
      var cleanBindings = {};
      Object.keys(bindings).forEach(function (key) {
        if (!["join", "select"].includes(key)) {
          cleanBindings[key] = bindings[key];
        }
      });
      return bindings.join.concat(Object.values(values), _Arr.Arr.flatten(cleanBindings));
    }
    /**
     * @param bindings
     * @return {*}
     */

  }, {
    key: "prepareBindingsForDelete",
    value: function prepareBindingsForDelete(bindings) {
      return _Arr.Arr.flatten(bindings);
    }
    /**
     * @param queryBuilder : Builder
     * @return *
     */

  }, {
    key: "compileComponents",
    value: function compileComponents(queryBuilder) {
      var _this4 = this;

      var sql = {};

      this._selectComponents.forEach(function (component) {
        switch (component) {
          case "aggregate":
            if (null !== queryBuilder.getAggregate()) {
              sql[component] = _this4._compileAggregate(queryBuilder, queryBuilder.getAggregate());
            }

            break;

          case "columns":
            if (null !== queryBuilder.getColumns()) {
              sql[component] = _this4._compileColumns(queryBuilder, queryBuilder.getColumns());
            }

            break;

          case "from":
            if (null !== queryBuilder.getFrom()) {
              sql[component] = _this4._compileFrom(queryBuilder, queryBuilder.getFrom());
            }

            break;

          case "wheres":
            if (null !== queryBuilder.getWheres()) {
              sql[component] = _this4._compileWheres(queryBuilder);
            }

            break;

          case "orders":
            if (null !== queryBuilder.getOrders()) {
              sql[component] = _this4._compileOrders(queryBuilder, queryBuilder.getOrders());
            }

            break;

          case "offset":
            if (null !== queryBuilder.getOffset()) {
              sql[component] = _this4._compileOffset(queryBuilder, queryBuilder.getOffset());
            }

            break;

          case "limit":
            if (null !== queryBuilder.getLimit()) {
              sql[component] = _this4._compileLimit(queryBuilder, queryBuilder.getLimit());
            }

            break;
        }
      });

      return sql;
    }
    /**
     * @param query : Builder
     * @param aggregate : *
     * @return string
     */

  }, {
    key: "_compileAggregate",
    value: function _compileAggregate(query, aggregate) {
      var column = this.columnize(aggregate.columns); // If the query has a "distinct" constraint and we're not asking for all columns
      // we need to prepend "distinct" onto the column name so that the query takes
      // it into account when it performs the aggregating operations on the data.

      if (query.getDistinct() && column !== "*") {
        column = "distinct " + column;
      }

      return "select " + aggregate.function + "(" + column + ") as aggregate";
    }
    /**
     * Compile the "select *" portion of the query.
     *
     * @param query : Builder
     * @param columns : Array<string|Expression>
     * @return string|undefined
     */

  }, {
    key: "_compileColumns",
    value: function _compileColumns(query, columns) {
      // If the query is actually performing an aggregating select, we will let that
      // compiler handle the building of the select clauses, as it will need some
      // more syntax that is best handled by that function to keep things neat.
      if (null !== query.getAggregate()) {
        return;
      }

      var select = query.getDistinct() ? "select distinct " : "select ";
      return select + this.columnize(columns);
    }
    /**
     * Compile the "from" portion of the query.
     *
     * @param query : Builder
     * @param table : string
     * @return string
     */

  }, {
    key: "_compileFrom",
    value: function _compileFrom(query, table) {
      return "from " + this._wrapTable(table);
    }
    /**
     * Compile the "where" portions of the query.
     *
     * @param query : Builder
     * @return string
     * @private
     */

  }, {
    key: "_compileWheres",
    value: function _compileWheres(query) {
      // Each type of where clauses has its own compiler function which is responsible
      // for actually creating the where clauses SQL. This helps keep the code nice
      // and maintainable since each clause has a very small method that it uses.
      if (!query.getWheres()) {
        return "";
      } // If we actually have some where clauses, we will strip off the first boolean
      // operator, which is added by the query builders for convenience so we can
      // avoid checking for the first clauses in each of the compilers methods.


      var sql = this._compileWheresToArray(query);

      if (sql.length > 0) {
        return this._concatenateWhereClauses(query, sql);
      }

      return "";
    }
    /**
     * Get an array of all the where clauses for the query.
     *
     * @param query : Builder
     * @return {Array<*>}
     * @private
     */

  }, {
    key: "_compileWheresToArray",
    value: function _compileWheresToArray(query) {
      var _this5 = this;

      return query.getWheres().map(function (where) {
        var result;

        switch (where.type) {
          case "Basic":
            result = _this5._whereBasic(query, where);
            break;

          case "In":
            result = _this5._whereIn(query, where);
            break;

          case "NotIn":
            result = _this5._whereNotIn(query, where);
            break;

          case "Null":
            result = _this5._whereNull(query, where);
            break;

          case "NotNull":
            result = _this5._whereNotNull(query, where);
            break;

          case "Exists":
            result = _this5._whereExists(query, where);
            break;

          case "NotExists":
            result = _this5._whereNotExists(query, where);
            break;
        }

        return where.boolean + " " + result;
      });
    }
    /**
     * @param query : Builder
     * @param where
     * @return {string}
     * @private
     */

  }, {
    key: "_whereBasic",
    value: function _whereBasic(query, where) {
      var value = this.parameter(where.value);
      return this.wrap(where.column) + " " + where.operator + " " + value;
    }
    /**
     * @param query : Builder
     * @param where
     * @return {string}
     * @private
     */

  }, {
    key: "_whereIn",
    value: function _whereIn(query, where) {
      if (where.values) {
        return this.wrap(where.column) + " in (" + this.parameterize(where.values) + ")";
      }

      return "0 = 1";
    }
    /**
     * @param query : Builder
     * @param where
     * @return {string}
     * @private
     */

  }, {
    key: "_whereNotIn",
    value: function _whereNotIn(query, where) {
      if (where.values) {
        return this.wrap(where.column) + " not in (" + this.parameterize(where.values) + ")";
      }

      return "1 = 1";
    }
    /**
     * @param query : Builder
     * @param where
     * @return {string}
     * @private
     */

  }, {
    key: "_whereNull",
    value: function _whereNull(query, where) {
      return this.wrap(where.column) + " is null";
    }
    /**
     * Compile a where exists clause.
     *
     * @param query : Builder
     * @param where
     * @return {string}
     * @private
     */

  }, {
    key: "_whereExists",
    value: function _whereExists(query, where) {
      return "exists (" + this.compileSelect(where.query) + ")";
    }
    /**
     * Compile a where not exists clause.
     *
     * @param query : Builder
     * @param where
     * @return {string}
     * @private
     */

  }, {
    key: "_whereNotExists",
    value: function _whereNotExists(query, where) {
      return "not exists (" + this.compileSelect(where.query) + ")";
    }
    /**
     * @param query : Builder
     * @param where
     * @return {string}
     * @private
     */

  }, {
    key: "_whereNotNull",
    value: function _whereNotNull(query, where) {
      return this.wrap(where.column) + " is not null";
    }
    /**
     * Concatenate an array of segments, removing empties.
     *
     * @param segments : Array<string>
     * @returns {string}
     * @private
     */

  }, {
    key: "_concatenate",
    value: function _concatenate(segments) {
      return segments.filter(function (item) {
        return item.toString() !== "";
      }).join(" ");
    }
    /**
     * @param query : Builder
     * @param sql : *
     * @return {string}
     * @private
     */

  }, {
    key: "_concatenateWhereClauses",
    value: function _concatenateWhereClauses(query, sql) {
      // TODO
      // const conjunction = query instanceof JoinClause ? 'on' : 'where';
      var conjuction = "where";
      return conjuction + " " + this._removeLeadingBoolean(sql.join(" "));
    }
    /**
     * @param value : string
     * @return {string}
     * @private
     */

  }, {
    key: "_removeLeadingBoolean",
    value: function _removeLeadingBoolean(value) {
      return value.replace(/and |or /i, "");
    }
    /**
     * @param query : Builder
     * @param orders : *
     * @return {string}
     * @private
     */

  }, {
    key: "_compileOrders",
    value: function _compileOrders(query, orders) {
      if (!orders) {
        return "";
      }

      return "order by " + this._compileOrdersToArray(query, orders).join(", ");
    }
    /**
     * Compile the "offset" portions of the query.
     *
     * @param query : Builder
     * @param offset : *
     * @return {string}
     * @private
     */

  }, {
    key: "_compileOffset",
    value: function _compileOffset(query, offset) {
      return "offset " + parseInt(offset);
    }
    /**
     * Compile the "limit" portions of the query.
     *
     * @param query : Builder
     * @param limit : *
     * @return {string}
     * @private
     */

  }, {
    key: "_compileLimit",
    value: function _compileLimit(query, limit) {
      return "limit " + parseInt(limit);
    }
    /**
     * @param seed : string
     * @return {string}
     *
     */
    // eslint-disable-next-line

  }, {
    key: "compileRandom",
    value: function compileRandom(seed) {
      return "RANDOM()";
    }
    /**
     * @param query : Builder
     * @param orders : *
     * @return {Array<string>}
     * @private
     */

  }, {
    key: "_compileOrdersToArray",
    value: function _compileOrdersToArray(query, orders) {
      var _this6 = this;

      return orders.map(function (order) {
        return !order.sql ? _this6.wrap(order.column) + " " + order.direction : order.sql;
      });
    }
  }]);

  return Grammar;
}(_Grammar.Grammar);

exports.Grammar = Grammar;