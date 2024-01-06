'use client'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter();
  router.push('/auth/welcome?type=signUp');
}

// "use client";

// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   Container,
//   Typography,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   FormControl,
//   InputAdornment,
//   IconButton,
// } from "@mui/material";
// import axios from "axios";
// import Swal from "sweetalert2";
// import classes from "./styles.module.scss";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { routes } from "@/app/routers/routes";
// import Link from "next/link";
// import axiosInstance from "@/app/routers/axios";
// import { useRouter } from "next/navigation";

// function RegisterForm() {
//   const router = useRouter();
//   const [fullname, setFullName] = useState("");
//   const [userType, setUserType] = useState("student"); // Default to 'student'
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleFullNameChange = (event: { target: { value: React.SetStateAction<string> } }) => {
//     setFullName(event.target.value);
//   };

//   const handleEmailChange = (event: { target: { value: React.SetStateAction<string> } }) => {
//     setEmail(event.target.value);
//   };

//   const handlePasswordChange = (event: { target: { value: any } }) => {
//     const newPassword = event.target.value;
//     setPassword(newPassword);
//     validatePassword(newPassword);
//   };

//   const handleTogglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleUserTypeChange = (event: { target: { value: React.SetStateAction<string> } }) => {
//     setUserType(event.target.value);
//   };

//   // const checkUsernameAvailability = (value) => {
//   //   // Simulated asynchronous check for username availability
//   //   // You should replace this with actual API calls to your server
//   //   const existingUsernames = ['existinguser1', 'existinguser2']; // Example existing usernames

//   //   if (existingUsernames.includes(value)) {
//   //     setUsernameExists(true);
//   //     setError('This username is already taken. Please choose a different one.');
//   //   } else {
//   //     setUsernameExists(false);
//   //     setError('');
//   //   }
//   // };

//   const validatePassword = (value: string) => {
//     // Password validation logic
//     const regex = /^(?=.*\d)(?=.*[A-Z]).{8,}$/;
//     if (!regex.test(value)) {
//       setError("Password must be at least 8 characters, contain at least 1 number, 1 uppercase letter.");
//     } else {
//       setError("");
//     }
//   };

//   const handleSubmit = async (event: { preventDefault: () => void }) => {
//     event.preventDefault();

//     // Additional form submission logic, e.g., sending data to the server
//     try {
//       const response = await axiosInstance.post(`/auth/register`, {
//         fullname,
//         email,
//         password,
//       });

//       // Handle the response as needed
//       if (response.data.message === "User already exists") {
//         console.log("Run here");
//         // Show SweetAlert2 dialog for user already exists
//         Swal.fire({
//           title: "Error",
//           text: "User already exists. Please choose a different email.",
//           icon: "error",
//         });
//       } else {
//         // Handle other cases or success
//         Swal.fire({
//           title: "Register sucessfully!",
//           text: "Please check your email to verify account!",
//           icon: "success",
//         })
//         .then(()=>{
//           router.push(routes.login);
//         })
//       }
//       // console.log('Server response:', response.data);
//     } catch (error) {
//       // Handle error
//       console.error("Error submitting form:", error);
//     }

//     console.log("Form submitted:", { fullname, email, password, userType });
//   };

//   return (
//     <Container className="register-form" maxWidth="sm">
//       <Typography variant="h4" align="center" gutterBottom>
//         Register
//       </Typography>
//       <form onSubmit={handleSubmit}>
//         <TextField label="Full Name" variant="outlined" margin="normal" fullWidth required value={fullname} onChange={handleFullNameChange} />
//         <TextField type="email" label="Email" variant="outlined" margin="normal" autoComplete="email" fullWidth required value={email} onChange={handleEmailChange} />
//         <TextField
//           type={showPassword ? "text" : "password"}
//           label="Password"
//           autoComplete="current-password"
//           variant="outlined"
//           margin="normal"
//           fullWidth
//           required
//           value={password}
//           onChange={handlePasswordChange}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton onClick={handleTogglePasswordVisibility} edge="end">
//                   {showPassword ? <Visibility /> : <VisibilityOff />}
//                 </IconButton>
//               </InputAdornment>
//             ),
//           }}
//         />
//         {error && (
//           <Typography variant="body2" color="error">
//             {error}
//           </Typography>
//         )}

//         <FormControl component="fieldset" margin="normal" fullWidth>
//           <Typography variant="subtitle1" gutterBottom>
//             You are:
//           </Typography>
//           <RadioGroup row value={userType} onChange={handleUserTypeChange}>
//             <FormControlLabel value="student" control={<Radio />} label="Student" />
//             <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
//           </RadioGroup>
//         </FormControl>
//         <Button type="submit" variant="contained" color="primary" className="submit-button" fullWidth disabled={Boolean(error)}>
//           Register
//         </Button>
//       </form>
//       <Typography className={classes.switchText} sx={{mt: 2}} variant="body2" align="center" gutterBottom>
//         Already have an account? <Link href={routes.login}>Login</Link>
//       </Typography>
//     </Container>
//   );
// }

// export default function Register() {
//   return (
//     <>
//       {/* <span>Register Page</span> */}
//       <Container className={classes.box} maxWidth="sm">
//         <RegisterForm />
//       </Container>
//     </>
//   );
// }
