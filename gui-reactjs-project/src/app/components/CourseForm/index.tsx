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
import { VALIDATION } from "../EditProfile";
import { Course } from "@/models/course";

export interface CourseFormData {
  name: string;
  description: string;
  class_code: string;
}

interface Props {
  itemEdit?: Course;
  onSubmit: (data: FormData) => void;
}

const CourseForm = memo(({ itemEdit, onSubmit }: Props) => {
  const router = useRouter();
  const schema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required("Course name is required."),
      description: yup.string().required("Description is required."),
      class_code: yup.string(),
      role: yup.object().required("Admin type is required."),
      isActive: yup.boolean(),
    });
  }, [itemEdit]);

  // const dispatch = useDispatch();
  // const [countries, setCountries] = useState<OptionItem[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CourseFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      isActive: true,
    },
  });

  const handleBack = () => {
    router.push("/admin/course");
  };

  const _onSubmit = (data: CourseFormData) => {
    const form = new FormData();
    form.append('name', data.name)
    form.append('description', data.description)
    form.append('class_code', data.class_code)
    onSubmit(form)
  };

  // useEffect(() => {
  //   if (itemEdit) {
  //     reset({
  //       name: itemEdit.name || "",
  //       descripiton: itemEdit.description || "",
  //       class_code: itemEdit.class_code || ""
  //     });
  //   }
  // }, [reset, itemEdit]);

  return (
    <div className={classes.container}>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Box display="flex" alignContent="center">
          <Button variant="contained" color="primary" onClick={handleBack} startIcon={<ArrowBackOutlined />}>
            Back
          </Button>
        </Box>
      </Box>
      <form autoComplete="off" noValidate onSubmit={handleSubmit(_onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardContent>
                <Typography component="h2" variant="h6" align="left" sx={{ marginBottom: "2rem" }}>
                   Course 
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Inputs title="Course Name" name="name" type="text" inputRef={register("name")} errorMessage={errors.name?.message} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs title="Description" name="description" type="text" inputRef={register("description")} errorMessage={errors.description?.message} />
                  </Grid>    
                  <Grid item xs={12} sm={6}>
                    <Inputs title="Class Code" name="class_code" type="text" inputRef={register("class_code")} errorMessage={errors.description?.message} />
                  </Grid>                 
                </Grid>
                <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                  <Button variant="contained" color="primary" type="submit" startIcon={<Save />} >
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

export default CourseForm;
