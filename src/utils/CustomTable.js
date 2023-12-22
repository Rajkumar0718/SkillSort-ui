import { makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles } from "@material-ui/core";
import _ from "lodash";
import BasicMenu from "./Menu/BasicMenu";

const useStyles = makeStyles({
  table: {
    minWidth: 150,
    marginLeft: '0.5rem',
    width: '98%',
    marginBottom: '1rem',
  },
});

const StyledTableCell = withStyles(() => ({
  head: {
    backgroundColor: '#ECEDF6',
    color: '#3B489E',
    textTransform: 'uppercase',
    fontWeight: '700',
    fontFamily: 'Montserrat',
    padding: '0.45rem 0.45rem 0.45rem 0.2rem !important',
    fontSize: 14
  },
  body: {
    fontSize: 13,
    fontFamily: 'Montserrat',
    paddingLeft: '0.45px !important'
  },
}))(TableCell);

const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: '#E0E1EA',
    },
  },
}))(TableRow);

export const CustomTable = (props) => {
  const classes = useStyles();


  const getHeader = () => {
    return _.map(props.headers, header => {
      if (header.isFilter) {
        return (
          <StyledTableCell>
            <BasicMenu header = {header}/>
          </StyledTableCell>
        )
      } else {
        return <StyledTableCell align={header.align ? header.align : 'center'}>{header.name}</StyledTableCell>
      }
    })
  }

  const concatKeys = (keys,data) => {
     let concatString = '';
      _.map(keys, key => {
       concatString = concatString.concat(data[key] ? data[key]: key)
      })
      return concatString;
  }

  const splitDotsAndJoin = (key,data) => {
    const name = key.split(".")
   return  data[name[0]][name[1]]
  }

  const getRowData = () => {
    let i = props.pageSize - 1;
    if(_.size(props.data) > 0) {
    return _.map(props.data, (row, index) => {
    return(
       <StyledTableRow>
      {  _.map(props.headers, keys => {
          if (keys.renderCell instanceof Function) {
            return <StyledTableCell align={keys.align ? keys.align : 'center' }>{keys.renderCell(row,index)}</StyledTableCell>
          }
          else if(keys.concat) {
            return <StyledTableCell align={keys.align ? keys.align : 'center' }>{concatKeys(keys.key,row)}</StyledTableCell>
          }
           else if (keys.key?.toUpperCase() === 'S.NO') {
            return <StyledTableCell align={ 'center' }>{props.pageSize * props.currentPage - (i--)}</StyledTableCell>
          } else if(keys.key?.includes(".")) {
            return <StyledTableCell align={keys.align ? keys.align : 'center' }>{splitDotsAndJoin(keys.key,row)}</StyledTableCell>
          }else {
            return <StyledTableCell align={keys.align ? keys.align : 'center' }>{row[keys.key]}</StyledTableCell>
          }
        })}
     </StyledTableRow>
    )})
  } else {
    return <StyledTableRow className="text-center"> <StyledTableCell colSpan={7} align="center" >NO DATA AVAILABLE</StyledTableCell></StyledTableRow>
  }
  }

  return (
    <TableContainer style={{overflowX: 'inherit'}}>
      <Table className={classes.table} size="small" aria-label="a dense table">
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
  )
}