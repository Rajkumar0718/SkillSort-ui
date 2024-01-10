import React, { useEffect } from 'react'

export const CollegeTable = (props) => {


    useEffect(() => {
        const {headers} = props
        const head = headers.toLowerCase()
    }, [])
    return (
        <table className="table table-striped" id="dataTable">
            <thead className="table-dark">
                <tr>
                    {props.headers.map(header => {
                        return <th className='col-lg-1' style={{ textAlign: 'center' }}>{header}</th>
                    })}

                </tr>
            </thead>
            <tbody style={{ textAlign: 'left', textTransform: 'capitalize' }}>
                {props.body.map((rowData, rowIndex) => (
                    <tr key={rowIndex}>
                        {console.log(rowIndex, "rowIndex")}
                        {props.headers.map((header, cellIndex) => (
                            <>
                            {header === 'S.No' ? <td style={{ textAlign: 'center' }}>{rowIndex+1}</td> :
                            <td key={cellIndex} style={{ textAlign: 'center' }}>

                               {rowData[header]}
                            </td>}
                            </>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
