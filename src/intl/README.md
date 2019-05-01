# Stejar - Intl

## How to install:

Make sure you have access to Middleout NPM repository (via .yarnrc)

```
yarn install @stejar/intl
```

## How to use:

```javascript
// app/redux/reducer.js
// ...
import { reducer as intlReducer } from "@stejar/intl/es/reducer";
// ...
export const coreReducer = combineReducers({
    "@stejar/intl": intlReducer,
});

// some place in your app where you want to load locales
import { loadingCatalog, loadedCatalog, failedToLoadCatalog, changeLocale } from "@stejar/intl/es/actions";

export async function localeLoader(newLocale, reduxStore) {
    if ($getCurrentLocale(reduxStore .getState()) === newLocale) {
        return;
    }

    reduxStore .dispatch(loadingCatalog(newLocale));
    // ...
	 // Load here the catalog for the new locale
	 // ...
    dispatch(
        loadedCatalog(locale, {
            key: "value" // This would be the new catalog contents (key > value)
        }),
    );
    dispatch(changeLocale(locale));

    // .. or in case of failure
    // dispatch(failedToLoadCatalog(newLocale, "Error message"));
}

```
## Using another location in the state tree:

If you want to use your own state slice selector then:

```javascript
// before creating the store
import { reducer as intlReducer } from "@stejar/intl/es/reducer";
import { changeStateSelector as changeIntlStateSelector } from "@stejar/intl/es/settings";

// Create a state selector which you will probably use in other places of your app also
$intl = state => state.stejar.intl;

changeIntlStateSelector($intl);

export const coreReducer = combineReducers({
    stejar: combineReducers({
        intl: intlReducer, // This nested path should match your own selector (state.stejar.intl in this example)
    }),
    ...
});
```


```
## Enabling debug:

The debug is usefull for packages like @stejar/intl-react where you might want to see certain locales keys that are missing for example. This package only gives the posibility to store the debug flag itself ( and it does not currently use it)

```javascript
// after creating the store
import { enableDebug, disableDebug } from "@stejar/intl/es/actions";


// ...
store.dispatch(enableDebug());
// ...
// And to disable debug
store.dispatch(disableDebug());
}

```
