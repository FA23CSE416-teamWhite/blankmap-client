import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from './store-request-api/index'
import mapApi from "../api/mapApi";
import AuthContext from '../auth';


export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");
export const GlobalStoreActionType = {
    CREATE_NEW_MAP: "CREATE_NEW_MAP",
    SET_CURRENT_MAP_PAGE: "SET_CURRENT_MAP_PAGE",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
}

function GlobalStoreContextProvider(props) {
    const [globalStore, setGlobalStore] = useState({
        currentMap: null,
        selectedFile: null,
        idNamePairs: null,
    });
    const navigate = useNavigate();
    console.log("inside useGlobalStore");
    const { auth } = useContext(AuthContext)

    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case GlobalStoreActionType.CREATE_MAP: {
                return setGlobalStore({
                    currentMap: payload.map,
                    selectedFile: payload.file,
                    idNamePairs: globalStore.idNamePairs

                });
            }
            case GlobalStoreActionType.SET_CURRENT_MAP_PAGE: {
                return setGlobalStore({
                    currentMap: payload.map,
                    selectedFile: payload.selectedFile,
                    idNamePairs: globalStore.idNamePairs
                });
            }
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setGlobalStore({
                    currentMap: globalStore.currentMap,
                    selectedFile: globalStore.selectedFile,
                    idNamePairs: payload
                });
            }
        }
    }
    globalStore.resetGlobalStore =function(){
        setGlobalStore({
            currentMap: null,
            selectedFile: null,
            idNamePairs: null,
        });
        auth.logoutUser();
    };

    globalStore.createMap = function (title, description, publicStatus, selectedCategory, tags, file, routerAdd, selectedFile) {
        console.log(file);

        async function asyncCreateMap(title, description, publicStatus, selectedCategory, tags, file) {
            try {
                let response = await api.createMap(title, description, publicStatus, selectedCategory, tags, file);

                if (response.status === 201) {
                    console.log("success");
                    console.log("here is the response"+response);
                    storeReducer({
                        type: GlobalStoreActionType.CREATE_MAP,
                        payload: {
                            file: selectedFile,
                            map: response.data.map,
                        },
                    });
                }

                // console.log("map_id created: "+ response.data.map.map._id);
                navigate("/" + routerAdd + "/" + response.data.map._id);
            } catch (error) {
                console.error("Error creating map:", error);
                throw error;
            }
        }

        asyncCreateMap(title, description, publicStatus, selectedCategory, tags, file);
    };
    globalStore.copyMap = function (title, description, publicStatus, selectedCategory, tags, file, features, routerAdd, selectedFile) {
        console.log(file);
        async function asyncCopyMap(title, description, publicStatus, selectedCategory, tags, file) {
            try {
                let response = await api.createMap(title, description, publicStatus, selectedCategory, tags, file);
                let map = response.data.map
                if (response.status === 201) {
                    console.log("map features: "+ map.map.addedFeatures);
                    map.map.addedFeatures = features
                    console.log("map features after: "+ map.map.addedFeatures);
                    console.log("success");
                    async function updateMapPage(mappage) {
                        response = await api.updateMapPage(mappage._id, mappage);
                        if (response.data.success) {
                            storeReducer({
                                type: GlobalStoreActionType.CREATE_MAP,
                                payload: {
                                    file: selectedFile,
                                    map: map,
                                },
                            });
                        }
                    }
                    updateMapPage(map);
                }
                // console.log("map_id created: "+ response.data.map.map._id);
                navigate("/" + routerAdd + "/" + response.data.map._id);
            } catch (error) {
                console.error("Error creating map:", error);
                throw error;
            }
        }

        asyncCopyMap(title, description, publicStatus, selectedCategory, tags, file);
    };
    globalStore.updateMapInfo = function (id, title, description, publicStatus, selectedCategory, tags, file, routerAdd, selectedFile) {
        async function asyncUpdateMapInfo(id, title, description, publicStatus, selectedCategory, tags, file,) {
            let response = await api.getMapPageById(id);
            if (response.data.success) {
                let mappage = response.data.mappage;
                mappage.title = title;
                mappage.description = description;
                mappage.publicStatus = publicStatus;
                mappage.map.baseData = JSON.parse(file);
                mappage.map.mapType = selectedCategory;
                mappage.tags = tags;
                console.log("inside updateMapInfo:", mappage)
                async function updateMapPage(mappage) {
                    response = await api.updateMapPage(mappage._id, mappage);
                    if (response.data.success) {
                        async function getMapPairs(mappage) {
                            response = await api.getPublicMapPagePairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                                    payload: pairsArray
                                });
                            }
                        }
                        getMapPairs(mappage);
                    }
                }
                updateMapPage(mappage);
                
            }
        }
        asyncUpdateMapInfo(id, title, description, publicStatus, selectedCategory, tags, file,);
        navigate("/" + routerAdd + "/" + id);
    }
    globalStore.getMapWithId = function (id) {
        async function asyncGetMapWithId(id) {
            let response = await api.getMapPageById(id)
            if (response.status === 201) {
                console.log("success")
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_MAP_PAGE,
                    payload: response.data.map

                })
            }
            navigate("/edit")
        } asyncGetMapWithId(id)
    }
    //sets idnamepairs to that of the users (used for user profile display)
    globalStore.loadUserIdNamePairs = function () {
        async function asyncLoadUserIdNamePairs() {
            const response = await api.getMapPagePairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log(pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else if (response.data.success === false && response.status === 200) {
                let pairsArray = response.data.mappages;
                console.log(pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            } else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadUserIdNamePairs();
    }
    //SET IDAMEPAIRS TO ALL PUBLIC MAPS FOR SEARCH AND DISPLAY
    globalStore.loadPublicMapPairs = function () {
        async function asyncPublicIdNamePairs() {
            const response = await api.getPublicMapPagePairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                console.log(pairsArray);
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE MAP PAIRS");
            }
        }
        asyncPublicIdNamePairs();
    }
    //set the current map page to view
    globalStore.setMapPage = async function (id, map) {
        console.log("inside setMapPage using ID: ", id);
        async function setMapPageById(id, map) {
            let response = await api.getMapPageById(id);
            if (response.data.success) {
                let mappage = response.data.mappage;
                console.log("inside setMapPage, setting mappage: ", mappage);
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_MAP_PAGE,
                    payload: {
                        selectedFile: map,
                        map: mappage
                    }
                });
                return mappage; // Return the fetched mappage
            }
            throw new Error("Failed to fetch map page");
        }
        return setMapPageById(id, map); // Return the setMapPageById promise
    }
    //update the mappage
    globalStore.updateCurrentMapPage = function () {
        async function asyncUpdateCurrentMapPage() {
            const response = await api.updateMapPage(globalStore.currentMap._id, globalStore.currentMap);
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_MAP_PAGE,
                    payload: globalStore.currentMap
                });
            }
        }
        asyncUpdateCurrentMapPage();
    }
    // functions to set values for mappage
    globalStore.addMapPageLikes = function (id, newLikes) {
        async function asyncAddMapLikes(id) {
            let response = await api.getMapPageById(id);
            if (response.data.success) {
                let mappage = response.data.mappage;
                mappage.upvotes = newLikes;
                console.log("inside addMapPageLikes:", mappage)
                async function updateMapPage(mappage) {
                    response = await api.updateMapPage(mappage._id, mappage);
                    if (response.data.success) {
                        async function getMapPairs(mappage) {
                            response = await api.getPublicMapPagePairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                                    payload: pairsArray
                                });
                            }
                        }
                        getMapPairs(mappage);
                    }
                }
                updateMapPage(mappage);
            }
        }
        asyncAddMapLikes(id);
    }
    globalStore.addMapPageDislikes = function (id, newDislikes) {
        async function asyncAddMapDislikes(id) {
            let response = await api.getMapPageById(id);
            if (response.data.success) {
                let mappage = response.data.mappage;
                mappage.downvotes = newDislikes;
                async function updateMapPage(mappage) {
                    response = await api.updateMapPage(mappage._id, mappage);
                    if (response.data.success) {
                        async function getMapPairs(mappage) {
                            response = await api.getPublicMapPagePairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                                    payload: pairsArray
                                });
                            }
                        }
                        getMapPairs(mappage);
                    }
                }
                updateMapPage(mappage);
            }
        }
        asyncAddMapDislikes(id);
    }
    globalStore.setMapPageComments = function (id, newComments) {
        async function asyncSetMapComments(id) {
            console.log("setMapComments", newComments);
            let response = await api.getMapPageById(id);
            if (response.data.success) {
                let mappage = response.data.mappage;
                mappage.comments = newComments;
                async function updateMapPage(mappage) {
                    response = await api.updateMapPage(mappage._id, mappage);
                    if (response.data.success) {
                        async function getMapPairs(mappage) {
                            response = await api.getPublicMapPagePairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                                    payload: pairsArray
                                });
                            }
                        }
                        getMapPairs(mappage);
                    }
                }
                updateMapPage(mappage);
            }
        }
        asyncSetMapComments(id);
    }
    globalStore.setMapPageTags = function (newTags) {
        let mappage = globalStore.currentMap
        mappage.tags = newTags
        mappage.lastModified = Date.now
        globalStore.updateCurrentMapPage();
    }
    globalStore.setMapPageTitle = function (newTitle) {
        let mappage = globalStore.currentMap
        mappage.title = newTitle
        mappage.lastModified = Date.now
        globalStore.updateCurrentMapPage();
    }
    globalStore.setNewMap = function (newMap) {
        let mappage = globalStore.currentMap
        mappage.map = newMap
        mappage.lastModified = Date.now
        globalStore.updateCurrentMapPage();
    }
    return (
        <GlobalStoreContext.Provider value={{ globalStore }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
