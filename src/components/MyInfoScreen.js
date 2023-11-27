import React from "react";
import ProfileMenu from "./ProfileMenu";

import  avatar from "./images/avatar.png";
import { Paper, Typography, Box, Button, Grid, TextField } from "@mui/material";
import AuthContext from "../auth";
import { useContext, useState } from "react";

const MyInfoScreen = () => {
  const [edit, setEdit] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  const { auth } = useContext(AuthContext);
  
  if(!auth.user){
    console.log("GETT LOGGG IN")
    auth.getLoggedIn();
    return <div>Loading...</div>;
  }
  const info=auth.user;
  const dateObject = new Date(auth.user.dateJoined);
  const formattedDate = dateObject.toLocaleDateString();
    const avatarUrl = avatar;
    const handleGetLoggin = () => {
      setEdit(!edit)
    }

    const handleProfileUpdate = () => {
      if(lastName == ""){
        setLastName(info.lastName)
      }else{
        info.lastName =lastName
      }
      if(firstName == ""){
        setFirstName(info.firstName)
      }else{
        info.firstName = firstName
      }
      if(phone == ""){
        setPhone(info.phone)
      }else{
        info.phone = phone
      }
      if(bio == ""){
        setBio(info.bio)
      }else{
        info.bio = bio
      }


      auth.updateProfile(auth.user.userName, email, firstName, lastName, phone, bio)
      .then(function(res){
          console.log(res)
          setEdit(!edit)
          // window.location.reload(false)
        }
      )
    }

 return (
    <Box sx={{ display: 'flex', padding: '20px' }}>
      <Grid item xs={12} sm={3}>
        <ProfileMenu />
      </Grid>
      <Grid item xs={12} sm={9} sx={{ width: '100%', flex: 'auto' }}>
        <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flex: 1,
          marginLeft: '25px',
        }}
      >
        <div className="avatar-section">
          <img src={avatarUrl} alt="User Avatar" className="avatar" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
        </div>
        
        <div id="userInfo" className="user-info" style={{ marginTop: '20px' }}>
          <Typography variant="h5">User Information</Typography>
          <div>
            <strong>Username: </strong>
            {info.userName}
          </div>
          <div>
            <strong>firstName: </strong>{edit && info.firstName }
            {!edit && <TextField size='small'  label ={info.firstName} onChange={(e) => setFirstName(e.target.value)}/>}
          </div>
          <div>
            <strong>lastName: </strong>
            {edit && info.lastName}
            {!edit && <TextField size='small'  label ={info.lastName} onChange={(e) => setLastName(e.target.value)}/>}
          </div>
          <div>
            <strong>Email:</strong> {info.email}
          </div>
          <div>
            <strong>Phone: </strong>
            {edit && info.phone}
            {!edit && <TextField size='small'  label ={info.phone} onChange={(e) => setPhone(e.target.value)}/>}
          </div>
          <div>
            <strong>Password:</strong> ********* {/* Display password securely or provide an option to reset */}
            {/* Ideally, avoid displaying passwords for security reasons */}
          </div>
          <div>
            <strong>Member Since:</strong> {formattedDate}
          </div>
          <div>
            <strong>Number of Maps:</strong> {info.mapLength}
          </div>
          <div>
            <strong>Bio: </strong>
            {edit && info.bio}
            {!edit && <TextField size='small'  label ={info.bio} onChange={(e) => setBio(e.target.value)}/>}
          </div>
          
        </div>
        {edit && <Button variant="contained" onClick={() => handleGetLoggin()} style={{ marginTop: '20px' }}>Edit</Button>}
        {!edit && <Button variant="contained" onClick={() => handleProfileUpdate()} style={{ marginTop: '20px' }}>Confirm</Button>}
      </Paper>
      </Grid>
    </Box>
  );
};

export default MyInfoScreen;