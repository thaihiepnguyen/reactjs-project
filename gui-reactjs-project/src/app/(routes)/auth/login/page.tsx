'use client'

import { useAppSelector } from "@/redux/hook";
import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import classes from "./styles.module.scss"
import { signIn } from "next-auth/react";
import Link from 'next/link';
import { routes } from "@/app/routers/routes";
import { Helmet } from "react-helmet";
import axios from "axios";

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setEmail(event.target.value);
  }
   
  const handlePasswordChange = (event: { target: { value: any; }; }) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const validatePassword = (value: string) => {
    // Password validation logic
    const regex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
    if (!regex.test(value)) {
      setError('Password must be at least 8 characters, contain one number, and one uppercase letter.');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    // Additional form submission logic
    // try {
    //   const response = await axios.post('http://localhost:3001/auth/login', {
    //     email 
    //   });

    //   // Handle the response as needed
    //   if (response.data) {
    //     console.log('Exist account: ', response.data);
    //   }
    // } catch (error) {
    //   // Handle error
    //   console.error('Error submitting form:', error);
    // }
    
    console.log('Form submitted:', {email, password});
  };
  
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          type="email"
          label="Email"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          onChange={handleEmailChange}
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
          Login
        </Button>
      </form>
    </Container>
  );
}


export default function Login() {
  const {value} = useAppSelector(state => state.counterReducer)

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <span>Login page</span>
      <span>Counter: {value}</span>
      <LoginForm />
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
        <Typography className={classes.switchText}variant="body2" align="center" gutterBottom>
          Don't have an account?{' '}
          <Link href={routes.register} >
            Register
          </Link>
        </Typography>
      </Container>
    </>
  )
}
