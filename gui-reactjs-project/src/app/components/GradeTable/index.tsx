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
import { useAppDispatch } from "@/redux/hook";
import { setLoading } from "@/redux/reducers/loading";

interface GradeTableProps {
  courseId: string;
}

const GradeTable = memo(({ courseId }: GradeTableProps) => {
  const dispatch = useAppDispatch();
  const [scoreData, setScoreData] = useState<any>(null);
  const [showGradeSetup, setShowGradeSetup] = useState<boolean>(false);
  const [columns, setColumns] = useState([]);
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  const [data, setData] = useState([]);

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const fetchDataForGradeManagementTable = async () => {
    try {
      setTableLoading(true);
      const response = await axiosInstance.get(`/score/columns/${courseId}`);
      if (response.data) {
        const { data } = response.data;
        setScoreData(data);
        if (data?.columns?.length) {
          console.log(data.columns);
          setColumns(
            data?.columns?.map((col: any, index: number) => ({
              title: `${capitalizeFirstLetter(col)} ${index >= 2 ? "(" + data?.scales?.[index - 2] + "%)" : ""}`,
              field: col,
              type: index >= 2 ? "numeric" : "string",
              editable: col === "fullname" ? "never" : "always"
            }))
          );
        }

        if (data?.scores?.length) {
          setData(data?.scores);
        }

        setTableLoading(false);
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
  };

  function move(src, dest, arr) {
    // Ensure src and dest are within the valid range of array indices
    if (src < 0 || src >= arr.length || dest < 0 || dest >= arr.length) {
      return arr.slice();
    }

    const newArray = [...arr];
    const removedElement = newArray.splice(src, 1)[0];
    newArray.splice(dest, 0, removedElement);

    return newArray;
  }

  const onChangeOrder = async (src, dest) => {
    if (src - 2 < 0 || dest - 2 < 0) return;
    const newOrder = move(src - 2, dest - 2, scoreData?.grade);
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.post(`/score/create-update-columns/${courseId}`, newOrder);
      dispatch(setLoading(false));
      if (response.data) {
        onSaveGradeComposition();
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
          isLoading={tableLoading}
          data={data}
          components={{
            EditField: (props) => {
              return (
                <InputSearch
                  width="100%"
                  sx={{ px: 1 }}
                  placeholder={props?.columnDef?.title}
                  type={props?.columnDef?.type == "numeric" ? "number" : "text"}
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
          onColumnDragged={onChangeOrder}
          editable={{
            onRowAdd: (newData) => {
              return new Promise((resolve, reject) => {
                const { studentId, fullname, ...scores } = newData;
                if (!studentId || Object.keys(scores).length != scoreData?.grade?.length) {
                  Swal.fire({
                    title: "Oops",
                    text: "Please enter Student ID and Scores",
                    icon: "error",
                  });
                  return reject(false);
                }
                axiosInstance
                  .post(`/score/add/by-student-code/${courseId}`, {
                    studentCode: studentId,
                    scores: scores,
                  })
                  .then((response) => {
                    setData(response.data.data)
                    resolve(response);
                  })
                  .catch((error) => {
                    reject(error);
                  });
              });
            },

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
      {showGradeSetup ? (
        <GradeManagementTable
          courseId={courseId}
          isOpen={showGradeSetup}
          onCancel={onCloseGradeSetup}
          scoreData={scoreData}
          onSave={onSaveGradeComposition}
        />
      ) : null}
    </>
  );
});

export default GradeTable;
