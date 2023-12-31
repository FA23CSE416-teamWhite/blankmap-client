import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ProfileMenu from './ProfileMenu'; // Import your ProfileMenu component
import Message from './Message';
import Grid from "@mui/material/Grid";
import AuthContext from "../auth";
import { useContext,useEffect,useState } from "react";
import GlobalStoreContext from '../store';

const MessageCenter = () => {
  const { auth } = useContext(AuthContext);
  const{globalStore} = useContext(GlobalStoreContext)
  const [mapList, setMapList] = useState([]);
  useEffect(() => {
    if (!globalStore.idNamePairs) {
      globalStore.loadUserIdNamePairs();
    } else {
      setMapList(globalStore.idNamePairs);
    }
  }, [globalStore]);
  if(!auth.user){
    console.log("GETT LOGGG IN")
    auth.getLoggedIn();
    return <div>Loading...</div>;
  }
    
  let messages = [];

  if (mapList && mapList.length > 0) {
    mapList.forEach(map => {
      if (map.comments && map.comments.length > 0) {
        messages.push(...map.comments);
      }
    });
  }
   

  return (
    <Box sx={{ display: 'flex', padding: '20px' }}>
      <Grid container>
        <Grid item xs={12} sm={2}>
          <ProfileMenu />
        </Grid>
        <Grid item xs={12} sm={9}>
          <Box sx={{ flex: 1, marginRight: '20' }}>
            <Typography variant="h4" gutterBottom>
              Message Center
            </Typography>
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MessageCenter;