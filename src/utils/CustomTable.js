import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import _ from 'lodash';
import BasicMenu from './Menu/BasicMenu';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';

const theme = createTheme({});

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#e0e1ea !important',
    color: '#3B489E',
    textTransform: 'uppercase',
    fontWeight: '700',
    fontFamily: 'Montserrat',
    padding: theme.spacing(0.45, 0.45, 0.45, 0.2),
    fontSize: 13,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    fontFamily: 'Montserrat',
    paddingLeft: '2px !important',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: '#E0E1EA',
  },
}));


export const CustomTable = (props) => {


  const getHeader = () => {
    return _.map(props.headers, header => {
      if (header.isFilter) {
        return (
          <StyledTableCell>
            <BasicMenu header={header} />
          </StyledTableCell>
        )
      } else {
        return <StyledTableCell align={header.align ? header.align : 'center'}>{header.name}</StyledTableCell>
      }
    })
  }


  const concatKeys = (keys, data) => {
    let concatString = '';
    _.map(keys, key => {
      concatString = concatString.concat(data[key] ? data[key] : key)
    })
    return concatString;
  }

  const splitDotsAndJoin = (key, data) => {
    const name = key.split(".")
    return data[name[0]][name[1]]
  }

  const getRowData = () => {
    let i = props.pageSize - 1;
    if (_.size(props.data) > 0) {
      return _.map(props.data, (row, index) => {
        return (
          <StyledTableRow>
            {_.map(props.headers, keys => {
              if (keys.renderCell instanceof Function) {
                return <StyledTableCell align={keys.align ? keys.align : 'center'}>{keys.renderCell(row, index)}</StyledTableCell>
              }
              else if (keys.concat) {
                return <StyledTableCell align={keys.align ? keys.align : 'center'}>{concatKeys(keys.key, row)}</StyledTableCell>
              }
              else if (keys.key?.toUpperCase() === 'S.NO') {
                return <StyledTableCell align={'center'}>{props.pageSize * props.currentPage - (i--)}</StyledTableCell>
              }
              else if (keys.key === 'status') {
                 return  <StyledTableCell className={row[keys.key] === 'INACTIVE' ? 'text-danger' : 'text-success'} align={keys.align ? keys.align : 'center'}>{row[keys.key]}</StyledTableCell>
              }
              else if (keys.key?.includes(".")) {
                return <StyledTableCell align={keys.align ? keys.align : 'center'}>{splitDotsAndJoin(keys.key, row)}</StyledTableCell>
              } else {
                return <StyledTableCell align={keys.align ? keys.align : 'center'}>{row[keys.key]}</StyledTableCell>
              }
            })}
          </StyledTableRow>
        )
      })
    } else {
      return <StyledTableRow className="text-center"> <StyledTableCell colSpan={7} align="center" >NO DATA AVAILABLE</StyledTableCell></StyledTableRow>
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <TableContainer style={{ overflowX: 'inherit' }}>
        <Table
          size="small"
          aria-label="a dense table"
          sx={{
            minWidth: 150,
            width: '100%',
            marginBottom: (theme) => theme.spacing(2),
          }}
        >
          <TableHead>
            <StyledTableRow>
              {getHeader()}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {getRowData()}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider >
  )
}
