'use client'
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TableCell from '@mui/material/TableCell/TableCell';
import { Button, Checkbox, Input, Table, TableBody, TableOwnProps, TableRow, TableRowOwnProps } from '@mui/material';
import { TableHeaderLabel } from '@/models/general';
import TableHeader from '../Table/TableHead';
import DeleteIcon from '@mui/icons-material/Delete';
import * as XLSX from 'xlsx'; 

const tableHeaders: TableHeaderLabel[] = [
  { name: "grade_name", label: "Grade name", sortable: true },
  { name: "scale", label: "Scale", sortable: true },
  { name: "is_published", label: "Published", sortable: true },
];

const initialItems = [
  { id: '0', name: 'Lab', scale: '30', isEditing: false, isPublished: false },
  { id: '1', name: 'Midterm', scale: '30', isEditing: false, isPublished: false },
  { id: '2', name: 'Final', scale: '40', isEditing: false, isPublished: false },
];

const DraggableTable = () => {
  const [items, setItems] = useState(initialItems);
  const [isEditingAll, setIsEditingAll] = useState(false);
  const [newItemData, setNewItemData] = useState({ id: '', name: '', scale: '', isEditing: false });
  const [totalScale, setTotalScale] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const calculateTotalScale = (itemsToCalculate) => {
    let total = 0;
    itemsToCalculate.forEach((item) => {
      total += parseInt(item.scale);
    });
    setTotalScale(total);
    return total;
  };

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedItems = Array.from(items);
    const [reorderedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, reorderedItem);

    // setItems(reorderedItems.map((item, index) => {
    //   if (result.destination.index === index) {
    //     return initialItems.find((initItem) => initItem.id === item.id);
    //   }
    //   return item;
    // }));
    setItems(reorderedItems);
    // console.log(reorderedItems);
  };

  const handleEditAllClick = () => {
    setIsEditingAll(true);
  };

  const handleSave = () => {
    setItems(items.map((item) => ({ ...item, isEditing: !isEditingAll })));
    const total = calculateTotalScale(items);
    if (Number.isNaN(total)) {
      setErrorMessage('The scale must be a number!');
    }
    else if (total !== 100) {
      setIsEditingAll(true);
      setErrorMessage('Your total scale is ' + total + '%. The total scale must be 100% so you can not save');
    }
    else {
      setIsEditingAll(false);
      setErrorMessage('');

      // call API here
    }
  }

  const handleInputChange = (e, itemId, field) => {
    const { value } = e.target;
    setItems(items.map((item) => {
      if (item.id === itemId) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleInputBlur = (itemId) => {
    setItems(items.map((item) => {
      if (item.id === itemId) {
        return { ...item, isEditing: false };
      }
      return item;
    }));
  };

  const handleAddRow = () => {
    const newItemId = String(items.length);
    const newItem = {...newItemData, id: newItemId };
    setItems(prevItems => [...prevItems, newItem]);
    setNewItemData({ id: '', name: '', scale: '', isEditing: false });
  };

  const handleInputChangeNewRow = (e, field) => {
    const { value } = e.target;
    setNewItemData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleDeleteRow = (itemId) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
  };  

  // Export file excel
  const handleExportToExcel = () => {
    if (items.length === 0) {
      return;
    }

    let gradesList = ['Student ID'];
    items.forEach((item) => {
      const nameValue = item.name; // get the name of the grade: lab, midterm, final, ...
      gradesList.push(nameValue);
    });

    const worksheet = XLSX.utils.aoa_to_sheet([gradesList]); // Create the first row with all the name of the grades list

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'grades template');

    XLSX.writeFile(workbook, 'grade_template.xlsx');
  };

  const handleCheckboxChange = (e, itemId) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, isPublished: e.target.checked };
      }
      return item;
    });

    setItems(updatedItems);
  };

  return (
    <div style={{padding: '1rem'}}>
    <DragDropContext 
      onDragEnd={handleDragEnd}
      >
      {
      !isEditingAll ? 
        (<Button 
          variant="contained" 
          color={isEditingAll ? "secondary" : "primary"} 
          onClick={handleEditAllClick}
          >
          Edit
        </Button>) : (
        <Button 
          variant="contained"
          style={{backgroundColor: 'green'}}
          onClick={handleSave}
          >
          Save
        </Button>
        )
      }
      <br/><br/>
      {errorMessage && (
        <>
          <p style={{ color: 'red' }}>{errorMessage}</p>
        </>
      )}
      
      {isEditingAll && (
        <>
          <br/>
          <div style={{display: 'flex', gap: '0.8rem'}}>
            <Input
              type="text"
              placeholder="Grade name"
              value={newItemData.name}
              onChange={(e) => handleInputChangeNewRow(e, 'name')}
            />
            <Input
              type="text"
              placeholder="Scale"
              value={newItemData.scale}
              onChange={(e) => handleInputChangeNewRow(e, 'scale')}
            />
            <Button variant="contained" color="primary" onClick={handleAddRow}>
              Add
            </Button>
          </div>
          <br/>
        </>
      )}

      <Droppable droppableId="droppable">
        {(provided) => (
          <Table
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ width: '30rem', borderCollapse: 'collapse' }}
          > 
            <TableHeader headers={tableHeaders} />
            <tbody>
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                  {(provided) => (
                    <TableRow
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TableCell style={{ padding: '1rem', width: '50%' }}>
                        {item.isEditing || isEditingAll ? (
                          <Input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleInputChange(e, item.id, 'name')}
                            onBlur={() => handleInputBlur(item.id)}
                          />
                        ) : (
                          item.name
                        )}
                      </TableCell>
                      <TableCell style={{ padding: '1rem', width: '20%' }}>
                        {item.isEditing || isEditingAll ? (
                          <Input
                            type="text"
                            value={item.scale}
                            onChange={(e) => handleInputChange(e, item.id, 'scale')}
                            onBlur={() => handleInputBlur(item.id)}
                          />
                        ) : (
                          item.scale
                        )}
                      </TableCell>
                      <TableCell style={{ padding: '1rem', width: '18%' }}>
                        {isEditingAll ?
                          (<Checkbox checked={item.isPublished}  onChange={(e) => handleCheckboxChange(e, item.id)}/>) : 
                          (<Checkbox checked={item.isPublished} disabled />)
                        }
                      </TableCell>
                      <TableCell style={{ padding: '1rem', width: '10%' }}>
                        {isEditingAll ? 
                          (<Button onClick={() => handleDeleteRow(item.id)}><DeleteIcon style={{color: 'red'}}/></Button>) :
                          ''
                        }
                      </TableCell>
                    </TableRow>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </tbody>
          </Table>
        )}
      </Droppable>
      {!isEditingAll ? (<Button variant="contained" color="primary" onClick={handleExportToExcel}>
        Download Transcript
      </Button>) : ''}
    </DragDropContext>
    </div>
  );
};

export default DraggableTable;