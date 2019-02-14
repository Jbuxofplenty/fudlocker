import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { dataActions } from '../../actions';
import Locations from '../Locations/Locations';
import PriceReport from '../PriceReport/PriceReport';
import ReactDOM from 'react-dom';
import ActiveOrders from '../ActiveOrders/ActiveOrders';

const ResponsiveGridLayout = WidthProvider(Responsive);
const layouts = {
  lg: [
    { i: 'a', h: 6, w: 6, x: 0, y: 0, static: true },
    { i: 'b', h: 6, w: 6, x: 6, y: 0, static: true },
    { i: 'c', h: 5, w: 12, x: 0, y: 6, static: true },
  ],
  sm: [
    { i: 'a', h: 6, w: 3, x: 0, y: 0, static: true },
    { i: 'b', h: 6, w: 3, x: 3, y: 0, static: true },
    { i: 'c', h: 5, w: 6, x: 0, y: 6, static: true }
  ],
  md: [
    { i: 'a', h: 6, w: 5, x: 0, y: 0, static: true },
    { i: 'b', h: 6, w: 5, x: 5, y: 0, static: true },
    { i: 'c', h: 5, w: 10, x: 0, y: 6, static: true }
  ],
  xs: [
    { i: 'a', h: 4, w: 3, x: 0, y: 0, static: true },
    { i: 'b', h: 4, w: 3, x: 3, y: 0, static: true },
    { i: 'c', h: 5, w: 6, x: 0, y: 4, static: true }
  ],
  xxs: [
    { i: 'a', h: 4, w: 1, x: 0, y: 0, static: true },
    { i: 'b', h: 4, w: 1, x: 1, y: 0, static: true },
    { i: 'c', h: 5, w: 6, x: 0, y: 4, static: true }
  ]
};

class DashboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
    };
  }

  async componentDidMount() {
    const { dispatch, user, userData } = this.props;
    await dispatch(dataActions.populateDashboard());
    var locationsData = JSON.parse(localStorage.getItem('locations'));
    var purchased = JSON.parse(localStorage.getItem('purchased'));
    var completed = JSON.parse(localStorage.getItem('completed'));
    var meals = JSON.parse(localStorage.getItem('meals'));
    var mealsForSale = JSON.parse(localStorage.getItem('mealsForSale'));
    const locations_container = document.querySelector('#locations_container');
    await ReactDOM.render(<Locations user={user} userData={userData} locationsData={locationsData} purchased={purchased} completed={completed} meals={meals} mealsForSale={mealsForSale} />, locations_container);
    const price_report_container = document.querySelector('#price_report_container');
    await ReactDOM.render(<PriceReport user={user} userData={userData} purchased={purchased} completed={completed} />, price_report_container);
    const active_orders_container = document.querySelector('#active_orders_container');
    await ReactDOM.render(<ActiveOrders user={user} userData={userData} purchased={purchased} completed={completed} />, active_orders_container);
  }


  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    return (
      <div>
        <ResponsiveGridLayout className="layout" layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}>
          <div key='a' className="data-container">
            <h6 className="header-text">Locations</h6>
            <div id="locations_container"></div>
          </div>
          <div key='b'>
            <div className="data-container">
              <h6 className="header-text">Active Order List</h6>
              <div id="active_orders_container"></div>
            </div>
          </div>
          <div key='c'>
            <h6 className="header-text">Daily Sales Report</h6>
            <div id="price_report_container" className="data-container"/>
          </div>
        </ResponsiveGridLayout>
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

const Dashboard = connect(mapStateToProps)(DashboardPage);
export default Dashboard;
