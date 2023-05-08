import CustomDataGrid from '../../../components/customDataGrid';

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Name' },
  {
    field: 'options',
    headerName: 'Options',
    renderCell: (row) => (
      <>
        <button onClick={() => console.log(`View: ${row.id}`)}>View</button>
        <button onClick={() => console.log(`Edit: ${row.id}`)}>Edit</button>
        <button onClick={() => console.log(`Delete: ${row.id}`)}>Delete</button>
      </>
    ),
  },
];

const data = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
];

export default function Overview () {
  return (
    <div className='flex items-center flex-col justify-around'>
      <div>testing</div>
      <CustomDataGrid columns={columns} data={data} />
    </div>
  );
};

