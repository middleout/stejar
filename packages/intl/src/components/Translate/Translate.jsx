import isObject from "lodash.isobject";
import { connect } from "react-redux";
import { getCurrentLocaleCatalog } from "../../selectors";

function _Translate(props) {
    let params = { ...props };
    delete params.catalog;
    delete params.children;
    delete params.dispatch;
    let translatedValue;

    try {
        translatedValue = props.catalog[props.children];
        if (!translatedValue) {
            translatedValue = props.children;
        }
    } catch (error) {
        translatedValue = props.children;
    }

    let list = [];
    Object.keys(params).forEach(name => {
        if (isObject(params[name])) {
            list.push(params[name]);

            try {
                translatedValue = translatedValue.replace(`%(${name})`, "{REACT}");
            } catch (error) {
                console.error(error);
                console.warn(translatedValue);
                console.warn(name);
            }
        } else {
            translatedValue = translatedValue.replace(`%(${name})`, params[name]);
        }
    });

    if (Object.keys(list).length > 0) {
        let result = translatedValue.split("{REACT}");
        let newResult = [];
        let offset = 0;
        result.forEach(item => {
            offset++;
            newResult.push(<span key={offset} className="dangerousHtml" dangerouslySetInnerHTML={{ __html: item }} />);
            if (list.length > 0) {
                offset++;
                newResult.push(<span key={offset}>{list.shift()}</span>);
            }
        });

        return <span>{[null].concat(newResult)}</span>;
    }

    if (
        -1 !== translatedValue.indexOf("&") ||
        (-1 !== translatedValue.indexOf("<") && -1 !== translatedValue.indexOf(">"))
    ) {
        return <span className="dangerousHtml" dangerouslySetInnerHTML={{ __html: translatedValue }} />;
    }

    return <span>{translatedValue}</span>;
}

const mapStateToProps = state => ({
    catalog: getCurrentLocaleCatalog(state),
});
export const Translate = connect(mapStateToProps)(_Translate);
