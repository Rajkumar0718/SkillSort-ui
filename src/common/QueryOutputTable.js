import _ from "lodash";
import React from "react";
const QueryOutputTable = ({ data }) => {
  let displayData = _.size(data)> 5 ? data.slice(0,5) : data
  return (
    <table className="query-table">
    <tbody>
       {displayData?.map((row, rowIndex) => {
         if (typeof row === 'string') {
           return (
             <tr key={rowIndex}>
               <td>{row}</td>
             </tr>
           );
         } else {
           return (
             <tr key={row.id}>
               {Object.values(row).map((cellValue, cellIndex) => (
                 <td key={cellIndex}>{cellValue}</td>
               ))}
             </tr>
           );
         }
       })}
     </tbody>
   </table>
  );
};

export default QueryOutputTable;