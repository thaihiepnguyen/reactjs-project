"use client";
import React, { useState, useEffect, memo } from "react";
import * as XLSX from "xlsx";
import { useTranslation } from "next-i18next";
import { Button } from "@mui/material";

const headerExcel = ['Student ID', 'Full name']

export default function DownloadStudentListButton() {
  const {t} = useTranslation();
  const handleExportToExcel = () => {
    const data = [headerExcel];
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "sheet 1");
    XLSX.writeFile(workbook, 'student_list_template.xlsx');
    }
       
  return (
    <Button
      variant="contained"
      style={{ backgroundColor: "green" }}
      onClick={handleExportToExcel}
    > 
    {t('Download Template Student List')}
    </Button>
  )
}