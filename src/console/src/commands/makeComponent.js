const path = require("path");
const fs = require("fs");
const { capitalizeFirstLetter } = require("@stejar/utils/es/capitalizeFirstLetter");
const { camelCase } = require("@stejar/utils/es/camelCase");
const { mkDirByPathSync } = require("@stejar/utils/es/mkDirByPathSync");

let jsxTpl = `import "./_NAME_Styles.scss";
import { createStructuredSelector } from "reselect";
import { lifecycle, withHandlers } from "recompose";
import { connect } from "react-redux";

const mapStateToProps = createStructuredSelector({});
const methods = {
    componentDidMount() {
      // TOOD: Implement componentDidMount()
    }
};
const handlers = {
    onClick: props => event => {
      event.preventDefault();
      
      // TOOD: Implement onClick()
    }
};

function _NAME_Component(props) {
    return <div className="_NAME_">TODO: Implement _NAME_ ...</div>;
}

export const _NAME_ = connect(mapStateToProps)(
    withHandlers(handlers)(
        lifecycle(methods)(_NAME_Component)
    )
);`;

let stylesTpl = `._NAME_ {
}
`;

module.exports = {
    command: "make:component <name>",
    callback: name => {
        let pathParts = name.split("/");
        name = pathParts.pop();
        pathParts = pathParts.join("/");

        name = capitalizeFirstLetter(camelCase(name)).replace("Component", "");
        const basePath = path.resolve(path.join("app", "components", pathParts, name));
        mkDirByPathSync(basePath);

        jsxTpl = jsxTpl.replace(/_NAME_/g, name);
        fs.writeFileSync(path.join(basePath, `${name}.jsx`), jsxTpl);

        stylesTpl = stylesTpl.replace(/_NAME_/g, name);
        fs.writeFileSync(path.join(basePath, `${name}.scss`), stylesTpl);
    },
};
