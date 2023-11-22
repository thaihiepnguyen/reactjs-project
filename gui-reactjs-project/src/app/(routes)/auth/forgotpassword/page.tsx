'use client'
import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    // try {
    //   const response = await axiosInstance.post(`/auth/forgot-password`, {
    //     email,
    //   });

    //   // Handle the response as needed
    //   if (response.data) {
    //     setSuccessMessage('Reset password link sent successfully. Please check your email.');
    //     setError('');
    //   }
    // } catch (error) {
    //   // Handle error
    //   console.error(error);
    //   setError(error?.response?.data?.message || 'Something went wrong. Please try again.');
    //   setSuccessMessage('');
    // }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Forgot Password
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          type="email"
          label="Email"
          variant="outlined"
          margin="normal"
          autoComplete="email"
          fullWidth
          required
          onChange={handleEmailChange}
        />
        {error && (
          <Typography variant="body2" sx={{ my: 2 }} color="error">
            {error}
          </Typography>
        )}
        {successMessage && (
          <Typography variant="body2" sx={{ my: 2 }} color="success">
            {successMessage}
          </Typography>
        )}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Reset Password
        </Button>
      </form>
    </Container>
  );
}

export default ForgotPasswordForm;
