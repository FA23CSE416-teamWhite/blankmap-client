import * as React from 'react';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { Link } from "react-router-dom";
import { CardHeader, CardContent, Button } from '@mui/material';
import backgroundImage from './images/login-background.png';

export default function PasswordRecovery() {

    return(
        <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          height: 'calc(100vh )',
          background: `url(${backgroundImage}) center/cover no-repeat fixed`,
          padding: '20px', // Adjust padding as needed
          boxSizing: 'border-box',
        }}
      ><Grid item xs={12} sm={8} md={6} lg={4}>
            <Card variant="outlined" sx={{ minWidth: 600 ,boxShadow:3,borderRadius: 3 }}>
                <CardContent  sx={{paddingY: 5,  alignItems:  "center"}}>
                    <Box>
                        <Box sx={{ display: 'flex', flexGrow: 1, paddingX: '60px', paddingY: 2 }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.4em' }}>Password Recovery</span>
                        </Box>
                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px"}}>
                            Username
                        </Box>
                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px",marginTop:'3px',marginBottom:"8px", alignItems: 'center', justifyContent: 'center'}}>
                            <TextField  fullWidth sx={{ '& input': { padding: '10px 12px' } }} />
                        </Box>

                        <Box sx={{ display: 'flex', flexGrow: 1, paddingX: '60px', paddingY: 2, alignItems: 'center', justifyContent: 'center' }}>
                            <Button variant="contained" to="/" sx={{ width: '100%', backgroundColor: 'black', color: 'white', textAlign: 'center', display: 'flex', alignItems: 'center', height: '45px' }}>
                                <Link to="/home" style={{ textDecoration: 'none', color: 'inherit', width: '100%', display: 'block', textTransform: 'none',fontSize: '1rem'  }}>Retrieve</Link>
                            </Button>
                        </Box>
                        <Box sx={{display:'flex', flexGrow: 1 ,paddingX:"60px",paddingY: 1,alignItems: 'center', justifyContent: 'center'}}> 
                       
                        <Link to="/login">Back to login</Link>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
    );
}