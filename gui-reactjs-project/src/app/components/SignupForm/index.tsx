'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { memo, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { GithubIcon, GoogleIcon } from '@/assets';
import Inputs from '../input/InputTextfield';
import { Typography, Grid, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import classes from './styles.module.scss';
import axiosInstance from "@/app/routers/axios";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { routes } from "@/app/routers/routes";
import { signIn } from "next-auth/react";


interface SignupFormProps {}

interface ISignupFormData {
  fullname: string;
  email: string;
  password: string;
  role: string;
}
const SignupForm = memo((props: SignupFormProps) => {
  const router = useRouter();

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        fullname: Yup.string().required('Please enter your name'),
        email: Yup.string().email('Please enter a valid email.').required('Please enter your email'),
        password: Yup.string()
          .required('Please enter your password')
          .matches(/^(?=.*\d)(?=.*[A-Z]).{8,}$/, 'Password must be at least 8 characters, contain at least 1 number, 1 uppercase letter'),
        role: Yup.string(),
      }),
    []
  );

  const {
    register,
    formState: { errors, isValid },
    getValues,
    handleSubmit,
  } = useForm<ISignupFormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ISignupFormData) => {
    try {
      const response = await axiosInstance.post(`/auth/register`, {
        fullname: data.fullname,
        email: data.email,
        password: data.password,
        role: data.role
      });

      // Handle the response as needed
      if (response.data.message === 'User already exists') {
        console.log('Run here');
        // Show SweetAlert2 dialog for user already exists
        Swal.fire({
          title: 'Error',
          text: 'User already exists. Please choose a different email.',
          icon: 'error',
        });
      } else {
        // Handle other cases or success
        Swal.fire({
          title: 'Register sucessfully!',
          text: 'Please check your email to verify account!',
          icon: 'success',
        }).then(() => {
          router.push(routes.login);
        });
      }
      // console.log('Server response:', response.data);
    } catch (error) {
      // Handle error
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className='form-container sign-up-container'>
      <form className={classes.registerForm} onSubmit={handleSubmit(onSubmit)}>
        <h1>Create Account</h1>
        <div className={classes.socialContainer}>
          <div className={classes.socialButton} onClick={()=>signIn('google', {callbackUrl: '/?redirect=true'})}>
            <GoogleIcon />
          </div>
          <div className={classes.socialButton}  onClick={()=>signIn('github', {callbackUrl: '/?redirect=true'})}>
            <GithubIcon />
          </div>
        </div>
        <span>or use your email for registration</span>
        <Grid container columnSpacing={1} rowSpacing={2} className={classes.customMargin}>
          <Grid item xs={12} sm={12}>
            <Inputs
              title='Full name'
              name='fullname'
              type='text'
              placeholder='Enter your name'
              inputRef={register('fullname')}
              errorMessage={errors.fullname?.message}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Inputs
              title='Email'
              name='email'
              type='text'
              placeholder='Enter your email'
              inputRef={register('email')}
              errorMessage={errors.email?.message}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Inputs
              title='Password'
              name='password'
              type='password'
              placeholder='Enter your password'
              inputRef={register('password')}
              errorMessage={errors.password?.message}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Typography variant='subtitle1' gutterBottom>
              You are:
            </Typography>
            <RadioGroup row>
              <FormControlLabel value='student' control={<Radio {...register('role')} />} label='Student' />
              <FormControlLabel value='teacher' control={<Radio {...register('role')} />} label='Teacher' />
            </RadioGroup>
          </Grid>
        </Grid>

        <button className={classes.signupButton}>Sign Up</button>
      </form>
    </div>
  );
});

export default SignupForm;
