import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useAppDispatch } from '../../hooks/reduxHooks';
import {
  filterTableData,
  resetTableData,
} from '../../store/reducers/table.slice';

const Search = () => {
  const [filter, setFilter] = useState<string>('');
  const dispatch = useAppDispatch();
  const handleFilter = () => {
    dispatch(filterTableData(filter));
    setFilter('');
  };
  const handleReset = () => {
    const storedDataString = localStorage.getItem('tableData');
    const storedData = storedDataString ? JSON.parse(storedDataString) : null;
    dispatch(resetTableData(storedData));
  };
  return (
    <div className='d-flex justify-content-center mb-4'>
      <div className='d-flex w-50'>
        <Form.Control
          onChange={(e) => setFilter(e.target.value)}
          className='mx-2'
          value={filter}
        />
        <Button onClick={handleFilter} variant='primary' className='mx-2'>
          filter
        </Button>
        <Button onClick={handleReset} variant='primary' className='mx-2'>
          reset
        </Button>
      </div>
    </div>
  );
};

export default Search;
