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

const GradeTable = memo(({ courseId }: GradeTableProps) => {
  const [scoreData, setScoreData] = useState<any>(null);
  const [showGradeSetup, setShowGradeSetup] = useState<boolean>(false);
  const [columns, setColumns] = useState([]);

  const [data, setData] = useState([]);

  const fetchDataForGradeManagementTable = async () => {
    try {
      const response = await axiosInstance.get(`/score/columns/${courseId}`);
      if (response.data) {
        const { data } = response.data;
        setScoreData(data);
        if (data?.columns?.length) {
          setColumns(data?.columns?.map((col:any, index: number) => ({
            title: `${col} (${index >= 2 ? data?.scales?.[index-2] + "%"  : ""})`,
            field: col,
            type: index >= 2 ? "numeric" : "string",
          })))
        }

        if (data?.rows?.length) {
         
          setColumns(data?.columns?.map((col:any, index: number) => ({
            title: `${col} ${index >= 2 ? "(" + data?.scales?.[index-2] + "%)"  : ""}`,
            field: col,
            type: index >= 2 ? "numeric" : "string",
          })))
        }

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

  const onSaveGradeComposition = async () => {
    await fetchDataForGradeManagementTable();
  }
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
              return (
                <InputSearch
                  width="100%"
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
      {showGradeSetup ? <GradeManagementTable courseId={courseId} isOpen={showGradeSetup} onCancel={onCloseGradeSetup} scoreData={scoreData} onSave={onSaveGradeComposition} /> : null}
      
    </>
  );
});

export default GradeTable;
