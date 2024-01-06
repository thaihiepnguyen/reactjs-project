'use client'
import CourseForm from "@/app/components/CourseForm";
import { useAppDispatch } from "@/redux/hook";
import { setLoading } from "@/redux/reducers/loading";
import AdminService from "@/services/adminService";
import { memo } from "react";
import Swal from "sweetalert2";

const Create = memo(() => {
    const dispatch = useAppDispatch();
    const onCreateCourse = (data: FormData) => {
        dispatch(setLoading(true));
        AdminService.createCourse(data)
        .then(() => {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Create course successfully",
            })
        })
        .catch(err => {
            Swal.fire({
                icon: "error",
                title: "Opps!",
                text: err.message,
            })
        })
        .finally(() => dispatch(setLoading(false)));
    }
    return (
        <CourseForm onSubmit={onCreateCourse}/>
    )
})

export default Create;