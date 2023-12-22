import _ from "lodash";
import { fallBackLoader } from "../CommonUtils";

function Table(props) {


  const getHeader = () => {
    return _.map(props.headers, header => {
      if (header.isFilter) {
        return (
          <th>
            <div className="row">
              {header.name}
              <div className="col-sm">
                <div className="dropdown">
                  <div className="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" >
                    <i className="fa fa-filter" aria-hidden="true"></i>
                  </div>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" >
                   {header.renderOptions()}
                  </div>
                </div>
              </div>
            </div>
          </th>
        )
      } else {
        return <th style={{ textAlign: header.align ? header.align : 'center' }}>{header.name}</th>
      }
    })
  }

  const getRowData = () => {
    return _.map(props.data, (row, index) => {
    return(
       <tr>
      {  _.map(props.headers, keys => {
          if (keys.renderCell instanceof Function) {
            return <td style={{ textAlign: 'center' }}>{keys.renderCell(row)}</td>
          } else if (keys.key === 'S.NO') {
            return <td style={{ textAlign: 'center' }}>{++index}</td>
          } else {
            return <td style={{ textAlign: keys.align ? keys.align : 'center' }}>{row[keys.key]}</td>
          }
        })}
     </tr>
    )})
  }

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="table-border">
          <div>
            {fallBackLoader(props.loader)}
            <div className="table-responsive pagination_table">
              <table className="table table-striped">
                <thead className="table-dark">
                  <tr>
                    {getHeader()}
                  </tr>
                </thead>
                <tbody>
                    {getRowData()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

}

export default Table;