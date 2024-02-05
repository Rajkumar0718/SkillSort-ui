import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { authHeader, errorHandler } from '../../api/Api';
import CustomDatePick from '../../common/CustomDatePick';
import { ToggleStatus, toastMessage, withLocation } from '../../utils/CommonUtils';
import { url } from "../../utils/UrlConstant";


class CompanyPlans extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValidDate: false,
      editPlan: null,
      status: 'ACTIVE',
      companyPlans: [],
      company: {},
      dropdownOpen: false
    }
  }

  componentDidMount = () => {
    this.getCompanyDetails();
  }

  getCompanyDetails = () => {
    const data = this.props.location.state || {}
    const companyId = data.companyId || data.company?.id;
    axios.get(`${url.ADMIN_API}/company/company-id/${companyId}`, { headers: authHeader() })
      .then(res => {
        const company = res.data.response
        this.setState({ editPlan: null, company: company, companyPlans: _.orderBy(company.plans, ['service', 'expiryDate'], ['asc', 'desc']) });
      }).catch(err => errorHandler(err));
  }

  updatePlan = (plan) => {
    axios.post(`${url.ADMIN_API}/plan`, plan, { headers: authHeader() })
      .then(_res => {
        toastMessage('success', 'Plan Details Updated Successfully..!');
        this.getCompanyDetails();
      }).catch(err => errorHandler(err));
  }

  deletePlan = (planId) => {
    axios.delete(`${url.ADMIN_API}/plan?planId=${planId}`, { headers: authHeader() })
      .then(_res => {
        toastMessage('success', 'Plan Deactivated Successfully..!');
        this.getCompanyDetails();
      }).catch(err => errorHandler(err));
  }

  onChangeDate = (date) => {
    const plan = _.clone(this.state.editPlan);
    plan.expiryDate = date
    if(this.checkIsValidDate(plan.startDate,plan.expiryDate)) {
      this.setState({ editPlan: plan, isValidDate:true })
    } else{
       this.setState({isValidDate : false})
    }
  }

  checkIsValidDate = (startDate,expiryDate) => {
     return moment(expiryDate).isAfter(startDate)
  }

  updateDate = () => {
    if (this.checkIsValidDate(this.state.editPlan.startDate,this.state.editPlan.expiryDate)) {
      const plan = _.cloneDeep(this.state.editPlan)
      plan.company = this.state.company;
      this.updatePlan(plan);
    }
  }

  onDateError = (err) => {
    console.log(err, "error")
    const isValid = _.isEmpty(err);
    if (this.state.isValidDate !== isValid) this.setState({ isValidDate: isValid })
  }

  handleStatusFilter = (value) => this.setState({ status: value })

  render() {
    const { companyPlans, company, addPlan, editPlan } = this.state || {}
    const plans = _.filter(companyPlans, p => p.status === this.state.status)
    return (<div>
      <div className={addPlan ? "" : "card-header-new"}>
        {addPlan ? null : <span>Plan for <span>{company?.name}</span></span>}
        {addPlan ? null : <button type="button" className="btn btn-sm btn-nxt header-button" onClick={() => this.setState({ addPlan: true })}>Add Plan</button>}
      </div>
      {addPlan ? <AddPlan company={company} updatePlan={this.updatePlan} onCancel={() => this.setState({ addPlan: false })} /> : null}
      <div className="row">
        <div className="col-md-12">
          <div className="table-border">
            <div>
              <div className="table-responsive pagination_table">
                <table className="table" id="dataTable">
                  <thead className="table-dark-custom">
                    <tr style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                      <th>s.No</th>
                      <th style={{ textAlign: 'left' }}>Services</th>
                      <th style={{ textAlign: 'right' }}>count</th>
                      <th>Start Date</th>
                      <th>Expiry Date</th>
                      <th>validity</th>
                      <th>
                        <div style={{ display: 'inline-flex' }}>
                          Status
                          <div className="dropdown" style={{ marginLeft: '0.5rem' }}>
                            <i className="fa fa-filter" aria-hidden="true" id="dropdownMenuButton"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false" onClick={this.toggleDropdown} style={{ cursor: 'pointer' }}></i>
                            <ul className={`dropdown-menu ${this.dropdownOpen ? 'show' : ''}`} aria-labelledby="dropdownMenuButton">
                              {_.map(['ACTIVE', 'INACTIVE'], (value) => (
                                <li key={value}>
                                  <button
                                    className={`dropdown-item ${this.state.status === value ? 'active' : ''}`}
                                    onClick={() => this.handleStatusFilter(value)}
                                  >
                                    {value}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {_.isEmpty(plans) ?
                      <tr className="text-center"><td colSpan="7" style={{ color: 'black' }}>No {this.state.status === 'ACTIVE' ? 'Available' : 'Inactive'} Plans Found</td></tr> :
                      _.map(plans, (plan, index) => (<tr key={index} style={{ textAlign: 'center' }}>
                        <td style={{ color: 'black' }}>{index + 1}</td>
                        <td style={{ textAlign: 'left', color: 'black' }}>{plan.service}</td>
                        <td style={{ textAlign: 'right', color: 'black' }}>{plan.count}</td>
                        <td style={{ color: 'black' }}>{plan.startDate ? moment(plan.startDate).format("DD/MM/YYYY") : "-"}</td>
                        {plan.status === 'ACTIVE' && editPlan && plan.id === editPlan.id ? <td style={{ textAlign: 'center' }}>
                          {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              style={{ backgroundColor: 'white', borderRadius: '3px', width: '10rem' }} minDate={moment(plan.startDate)}
                              id="date-picker-dialog" format="dd/MM/yyyy" autoComplete="off" placeholder="Expired Date"
                              value={editPlan?.expiryDate || null} KeyboardButtonProps={{ "aria-label": "change date" }}
                              onChange={(date) => this.onChangeDate(date)} onError={this.onDateError} />
                          </MuiPickersUtilsProvider> */}
    
                          <CustomDatePick 
                             value={editPlan?.expiryDate && new Date(editPlan?.expiryDate) || null}
                             minDate={_.isDate(editPlan?.startDate) ? editPlan.startDate : moment(editPlan.startDate).toDate()}
                             onChange={(date) => this.onChangeDate(date)}
                          />
                          <button type="button" className="btn nofocus" onClick={this.updateDate}>
                            <i className="fa fa-floppy-o" title='Update Date' aria-hidden="true"></i></button>
                          <button type="button" className="btn nofocus" onClick={() => this.setState({ editPlan: null })}>
                            <i className="fa fa-window-close" aria-hidden="true"></i></button>
                        </td> :
                          <td style={{ textAlign: 'center', color: 'black' }}>
                            {plan.expiryDate ? moment(plan.expiryDate).format("DD/MM/YYYY") : "-"}
                            {plan.status === 'ACTIVE' ? <button type="button" className="btn nofocus" onClick={() => this.setState({ editPlan: _.cloneDeep(plan) })}>
                              <i className="fa fa-pencil" aria-hidden="true"></i></button>
                              : null}
                          </td>}
                        <td style={{ color: 'black' }}>{plan.startDate && plan.expiryDate ? moment(editPlan && plan.id === editPlan.id ? editPlan.expiryDate : plan.expiryDate).diff(moment(plan.startDate), 'days') : '-'}</td>
                        <td style={{ textAlign: 'center' }} className={plan.status === 'INACTIVE' ? 'text-danger' : 'text-success'}>
                          {plan.status === 'ACTIVE' ? <ToggleStatus checked={plan.status === 'ACTIVE'} onChange={() => this.deletePlan(plan.id)} name="planStatus" /> : null}
                          {plan.status}
                        </td>
                      </tr>))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}

class AddPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      services: [],
      plan: {
        id: null,
        company: props.company,
        service: '',
        status: 'ACTIVE'
      },
      isValidDate: false,
    }
  }

  componentDidMount = () => {
    this.getPlanServices();
  }

  getPlanServices = () => {
    axios.get(`${url.ADMIN_API}/plan/services`, { headers: authHeader() })
      .then(res => {
        if (res.data) this.setState({ services: res.data.response || [] })
      }).catch(error => errorHandler(error))
  }

  updatePlan = () => {
    this.props.updatePlan(this.state.plan);
    this.props.onCancel();
  }


  handleChange = (value, key) => {
    const plan = _.clone(this.state.plan)
    plan[key] = value
    if (key === 'startDate' || key === 'expiryDate') {
      this.onDateError()
    }
    this.setState({ plan: plan })
  }

  onDateError = (err) => {
    const isValid = _.isEmpty(err);
    if (this.state.isValidDate !== isValid) this.setState({ isValidDate: isValid })
  }

  render() {

    const { plan, services, update } = this.state || { plan: {}, services: [] }

    console.log(plan.service, plan.count >= 0, plan.startDate, plan.expiryDate, this.state.isValidDate)

    const isValidPlan = plan.service && plan.count >= 0 && plan.startDate && plan.expiryDate && this.state.isValidDate;

    return (
      <main className="main-content bcg-clr">
        <div>
          <div className="cf-1">
            <div className="card-header-new"><span>{update ? 'Update' : 'Add'} Plan for <span>{plan.company?.name}</span></span></div>
            <div style={{ padding: '0.5rem', paddingTop: '2rem', margin: '2rem 0', border: '1px solid lightgray' }}>
              <div className="row">
                <div className="col-sm-4 col-md-2 col-lg-2 col-xl-1 mtb-1">
                  <label className="form-label text-label">Service</label>
                </div>
                <div className="col-sm-8 col-md-4 col-lg-4 col-xl-2 mtb-1">
                  {update ? <input required className="profile-page w-75" value={plan.service} readOnly={update} />
                    : <select className="profile-page w-75" label='Services' name='services' value={plan.service || ""}
                      onChange={(e) => this.handleChange(e.target.value, 'service')} placeholder="Select any services">
                      <option hidden value="">Select any services...</option>
                      {_.map(services, (service, k) => <option key={k} value={service}>{service}</option>)}
                    </select>}
                </div>
                <div className="col-sm-4 col-md-2 col-lg-2 col-xl-1 mtb-1">
                  <label className="form-label text-label">Allowed Count</label>
                </div>
                <div className="col-sm-8 col-md-4 col-lg-4 col-xl-2 mtb-1">
                  <input required className="profile-page w-50" type='number' label='count' name='count' min={0}
                    readOnly={update} value={plan.count || ''} onChange={(e) => this.handleChange(e.target.value, 'count')} aria-label="default input example" />
                </div>
                <div className="col-sm-4 col-md-2 col-lg-2 col-xl-1 mtb-1">
                  <label className="form-label text-label">Start Date</label>
                </div>
                <div className='col-sm-8 col-md-4 col-lg-4 col-xl-2 mtb-1'>
                  <CustomDatePick
                    disabled={!plan.service}
                    onChange={(date, key) =>this.handleChange(date,key)}
                    value={plan.startDate || null}
                    objectKey='startDate'
                    minDate={new Date()}
                  />
                </div>
                <div className="col-sm-4 col-md-2 col-lg-2 col-xl-1 mtb-1">
                  <label className="form-label text-label">Expiry Date</label>
                </div>
                <div className="col-sm-8 col-md-4 col-lg-4 col-xl-2 mtb-1">
                  <CustomDatePick
                    disabled={!plan.startDate}
                    onChange={(date, key) =>this.handleChange(date,key)}
                    value={plan.expiryDate || null}
                    objectKey='expiryDate'
                    minDate={plan.startDate}
                  />
                </div>
                <div>
                </div>
                {update ? <div className='col-sm-12 col-md-6 col-lg-4 col-xl-4 mtb-1'>
                  <label className="form-label text-label"><strong>Status</strong></label>
                  <div style={{ display: 'inline-block' }}> <div className="custom-control custom-radio custom-control-inline ml-3 radio">
                    <input className="custom-control-input" id="active" type="radio" onChange={(e) => this.handleChange(e.target.value, 'status')}
                      value="ACTIVE" name="status" checked={_.includes(["ACTIVE", ""], plan.status)} />
                    <label className="custom-control-label" htmlFor="active"> Active </label>
                  </div>
                    <div className="custom-control custom-radio custom-control-inline ml-3 radio">
                      <input required className="custom-control-input" id="inactive" type="radio" onChange={(e) => this.handleChange(e.target.value, 'status')}
                        value="INACTIVE" name="status" checked={plan.status === "INACTIVE"} />
                      <label className="custom-control-label" htmlFor="inactive"> Inactive </label> </div>
                  </div>
                </div> : null}
              </div>
              <div className='pull-right' style={{ marginRight: '1rem' }}>
                <button style={{ marginRight: '1rem' }} type='submit' className="btn btn-sm btn-nxt" disabled={!isValidPlan} onClick={this.updatePlan}>{update ? 'Update' : 'Add'}</button>
                <button className="btn btn-sm btn-prev" id="cancel" name="cancel" onClick={this.props.onCancel}>Cancel</button>
              </div>
              <div style={{ clear: "both" }} />
            </div>
          </div>
        </div>
      </main>);
  }
}

export default withLocation(CompanyPlans)
