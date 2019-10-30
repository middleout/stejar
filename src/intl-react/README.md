# Stejar React Translator

The react translator is based on the Stejar Translator package (and requires it). It offers a component which you can use to translate keys (master texts) in various locales.

## Installation

Stejar React Translator requires React 16.0.0 or later.

To use React Redux with your React app:

```bash
npm install --save @stejar/react-translator
```
or

```bash
yarn add react-redux
```

You'll also need to **install Stejar Translator** and set up a Redux store in your app.

## Usage

### extract-locale

The Stejar React Translator provides a script that parses all your js(x) files (using babylon) and extracts all <Translate /> components as master texts.

The arguments are as following:

1. The path where the files that you want to parse are located (ex: ./src/). Defaults to "./src/"
2. The path to the json file where you want the keys to be extracted. Defaults to "./keys-to-translate.json"
3. The files extensions that you want to parse. Defaults to ".js,.jsx".

```bash
# extract-locale path/to/files/ path/to/keys.json .js,.jsx
```

### Translate

Simple translation

```jsx
<Translate name="John">Hello :name</Translate>
```

Variabiles

```jsx
<Translate name={<strong>John</strong>}>Hello :name</Translate>
```

Nested translates

```jsx
<Translate name={<strong><Translate realName="John">Hello :realName </Translate></strong>}>Hello :name</Translate>
```

### translatorFactory

### withTranslate

# TODO
1. Finish documentation
2. Improve extractor to use includes & excludes + glob matcher

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
