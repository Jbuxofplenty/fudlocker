import React, { Component } from 'react';
import { connect } from 'react-redux';
import Calendar from 'react-calendar';

class CalendarPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      date: new Date(),
    };
  }

  async componentDidMount() {

  }


  onChange = date => this.setState({ date })
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    return (
      <div className="data-container">
        <h6 className="header-text">Calendar</h6>
        <div id="locations_container">
          <Calendar
            onChange={this.onChange}
            value={this.state.date}
            className="calendar-container"
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { authentication, data } = state;
  const { user, userData } = authentication;
  const { restaurantData } = data;
  return {
    user,
    userData,
    restaurantData
  };
}

const ReactCalendar = connect(mapStateToProps)(CalendarPage);
export default ReactCalendar;
