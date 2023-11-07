import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Search from './components/Search/Search';
import Table from './components/Table/Table';

const App = () => {
  return (
    <div className='container mt-5'>
      <Search />
      <div className='d-flex flex-column align-items-center'>
        <p>You can change value by clicking on any value in table</p>
        <p>After reloading page all value data save (localstorage)</p>
      </div>
      <Table />
    </div>
  );
};

export default App;
