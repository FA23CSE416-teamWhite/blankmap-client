import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from './store-request-api/index'
import AuthContext from '../auth';


export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");
export const GlobalStoreActionType = {
    CREATE_NEW_MAP: "CREATE_NEW_MAP",
}

function GlobalStoreContextProvider(props) {
    const [globalStore, setGlobalStore] = useState({
        currentMap:null
    });
    const navigate = useNavigate();
    console.log("inside useGlobalStore");
    const { auth } = useContext(AuthContext);
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {

        }
    }
    
    globalStore.createMap = function(title,description,publicStatus,selectedCategory,tags,file){
        console.log("hi")
        async function asyncCreateMap(title,description,publicStatus,selectedCategory,tags,file){
            let response= await api.createMap(title,description,publicStatus,selectedCategory,tags,file)
            if (response.data.success) {
                console.log("good")
            }
        }asyncCreateMap(title,description,publicStatus,selectedCategory,tags,file)
    }
    const setQueryString = (newQueryString) => {
        setGlobalStore({
            ...globalStore,
            queryString: newQueryString
        })
    }
    
    return (
        <GlobalStoreContext.Provider value={{globalStore}}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
