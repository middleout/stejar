const bablyon = require("babylon");
const traverse = require("@babel/traverse");

function checkNode(node, components) {
    return components.indexOf(node.openingElement.name.name) !== -1;
}

function checkFn(expression, functions) {
    return functions.indexOf(expression.callee.name) !== -1;
}

function getNodeValue(node) {
    let children = node.children.map(item => {
        // If we have a weird <Translate>{"..."}</Translate> we need to use the "expression" value
        if (item.type === "JSXExpressionContainer") {
            return item.expression;
        }

        return item;
    });

    children = children.filter(item => {
        if (!item.value) {
            return false;
        }

        // If we have more than 1 child but these children actually are spaces/new lines, filter them out
        let val = item.value.replace(/(?:\r\n|\r|\n)/g, "");
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

function extract(code, components = ["Translate"], functions = ["translate", "__"]) {
    const ast = bablyon.parse(code, {
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

    let result = [];

    traverse.default(ast, {
        enter(path) {
            switch (path.node.type) {
                case "JSXElement":
                    if (!checkNode(path.node, components)) {
                        return;
                    }

                    result.push({
                        line: path.node.loc.start.line,
                        value: getNodeValue(path.node),
                    });
                    break;
                case "CallExpression":
                    if (!checkFn(path.node, functions)) {
                        return;
                    }

                    result.push({
                        line: path.node.loc.start.line,
                        value: getFnFirstArg(path.node),
                    });
                    break;
            }
        },
    });

    return result;
}

module.exports = {
    extract,
};
