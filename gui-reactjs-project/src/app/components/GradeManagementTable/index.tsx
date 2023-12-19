'use client'
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TableCell from '@mui/material/TableCell/TableCell';
import { Button, Input, Table, TableBody, TableOwnProps, TableRow, TableRowOwnProps } from '@mui/material';
import { TableHeaderLabel } from '@/models/general';
import TableHeader from '../Table/TableHead';
import DeleteIcon from '@mui/icons-material/Delete';

const tableHeaders: TableHeaderLabel[] = [
  { name: "grade_name", label: "Grade name", sortable: true },
  { name: "scale", label: "Scale", sortable: true },
];

const initialItems = [
  { id: '0', name: 'Item 1', scale: '100%', isEditing: false },
  { id: '1', name: 'Item 2', scale: '100%', isEditing: false },
  { id: '2', name: 'Item 3', scale: '100%', isEditing: false },
  // Add more items as needed
];

const DraggableTable = () => {
  const [items, setItems] = useState(initialItems);
  const [isEditingAll, setIsEditingAll] = useState(false);
  const [newItemData, setNewItemData] = useState({ id: '', name: '', scale: '', isEditing: false });

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
    setItems(items.map((item) => ({ ...item, isEditing: !isEditingAll })));
    setIsEditingAll(!isEditingAll);
  };

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

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <br/>
      <Button variant="contained" color="primary" onClick={handleEditAllClick}>
        {isEditingAll ? 'Save' : 'Edit'}
      </Button>
      <br/><br/>
      
      {isEditingAll && (
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
      )}

      <Droppable droppableId="droppable">
        {(provided) => (
          <Table
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ width: '25rem', borderCollapse: 'collapse' }}
          > 
            <TableHeader headers={tableHeaders} />
            <tbody>
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <TableRow
                      // hover
                      // tabIndex={-1}
                      key={item.id}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        marginBottom: '8px', // Add spacing between rows
                        // backgroundColor: provided.draggableProps.style.background,
                      }}
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
                      <TableCell>
                        {isEditingAll && 
                          (<Button onClick={() => handleDeleteRow(item.id)}><DeleteIcon style={{color: 'red'}}/></Button>)
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
    </DragDropContext>
  );
};

export default DraggableTable;
function useEffect(arg0: () => void, arg1: { id: string; name: string; scale: string; isEditing: boolean; }[][]) {
  throw new Error('Function not implemented.');
}

