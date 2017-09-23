# Introduction

# Common files explanations:

* packages/**/.gitignore - Used per package for GIT (...)
* packages/**/__coverage__/ - Generated when running JEST (npm run test:coverage) with coverage enabled. Is not published to GIT or NPM.
* packages/**/es/ - Generated when running build. The final build directory containing the ES2015 version of the code
* packages/**/src/ - The source files of the code.
* packages/**/jest.config.json - Cannot be moved to the top of the monorepo since JEST uses its location as a the rootDir for the config details.
