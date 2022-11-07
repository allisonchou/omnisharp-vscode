﻿// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
// See the LICENSE file in the project root for more information.

using System.Composition;

namespace Microsoft.CodeAnalysis.LanguageServer.LanguageServer;

/// <summary>
/// Implements the workspace registration service so that any new workspaces we
/// create are automatically registered by <see cref="LspWorkspaceRegistrationEventListener"/>
/// </summary>
[Export(typeof(LspWorkspaceRegistrationService)), Shared]
internal class WorkspaceRegistrationService : LspWorkspaceRegistrationService
{
    [ImportingConstructor]
    public WorkspaceRegistrationService()
    {

    }

    public override string GetHostWorkspaceKind()
    {
        // For now mark the host workspace kind as the 'main' workspace where
        // 'workspace/XXXX' requests go to.
        return WorkspaceKind.MSBuild;
    }
}
