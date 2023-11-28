'use client';
import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Tabs,
  Tab} from "@mui/material";
import axiosInstance from "@/app/routers/axios";
import Swal from "sweetalert2";

export default function MyNextJsExcelSheet() {
  const [items, setItems] = useState([]);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showManualMapping, setShowManualMapping] = useState(false);
  const [manualMappingData, setManualMappingData] = useState([]);
  const [newStudentId, setNewStudentId] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [showSaveButtonMappingTable, setShowSaveButtonMappingTable] = useState(false);

  const readExcel = (file: Blob) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        
        // Check if the file contains exactly 2 columns (Student ID and Email)
        if (data.length > 0 && data[0].length === 2) {
          setItems(data);
          setShowSaveButton(true); // Show the Save button after file import
          setErrorMessage(""); // Clear error message if present
          resolve(data);
        } else {
          setItems([]);
          setShowSaveButton(false);
          setErrorMessage("The file format is incorrect. It should contain exactly two columns: Student ID and Email.");
        }
      };
      
      
      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      setItems(d);
      setShowSaveButton(true);
    });
  };

  const handleSaveData = async () => {
    // console.log(items); // an array objects
    // items[0] = [20127500, 20127500@gmail.com]
    // items[0][0] = 20127500
    
    const transformedItems = items.map(([studentId, email]) => ({ studentId, email }));
    // console.log(transformedItems[0].email);
    try {
      const response = await axiosInstance.post(`/admin/account/mappingExcel`, transformedItems );
      // console.log('Data saved:', response.data);
      Swal.fire({
        title: "Save successfully!",
        text: response.data,
        icon: "success",
      })
    } catch (error) {
      console.error('Error saving data:', error);
      // Handle error scenarios accordingly
      Swal.fire({
        title: "Error",
        text: "Something went wrong in process",
        icon: "error",
      })
    }

  }

  const handleManualMapping = () => {
    setShowManualMapping(!showManualMapping);
    setManualMappingData([]); // Clear any previous manual mapping data
  };

  const handleManualSave = async () => {
    // console.log(manualMappingData);
    // manualMappingData is an array
    // manualMappingData[0].email = email of the 1st student
    // manualMappingData[0].studentId = id of the 1st student

    try {
      const response = await axiosInstance.post(`/admin/account/mapping`, manualMappingData );
      // console.log('Data saved:', response.data);
      Swal.fire({
        title: "Save successfully!",
        text: response.data,
        icon: "success",
      })
    } catch (error) {
      console.error('Error saving data:', error);
      // Handle error scenarios accordingly
      Swal.fire({
        title: "Error",
        text: "Something went wrong in process",
        icon: "error",
      })
    }

    setShowManualMapping(false); // Hide the manual mapping table after saving
  };

  const handleManualInputChange = (index: string | number, column: string, value: any) => {
    const updatedManualData = [...manualMappingData];
    updatedManualData[index] = { ...updatedManualData[index], [column]: value };
    setManualMappingData(updatedManualData);
  };

  const handlePushToTable = () => {
    setShowSaveButtonMappingTable(true);
    if (newStudentId.trim() !== "" && newEmail.trim() !== "") {
      setManualMappingData([
        ...manualMappingData,
        { studentId: newStudentId.trim(), email: newEmail.trim() },
      ]);
      setNewStudentId("");
      setNewEmail("");
    }
  };

  const handleTabChange = (event: any, newValue: React.SetStateAction<number>) => {
    setSelectedTab(newValue);
    setErrorMessage(""); // Clear error message when switching tabs
  };

  return (
    <div>
       <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Import Excel" />
        <Tab label="Manual Mapping" />
      </Tabs>
      {selectedTab === 0 && (
        <>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              readExcel(file);
            }} 
            style={{
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: '#f9f9f9',
              color: '#555',
              transition: 'border-color 0.3s ease-in-out',
              width: 'auto', // Set the width as needed
            }}
          />
          <br /><br /><br />

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <div style={{ display: 'flex', gap: '1rem' }}>
            {/* If admin chooses import excel file */}
            {items.length > 0 && (
                <TableContainer component={Paper}>
                  <Table aria-label="Excel Data Table">
                    <TableHead>
                      <TableCell>Student ID</TableCell>
                      <TableCell>Email</TableCell>
                    </TableHead>
                    <TableBody>
                      {items.map((row, index) => (
                        <TableRow key={index}>
                          {Object.values(row).map((value, i) => (
                            <TableCell key={i}>{value}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {showSaveButton && (
              <Button variant="contained" color="primary" onClick={handleSaveData} style={{width: '10rem', height: '3rem'}}>
                Save Data
              </Button>
              )}
            </div>
          </> 
        )}
      
      {selectedTab === 1 && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}> 
            <TextField
              label="Student ID"
              value={newStudentId}
              onChange={(e) => setNewStudentId(e.target.value)}
            />
            <TextField
              label="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handlePushToTable}>
              Push to Table
            </Button>
          </div>
          
          {/* Manual Mapping Table */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <TableContainer component={Paper}>
              <Table aria-label="Manual Mapping Table">
                <TableHead>
                  <TableRow>
                    <TableCell>Student ID</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {manualMappingData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          value={row?.studentId || ""}
                          onChange={(e) => handleManualInputChange(index, 'studentId', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={row?.email || ""}
                          onChange={(e) => handleManualInputChange(index, 'email', e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {showSaveButtonMappingTable && (
              <Button variant="contained" color="primary" onClick={handleManualSave} style={{ marginTop: '10px' }}>
                Save Data
              </Button>
              )}
            </div>
        </>
      )}
    </div>
  );
}
