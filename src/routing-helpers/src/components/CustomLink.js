import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

CustomLinkWithoutRouter.propTypes = {
    children: PropTypes.func.isRequired,
    to: PropTypes.string.isRequired,
    preventDefault: PropTypes.bool,
};


function CustomLinkWithoutRouter({ children, history, onClick, preventDefault, ...props }) {
    const wrappedOnClick = event => {
        if (preventDefault === undefined || preventDefault === true) {
            event.preventDefault();
        }

        onClick && onClick(event);
        history.push(props.to);
    };

    const finalProps = { ...props };
    delete finalProps.staticContext;
    delete finalProps.dispatch;
    delete finalProps.location;
    delete finalProps.match;

    return children({ ...finalProps, onClick: wrappedOnClick });
}

export default withRouter(CustomLinkWithoutRouter);
