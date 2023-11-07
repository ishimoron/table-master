import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import tableData from '../../data/moc';

const initialState = {
  ...tableData,
  sortOrder: null,
  sortedColumn: null,
};

export const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    updateLocalData: (state, action) => {
      state.data = action.payload;
      localStorage.setItem('tableData', JSON.stringify(state.data));
    },
    resetTableData: (state) => {
      const originalData = [...tableData.data];
      state.data = originalData;
      localStorage.setItem('tableData', JSON.stringify(state.data));
    },
    updateTableData: (state, action) => {
      const { rowId, columnId, newValue } = action.payload;
      const rowData = state.data.find((row) => row.id === rowId);
      if (rowData) {
        rowData[columnId] = newValue;
        localStorage.setItem('tableData', JSON.stringify(state.data));
      }
    },
    filterTableData: (state, action: PayloadAction<string>) => {
      const wordToFilter = action.payload;

      if (wordToFilter.trim() === '') {
        return state;
      }

      return {
        ...state,
        data: state.data.filter((row) => {
          for (const column of state.columns) {
            const cellValue = row[column.id].toString().toLowerCase();
            if (cellValue.includes(wordToFilter.toLowerCase())) {
              return true;
            }
          }
          return false;
        }),
      };
    },
    sortTableData: (state, action) => {
      const { columnId, sortOrder } = action.payload;

      if (sortOrder === 'asc') {
        state.data.sort((a, b) => {
          const aValue = a[columnId];
          const bValue = b[columnId];
          if (aValue < bValue) {
            return -1;
          }
          if (aValue > bValue) {
            return 1;
          }
          return 0;
        });
      } else if (sortOrder === 'desc') {
        state.data.sort((a, b) => {
          const aValue = a[columnId];
          const bValue = b[columnId];
          if (aValue > bValue) {
            return -1;
          }
          if (aValue < bValue) {
            return 1;
          }
          return 0;
        });
      }

      state.sortOrder = sortOrder;
      state.sortedColumn = columnId;
    },
  },
});

export const {
  updateTableData,
  filterTableData,
  sortTableData,
  updateLocalData,
  resetTableData,
} = tableSlice.actions;

export default tableSlice.reducer;
