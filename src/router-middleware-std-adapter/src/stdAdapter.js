export function stdAdapter() {
    let currentMatch = null;

    return {
        getPreviousMatch() {
            return currentMatch;
        },
        update(match) {
            currentMatch = this.hydrate(match);
        },
        hydrate(match) {
            return {
                name: match.getName(),
                params: match.getParams(),
                query: match.getQuery(),
            };
        },
    };
}
