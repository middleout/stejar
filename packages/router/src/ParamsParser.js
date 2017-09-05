export class ParamsParser {
    /**
     * @param qstr
     * @returns {{}}
     */
    parseQuery(qstr) {
        if (!qstr) {
            return {};
        }

        var query = {};
        var a = (qstr[0] === "?" ? qstr.substr(1) : qstr).split("&");
        for (var i = 0; i < a.length; i++) {
            var b = a[i].split("=");
            query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || "");
        }
        return query;
    }

    /**
     * @param matchedParams
     * @returns {{}}
     */
    parseMatchedParams(matchedParams) {
        let params = { ...matchedParams };
        delete params._masked;
        Object.keys(params).forEach(param => {
            if (params[param].indexOf("?") !== -1) {
                params[param] = params[param].split("?")[0];
            }
        });

        return params;
    }

    /**
     * @param current
     * @param provided
     * @returns {{}}
     */
    buildParams(current = {}, provided = {}) {
        return { ...current, ...provided };
    }

    /**
     * @param current
     * @param provided
     * @returns {string}
     */
    buildQueryString(current = {}, provided = {}) {
        const obj = { ...current, ...provided };
        let str = "?";
        Object.keys(obj).forEach(key => {
            str += encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
            str += "&";
        });

        return str.substr(0, str.length - 1);
    }
}
