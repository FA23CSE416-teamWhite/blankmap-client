import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from './store-request-api/index'
import mapApi from "../api/mapApi";
import AuthContext from '../auth';


export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");
export const GlobalStoreActionType = {
    CREATE_NEW_MAP: "CREATE_NEW_MAP",
    SET_CURRENT_MAP_PAGE: "SET_CURRENT_MAP_PAGE"
}

function GlobalStoreContextProvider(props) {
    const [globalStore, setGlobalStore] = useState({
        currentMap:null,
        selectedFile:null
    });
    const navigate = useNavigate();
    console.log("inside useGlobalStore");
    const { auth } = useContext(AuthContext);
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.CREATE_MAP: {
                return setGlobalStore({
                    currentMap: payload.map,
                    selectedFile: payload.file
                    
                });
            }
            case GlobalStoreActionType.SET_CURRENT_MAP_PAGE: {
                return setGlobalStore({
                    currentMap: payload,
                    selectedFile: null
                });
            }
        }
    }
    
    globalStore.createMap = function(title,description,publicStatus,selectedCategory,tags,file){
        console.log("hi")
        async function asyncCreateMap(title,description,publicStatus,selectedCategory,tags,file){
            let response= await api.createMap(title,description,publicStatus,selectedCategory,tags,file)
            if (response.status===201) {
                console.log("success")
                storeReducer({
                    type: GlobalStoreActionType.CREATE_MAP,
                    payload:{
                        file:file,
                        map:response.data.map
                    } 
                })
            }
            navigate("/edit")
        }asyncCreateMap(title,description,publicStatus,selectedCategory,tags,file)
    }
    globalStore.updateCurrentMapPage = function(){
        async function asyncUpdateCurrentMapPage() {
            const response = await api.updateMapPage(globalStore.currentMap._id, globalStore.currentMap);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: globalStore.currentMap
                });
            }
        }
        asyncUpdateCurrentMapPage();
    }
    globalStore.setDescription = function(description) {

    };
    globalStore.setPublicStatus = function(publicStatus){
        
    };
    globalStore.setMapPageLikes = function(newLikes){
        let mappage = globalStore.currentMap
        mappage.upvotes = newLikes
        globalStore.updateCurrentMapPage();
    }
    globalStore.setMapPageDislikes = function(newDislikes){
        let mappage = globalStore.currentMap
        mappage.downvotes = newDislikes
        globalStore.updateCurrentMapPage();
    }
    globalStore.setMapPageComments = function(newComments){
        let mappage = globalStore.currentMap
        mappage.comments = newComments
        globalStore.updateCurrentMapPage();
    }
    globalStore.setMapPageTags = function(newTags){
        
    }
    globalStore.setMapPageTitle = function(newTitle){

    }
    return (
        <GlobalStoreContext.Provider value={{globalStore}}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
