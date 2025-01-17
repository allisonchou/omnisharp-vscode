﻿/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as vscode from 'vscode';
import { getRazorDocumentUri, isRazorCSharpFile, isRazorHtmlFile } from '../RazorConventions';
import { RazorLanguageFeatureBase } from '../RazorLanguageFeatureBase';
import { LanguageKind } from '../RPC/LanguageKind';
import { MappingHelpers } from '../Mapping/MappingHelpers';

export class RazorDefinitionProvider
    extends RazorLanguageFeatureBase
    implements vscode.DefinitionProvider {

    public async provideDefinition(
        document: vscode.TextDocument, position: vscode.Position,
        token: vscode.CancellationToken) {

        const projection = await this.getProjection(document, position, token);
        if (!projection || projection.languageKind === LanguageKind.Razor) {
            return;
        }

        const definitions = await vscode.commands.executeCommand<vscode.Definition>(
            'vscode.executeDefinitionProvider',
            projection.uri,
            projection.position) as vscode.Location[];

        const result = new Array<vscode.Location>();
        for (const definition of definitions) {
            if (projection.languageKind === LanguageKind.Html && isRazorHtmlFile(definition.uri)) {

                // Because the line pragmas for html are generated referencing the projected document
                // we need to remap their file locations to reference the top level Razor document.
                const razorFile = getRazorDocumentUri(definition.uri);
                result.push(new vscode.Location(razorFile, definition.range));
            } else if (isRazorCSharpFile(definition.uri)) {
                const remappedLocation = await MappingHelpers.remapGeneratedFileLocation(definition, this.serviceClient, this.logger, token);
                if (remappedLocation === undefined) {
                    continue;
                }

                result.push(remappedLocation);
            } else {
                // This means it is one of the following,
                // 1. A .cs file
                // 2. A .html/.js file
                // In both of these cases, we don't need to remap. So accept it as is and move on.
                result.push(definition);
            }
        }

        return result;
    }
}
