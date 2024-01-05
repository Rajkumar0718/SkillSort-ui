    // import React, { useEffect } from 'react'

    // export const CollegeTable = (props) => {
    //     const { headers, body } = props
        

    //     const head = headers.map(h => h.toUpperCase());

    //     const headerKeyMap = {'Company Name': 'name'};
    //     const headKeys = headers.map(h => (headerKeyMap[h] || h).toUpperCase());

    //     const lowerCasedData = body.map(obj => {
    //         const lowerCasedObj = Object.fromEntries(
    //             Object.entries(obj).map(([key, value]) => [key.toUpperCase(), value])
    //         );
    //         return lowerCasedObj;
    //     });

    //     return (
    //         <table className="table table-striped" id="dataTable">
    //             <thead>
    //                 <tr>
    //                     {head.map(header => {
    //                         return <th className='col-lg-1' style={{ textAlign: 'center' }}>{header}</th>
    //                     })}
    //                 </tr>
    //             </thead>
    //             <tbody style={{ textAlign: 'left', textTransform: 'capitalize' }}>
    //                 {lowerCasedData.map((rowData, rowIndex) => (
    //                     <tr key={rowIndex}>
    //                         {headKeys.map((header, cellIndex) => (
    //                             <>
    //                                 {header === 'S.NO' ? <td style={{ textAlign: 'center' }}>{rowIndex + 1}</td> :
    //                                     <td key={cellIndex} style={{ textAlign: 'center' }}>
    //                                         {rowData[header]}
    //                                     </td>}
    //                             </>
    //                         ))}
    //                         {/* {props.link && <td>
    //                             <Link to={{ pathname: '/collegeadmin/edit'}} >
    //                                 <i className="fa fa-pencil" aria-hidden="true" ></i></Link>
    //                         </td>} */}
    //                     </tr>
    //                 ))}
    //             </tbody>
    //         </table>
    //     )
    // }












import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import "../../assests/css/AdminDashboard.css";

export const CollegeTable = (props) => {
    const { headers, body } = props
    console.log(body, "body")

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const head = headers.map(h => h.toUpperCase());
    const headerKeyMap = { 'Company Name': 'name' };
    const headKeys = headers.map(h => (headerKeyMap[h] || h).toUpperCase());

    const lowerCasedData = body?.map(obj => {
        const lowerCasedObj = Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key.toUpperCase(), value])
        );
        return lowerCasedObj;
    });

    const fn = () => {
        console.log("working")
    }

    return (
        <table className="table table-striped" id="dataTable">  
            <thead>
                <tr>
                    {head.map(header => (
                        <th className='col-lg-1' style={{ textAlign: 'center'}}>
                            {header === "VERIFICATION" ? (
                                <>
                                    <Button
                                        id="fade-button"
                                        aria-controls={open ? 'fade-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                        onClick={handleClick}
                                    >
                                        VERIFICATION
                                    </Button>
                                    <Menu
                                        id="fade-menu"
                                        MenuListProps={{
                                            'aria-labelledby': 'fade-button',
                                        }}
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        TransitionComponent={Fade}
                                    >
                                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                                        <MenuItem onClick={handleClose}>My account</MenuItem>
                                        <MenuItem onClick={handleClose}>Logout</MenuItem>
                                    </Menu>
                                </>
                                //     <div className="row">
                                //     <div className="col-sm-6">Verification</div>
                                //     <div className="col-sm">
                                //         <div className="dropdown">
                                //             <div
                                //                 className="dropdown-toggle"
                                //                 type="button"
                                //                 id="dropdownMenuButton"
                                //                 data-toggle="dropdown"
                                //                 aria-haspopup="true"
                                //                 aria-expanded="false"
                                //             >
                                //                 <i className="fa fa-filter" aria-hidden="true"></i>
                                //             </div>
                                //             <div
                                //                 className="dropdown-menu"
                                //                 aria-labelledby="dropdownMenuButton"
                                //             >
                                //                 <option
                                //                     className="dropdown-item"
                                //                     onClick={() => fn()}
                                //                     value="ALL"
                                //                 >
                                //                     All
                                //                 </option>
                                //                 <option
                                //                     className="dropdown-item"
                                //                     onClick={(e) =>
                                //                         props.handleVerifiedFilters(e, this.value)
                                //                     }
                                //                     value="VERIFIED"
                                //                 >
                                //                     Verified
                                //                 </option>
                                //                 <option
                                //                     className="dropdown-item"
                                //                     onClick={(e) =>
                                //                         props.handleVerifiedFilters(e, "verifiedStatus")
                                //                     }
                                //                     value="NOTVERIFIED"
                                //                 >
                                //                     Not Verified
                                //                 </option>
                                //             </div>
                                //         </div>
                                //     </div>
                                // </div>
                            ) : (header)
                            }
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody style={{ textAlign: 'left', textTransform: 'capitalize' }}>
                {lowerCasedData?.map((rowData, rowIndex) => (
                    <tr key={rowIndex}>
                        {headKeys.map((header, cellIndex) => (
                            <>
                                {header === 'S.NO' ? <td style={{ textAlign: 'center' }}>{rowIndex + 1}</td> :
                                    <td key={cellIndex} style={{ textAlign: 'center' }}>
                                        {rowData[header]}
                                    </td>}
                            </>
                        ))}
                        {/* {props.link && <td>
                                <Link to={{ pathname: '/collegeadmin/edit'}} >
                                    <i className="fa fa-pencil" aria-hidden="true" ></i></Link>
                            </td>} */}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
