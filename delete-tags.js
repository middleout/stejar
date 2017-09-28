const exec = require("child_process").execSync;

const tags = {
    'router': [
        '0.0.35'
    ],
    'router-redux': [
        '0.0.8',
    ],
    'react-router': [
        '0.0.35',
    ],
    'http': [
        '3.0.9'
    ],
    'di': [
        '3.0.10'
    ]
}


Object.keys(tags).forEach(name => {
    tags[name].forEach(version => {
        const tagname = `@stejar/${name}@${version}`;
        try {
            exec(`git push --delete origin ${tagname}`, {encoding: "utf-8"})
        } catch (err) {
            if (JSON.stringify(err).indexOf("remote ref does not exist") === -1) {
                throw err;
            }
        }

        try {
            exec(`git tag --delete ${tagname}`, {encoding: "utf-8"});
        } catch (err) {
            if (JSON.stringify(err).indexOf("not found.") === -1) {
                throw err;
            }
        }
    });
})
