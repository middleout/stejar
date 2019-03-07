"use strict";

var bablyon = require("babylon");

var traverse = require("@babel/traverse");

function checkNode(node, components) {
    return components.indexOf(node.openingElement.name.name) !== -1;
}

function checkFn(expression, functions) {
    return functions.indexOf(expression.callee.name) !== -1;
}

function getNodeComment(node) {
    let comment = "";

    node.openingElement.attributes.forEach(el => {
        if (el.type === "JSXAttribute") {
            if (el.name.name === "__comment") {
                comment = el.value.value;
            }
        }
    });
    return comment;
}

function getNodeValue(node) {
    var children = node.children.map(function(item) {
        // If we have a weird <Translate>{"..."}</Translate> we need to use the "expression" value
        if (item.type === "JSXExpressionContainer") {
            return item.expression;
        }

        return item;
    });
    children = children.filter(function(item) {
        if (!item.value) {
            return false;
        } // If we have more than 1 child but these children actually are spaces/new lines, filter them out

        var val = item.value.replace(/(?:\r\n|\r|\n)/g, "");
        val = val.replace(/ /g, "");

        if (!val) {
            return false;
        }

        return true;
    });

    if (children.length === 0) {
        return "";
    }

    return children[0].value.trim();
}

function getFnFirstArg(node) {
    return node.arguments[0].value;
}

function extract(code) {
    var components = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ["Translate"];
    var functions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ["translate", "__"];
    var ast = bablyon.parse(code, {
        sourceType: "module",
        plugins: [
            "jsx",
            "objectRestSpread",
            "decorators-legacy",
            "classProperties",
            "exportDefaultFrom",
            "exportNamespaceFrom",
            "asyncGenerators",
            "dynamicImport",
            "typescript",
        ],
    });
    var result = [];
    traverse.default(ast, {
        enter: function enter(path) {
            switch (path.node.type) {
                case "JSXElement":
                    if (!checkNode(path.node, components)) {
                        return;
                    }

                    result.push({
                        line: path.node.loc.start.line,
                        value: getNodeValue(path.node),
                        comment: getNodeComment(path.node),
                    });
                    break;

                case "CallExpression":
                    if (!checkFn(path.node, functions)) {
                        return;
                    }

                    result.push({
                        line: path.node.loc.start.line,
                        value: getFnFirstArg(path.node),
                        comment: getNodeComment(path.node),
                    });
                    break;
            }
        },
    });
    return result;
}

module.exports = {
    extract: extract,
};
