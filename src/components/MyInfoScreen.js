import React from "react";
import ProfileMenu from "./ProfileMenu";
import NavBar from "./NavBar";
import  avatar from "./images/avatar.png";
import { Paper, Typography, Box, Button, Grid } from "@mui/material";

const MyInfoScreen = ({userInfo}) => {
  var info=userInfo
  info={
    username: "testuser",
    email : "email@email.email",
    phone : "123-456-7890",
    memberSince : "1/1/2014",
    numberOfMaps : "2",
    bio : "Nice to meet you!"

  }
    
    const avatarUrl = avatar;

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
        
        {edit &&
          <div className="user-info" style={{ marginTop: '20px' }}>
            <Typography variant="h5">User Information</Typography>
            <div>
              <strong>Username: </strong>
              {info.userName}
            </div>
            <div>
              <strong>firstName: </strong>
              {info.firstName }
            </div>
            <div>
              <strong>lastName: </strong>
              {info.lastName}
            </div>
            <div>
              <strong>Email:</strong> {info.email}
            </div>
            <div>
              <strong>Phone: </strong>
              {info.phone}
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
              {info.bio}
            </div>
            
          </div>
        }
        {!edit && 
          <Box sx={{display:'flex', flex:1, flexDirection: 'column',alignItems: 'left', justifyContent: 'left' }}>
            <Typography variant="h5" sx={{display:'flex', alignItems:'center', justifyContent:'center'}}>Edit Information</Typography>
            <Box  sx={{display:'flex', flex:1, flexDirection: 'column',paddingY:'5px',alignItems: 'center', justifyContent: 'center' }}>
              <strong>FirstName: </strong>
              <TextField size='small'  label ={info.firstName} onChange={(e) => setFirstName(e.target.value)}/>
            </Box>

            <Box  sx={{display:'flex', flex:1, flexDirection: 'column',paddingY:'5px',alignItems: 'center', justifyContent: 'center' }}>
              <strong>LastName: </strong>
              <TextField size='small'  label ={info.lastName} onChange={(e) => setLastName(e.target.value)}/>
            </Box>

            <Box  sx={{display:'flex', flex:1, flexDirection: 'column',paddingY:'5px',alignItems: 'center', justifyContent: 'center' }}>
              <strong>Phone: </strong>
              <TextField size='small'  label ={info.phone} onChange={(e) => setPhone(e.target.value)}/>
            </Box>

            <Box  sx={{display:'flex', flex:1, flexDirection: 'column',paddingY:'5px',alignItems: 'center', justifyContent: 'center' }}>
              <strong>Bio: </strong>
              <TextField size='small'  label ={info.bio} onChange={(e) => setBio(e.target.value)}/>
            </Box>
          </Box>
        }
        {edit && <Button variant="contained" onClick={() => handleGetLoggin()} style={{ marginTop: '20px' }}>Edit</Button>}
        {!edit && <Button variant="contained" onClick={() => handleProfileUpdate()} style={{ marginTop: '20px' }}>Confirm</Button>}
      </Paper>
      </Grid>
    </Box>
  );
};

export default MyInfoScreen;