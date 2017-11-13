import PropTypes from "prop-types";

export const Notif = ({ type, componentClassName, onClick, id, message }) => {
    const handleClick = ev => {
        ev.preventDefault();

        if (!onClick) {
            return;
        }

        onClick(id);
    };

    return (
        <div onClick={handleClick} className={`${componentClassName} ${componentClassName}-${type}`}>
            <div className={`${componentClassName}__icon`} />
            <div className={`${componentClassName}__content`}>
                <span className={`${componentClassName}__message`}>{message}</span>
            </div>
            <div className={`${componentClassName}__close`} />
        </div>
    );
};

Notif.defaultProps = {
    type: "info",
};

Notif.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    message: PropTypes.node.isRequired,
    type: PropTypes.oneOf(["success", "info", "warning", "danger"]).isRequired,
    componentClassName: PropTypes.string,
    onClick: PropTypes.func,
};
