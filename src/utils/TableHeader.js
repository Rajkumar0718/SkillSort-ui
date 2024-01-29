import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TableHeader = (props) => {
    const title = props.title;
    const link = props.link;
    const buttonName = props.buttonName;
    const btnName = props.btnName;
    const [search, setSearch] = useState('');

    const onSearch = () => {
        props.onSearch(search);
    }

    const onChange = (event) => {
        setSearch(event.target.value);
    }

    const onButtonClick = () => {
        props.onButtonClick();
    }

    return (
        <div className="card-header-new">
            <div className="row">
                <div className="col-md-4">
                    <span className="card-title">{title}</span>
                </div>
                {
                    props.showSearch ?
                        <>
                            <div className="col-md-3">
                                <input type="text" className="form-control" placeholder={props.placeholder} onChange={onChange} />
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-sm btn-secondary" style={{ marginTop: "5px" }} onClick={onSearch}>search</button>
                            </div>
                        </> :
                        <div className="col-md-4">
                        </div>}
                {props.showLink ?
                    <div className="col-md-4">
                        {buttonName === null ? '' :<Link to={link} className="btn btn-sm btn-nxt float-right" style={{ marginTop: "5px" ,float:'right' }}>{buttonName}</Link>}
                    </div> : ""}
                {props.showButton && !props.showSendButton ?<div className= {props.showSendButton ? "col-md-2" : "col-md-4"} style={{ textAlign: 'end' }}>
                    <button className="btn btn-sm btn-nxt" style={{ marginTop: "5px" }} onClick={onButtonClick}>{btnName}</button>
                </div> :null}
                {props.showSendButton && <div className="col-md-4" style={{ textAlign: 'end' }}>
                        <button onClick={props.showTest} className="btn btn-sm btn-nxt" style={{ marginTop: "5px" }} >Send Mail</button>
                </div>}
            </div>
        </div>
    )
}

export default TableHeader;