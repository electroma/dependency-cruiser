/* eslint-disable security/detect-object-injection,prefer-reflect */
"use strict";

function srcToModule(src) {
    const chunks = src.split('/');

    if (chunks[0] === 'modules') {
        return chunks[1];
    }
    return chunks[0];
}

function reduceToModules(pInput) {
    const res = {};

    pInput
        .filter(d => !d.coreModule && !d.couldNotResolve)
        .forEach(src => {
            const mod = srcToModule(src.source);
            // map source to module
            const modInfo = res[mod] || {source: mod};
            // filter and map dependencies

            modInfo.modules = src.dependencies
                .filter(d => (d.dependencyTypes.indexOf("npm") !== -1 ||
                    d.dependencyTypes.indexOf("npm-no-pkg") !== -1) &&
                !d.resolved.startsWith('node_modules') &&
                !d.coreModule)
                .reduce((acc, v) => {
                    const targetMod = srcToModule(v.resolved);

                    acc[targetMod] = 1 + (acc[targetMod] || 0);
                    return acc;
                }, modInfo.modules || {});

            res[mod] = modInfo;
        });
    return Object.getOwnPropertyNames(res).map(mod => ({
        source: res[mod].source,
        dependencies: Object.getOwnPropertyNames(res[mod].modules || {}).map(m => (
            {
                "resolved": m,
                "coreModule": false,
                "followable": false,
                "couldNotResolve": false,
                "dependencyTypes": [
                    "npm"
                ],
                "module": m,
                "moduleSystem": "es6",
                "matchesDoNotFollow": false,
                "valid": true
            }
        ))
    }));
}

module.exports = reporter => (pInput) =>
    reporter(Object.assign({}, pInput, {dependencies: reduceToModules(pInput.dependencies)}));
module.exports.reduceToModules = reduceToModules;
module.exports.srcToModule = srcToModule;
