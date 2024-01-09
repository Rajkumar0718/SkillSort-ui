import axios from 'axios';
import React, { Component , useState  , useEffect} from 'react';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import { url } from '../../utils/UrlConstant';
import "../Admin/AddExam.css";

const AddSectionModal = (props) => {
const [name,setName] = useState("")
const [forGroupType, setForGroupType] = useState('Group');
const [state, setState] = useState({
    disabled: false,
    name: '',
    description: '',
  });
    const handleAddSection = (event) => {
        setName(event.target.value);
      };

      const handleSubmitAddSection = (event) => {
        event.preventDefault();
        forGroupType ? addGroupType() : addSection();
      };

      const addSection = () => {
        setState((prevState) => ({ ...prevState, disabled: true }));
    
        axios.post(`${url.ADMIN_API}/section/save`, state, { headers: authHeader() })
          .then((res) => {
            if (props.modalSection.action === 'Update') {
              toastMessage('success', 'Section Updated Successfully..!');
              setState({ name: '', description: '', disabled: false });
              props.onCloseModal();
            } else {
              toastMessage('success', 'Section Added Successfully..!');
              props.onCloseModalAdd();
            }
          })
          .catch((error) => {
            setState((prevState) => ({ ...prevState, disabled: false }));
            errorHandler(error);
          });
      };

      useEffect(() => {
        if (props.modalSection.action === 'Update') {
          setState((prevState) => ({
            ...prevState,
            ...props.modalSection.section,
            ...props.modalSection.groupTypes,
          }));
        }
      }, [props.modalSection.action, props.modalSection.section, props.modalSection.groupTypes]);




      const addGroupType = async () => {
        setState({ ...state, disabled: true });
    
        try {
          const response = await axios.post(`${url.COLLEGE_API}/practiceExam/saveGroupType`, state, {
            headers: authHeader()
          });
    
          if (props.modalSection.action === 'Update') {
            toastMessage('success', 'GroupType Updated Successfully..!');
            setState({ name: '', description: '', disabled: false });
            props.onCloseModal();
          } else {
            toastMessage('success', 'GroupType Added Successfully..!');
            props.onCloseModalAdd();
          }
        } catch (error) {
          setState({ ...state, disabled: false });
          errorHandler(error);
        }
      };

      const oncheckBoxChange = (event) => {
        setState((prevState) => ({
          ...prevState,
          status: event.target.value === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
        }));
      };
    
  return (

    <div className="modal fade show" id="myModal" role="dialog" style={{ paddingRight: '15px', display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }} aria-hidden="true">
                <div className="modal-dialog" style={{ width: "625px", maxWidth: "670px" }}>
                    <div className="modal-content" style={{ borderStyle: 'solid', borderColor: '#af80ecd1', borderRadius: "32px" }}>
                        <div className="modal-header" style={{ padding: "2rem 2rem 0 3.85rem", border: "none" }}>
                            <h5 className="setting-title">{props.modalSection.action} {state.forGroupType?'GroupType':'Section'}</h5>
                            {props.modalSection.action === 'Update' ?
                                <button type="button" onClick={props.onCloseModal} className="close" data-dismiss="modal">&times;</button> :
                                <button type="button" onClick={props.onCloseModalAdd} className="close" data-dismiss="modal">&times;</button>}
                        </div>
                        <div className="modal-body" style={{ paddingTop: "5px" }}>
                            <form onSubmit={handleSubmitAddSection}>
                                <div className="form-group row">
                                    <label for="question" className='col-md-3 col-sm-3 col-lg-3 col-3 form-label lable-text'>{state.forGroupType?'GroupType':'Section'}<span className='required'></span></label>
                                    <input className="form-control-mini" style={{ marginLeft: "1rem", width: "23.8rem" }}
                                        onChange={(e) => handleAddSection(e, 'name')}
                                        value={state.name}
                                        autoComplete="off"
                                        name='name' id='section' autoFocus required='true' type="text" placeholder={state.forGroupType?'Enter grouptype': 'Enter section' }/>
                                </div>
                                <div className="form-group row">
                                    <label for="question" className='col-md-3 col-sm-3 col-lg-3 col-3 form-label lable-text'>Description<span className='required'></span></label>
                                    <input className="form-control-mini" required='true' style={{ marginLeft: "1rem", width: '23.8rem' }}
                                        onChange={(e) => handleAddSection(e, 'description')}
                                        value={state.description}
                                        autoComplete="off"
                                        name='section' id='section' type="text" placeholder='Enter description' />
                                </div>
                                {props.modalSection.action === 'Update' ? < div className="form-group col-6">
                                    <div className="form-check" style={{marginLeft: '2.2rem',paddingTop:'1rem'}}>
                                        <input type="checkbox" value={state.status} onClick={oncheckBoxChange} checked={state.status === 'ACTIVE' ? true : false} className="form-check-input" id="exampleCheck1" />
                                        <label className="form-check-label" for="exampleCheck1">Active</label>
                                    </div>
                                </div> : ''}
                                <div className="form-group row">
                                    <div className="col-md-11">
                                        <button disabled={state.disabled} type="submit" style={{ float: "right" }} className="btn btn-sm btn-nxt">{props.modalSection.action}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {/* <div className="modal-footer">
                            <button type="button" onClick={props.onCloseModal} className="btn btn-default" data-dismiss="modal">Close</button>
                        </div> */}
                    </div>

                </div>
            </div>
  )
}

export default AddSectionModal