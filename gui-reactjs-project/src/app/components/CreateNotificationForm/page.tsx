'use client'
import React, {useState} from 'react';
import classes from './style.module.scss';
import { Button, Checkbox, Stack, TextField } from '@mui/material';
import { Create } from '@mui/icons-material';

export default function CreateNotificationForm({onHideForm}){
    const [notificationText, setNotificationText] = useState('');

    const handleTextChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
      setNotificationText(event.target.value);
    };
  
    const handleCreate = () => {
      // Handle any necessary create functionality here
      
      // Hide the form by calling the onHideForm function
      onHideForm();
    };

    return (
      <div className={classes.container}>
        <h4>This notification is used for:</h4>
        <br/>
        <Checkbox disabled checked />Notify to all students in class
        <br/><br/>
        <TextField
          id="filled-multiline-static"
          label=""
          multiline
          rows={6}
          placeholder='Your notification'
          variant="filled"
          style={{width: '100%'}}
        />
        <br/><br/>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'end' }}>
          <Button 
            variant="contained" 
            onClick={handleCreate}
            disabled={notificationText.trim() === ''}>
            Create
          </Button>
          <Button variant="outlined"  onClick={handleCreate}>Cancel</Button>
        </Stack>
      </div>
    )
}