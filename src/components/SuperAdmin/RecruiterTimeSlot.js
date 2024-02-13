import axios from 'axios';
import React, { Component } from 'react';
import { authHeader } from '../../api/Api';
import '../../assests/css/AdminDashboard.css';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
class RecruiterTimeSlot extends Component {
  state = {
    week: ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
    toDate: new Date(),
    fromDate: new Date(),
    selectedDays: [],
    recruiterId: '',
    timeSlot: {
      selectedDays: [],
    },
    start: new Date().getTime(),
    end: new Date().getTime(),
    slots: {
      sunday: '',
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: ''
    }
  }


  componentDidMount() {
    let id = this.props.location.state.id
    this.setState({ recruiterId: id })
    axios.get(`/api1/timeSlot/list?recruiterId=${id}`, { headers: authHeader() })
      .then(res => {
        const timeSlot = this.state.timeSlot;
        timeSlot.selectedDays = res.data.response;
        this.setState({ timeSlot: timeSlot });
        toastMessage('success', "Updated Successfully..!")

      })
  }

  handleClick = (day) => {
    if (this.state.selectedDays.includes(day)) {
      let index = this.state.selectedDays.indexOf(day);
      //  if (index !== -1){
      let eliminate = [...this.state.selectedDays];
      eliminate.splice(index, 1);
      this.setState({ selectedDays: eliminate })
      //  }
    } else {
      this.setState({ selectedDays: [...this.state.selectedDays, day] })
    }
  }

  handleTimeChange = (e, key, value) => {
    // this.setState({[key]:e.toLocaleTimeString()})7
    this.setState({ [value]: e.getTime() })
  }

  showTable = () => {
    // const slot = this.concat();

    return (
      <tbody>
        <tr>
          <td>{this.state.week[0]}</td>
          <td>{this.state.slots.sunday}</td>
        </tr>
        <tr>
          <td>{this.state.week[1]}</td>
          <td>{this.state.slots.monday}</td>
        </tr>
        <tr>
          <td>{this.state.week[2]}</td>
          <td>{this.state.slots.tuesday}</td>
        </tr>
        <tr>
          <td>{this.state.week[3]}</td>
          <td>{this.state.slots.wednesday}</td>
        </tr>
        <tr>
          <td>{this.state.week[4]}</td>
          <td>{this.state.slots.thursday}</td>
        </tr>
        <tr>
          <td>{this.state.week[5]}</td>
          <td>{this.state.slots.friday}</td>
        </tr>
        <tr>
          <td>{this.state.week[6]}</td>
          <td>{this.state.slots.saturday}</td>
        </tr>
      </tbody>
    );
  }

  render() {
    return (
      <main className="main-content bcg-clr">
        <div>
          <div className="container-fluid cf-1">
            <div className="card-header-new">
              <span>
                TimeSlot
              </span>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="table-border-cr">
                  {this.state.timeSlot.selectedDays.length > 0 ? (
                    <div style={{ paddingLeft: "20%", paddingRight: "20%", paddingTop: "2%" }}>
                      <table className="table table-bordered" style={{ fontSize: "13px", textAlign: "center" }}>
                        <thead>
                          <tr>
                            <th>DAYS</th>
                            <th>SLOT TIMINGS</th>
                          </tr>
                        </thead>
                        {this.showTable()}
                      </table>
                    </div>) : (<div><p style={{ marginLeft: '450px', opacity: 0.5 }}>No Time Slots Available for this Recruiter</p></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

}

export default withLocation(RecruiterTimeSlot)