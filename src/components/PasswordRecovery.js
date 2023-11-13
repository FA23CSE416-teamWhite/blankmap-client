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

export default function PasswordRecovery() {

    return(
        <Grid container justifyContent="flex-start" alignItems="flex-start" sx={{height:"100%", width:"min-content", margin:"auto",  padding:"50px"}}>
        <Grid item xs={1} spacing={1.5}>
            <Card variant="outlined" sx={{ minWidth: 600 }}>
                <CardHeader color="blue"
                            title={<Typography noWrap sx={{textAlign: "center", fontWeight: "bold",  overflow: "hidden", textOverflow: "ellipsis"}}>LOGIN</Typography>}
                            sx = {{bgcolor:"CornflowerBlue"}}
                            />
                <CardContent  sx={{paddingY: 5,  alignItems:  "center"}}>
                    <Box>
                        <Box sx={{display:'flex', flexGrow: 1 , paddingX:"60px", paddingY:1, alignItems: 'center', justifyContent: 'center'}}>
                            <AccountCircle sx = {{padding:1}}/>
                            <TextField label = "Username" fullWidth/>
                        </Box>

                        <Box sx = {{mt:3, mb:4,display: 'flex', }}>
                            <Button variant="contained" to="/" sx={{ml:"15%"}}>Back to Login</Button>
                            <Button variant="contained" to="/" sx={{ml:"25%"}}>Retrieve</Button>
                        </Box>    
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
    );
}