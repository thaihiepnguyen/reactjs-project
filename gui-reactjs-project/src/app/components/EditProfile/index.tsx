import { Button, Grid, useMediaQuery, useTheme } from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import classes from "./styles.module.scss";
import { CameraAlt } from "@mui/icons-material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import UploadImage from "../UploadImage";
import Heading3 from "../text/Heading3";
import Inputs from "../input/InputTextfield";

export const VALIDATION = {
  phone: /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/,
};

export interface UserFormData {
  avatar: File | string;
  fullname: string;
  email: string;
  phone: string;
}

const EditProfile = () => {
  const schema = useMemo(() => {
    return yup.object().shape({
      avatar: yup.mixed(),
      fullname: yup.string().required("Fullname is required"),
      email: yup.string().email("Please input corect email").required("Email is required"),
      phone: yup.string().matches(VALIDATION.phone, { message: "Please input valid phone number", excludeEmptyString: true }),
    });
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<UserFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: UserFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <Grid className={classes.rowInfo}>
        <div className={classes.personalImage}>
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <UploadImage
                file={field.value}
                errorMessage={errors.avatar?.message}
                onChange={(value) => field.onChange(value)}
                className={classes.avatar}
              />
            )}
          />
          <label htmlFor="upload" className={classes.uploadAvatar}>
            <CameraAlt />
          </label>
        </div>
        <div className={classes.personalInfo}>
          <Heading3 $colorName="--eerie-black" className={classes.name}>
            Lê Đăng Khoa
          </Heading3>
        </div>
      </Grid>
      <Grid container columnSpacing={1} rowSpacing={3} className={classes.customMargin}>
        <Grid item xs={12} sm={12}>
          <Inputs
            title="Full name"
            name="fullname"
            type="text"
            placeholder="Enter your name"
            inputRef={register("fullname")}
            errorMessage={errors.fullname?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Inputs
            title="Email"
            name="email"
            type="text"
            placeholder="Enter your email"
            inputRef={register("email")}
            errorMessage={errors.email?.message}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Inputs
            title="Phone"
            name="phone"
            type="text"
            placeholder="Enter your phone"
            inputRef={register("phone")}
            errorMessage={errors.phone?.message}
          />
        </Grid>
        <Button type='submit' variant="contained" children={"Save change"} className={classes.btnSave}/> 
      </Grid>
    </form>
  );
};

export default EditProfile;
