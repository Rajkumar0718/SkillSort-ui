import React, { useState, useEffect } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { authHeader, errorHandler } from '../../api/Api';
import { ToggleStatus, fallBackLoader, toastMessage } from '../../utils/CommonUtils';
import url from "../../utils/UrlConstant";
import { CustomTable } from '../../utils/CustomTable';
import { MenuItem } from "@mui/material";
// import Switch from '@mui/material/Switch';
import { alpha, styled } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import Switch from '@mui/material/Switch';

const PlanMaster = () => {
  const [planMasters, setPlanMasters] = useState([]);
  const [showActive, setShowActive] = useState('ACTIVE');
  const [loader, setLoader] = useState(true);
  const [addPlan, setAddPlan] = useState(false);
  const [headers, setHeaders] = useState([]);

  const SwitchItem = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase': {
      color: red[600],
      '&:hover': {
        backgroundColor: alpha(red[600], theme.palette.action.hoverOpacity),
      },
    },
    '& .MuiSwitch-switchBase+ .MuiSwitch-track': {
      backgroundColor: red[600],
    },
  }));

  useEffect(() => {
    getPlanMasters();
  }, [showActive]);

  const getPlanMasters = () => {
    setTableJson()
    axios.get(`${url.ADMIN_API}/plan/plan-master?status=${showActive}`, { headers: authHeader() })
      .then(res => {
        if (res.data) {
          const plans = res.data.response;
          setPlanMasters(_.orderBy(plans, ['createdDate']));
          setLoader(false);
        }
      })
      .catch(error => errorHandler(error));
  };

  const updatePlan = (e, plan) => {
    e?.preventDefault();
    axios.post(`${url.ADMIN_API}/plan/plan-master`, plan, { headers: authHeader() })
      .then(_res => {
        toastMessage('success', 'Plan Details Updated Successfully..!');
        getPlanMasters();
      })
      .catch(error => errorHandler(error));
  };

  const togglePlan = (e, planMaster) => {
    const plan = _.clone(planMaster);
    plan.status = planMaster.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    updatePlan(e, plan);
  }


  const handleStatusFilter = (value) => {
    setShowActive(value);
  };


  const setTableJson = () => {
    const newHeaders = [
      {
        name: 'S.NO',
        align: 'center',
        key: 'S.NO',
      },
      {
        name: 'NAME',
        align: 'left',
        key: 'planName',
      },
      {
        name: 'SERVICE',
        align: 'left',
        key: 'service',
      },
      {
        name: 'COUNT',
        align: 'left',
        key: 'count',
      },
      {
        name: 'VADITITY	',
        align: 'left',
        key: 'validity',
      },
      {
        name: 'STATUS',
        align: 'left',
        isFilter: true,
        key: 'status',
        renderOptions: () => {
          return _.map(
            [
              { name: 'Active', value: 'ACTIVE' },
              { name: 'InActive', value: 'INACTIVE' },
            ],
            (opt) => (
              <MenuItem
                onClick={() => handleStatusFilter(opt.value)}
                key={opt.value}
                value={opt.value}
              >
                {opt.name}
              </MenuItem>
            )
          )
        },
        renderCell: (params) => {
          return (
         
            <>
              <ToggleStatus checked={params?.status === 'ACTIVE'} onChange={(e) => togglePlan(e, params)} />
              <span className={showActive === 'INACTIVE' ? 'text-danger' : 'text-success'}>
                {showActive}
              </span>
            </>
          );
        }
      },
    ];
    setHeaders(newHeaders);
  };


  return (
    <div>
      <div className="card-header-new">
        <span>Plan Masters</span>
        {!addPlan && (
          <button type="button" className="btn btn-sm btn-nxt header-button" onClick={() => setAddPlan(true)}>
            Add Plan
          </button>
        )}
      </div>
      {addPlan && <AddPlanMaster updatePlan={updatePlan} onCancel={() => setAddPlan(false)} />}
      <div className="row">
        <div className="col-md-12">
          <div className="table-border">
            {fallBackLoader(loader)}
            <div className="table-responsive pagination_table">

              <CustomTable headers={headers} data={planMasters}></CustomTable>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const AddPlanMaster = (props) => {
  const [services, setServices] = useState([]);
  const [plan, setPlan] = useState({
    id: null,
    planName: '',
    service: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    getPlanServices();
  }, []);

  const getPlanServices = () => {
    axios.get(`${url.ADMIN_API}/plan/services`, { headers: authHeader() })
      .then(res => {
        if (res.data) setServices(res.data.response || []);
      })
      .catch(error => errorHandler(error));
  }

  const updatePlanMaster = (e) => {
    props.updatePlan(e,plan);
    props.onCancel();
  }

  const handleChange = (value, key) => {
    const updatedPlan = _.clone(plan);
    updatedPlan[key] = value;
    setPlan(updatedPlan);
  }

  const isValidPlan = plan.planName && plan.service && plan.count >= 0 && plan.validity > 0 && plan.status;

  return (
    <main className="main-content bcg-clr">
      <div>
        <div className="cf-1">
          <div className="card-header-new"><span>{props.update ? 'Update' : 'Add'} Plan Master</span></div>
          <div style={{ padding: '0.5rem', paddingTop: '2rem', margin: '2rem 0', border: '1px solid lightgray' }}>
            <div className="row">
              <div className="col-sm-4 col-md-2 col-lg-2 col-xl-1 mtb-1">
                <label className="form-label text-label">Plan Name</label>
              </div>
              <div className='col-sm-8 col-md-4 col-lg-4 col-xl-2 mtb-1'>
                <input required className="profile-page w-75" type='name' label='Plan Name' name='planName' maxLength="50" value={plan.planName}
                  readOnly={props.update} onChange={(e) => handleChange(e.target.value, 'planName')} aria-label="default input example"></input>
              </div>
              <div className="col-sm-4 col-md-2 col-lg-2 col-xl-1 mtb-1">
                <label className="form-label text-label">Service</label>
              </div>
              <div className="col-sm-8 col-md-4 col-lg-4 col-xl-2 mtb-1">
                {props.update ? <input required className="profile-page w-75" value={plan.service} readOnly={props.update} />
                  : <select className="profile-page w-75" label='Services' name='services' value={plan.service || ""} defaultValue={_.first(services) || []}
                    onChange={(e) => handleChange(e.target.value, 'service')}>
                    <option selected value="">Select Services</option>
                    {_.map(services, (service, k) => <option key={k} value={service}>{service}</option>)}
                  </select>}
              </div>
              <div className="col-sm-4 col-md-4 col-lg-2 col-xl-1 mtb-1">
                <label className="form-label text-label">Allowed Count</label>
              </div>
              <div className="col-sm-8 col-md-8 col-lg-4 col-xl-2 mtb-1">
                <input required className="profile-page w-50" type='number' label='count' name='count' min={0}
                  readOnly={props.update} value={plan.count} onChange={(e) => handleChange(e.target.value, 'count')} aria-label="default input example" />
              </div>
              <div className="col-sm-4 col-md-4 col-lg-2 col-xl-1 mtb-1">
                <label className="form-label text-label">Validity (Days)</label>
              </div>
              <div className="col-sm-8 col-md-8 col-lg-4 col-xl-2 mtb-1">
                <input required className="profile-page w-50" type='number' label='validity' name='validity' maxLength="4" min={0}
                  readOnly={props.update} value={plan.validity} onChange={(e) => handleChange(e.target.value, 'validity')} aria-label="default input example" />
              </div>
              <div>
              </div>
            </div>
            <div className='pull-right' style={{ marginRight: '1rem' }}>
              <button style={{ marginRight: '1rem' }} type='submit' className="btn btn-sm btn-nxt" disabled={!isValidPlan} onClick={(e)=> updatePlanMaster(e)}>{props.update ? 'Update' : 'Add'}</button>
              <button className="btn btn-sm btn-prev" id="cancel" name="cancel" onClick={props.onCancel}>Cancel</button>
            </div>
            <div style={{ clear: "both" }} />
          </div>
        </div>
      </div>
    </main>
  );
}


export default PlanMaster;
