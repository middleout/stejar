/**
 * This script is run by lerna on publish.
 * We keep it here to have a "prepuplish" per package
 * but in reality we keep the actual run script in the common scripts.
 *
 * We also pass the package name to be identifiable
 */
require("./../../../scripts/onPrepublish")(__dirname.replace("/scripts", ""));
