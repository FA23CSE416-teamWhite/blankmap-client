import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'


export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {}

function GlobalStoreContextProvider(props) {
    return (
        <GlobalStoreContext.Provider value={{}}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };