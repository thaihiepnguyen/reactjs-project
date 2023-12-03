'use client'
import UserForm from "@/app/components/UserForm";
import { useAppDispatch } from "@/redux/hook";
import { setLoading } from "@/redux/reducers/loading";
import AdminService from "@/services/adminService";
import { memo } from "react";
import Swal from "sweetalert2";

const Create = memo(() => {
    const dispatch = useAppDispatch();
    const onCreateUser = (data: FormData) => {
        dispatch(setLoading(true));
        AdminService.createUser(data)
        .then(() => {
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Create user successfully",
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
        <UserForm onSubmit={onCreateUser}/>
    )
})

export default Create;