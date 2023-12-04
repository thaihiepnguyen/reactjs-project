'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { memo, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { GithubIcon, GoogleIcon } from '@/assets';
import Inputs from '../input/InputTextfield';
import { Typography, Grid, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import classes from './styles.module.scss';
import Link from 'next/link';
import { routes } from '@/app/routers/routes';
import axiosInstance from "@/app/routers/axios";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";
import Swal from "sweetalert2";
import { setUser } from "@/redux/reducers/user";
import { signIn } from "next-auth/react";
import { setLoading } from '@/redux/reducers/loading';

interface LoginFormProps {}

interface ILoginFormData {
  fullname: string;
  email: string;
  password: string;
  role: string;
}
const LoginForm = memo((props: LoginFormProps) => {
  const router = useRouter()
  const dispatch = useAppDispatch();

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        email: Yup.string().email('Please enter a valid email.').required('Please enter your email'),
        password: Yup.string()
          .required('Please enter your password')
          .matches(/^(?=.*\d)(?=.*[A-Z]).{8,}$/, 'Password must be at least 8 characters, contain at least 1 number, 1 uppercase letter'),
      }),
    []
  );

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ILoginFormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ILoginFormData) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.post(`/auth/login`, {
        email: data.email,
        password: data.password,
      });
      // Handle the response as needed
      if (response.data) {
        dispatch(setUser(response.data.data.user));
        router.replace('/home');
        Swal.fire({
          title: 'Login sucessfully!',
          text: 'Congratulations!',
          icon: 'success',
        })
      }
    } catch (error) {
      // Handle error
      console.log(error);
      Swal.fire({
        title: 'Oops!',
        text: error?.response?.data?.message,
        icon: 'error',
      });
    }
    dispatch(setLoading(false));

  };
  return (
    <div className='form-container login-container'>
      <form className={classes.registerForm} onSubmit={handleSubmit(onSubmit)}>
        <h1>Sign in</h1>
        <div className={classes.socialContainer}>
          <div className={classes.socialButton} onClick={()=>signIn('google', {callbackUrl: '/?redirect=true'})}>
            <GoogleIcon />
          </div>
          <div className={classes.socialButton}  onClick={()=>signIn('github', {callbackUrl: '/?redirect=true'})}>
            <GithubIcon />
          </div>
        </div>
        <span>or use your account</span>
        <Grid container columnSpacing={1} rowSpacing={2} className={classes.customMargin}>
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
            <Typography sx={{ mb: 2 }} variant='body2' align='right' gutterBottom>
              <Link href={routes.forgotpassword} color='primary'>
                Forgot Password?
              </Link>
            </Typography>
          </Grid>
        </Grid>

        <button className={classes.signupButton}>Sign In</button>
      </form>
    </div>
  );
});

export default LoginForm;
