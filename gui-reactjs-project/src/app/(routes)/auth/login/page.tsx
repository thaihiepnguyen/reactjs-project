'use client'

import { useAppSelector } from "@/redux/hook";
import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import classes from "./styles.module.scss"
import { signIn } from "next-auth/react";

function SignUpForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const validatePassword = (value) => {
    // Password validation logic
    const regex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
    if (!regex.test(value)) {
      setError('Password must be at least 8 characters, contain one number, and one uppercase letter.');
    } else {
      setError('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Additional form submission logic
    
  };
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          type="email"
          label="Email"
          variant="outlined"
          margin="normal"
          fullWidth
          required
        />
        <TextField
          type="password"
          label="Password"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          onChange={handlePasswordChange}
        />
        {error && <Typography variant="body2" color="error">{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={Boolean(error)} 
        >
          Sign Up
        </Button>
      </form>
    </Container>
  );
}


export default function Login() {
  const {value} = useAppSelector(state => state.counterReducer)

  return (
    <>
      <span>Login page</span>
      <span>Counter: {value}</span>
      <SignUpForm />
      <Container maxWidth="sm">
        <Button 
            className={classes.loginGoogleBtn}
            type="submit"
            variant="contained"
            // color="white"
            fullWidth
            onClick={()=>signIn('google')}
            >
            Login with google
        </Button>
      </Container>
    </>
  )
}
