import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'


export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    SET_QUERY_STRING: "SET_QUERY_STRING",
}

function GlobalStoreContextProvider(props) {
    const [globalStore, setGlobalStore] = useState({
        queryString: ""
    });
    const setQueryString = (newQueryString) => {
        setGlobalStore({
            ...globalStore,
            queryString: newQueryString
        })
    }
    const contextValue = {
        globalStore,
        setQueryString
    }
    return (
        <GlobalStoreContext.Provider value={{contextValue}}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };