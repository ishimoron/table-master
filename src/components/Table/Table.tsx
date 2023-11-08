import React, { useEffect, useState } from 'react';
import { Button, Form, Table as TableWrapper } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  sortTableData,
  updateLocalData,
  updateTableData,
} from '../../store/reducers/table.slice';
import { HiddenColumns, TableColumn, TableRow } from '../../types/Table';

const Table = () => {
  const table = useAppSelector((state) => state.table);
  const dispatch = useAppDispatch();

  const [editingId, setEditingId] = useState<null | string>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  const [sortedColumn, setSortedColumn] = useState<string | null>(null);

  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  const [hiddenColumns, setHiddenColumns] = useState<HiddenColumns>({});

  const handleColumnVisibilityChange = (columnId: string) => {
    setHiddenColumns({
      ...hiddenColumns,
      [columnId]: !hiddenColumns[columnId],
    });
  };

  useEffect(() => {
    const storedDataString = localStorage.getItem('tableData');
    if (storedDataString) {
      const storedData = JSON.parse(storedDataString);
      dispatch(updateLocalData(storedData));
      setDataLoaded(true);
    } else {
      localStorage.setItem('tableData', JSON.stringify(table.data));
      setDataLoaded(true);
    }
  }, []);

  if (!dataLoaded) {
    return <div>Loading</div>;
  }

  const toggleRowExpansion = (rowId: string) => {
    if (expandedRows.includes(rowId)) {
      setExpandedRows(expandedRows.filter((id) => id !== rowId));
    } else {
      setExpandedRows([...expandedRows, rowId]);
    }
  };

  const isRowExpanded = (rowId: string) => expandedRows.includes(rowId);

  const handleEdit = (rowId: string, columnId: string, value: string) => {
    setEditingId(`${rowId}-${columnId}`);
    setEditingValue(value);
  };

  const handleSaveCheckbox = (
    rowId: string,
    columnId: string,
    checkValue: boolean,
  ) => {
    dispatch(updateTableData({ rowId, columnId, newValue: checkValue }));
    setEditingId(null);
  };

  const handleSaveSelect = (
    rowId: string,
    columnId: string,
    selectValue: string,
  ) => {
    dispatch(updateTableData({ rowId, columnId, newValue: selectValue }));
    setEditingId(null);
  };

  const handleSaveText = (
    rowId: string,
    columnId: string,
    e: React.KeyboardEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    if (e.key === 'Enter') {
      dispatch(updateTableData({ rowId, columnId, newValue: editingValue }));
      setEditingId(null);
    }
  };

  const handleSort = (columnId: string) => {
    if (columnId === sortedColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortOrder('asc');
      setSortedColumn(columnId);
    }
    dispatch(sortTableData({ columnId, sortOrder }));
  };

  const renderCellContent = (row: TableRow, column: TableColumn) => {
    if (editingId === `${row.id}-${column.id}`) {
      if (column.type === 'selection') {
        return (
          <Form.Select
            value={editingValue}
            onChange={(e) => {
              setEditingValue(e.target.value);
              handleSaveSelect(row.id, column.id, e.target.value);
            }}
          >
            <option value='Male'>Male</option>
            <option value='Female'>Female</option>
          </Form.Select>
        );
      } else if (column.type === 'boolean') {
        return (
          <Form.Check
            type='checkbox'
            checked={row[column.id]}
            onChange={(e) =>
              handleSaveCheckbox(row.id, column.id, e.target.checked)
            }
          />
        );
      } else {
        return (
          <Form.Control
            type='text'
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            onKeyDown={(e) => handleSaveText(row.id, column.id, e)}
          />
        );
      }
    } else {
      if (column.type === 'boolean') {
        return (
          <Form.Check
            type='checkbox'
            checked={row[column.id]}
            onChange={(e) =>
              handleSaveCheckbox(row.id, column.id, e.target.checked)
            }
          />
        );
      } else {
        return (
          <span onClick={() => handleEdit(row.id, column.id, row[column.id])}>
            {column.type === 'selection' ? row[column.id] : row[column.id]}
          </span>
        );
      }
    }
  };

  return (
    <div>
      <div className='d-flex justify-content-center my-2'>
        <h2 className='mx-2'>Column Visibility</h2>
        {table.columns.map((column) => (
          <div key={column.id} className='d-flex align-items-center mx-1'>
            <Form.Check
              type='checkbox'
              checked={!hiddenColumns[column.id]}
              onChange={() => handleColumnVisibilityChange(column.id)}
            />
            <label className='mx-1'>{column.title}</label>
          </div>
        ))}
      </div>
      <TableWrapper striped bordered hover>
        <thead>
          <tr>
            <th></th>
            {table.columns.map(
              (column) =>
                !hiddenColumns[column.id] && (
                  <th key={column.id}>
                    <Button
                      variant='outline-primary'
                      onClick={() => handleSort(column.id)}
                    >
                      {column.title}
                      {column.id === sortedColumn &&
                        (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                    </Button>
                  </th>
                ),
            )}
          </tr>
        </thead>
        <tbody>
          {table.data.map((row) => (
            <React.Fragment key={row.id}>
              <tr>
                <td>
                  <Button
                    variant='outline-primary'
                    onClick={() => toggleRowExpansion(row.id)}
                  >
                    {isRowExpanded(row.id) ? '▼' : '▶'}
                  </Button>
                </td>
                {table.columns.map(
                  (column) =>
                    !hiddenColumns[column.id] && (
                      <td key={column.id}>{renderCellContent(row, column)}</td>
                    ),
                )}
              </tr>
              {isRowExpanded(row.id) && (
                <tr>
                  <td colSpan={table.columns.length + 1}>
                    <>
                      <p>Additional details about the selected row:</p>
                      <p>Name: {row.name}</p>
                      <p>Age: {row.age}</p>
                      <p>City: {row.city}</p>
                      <p>Gender: {row.gender}</p>
                    </>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </TableWrapper>
    </div>
  );
};

export default Table;
