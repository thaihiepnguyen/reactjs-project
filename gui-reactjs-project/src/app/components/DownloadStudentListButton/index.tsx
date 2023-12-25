"use client";
import React, { useState, useEffect, memo } from "react";
import CustomBtn, { BtnType } from "../buttons/Button";
import * as XLSX from "xlsx";

const headerExcel = ['Student ID', 'Full name']

export default function DownloadStudentListButton() {
  const handleExportToExcel = () => {
    const data = [headerExcel];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "sheet 1");

    XLSX.writeFile(workbook, 'student_list_template.xlsx');
    }
       
  return (
    <CustomBtn
        sx={{ mt: "16px !important" }}
        btnType={BtnType.Primary}
        onClick={handleExportToExcel}
    >
        Download Template Student List
    </CustomBtn>
  )
}