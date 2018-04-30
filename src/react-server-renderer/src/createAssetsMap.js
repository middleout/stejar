import fs from "fs";

export function createAssetsMap(pathToAssetsMap) {
    const map = JSON.parse(fs.readFileSync(pathToAssetsMap));
    let scripts = [];
    let styles = [];

    const data = map.chunks;

    Object.keys(data).forEach(offset => {
        if (offset === "null") {
            return;
        }

        data[offset].forEach(item => {
            if (-1 !== item.indexOf(".css")) {
                styles.push(item);
            }

            if (-1 !== item.indexOf(".js")) {
                scripts.push(item);
            }
        });
    });

    return { scripts, styles };
}
