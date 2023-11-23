'use client'
import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);

  const handleEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setEmail(event.target.value);

    // Check input email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setIsValidEmail(isValid);
    setError('');
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    if (!isValidEmail) {
      setError('Please enter a valid email address.');
      return;
    }

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
        We sent you a mail to your email, check the verified code
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          type="text"
          label="Verified code"
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
        {/* {successMessage && (
          <Typography variant="body2" sx={{ my: 2 }} color="success">
            {successMessage}
          </Typography>
        )} */}
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Reset Password
        </Button>
      </form>
    </Container>
  );
}

export default ForgotPasswordForm;
