import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import api from './store-request-api/index'


export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {
    SET_QUERY_STRING: "SET_QUERY_STRING",
}

function GlobalStoreContextProvider(props) {
    const [globalStore, setGlobalStore] = useState({
        queryString: ""
    });
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {

        }
    }
    globalStore.createMap = function(title,description,publicStatus,tags,file){
        async function asyncCreateMap(title,description,publicStatus,tags,file){
            let response= await api.createMap(title,description,publicStatus,tags,file)
            if (response.data.success) {

            }
        }asyncCreateMap(title,description,publicStatus,tags,file)
    }
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