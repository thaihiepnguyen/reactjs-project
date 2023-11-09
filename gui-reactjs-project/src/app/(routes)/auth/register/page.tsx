"use client";
// SignUpForm.jsx

import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
// import './SignUpFormStyles.scss';
import { Helmet } from 'react-helmet';

function RegisterForm() {
  const [fullname, setFullName] = useState('');
  const [userType, setUserType] = useState('student'); // Default to 'student'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  // const checkUsernameAvailability = (value) => {
  //   // Simulated asynchronous check for username availability
  //   // You should replace this with actual API calls to your server
  //   const existingUsernames = ['existinguser1', 'existinguser2']; // Example existing usernames

  //   if (existingUsernames.includes(value)) {
  //     setUsernameExists(true);
  //     setError('This username is already taken. Please choose a different one.');
  //   } else {
  //     setUsernameExists(false);
  //     setError('');
  //   }
  // };

  const validatePassword = (value) => {
    // Password validation logic
    const regex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
    if (!regex.test(value)) {
      setError('Password must be at least 8 characters, contain at least 1 number, 1 uppercase letter.');
    } else {
      setError('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Additional form submission logic, e.g., sending data to the server
    console.log('Form submitted:', { fullname, email, password, userType });
  };

  return (
    <Container className="register-form" maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          value={fullname}
          onChange={handleFullNameChange}
        />
        <TextField
          type="email"
          label="Email"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          value={email}
          onChange={handleEmailChange}
        />
        <TextField
          type="password"
          label="Password"
          variant="outlined"
          margin="normal"
          fullWidth
          required
          value={password}
          onChange={handlePasswordChange}
        />
        {error && <Typography variant="body2" color="error">{error}</Typography>}
        
        <FormControl component="fieldset" margin="normal" fullWidth>
          <Typography variant="subtitle1" gutterBottom>
            You are:
          </Typography>
          <RadioGroup row value={userType} onChange={handleUserTypeChange}>
            <FormControlLabel value="student" control={<Radio />} label="Student" />
            <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
          </RadioGroup>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="submit-button"
          fullWidth
          disabled={Boolean(error)}
        >
          Register
        </Button>
      </form>
    </Container>
  );
}

export default function Register() {
  return (
    <>
      <Helmet>
        <title>Register</title>
      </Helmet>
      {/* <span>Register Page</span> */}
      <RegisterForm />
    </>
  );
}
