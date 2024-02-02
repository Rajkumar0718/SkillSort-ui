import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

export default function DataGridDemo(props) {
  function getRowClassName(params) {
    return params.id % 2 === 0 ? 'even-row' : 'odd-row';
  }

  return (
    <Box
      sx={{
        '& .super-app-theme--header': {
          color: '#3B489E !important',
          backgroundColor: '#E0E1EA !important',
        },'& .MuiDataGrid-columnHeaders':{
          maxHeight: '40px !important',
          minHeight: '40px !important'
        }
      }}
    >
      <DataGrid
        rows={props.rows}
        className='myGrid'
        autoHeight
        headerHeight={10}
        columns={props.columns}
        rowHeight={35}
        pageSize={20}
        disableColumnFilter
        rowCount={props.totalSize}
        rowsPerPageOptions={[20]}
        checkboxSelection={false}
        onPageChange={(newPage) => props.onPagination(newPage +1)}
        disableSelectionOnClick
        paginationMode="server"
        getRowClassName={getRowClassName}
      />
      </Box>
    // </div>
  );
}
