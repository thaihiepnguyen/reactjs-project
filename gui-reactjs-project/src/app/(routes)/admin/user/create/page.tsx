'use client'
import UserForm from "@/app/components/UserForm";
import { memo } from "react";

const Create = memo(() => {
    return (
        <UserForm onSubmit={(data: FormData) => {
            console.log(data);
        }}/>
    )
})

export default Create;