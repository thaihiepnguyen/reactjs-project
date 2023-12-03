"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import Inputs from "@/app/components/input/InputTextfield";
import { memo, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { OptionItem, adminTypes, EAdminType } from "@/models/general";
import { User } from "@/models/user";
import InputSelect from "../input/InputsSelect";
import UploadImage from "../UploadImage";
import { useRouter } from "next/navigation";
import classes from "./styles.module.scss"

export interface UserFormData {
  avatar: File | string;
  fullname: string;
  email: string;
  password: string;
  role: OptionItem;
  isActive: boolean;
}

interface Props {
  itemEdit?: User;
  onSubmit: (data: FormData) => void;
}

const UserForm = memo(({ itemEdit, onSubmit }: Props) => {
  const router = useRouter();
  const schema = useMemo(() => {
    return yup.object().shape({
      avatar: yup.mixed(),
      fullname: yup.string().required("Full name is required."),
      email: yup.string().email("Please enter a valid email adress").required("Email is required."),
      password: itemEdit
        ? yup.string()
        : yup
            .string()
            .matches(/^(?=.*\d)(?=.*[A-Z]).{8,}$/, {
              message: "Password must contains at least 8 characters, including at least one letter and one number and a special character.",
              excludeEmptyString: true,
            })
            .required("Password is required."),
      role: yup.object().required("Admin type is required."),
      isActive: yup.boolean(),
    });
  }, [itemEdit]);

  const dispatch = useDispatch();
  const [countries, setCountries] = useState<OptionItem[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<UserFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      isActive: true,
    },
  });

  const handleBack = () => {
    router.push("/admin/user");
  };

  const _onSubmit = (data: UserFormData) => {
    console.log(data);
    const form = new FormData()
    // form.append('firstName', data.firstName)
    // form.append('lastName', data.lastName)
    // form.append('email', data.email)
    // form.append('countryId', `${data.countryId.id}`)
    // form.append('isNotify', `${data.isNotify}`)
    // form.append('company', data.company)
    // form.append('phone', data.phone)
    // if(!itemEdit || itemEdit?.adminTypeId !== EAdminType.SUPER_ADMIN) {
    //   form.append('adminTypeId', `${data.adminTypeId.id}`)
    //   form.append('verified', `${data.verified}`)
    // }
    // if (!itemEdit) form.append('password', data.password)
    // if (typeof data.avatar === 'object') form.append('avatar', data.avatar)
    onSubmit(form)
  };

  useEffect(() => {
    if (itemEdit) {
      reset({
        avatar: itemEdit.avatarUrl,
        fullname: itemEdit.fullname || "",
        email: itemEdit.email || "",
        password: itemEdit.password || "",
        role: itemEdit.role ? { id: itemEdit.role.id, name: itemEdit.role.name } : undefined,
        isActive: itemEdit.isActive,
      });
    }
  }, [reset, itemEdit]);

  return (
    <div className={classes.container}>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          {itemEdit ? "Edit user" : "Create user"}
        </Typography>
        <Box display="flex" alignContent="center">
          <Button variant="contained" color="primary" onClick={handleBack} startIcon={<ArrowBackOutlined />}>
            Back
          </Button>
        </Box>
      </Box>
      <form autoComplete="off" noValidate onSubmit={handleSubmit(_onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <Box sx={{ my: 10, display: "flex", alignItems: "center", flexDirection: "column" }}>
                <Controller
                  name="avatar"
                  control={control}
                  render={({ field }) => (
                    <UploadImage square file={field.value} errorMessage={errors.avatar?.message} onChange={(value) => field.onChange(value)} />
                  )}
                />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardContent>
                <Typography component="h2" variant="h6" align="left" sx={{ marginBottom: "2rem" }}>
                  User
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Inputs title="Full Name" name="fullname" type="text" inputRef={register("fullname")} errorMessage={errors.fullname?.message} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs title="Email" name="email" type="text" inputRef={register("email")} errorMessage={errors.email?.message} />
                  </Grid>
                  {!itemEdit && (
                    <Grid item xs={12} sm={6}>
                      <Inputs
                        title="Password"
                        name="password"
                        type="password"
                        showEyes
                        inputRef={register("password")}
                        errorMessage={errors.password?.message}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="User Type"
                      name="role"
                      control={control}
                      selectProps={{
                        isDisabled: itemEdit?.role?.id === EAdminType.ADMIN,
                        menuPosition: "fixed",
                        options: adminTypes,
                        placeholder: "Select user type",
                      }}
                      errorMessage={(errors.role as any)?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControlLabel
                      control={<Controller name="isActive" control={control} render={({ field }) => <Checkbox checked={field.value} {...field} />} />}
                      label="Verified user"
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="contained" color="primary" type="submit" startIcon={<Save />}>
                    Save
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </div>
  );
});

export default UserForm;
