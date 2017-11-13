import { connect } from "react-redux";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import PropTypes from "prop-types";
import { Notif } from "./Notif";
import { getNotifications } from "../selectors";

// This checks to see if object is immutable and properly access it
const getter = (obj, propName) => (obj.get ? obj.get(propName) : obj[propName]);

const _Notifs = props => {
    const {
        notifications,
        className,
        componentClassName,
        CustomComponent,
        transitionEnterTimeout,
        transitionLeaveTimeout,
    } = props;

    const renderedNotifications = notifications.map(notification => {
        if (CustomComponent) {
            return (
                <CustomComponent
                    {...props}
                    componentClassName={componentClassName}
                    key={getter(notification, "id")}
                    id={getter(notification, "id")}
                    message={getter(notification, "message")}
                    type={getter(notification, "type")}
                />
            );
        }
        return (
            <Notif
                {...props}
                componentClassName={componentClassName}
                key={getter(notification, "id")}
                id={getter(notification, "id")}
                message={getter(notification, "message")}
                type={getter(notification, "type")}
            />
        );
    });
    const classes = [`${componentClassName}__container`, className].join(" ").split();

    return (
        <div className={classes}>
            <CSSTransitionGroup
                transitionName={`${componentClassName}-transition`}
                transitionEnterTimeout={transitionEnterTimeout}
                transitionLeaveTimeout={transitionLeaveTimeout}>
                {renderedNotifications}
            </CSSTransitionGroup>
        </div>
    );
};

_Notifs.defaultProps = {
    className: null,
    componentClassName: "alert",
    CustomComponent: null,
    transitionEnterTimeout: 600,
    transitionLeaveTimeout: 600,
};

_Notifs.propTypes = {
    notifications: PropTypes.array.isRequired,
    className: PropTypes.string,
    CustomComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.element]),
    componentClassName: PropTypes.string,
    transitionEnterTimeout: PropTypes.number,
    transitionLeaveTimeout: PropTypes.number,
};

function mapStateToProps(state) {
    return { notifications: getNotifications(state) };
}

export const Notifs = connect(mapStateToProps)(_Notifs);
