import { Box, Input, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { SetupTable } from "../Table/SetupTable";
import classes from "./styles.module.scss";
import SubTitle from "../text/SubTitle";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { DragIndicator } from "@mui/icons-material";
import clsx from "clsx";
import ParagraphSmall from "../text/ParagraphSmall";
import { useState } from "react";
import MaterialTable, { Column } from "material-table";
import { tableIcons } from "../TableIcon";
import InputSearch from "../input/InputSearch";

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
const GradeTable = () => {
  // const onDragEnd = ({ destination, source }: DropResult) => {
  //   console.log(destination, source);
  // };

  // return (
  //   <SetupTable className={classes.desktopTable}>
  //     <Table>
  //       <TableHead>
  //         <TableRow>
  //           <TableCell width="40"></TableCell>
  //           <TableCell width="150">
  //             <SubTitle>Student ID</SubTitle>
  //           </TableCell>
  //           <TableCell width="200">
  //             <SubTitle>Student Name</SubTitle>
  //           </TableCell>
  //           <TableCell>
  //             <SubTitle>Lab1</SubTitle>
  //           </TableCell>
  //           <TableCell>
  //             <SubTitle>Lab2</SubTitle>
  //           </TableCell>
  //           <TableCell>
  //             <SubTitle>Midterm</SubTitle>
  //           </TableCell>
  //           <TableCell>
  //             <SubTitle>Final</SubTitle>
  //           </TableCell>
  //         </TableRow>
  //       </TableHead>

  //       <DragDropContext onDragEnd={onDragEnd}>
  //         <Droppable droppableId="droppable-list-score">
  //           {(provided) => (
  //             <TableBody ref={provided.innerRef} {...provided.droppableProps}>
  //               {sampleScore?.map((item, index) => (
  //                 <Draggable draggableId={item.id.toString()} index={index} key={item.id}>
  //                   {(provided, snapshot) => (
  //                     <TableRow
  //                       className={clsx(classes.rowItem, { [classes.rowItemDraging]: snapshot.isDragging })}
  //                       ref={provided.innerRef}
  //                       {...provided.draggableProps}

  //                     >
  //                       <TableCell valign="middle" sx={{ pl: "16px !important" }}>
  //                         <Box display="flex" alignItems="center" justifyContent="center"  {...provided.dragHandleProps}>
  //                           <DragIndicator className={classes.dragIcon} />
  //                         </Box>
  //                       </TableCell>

  //                       <TableCell>
  //                           <Input disableUnderline value={"20127533"}/>
  //                       </TableCell>

  //                       <TableCell>
  //                           <Input disableUnderline value={"Lê Đăng Khoa"}/>
  //                       </TableCell>

  //                       <TableCell>
  //                           <Input disableUnderline value={"10"}/>
  //                       </TableCell>

  //                       <TableCell>
  //                           <Input disableUnderline value={"10"}/>
  //                       </TableCell>

  //                       <TableCell>
  //                           <Input disableUnderline value={"10"}/>
  //                       </TableCell>

  //                       <TableCell>
  //                           <Input disableUnderline value={"10"}/>
  //                       </TableCell>

  //                     </TableRow>
  //                   )}
  //                 </Draggable>
  //               ))}
  //             </TableBody>
  //           )}
  //         </Droppable>
  //       </DragDropContext>
  //     </Table>
  //   </SetupTable>
  // );

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

  return (
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
                  max: 10
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
  );
};

export default GradeTable;
