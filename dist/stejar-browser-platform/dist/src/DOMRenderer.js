import * as tslib_1 from "tslib";
import * as React from "react";
const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
import { render } from "react-dom";
import { injectable, ServiceManager } from "@stejar/di";
let DOMRenderer = class DOMRenderer {
    /**
     * @param serviceManager
     */
    constructor(serviceManager) {
        this.serviceManager = serviceManager;
    }
    /**
     * @param Component
     * @param element
     * @returns {Promise<any>}
     */
    render(Component, element = document.getElementById(".root")) {
        return render(React.createElement(Component, { serviceManager: this.serviceManager }), element);
    }
};
DOMRenderer = tslib_1.__decorate([
    injectable,
    tslib_1.__metadata("design:paramtypes", [ServiceManager])
], DOMRenderer);
export { DOMRenderer };
//# sourceMappingURL=DOMRenderer.js.map