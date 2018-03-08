"use strict";
const expect = require('chai').expect;
const utils = require('../../src/report/modulesOnly');
const deps = require('./fixtures/modules-reduce');

describe("modulesOnly", () => {
    it.only("says everything fine", () => {
        expect(utils.reduceToModules(deps)).to.deep.eq([{"source": "core", "dependencies": []}, {
            "source": "mod1",
            "dependencies": []
        }, {
            "source": "somemodule",
            "dependencies": [{
                "resolved": "mod1",
                "coreModule": false,
                "followable": false,
                "couldNotResolve": false,
                "dependencyTypes": ["npm"],
                "module": "mod1",
                "moduleSystem": "es6",
                "matchesDoNotFollow": false,
                "valid": true
            }, {
                "resolved": "mod2",
                "coreModule": false,
                "followable": false,
                "couldNotResolve": false,
                "dependencyTypes": ["npm"],
                "module": "mod2",
                "moduleSystem": "es6",
                "matchesDoNotFollow": false,
                "valid": true
            }]
        }]
        );
    });
});
