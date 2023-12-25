"use client";
import React, { useState, useEffect, memo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TableCell from "@mui/material/TableCell/TableCell";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Grid,
  Input,
  Table,
  TableBody,
  TableOwnProps,
  TableRow,
  TableRowOwnProps,
} from "@mui/material";
import { TableHeaderLabel } from "@/models/general";
import TableHeader from "../Table/TableHead";
import DeleteIcon from "@mui/icons-material/Delete";
import * as XLSX from "xlsx";
import axiosInstance from "@/app/routers/axios";
import { CommonProps } from "@mui/material/OverridableComponent";
import classes from "./styles.module.scss";

import { DialogTitleConfirm } from "../dialogs/DialogTitle";
import Heading4 from "../text/Heading4";
import ButtonCLose from "../buttons/ButtonClose";
import { DialogContentConfirm } from "../dialogs/DialogContent";
import InputTag from "../InputTag";
import ParagraphSmall from "../text/ParagraphSmall";
import CustomBtn, { BtnType } from "../buttons/Button";
import ErrorMessage from "../text/ErrorMessage";
import { useAppDispatch } from "@/redux/hook";
import { setLoading } from "@/redux/reducers/loading";

type Item = {
  id: string;
  name: string;
  scale: string;
  isEditing: boolean;
  isPublished: boolean;
};

const tableHeaders: TableHeaderLabel[] = [
  { name: "grade_name", label: "Grade name", sortable: true },
  { name: "scale", label: "Scale", sortable: true },
  { name: "is_published", label: "Finalize", sortable: true },
];

interface Props {
  courseId: string;
  isOpen: boolean;
  onCancel: () => void;
  scoreData: any;
  onSave: () => void;
}

const GradeManagementTable = memo(({ courseId, isOpen, onCancel, scoreData, onSave }: Props) => {
  const dispatch = useAppDispatch();
  const [items, setItems] = useState<any[]>([]);
  const [isEditingAll, setIsEditingAll] = useState(false);
  const [newItemData, setNewItemData] = useState({ name: "", scale: "", isEditing: false });
  const [errorMessage, setErrorMessage] = useState("");
  const [gradeNameList, setGradeNameList] = useState<any>(scoreData?.grade);
  const [headerExcelFile, setHeaderExcelFile] = useState<any>(scoreData?.columns);
  const [filename, setFileName] = useState(scoreData?.fileName);
  const [studentList, setStudentList] = useState<any[]>(scoreData?.rows);

  const convertDataToTable = (gradeNameList: any[]) => {
    const items = gradeNameList.map((grade: any) => {
      return {
        id: grade?.id,
        name: grade?.name,
        scale: grade?.scale,
        isEditing: false,
        isFinal: grade?.isFinal,
      };
    });

    return items;
  };

  useEffect(() => {
    console.log(gradeNameList);
    if (gradeNameList?.length) {
      setItems(convertDataToTable(gradeNameList));
    }
  }, [gradeNameList]);

  const calculateTotalScale = (itemsToCalculate: any[]) => {
    let total = 0;
    itemsToCalculate.forEach((item: { scale: string }) => {
      total += parseInt(item.scale);
    });

    return total;
  };

  const handleDragEnd = async (result: { destination: { index: number }; source: { index: number } }) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = Array.from(items);
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, reorderedItem);

    // Sett new header for the xls file
    const headers = ["studentId", "fullname", ...reorderedItems.map((obj) => obj.name)];
    setHeaderExcelFile(headers);

    // Save new order index to DB
    try {
      if(isEditingAll) return
      const updatedData = reorderedItems.map(item => {
        const { isEditing, ...updatedItem } = item;
        return updatedItem;
      });

      console.log(updatedData)
      dispatch(setLoading(true));
      const response = await axiosInstance.post(`/score/create-update-columns/${courseId}`, updatedData);
      dispatch(setLoading(false));
      if (response.data) {
        onSave()
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEditAllClick = () => {
    setIsEditingAll(true);
  };

  const handleSave = async () => {
    setItems(items.map((item) => ({ ...item, isEditing: !isEditingAll })));
    const total = calculateTotalScale(items);
    if (Number.isNaN(total)) {
      setErrorMessage("The scale must be a number!");
    } else if (total !== 100) {
      setIsEditingAll(true);
      setErrorMessage("Your total scale is " + total + "%. The total scale must be 100% so you can not save");
    } else {
      setIsEditingAll(false);
      setErrorMessage("");

      const reorderedItems = Array.from(items);
      // Sett new header for the xls file
      const headers = ["studentId", "fullname", ...reorderedItems.map((obj) => obj.name)];
      setHeaderExcelFile(headers);

      // Save new order index to DB
      try {
        dispatch(setLoading(true));
        const updatedData = items.map(item => {
          const { isEditing, ...updatedItem } = item;
          return updatedItem;
        });
        const response = await axiosInstance.post(`/score/create-update-columns/${courseId}`, updatedData);
        dispatch(setLoading(false));
        if (response.data) {
          onSave();
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    itemId: any,
    field: string
  ) => {
    const { value } = e.target;
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleInputBlur = (itemId: any) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          return { ...item, isEditing: false };
        }
        return item;
      })
    );
  };

  const handleAddRow = async () => {
    const newItemId = String(items.length);
    const newItem = { ...newItemData, id: newItemId};
    setItems((prevItems) => [...prevItems, newItem]);
    setNewItemData({name: "", scale: "", isEditing: false });
  };

  const handleInputChangeNewRow = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    const { value } = e.target;
    setNewItemData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleDeleteRow = (itemId: any) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
  };

  // Export file excel
  const handleExportToExcel = () => {
    if (items.length === 0) {
      return;
    }
    // Convert the array of objects to an array of arrays
    const dataArray = studentList.map((item) => [item.id, item.fullname]);
    dataArray.unshift(headerExcelFile);
    const worksheet = XLSX.utils.aoa_to_sheet(dataArray);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "sheet 1");

    XLSX.writeFile(workbook, filename);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, itemId: any) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, isFinal: e.target.checked };
      }
      return item;
    });

    setItems(updatedItems);
  };

  return (
    <Dialog scroll="paper" open={isOpen} onClose={onCancel} classes={{ paper: classes.paper }}>
      <DialogTitleConfirm className={classes.dialogTitle}>
        <Box display="flex" alignItems="center">
          <Heading4 $colorName="#333">Edit Grade Compositions</Heading4>
        </Box>
        <ButtonCLose $backgroundColor="--eerie-black-5" $colorName="--eerie-black-40" onClick={onCancel} />
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <div style={{ padding: "1rem" }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            {!isEditingAll ? (
              <CustomBtn btnType={BtnType.Primary} onClick={handleEditAllClick} className={classes.modalBtn}>
                Edit
              </CustomBtn>
            ) : (
              <Button
                variant="contained"
                style={{ backgroundColor: "green" }}
                onClick={handleSave}
                className={classes.saveBtn}
              >
                Save
              </Button>
            )}
            <br />
            <br />
            {errorMessage && (
              <>
                <p style={{ color: "red" }}>{errorMessage}</p>
              </>
            )}

            {isEditingAll && (
              <>
                <br />
                <div style={{ display: "flex", gap: "0.8rem" }}>
                  <Input
                    type="text"
                    placeholder="Grade name"
                    value={newItemData.name}
                    onChange={(e) => handleInputChangeNewRow(e, "name")}
                  />
                  <Input
                    type="text"
                    placeholder="Scale"
                    value={newItemData.scale}
                    onChange={(e) => handleInputChangeNewRow(e, "scale")}
                  />
                  <CustomBtn btnType={BtnType.Primary} onClick={handleAddRow} className={classes.modalBtn}>
                    Add
                  </CustomBtn>
                </div>
                <br />
              </>
            )}

            <Droppable droppableId="droppablessss">
              {(provided) => (
                <Table
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ width: "30rem", borderCollapse: "collapse" }}
                >
                  <TableHeader headers={isEditingAll ? [...tableHeaders, {label: "Action"}] : tableHeaders} />
                  <tbody>
                    {items.map((item, index) => (
                      <Draggable key={`gc-${index}`} draggableId={`gc-${index}`} index={index}>
                        {(provided) => (
                          <TableRow ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <TableCell style={{ padding: "1rem", width: "40%" }}>
                              {item.isEditing || isEditingAll ? (
                                <Input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => handleInputChange(e, item.id, "name")}
                                  onBlur={() => handleInputBlur(item.id)}
                                />
                              ) : (
                                item.name
                              )}
                            </TableCell>
                            <TableCell style={{ padding: "1rem", width: "20%" }}>
                              {item.isEditing || isEditingAll ? (
                                <Input
                                  type="text"
                                  value={item.scale}
                                  onChange={(e) => handleInputChange(e, item.id, "scale")}
                                  onBlur={() => handleInputBlur(item.id)}
                                />
                              ) : (
                                item.scale
                              )}
                            </TableCell>
                            <TableCell style={{ padding: "1rem", width: "18%" }}>
                              {isEditingAll ? (
                                <Checkbox checked={item.isFinal} onChange={(e) => handleCheckboxChange(e, item.id)} />
                              ) : (
                                <Checkbox checked={item.isFinal} disabled />
                              )}
                            </TableCell>
                            {isEditingAll ? (
                              <TableCell style={{ padding: "1rem" }}>
                                <Button onClick={() => handleDeleteRow(item.id)}>
                                  <DeleteIcon style={{ color: "red" }} />
                                </Button>
                              </TableCell>
                            ) : null}
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </Table>
              )}
            </Droppable>
            {!isEditingAll ? (
              <CustomBtn
                sx={{ mt: "16px !important" }}
                btnType={BtnType.Primary}
                onClick={handleExportToExcel}
                className={classes.saveBtn}
              >
                Download Transcript
              </CustomBtn>
            ) : (
              ""
            )}
          </DragDropContext>
        </div>
      </DialogContentConfirm>
    </Dialog>
  );
});

export default GradeManagementTable;
