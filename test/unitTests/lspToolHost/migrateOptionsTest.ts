
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {readFileSync} from 'fs';
import { migrateOptions } from '../../../src/shared/MigrateOptions';
import { assert } from 'chai';

suite("Migrate configuration should in package.json", () => {
    let packageJson = JSON.parse(readFileSync('package.json').toString());
    let configurations = Object.keys(packageJson["contributes"]["configuration"]["properties"]);

    migrateOptions.forEach((data) => {
        assert.include(configurations, data.roslynOption);
    });
});