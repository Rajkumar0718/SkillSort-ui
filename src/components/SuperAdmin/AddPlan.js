import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import { url } from "../../utils/UrlConstant";
import './SuperAdmin.css';



export default class AddPlan extends Component {
  constructor() {
    super();
    this.state = {
      action: null,
      plan: {
        id: null,
        packageName: '',
        maxResumes: '',
        maxTests: '',
        maxInterviews: '',
        expiryDate: '',
        company: {},
        status: 'ACTIVE'
      },
    }
  }

  componentDidMount() {
    this.getPlanMaster();
    const props = this.props.location.state
    const plan = props.action === 'update' ? props.plan || {} : _.cloneDeep(this.state.plan)
    if (props) {
      plan.company = _.omit(props.company, ['plans']);
      this.setState({ plan: plan })
    }
  }

  getPlanMaster = () => {
    axios.get(`${url.ADMIN_API}/plan/plan-master`, { headers: authHeader() })
      .then(res => {
        if (res.data) {
          const plans = res.data.response
          this.setState({ planMasters: _.orderBy(plans, ['createdDate']) })
        }
      }).catch(error => {
        errorHandler(error);
      })
  }

  updatePlan = () => {
    axios.post(`${url.ADMIN_API}/plan`, this.state.plan, { headers: authHeader() })
      .then(_res => {
        toastMessage('success', 'Plan Details Updated Successfully..!');
        this.goback();
      })
  }

  goback = () => this.props.history.push({
    pathname: '/companyadmin/plan', state: { companyId: this.state.plan.company.id }
  })


  handleChange = (value, key) => {
    const plan = _.clone(this.state.plan)
    plan[key] = value
    this.setState({ plan: plan })
  }

  handlePlanChange = (e) => {
    const plan = _.find(this.state.planMasters, pm => pm.id === e.target.value) || {};
    const expiryDate = moment().add(String(plan.dateRange), 'days').toDate();
    this.setState({
      plan: Object.assign({}, this.state.plan, { expiryDate: expiryDate },
        _.pick(plan, ['packageName', 'maxResumes', 'maxTests', 'maxInterviews']))
    })
  }

  render() {

    const { plan, planMasters } = this.state || {};

    const action = this.props.location?.state?.action

    const isValidPlan = plan.packageName && plan.maxResumes >= 0 && plan.maxTests >= 0 && plan.maxInterviews >= 0 && plan.expiryDate && plan.status && !_.isEmpty(plan.company)

    return (
      <main className="main-content bcg-clr">
        <div>
          <div className="container-fluid cf-1">
            <div className="card-header-new"><span>{action !== null ? 'Update' : 'Add'} Plan for <span>{plan.company?.name}</span></span></div>
            <div style={{ padding: '20px', paddingTop: '40px', marginTop: '2rem', border: '1px solid lightgray' }}>
              <div className="row">
                <div className="col-sm-4 col-md-4 col-lg-2 mtb-1">
                  <label className="form-label text-label">Plan Name</label>
                </div>
                <div className='col-sm-8 col-md-8 col-lg-2 mtb-1'>
                  {action === 'update' ?
                    <input readOnly className="profile-page w-75" type='name' label='Plan Name' name='packageName' maxLength="50" value={plan.packageName}
                      aria-label="default input example"></input>
                    : <select className="profile-page" style={{ width: '75%', marginBottom: '10px' }}
                      value={plan.id}
                      onChange={(e) => this.handlePlanChange(e)}>
                      <option hidden selected value="">Select Plan</option>
                      {_.map(planMasters || [], pm => <option key={pm.id} value={pm.id}>{pm.packageName}</option>)}
                    </select>}
                </div>
                <div className="col-sm-4 col-md-4 col-lg-2 mtb-1">
                  <label className="form-label text-label">Expiry Date</label>
                </div>
                <div>
                  {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      style={{ backgroundColor: 'white', borderRadius: '3px' }}
                      id="date-picker-dialog"
                      format="dd/MM/yyyy"
                      autoComplete="off"
                      placeholder="Expiry Date"
                      value={plan.expiryDate || null}
                      onChange={(date) => this.handleChange(date, 'expiryDate')}
                      KeyboardButtonProps={{ "aria-label": "change date", }}
                    />
                  </MuiPickersUtilsProvider> */}
                  

                </div>
                {_.map(['Resumes', 'Tests', 'Interviews'], l => {
                  const fieldName = `max${l}`
                  const limits = `remaining${l}`
                  return <React.Fragment key={l}>
                    <div className="col-sm-4 col-md-2 col-lg-2 col-lx-1 mtb-1">
                      <label className="form-label text-label">{l} - ({plan[limits]})</label>
                    </div>
                    <div className="col-sm-8 col-md-4 col-lg-2 col-lx-2 mtb-1">
                      <input required className="profile-page w-50" type='number' label={l} name={fieldName} maxLength="7" min={0}
                        value={plan[fieldName]} onChange={(e) => this.handleChange(e.target.value, fieldName)}
                        aria-label="default input example"></input>
                    </div>
                  </React.Fragment>
                })}
                <div className='col-sm-12 col-md-6 col-lg-4 col-lx-3 mtb-1'>
                  <label className="form-label text-label"><strong>Status</strong></label>
                  <div style={{ display: 'inline-block' }}> <div className="custom-control custom-radio custom-control-inline ml-3 radio">
                    <input className="custom-control-input" id="active" type="radio" onChange={(e) => this.handleChange(e.target.value, 'status')}
                      value="ACTIVE" name="status" checked={plan.status === "ACTIVE" || plan.status === ""} />
                    <label className="custom-control-label" for="active"> Active </label>
                  </div>
                    <div className="custom-control custom-radio custom-control-inline ml-3 radio">
                      <input required className="custom-control-input" id="inactive" type="radio" onChange={(e) => this.handleChange(e.target.value, 'status')}
                        value="INACTIVE" name="status" checked={plan.status === "INACTIVE"} />
                      <label className="custom-control-label" for="inactive"> Inactive </label> </div>
                  </div>
                </div>
              </div>
              <div className='pull-right' style={{ margin: '2rem' }}>
                <button type='submit' className="btn btn-sm btn-nxt" style={{ marginRight: '1rem', textTransform: "capitalize" }}
                  disabled={!isValidPlan} onClick={this.updatePlan}>{action}</button>
                <button className="btn btn-sm btn-prev" id="cancel" name="cancel" onClick={this.goback} >Cancel</button>
              </div>
              <div style={{ clear: "both" }} />
            </div>
          </div>
        </div>
      </main>);
  }
}