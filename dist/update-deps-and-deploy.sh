#!/usr/bin/env bash
cd stejar-di && ncu -a && npm i && npm run deploy && \
cd ../stejar-react && ncu -a && npm i && npm run deploy && \
cd ../stejar-react-di && ncu -a && npm i && npm run deploy && \
cd ../stejar-http && ncu -a && npm i && npm run deploy && \
cd ../stejar-utils && ncu -a && npm i && npm run deploy && \
cd ../stejar-reselect && ncu -a && npm i && npm run deploy && \
cd ../stejar-typings && ncu -a && npm i && npm run deploy && \
cd ../stejar-router && ncu -a && npm i && npm run deploy && \
cd ../stejar-redux && ncu -a && npm i && npm run deploy && \
cd ../stejar-config && ncu -a && npm i && npm run deploy && \
cd ../stejar-cache && ncu -a && npm i && npm run deploy && \
cd ../stejar-application && ncu -a && npm i && npm run deploy && \
cd ../stejar-authentication && ncu -a && npm i && npm run deploy && \
cd ../stejar-authorization && ncu -a && npm i && npm run deploy && \
cd ../stejar-translate && ncu -a && npm i && npm run deploy && \
cd ../stejar-version-card && ncu -a && npm i && npm run deploy