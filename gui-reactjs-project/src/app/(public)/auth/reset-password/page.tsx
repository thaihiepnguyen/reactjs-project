"use client";

import { Button, Grid } from "@mui/material";
import classes from "./styles.module.scss";
import Heading3 from "@/app/components/text/Heading3";
import ParagraphSmall from "@/app/components/text/ParagraphSmall";
import { useRouter, useSearchParams } from "next/navigation";
import Inputs from "@/app/components/input/InputTextfield";
import { useMemo } from "react";
import * as yup from "yup";
import { VALIDATION } from "@/app/components/EditProfile";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch } from "@/redux/hook";
import { setLoading } from "@/redux/reducers/loading";
import UserService from "@/services/user";
import Swal from "sweetalert2";
import { routes } from "@/app/routers/routes";

interface DataForm {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const dispatch = useAppDispatch();
  const router = useRouter();

  const schema = useMemo(() => {
    return yup.object().shape({
      password: yup.string()
        .matches(VALIDATION.password, { message: 'Password must be at least 8 characters, contain at least 1 number, 1 uppercase letter', excludeEmptyString: true })
        .required("Please enter your password"),
      confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Confirm password not match')
        .required("Please enter confirmation password"),
    })
  }, [])

  const { register, handleSubmit, formState: { errors } } = useForm<DataForm>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = (data: DataForm) => {
    dispatch(setLoading(true));
    const form = new FormData();
    form.append('password', data.password);
    form.append('token', `${token}`);
    UserService.resetPassword(form)
    .then((res) => {
      Swal.fire({
        title: 'Success!',
        text: 'Change password successfully',
        icon:'success',
      })
      router.push(routes.login);
    })
    .catch(err => {
      Swal.fire({
        title: 'Oops!',
        text: 'Token has expired',
        icon:'error',
      })
    })
    .finally(() => dispatch(setLoading(false))); 
  }
  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit(onSubmit)} name="forgot-password" noValidate autoComplete="off">
        <Grid className={classes.body}>
          <Heading3>Reset Password</Heading3>
          <ParagraphSmall sx={{ paddingTop: "16px", paddingBottom: "24px" }}>Create a new password for {email}</ParagraphSmall>
          <Grid container columnSpacing={1} rowSpacing={2} className={classes.customMargin}>
            <Grid item xs={12} sm={12}>
              <Inputs
                title="Password"
                name="password"
                type="password"
                placeholder="Enter new password"
                inputRef={register("password")}
                errorMessage={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Inputs
                title="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                inputRef={register("confirmPassword")}
                errorMessage={errors.confirmPassword?.message}
              />
            </Grid>
            <Button sx={{ mt: 4, ml: 1 }} type="submit" variant="contained" children={"Change Password"} className={classes.btnSave} />
          </Grid>
        </Grid>
      </form>
    </div>
  );
};
export default ResetPassword;

// import React, { useState } from 'react';
// import { Container, Typography, TextField, Button } from '@mui/material';
// import axiosInstance from '@/app/routers/axios';

// function ResetPasswordForm() {
//     const [email, setEmail] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');
//     const [isValidPassword, setIsValidPassword] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const handleEmailChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
//       setEmail(event.target.value);
//     };

//     const handleNewPasswordChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
//       setNewPassword(event.target.value);
//       setIsValidPassword(true);
//       setError('');
//     };

//     const handleConfirmPasswordChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
//       setConfirmPassword(event.target.value);
//       setIsValidPassword(true);
//       setError('');
//     };

//     const handleSubmit = async (event: { preventDefault: () => void; }) => {
//       event.preventDefault();

//       if (!isValidPassword || newPassword !== confirmPassword) {
//         setError('Passwords do not match or are invalid.');
//         return;
//       }

//       setLoading(true);

//       try {
//         const response = await axiosInstance.post(`/auth/reset-password`, {
//           email,
//           newPassword,
//         });
//         console.log(response.data);
//         // if (response.data.message === 'password reset successful') {
//         //   setLoading(false);
//         //   setSuccessMessage('Password reset successfully.');
//         //   setError('');
//         //   // Redirect or handle success as needed
//         // } else {
//         //   setError(response.data.message);
//         //   setSuccessMessage('');
//         // }
//       } catch (error) {
//         console.error(error);
//         setError(error?.response?.data?.message || 'Something went wrong. Please try again.');
//         setSuccessMessage('');
//       }
//     };

//     return (
//       <Container maxWidth="sm">
//         <Typography variant="h4" align="center" gutterBottom>
//           Reset Password
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <TextField
//             type="email"
//             label="Email"
//             variant="outlined"
//             margin="normal"
//             fullWidth
//             required
//             onChange={handleEmailChange}
//           />
//           <TextField
//             type="password"
//             label="New Password"
//             variant="outlined"
//             margin="normal"
//             fullWidth
//             required
//             onChange={handleNewPasswordChange}
//           />
//           <TextField
//             type="password"
//             label="Confirm New Password"
//             variant="outlined"
//             margin="normal"
//             fullWidth
//             required
//             onChange={handleConfirmPasswordChange}
//           />
//           {error && (
//             <Typography variant="body2" sx={{ my: 2 }} color="error">
//               {error}
//             </Typography>
//           )}
//           <Button type="submit" variant="contained" color="primary" fullWidth>
//             Reset Password
//           </Button>
//           {successMessage && (
//             <Typography variant="body2" sx={{ my: 2 }} color="#4caf50">
//               {successMessage}
//             </Typography>
//           )}
//         </form>
//       </Container>
//     );
//   }

//   export default ResetPasswordForm;
