import React from 'react';
import { WorkspaceContext } from '../provider/workspace.provider';


/**
 * Hook to get the user from the context
 */
function useWorkspace(): {

    team: object,
    workspace: object,
    isLoadingTeam: boolean,
    workspacesList: object,
    isLoadingWorkSpaceList: boolean,
    allCollection: Array<object>,
    isLoadingCollection: boolean,
    createCollection: Function,
    createItem: (collection: Object) => void,
    updateCollection: (id: String, title: String) => void,
    deleteCollection: (id: String, parent: String | undefined) => void,
} {
    return React.useContext(WorkspaceContext);
}


export default useWorkspace;