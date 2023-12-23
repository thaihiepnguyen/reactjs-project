import { Box, Button, IconButton, Input, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { SetupTable } from "../Table/SetupTable";
import classes from "./styles.module.scss";
import SubTitle from "../text/SubTitle";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { DragIndicator, MoreHoriz } from "@mui/icons-material";
import clsx from "clsx";
import ParagraphSmall from "../text/ParagraphSmall";
import { memo, useEffect, useState } from "react";
import MaterialTable, { Column } from "material-table";
import { tableIcons } from "../TableIcon";
import InputSearch from "../input/InputSearch";
import GradeManagementTable from "../GradeManagementTable";
import Swal from "sweetalert2";
import axiosInstance from "@/app/routers/axios";

interface GradeTableProps {
  courseId: string;
}

const sampleScore = [
  {
    id: 1,
    studentId: "20127533",
    Lab1: 10,
    Lab2: 10,
    Midterm: 10,
    Final: 10,
  },
  {
    id: 2,
    studentId: "20127533",
    Lab1: 10,
    Lab2: 10,
    Midterm: 10,
    Final: 10,
  },
  {
    id: 3,
    studentId: "20127533",
    Lab1: 10,
    Lab2: 10,
    Midterm: 10,
    Final: 10,
  },
];
const GradeTable = memo(({ courseId }: GradeTableProps) => {
  const [scoreData, setScoreData] = useState<any>(null);

  const [showGradeSetup, setShowGradeSetup] = useState<boolean>(false);
  const [columns, setColumns] = useState([
    {
      title: "Student ID",
      field: "studentId",
    },
    {
      title: "Full name",
      field: "fullname",
    },
    {
      title: "Lab 1",
      field: "Lab 1",
      type: "numeric",
    },
    {
      title: "Lab 2",
      field: "Lab 2",
      type: "numeric",
    },
    {
      title: "Lab 3",
      field: "Lab 3",
      type: "numeric",
    },
    {
      title: "Midterm",
      field: "Midterm",
      type: "numeric",
    },
    {
      title: "Final",
      field: "Final",
      type: "numeric",
    },
  ]);

  const [data, setData] = useState([
    {
      studentId: "20127533",
      fullname: "Lê Đăng Khoa",
      "Lab 1": 10,
      "Lab 2": 9,
      "Lab 3": 8,
      Midterm: 7,
      Final: 6,
    },
    {
      studentId: "20127599",
      fullname: "Lê Đăng",
      "Lab 1": 6,
      "Lab 2": 9,
      "Lab 3": 4,
      Midterm: 5,
      Final: 8,
    },
  ]);

  const fetchDataForGradeManagementTable = async () => {
    try {
      const response = await axiosInstance.get(`/score/columns/${courseId}`);
      if (response.data) {
        const { data } = response.data;
        setScoreData(data);
      } else {
        Swal.fire({
          title: "Oops! Something went wrong",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Oops! Something went wrong",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    fetchDataForGradeManagementTable();
  }, [courseId]);

  const onShowGradeSetup = () => {
    setShowGradeSetup(true);
  };

  const onCloseGradeSetup = () => {
    setShowGradeSetup(false);
  };

  return (
    <>
      <IconButton className={classes.iconMore} onClick={onShowGradeSetup}>
        <MoreHoriz />
      </IconButton>

      <div className={classes.rootTable}>
        <MaterialTable
          title="Students Score"
          icons={tableIcons}
          columns={columns}
          data={data}
          components={{
            EditField: (props) => {
              console.log(props);
              return (
                <InputSearch
                  sx={{ px: 1 }}
                  placeholder={props?.columnDef?.title}
                  type={props?.columnDef?.type ? "number" : "text"}
                  value={props.value}
                  onChange={(e) => props.onChange(e.target.value)}
                  inputProps={{
                    min: 0,
                    max: 10,
                  }}
                />
              );
            },
          }}
          options={{
            exportButton: true,
            headerStyle: {
              backgroundColor: "var(--gray-10)",
            },
          }}
          cellEditable={{
            onCellEditApproved: (newValue, oldValue, rowData, columnDef) => {
              return new Promise((resolve, reject) => {
                console.log("newValue: " + newValue);
                setTimeout(resolve, 1000);
              });
            },
          }}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  setData([...data, newData]);

                  resolve(true);
                }, 1000);
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataUpdate = [...data];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  setData([...dataUpdate]);

                  resolve(true);
                }, 1000);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...data];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  setData([...dataDelete]);

                  resolve(true);
                }, 1000);
              }),
          }}
        />
      </div>
      <GradeManagementTable courseId={courseId} isOpen={showGradeSetup} onCancel={onCloseGradeSetup} scoreData={scoreData} />
    </>
  );
});

export default GradeTable;
