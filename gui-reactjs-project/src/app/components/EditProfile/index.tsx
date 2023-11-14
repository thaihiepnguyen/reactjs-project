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
import UserService from "@/services/user";
import Swal from "sweetalert2";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setUser } from "@/redux/reducers/user";
import ParagraphSmall from "../text/ParagraphSmall";

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
  const { user } = useAppSelector((state) => state.userReducer);
  const dispatch = useAppDispatch();
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
    const form = new FormData();
    form.append("fullname", data.fullname);
    form.append("avatar", data.avatar);
    form.append("phone", data.phone);
    form.append("email", data.email);
    UserService.UpdateProfile(form)
      .then((res) => {
        Swal.fire({
          title: "Update profile sucessfully!",
          text: "Congratulations!",
          icon: "success",
        });
        UserService.getMe()
          .then((data) => {
            dispatch(
              setUser({
                fullname: data.fullname,
                avatar: data.avatarUrl,
                phone: data.phone,
                email: data.email,
              })
            );
          })
          .catch((e) => {
            dispatch(setUser(null));
          });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: err,
          text: "Oops!",
          icon: "error",
        });
      });
  };

  useEffect(() => {
    reset({
      fullname: user?.fullname,
      phone: user?.phone,
      email: user?.email,
      avatar: `${process.env.API_URL}\\${user?.avatar}`,
    });
  }, [user]);
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
            {user?.fullname}
          </Heading3>
          <ParagraphSmall>
            {user?.email}
          </ParagraphSmall>
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
            disabled
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
        <Button sx={{mt: 4, ml: 1}} type="submit" variant="contained" children={"Save change"} className={classes.btnSave} />
      </Grid>
    </form>
  );
};

export default EditProfile;
