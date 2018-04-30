import serialize from "serialize-javascript";

export function createHtml(helmet, scripts, styles, app, state = {}) {
    return `
        <!doctype html>
          <html ${helmet.htmlAttributes.toString()}>
            <head>
              ${helmet.title.toString()}
              ${helmet.meta.toString()}
              ${helmet.link.toString()}
              ${styles.map(style => `<link rel="stylesheet" href="${style}" />`).join("\n")}
            </head>
            <body ${helmet.bodyAttributes.toString()}>
              <div id="app">${app}</div>
            </body>
            <script>
              window.__PRELOADED_STATE__ = ${serialize(state)};
            </script>
            ${scripts.map(script => `<script src="${script}"></script>`).join("\n")}
        </html>
    `;
}
