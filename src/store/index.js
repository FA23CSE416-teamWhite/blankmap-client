import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'


export const GlobalStoreContext = createContext({});

export const GlobalStoreActionType = {}

function GlobalStoreContextProvider(props) {

}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };