import React, { Component } from 'react';
import { connect } from 'react-redux';
import Chart from 'chart.js';
import { dataActions } from '../../actions';
import { Responsive, WidthProvider } from 'react-grid-layout';
import RecentOrders from '../RecentOrders/RecentOrders';
import FrequentUsers from '../FrequentUsers/FrequentUsers';
import ReactDOM from 'react-dom';

const dateformat = require('dateformat');

const ResponsiveGridLayout = WidthProvider(Responsive);
const layouts = {
  lg: [
    { i: 'a', h: 3, w: 6, x: 0, y: 0, static: true },
    { i: 'b', h: 3, w: 6, x: 6, y: 0, static: true },
    { i: 'c', h: 5, w: 12, x: 0, y: 3, static: true },
    { i: 'd', h: 5, w: 12, x: 0, y: 8, static: true },
  ],
  sm: [
    { i: 'a', h: 3, w: 6, x: 0, y: 0, static: true },
    { i: 'b', h: 3, w: 6, x: 0, y: 3, static: true },
    { i: 'c', h: 5, w: 12, x: 0, y: 6, static: true },
    { i: 'd', h: 5, w: 12, x: 0, y: 11, static: true },
  ],
  md: [
    { i: 'a', h: 3, w: 5, x: 0, y: 0, static: true },
    { i: 'b', h: 3, w: 5, x: 5, y: 0, static: true },
    { i: 'c', h: 5, w: 5, x: 0, y: 3, static: true },
    { i: 'd', h: 5, w: 5, x: 5, y: 3, static: true },
  ],
  xs: [
    { i: 'a', h: 3, w: 4, x: 0, y: 0, static: true },
    { i: 'b', h: 3, w: 4, x: 0, y: 3, static: true },
    { i: 'c', h: 5, w: 12, x: 0, y: 6, static: true },
    { i: 'd', h: 5, w: 12, x: 0, y: 11, static: true },
  ],
  xxs: [
    { i: 'a', h: 2, w: 4, x: 0, y: 0, static: true },
    { i: 'b', h: 2, w: 4, x: 4, y: 0, static: true },
    { i: 'c', h: 4, w: 12, x: 0, y: 2, static: true },
    { i: 'd', h: 4, w: 12, x: 0, y: 6, static: true },
  ]
};

class DefaultDict {
  constructor(defaultVal) {
    return new Proxy({}, {
      get: (target, name) => name in target ? target[name] : defaultVal
    })
  }
}

class StatisticsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
      locationsData: null,
      purchased: null,
      completed: null,
      inventory: null,
      orderCategoriesData: null,
      recentOrdersData: null,
      salesData: null,
      usersData: null,
      inventoryData: null,
      startDate: Date.now() - (60 * 60 * 24 * 1000),
      endDate: Date.now(),
      type: "Orders",
      range: "Daily",
      salesGraph: null,
      ordersPieGraph: null,
      orderTitle: dateformat(Date.now(), 'dddd, mmmm d, yyyy'),
    };
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleRangeChange = this.handleRangeChange.bind(this);
  }

  async updateData() {
    const { dispatch, user, userData, history } = this.props;
    if (user && userData && userData.org) {
      await dispatch(dataActions.populateStatistics());
      var locationsData = JSON.parse(localStorage.getItem('locations'));
      var purchased = JSON.parse(localStorage.getItem('purchased'));
      var completed = JSON.parse(localStorage.getItem('completed'));
      var inventory = JSON.parse(localStorage.getItem('inventory'));
      if (locationsData && purchased && completed && inventory) {
        this.setState({ locationsData, purchased, completed, inventory });

        if (this.processData()) {
          this.plotGraphs(user, userData);
        }
      }
    }
    else {
      if (!user) {
        alert('No logged in user!');
      }
      else {
        alert('Logged in user not associated with an organization!');
        localStorage.setItem('user', null);
      }
      window.clearInterval();
      history.push('login');
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  componentDidMount() {
    this.updateData();
    var intervalId = setInterval(() => { this.updateData() }, 100000);
    this.setState({ intervalId });
  }

  async plotGraphs(user, userData) {
    if (this.state.type === "Orders") {
      if (this.state.salesGraph !== null) {
        this.state.salesGraph.destroy();
      }
      if (this.state.ordersPieGraph !== null) {
        this.state.ordersPieGraph.destroy();
      }
      var ctx = document.getElementById("sales_container").getContext("2d");
      var temp = new Chart(ctx, {
        type: 'line',
        data: this.state.salesData
      });
      var ctx1 = document.getElementById("order_category_container").getContext("2d");
      var temp1 = new Chart(ctx1, {
        type: 'pie',
        data: this.state.orderCategoriesData
      });
      this.setState({ salesGraph: temp, ordersPieGraph: temp1 });
      const recent_orders_container = document.querySelector('#recent_orders_container');
      await ReactDOM.render(<RecentOrders user={user} userData={userData} purchased={this.state.purchased} completed={this.state.completed} date={this.state.orderTitle} startDate={this.state.startDate} />, recent_orders_container);
      const users_container = document.querySelector('#users_container');
      await ReactDOM.render(<FrequentUsers user={user} userData={userData} usersData={this.state.usersData} />, users_container);
    }
  }

  async processData() {
    if (this.state.type === "Orders") {
      // Line graph
      var tempOrderTitle = dateformat(Date.now(), 'dddd, mmmm d, yyyy');
      var labels = [];
      var sortable = [];
      var tempArray = [];
      var data = [];
      var i = 0;
      var total = 0.0;

      Object.entries(this.state.purchased).forEach(entry => {
        let key = entry[0];
        let value = entry[1];
        sortable.push([value, this.state.purchased[key]['datePurchased']]);
      });

      sortable.sort(function (a, b) {
        return a[1] - b[1];
      });

      while (i < sortable.length && parseFloat(sortable[i][1]) < this.state.startDate) {
        i++;
      }

      if (this.state.range === "Daily") {
        let step = (this.state.endDate - this.state.startDate) / 24;
        for (let date = this.state.startDate; date <= this.state.endDate; date+=step) {
          let d = dateformat(date, 'h:MM TT');
          labels.push(d);
          tempArray = [];
          total = 0.0;
          while (i < sortable.length && sortable[i][1] >= date && sortable[i][1] <= date+step) {
            tempArray.push(sortable[i][0]);
            total += parseFloat(sortable[i][0]['strCost']);
            i++;
          }
          data.push(total);
        }
      }
      else if (this.state.range === "Weekly") {
        let step = (this.state.endDate - this.state.startDate) / 7;
        for (let date = this.state.startDate; date <= this.state.endDate; date += step) {
          let d = new Date(date).getDay();
          var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          var n = weekday[(d+1)%7];
          labels.push(n);
          tempArray = [];
          total = 0.0;
          while (i < sortable.length && sortable[i][1] >= date && sortable[i][1] <= date + step) {
            tempArray.push(sortable[i][0]);
            total += parseFloat(sortable[i][0]['strCost']);
            i++;
          }
          data.push(total);
        }
        tempOrderTitle = dateformat(Date.now(), 'mmmm d, yyyy');
      }
      else if (this.state.range === "Monthly") {
        let step = (this.state.endDate - this.state.startDate) / 30.0;
        let add = true;
        for (let date = this.state.startDate; date <= this.state.endDate; date += step) {
          if (add) {
            let d = dateformat(date+step, 'mmm dd');
            labels.push(d);
            tempArray = [];
            total = 0.0;
            while (i < sortable.length && parseFloat(sortable[i][1]) >= date && parseFloat(sortable[i][1]) <= (date + 2*step)) {
              tempArray.push(sortable[i][0]);
              total += parseFloat(sortable[i][0]['strCost']);
              i++;
            }
            data.push(total);
            add = false;
          }
          else {
            add = true;
          }
        }
        tempOrderTitle = dateformat(Date.now(), 'mmmm d, yyyy');
      }
      else if (this.state.range === "Yearly") {
        let step = (this.state.endDate - this.state.startDate) / 12.0;
        for (let date = this.state.startDate; date <= this.state.endDate; date += step) {
          let d = dateformat(date+step, 'mmmm');
          labels.push(d);
          tempArray = [];
          total = 0.0;
          while (i < sortable.length && parseFloat(sortable[i][1]) >= date && parseFloat(sortable[i][1]) <= (date + step)) {
            tempArray.push(sortable[i][0]);
            total += parseFloat(sortable[i][0]['strCost']);
            i++;
          }
          data.push(total);
        }
        tempOrderTitle = dateformat(Date.now(), 'yyyy');
      }
      else {
        await this.setState({ startDate: parseFloat(sortable[0][1]) });
        while (i < sortable.length && parseFloat(sortable[i][1]) < this.state.startDate) {
          i++;
        }
        let step = (this.state.endDate - this.state.startDate) / 12;
        for (let date = this.state.startDate; date <= this.state.endDate; date += step) {
          let d = dateformat(date, 'mmm yyyy');
          labels.push(d);
          tempArray = [];
          total = 0.0;
          while (i < sortable.length && parseFloat(sortable[i][1]) >= date && parseFloat(sortable[i][1]) <= date + step) {
            tempArray.push(sortable[i][0]);
            total += parseFloat(sortable[i][0]['strCost']);
            i++;
          }
          data.push(total);
        }
        tempOrderTitle = 'All-Time';
      }
      
      var lineChartData = {
        labels: labels,
        datasets: [
          {
            label: "Sales ($)",
            backgroundColor: "#ADD8E6",
            strokeColor: "#1f76ee",
            pointColor: "#1f76ee",
            pointStrokeColor: "#ADD8E6",
            pointHighlightFill: "#ADD8E6",
            pointHighlightStroke: "#1f76ee",
            data: data,
            scaleLabel:
              function (label) { return '$' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
          }
        ]
      }

      // Pie Data
      i = 0;
      var tempObject = { "American": 0, "Appetizers": 0, "Asian": 0, "Italian": 0, "Meat": 0, "Mexican": 0, "Salads": 0 };

      while (i < sortable.length && parseFloat(sortable[i][1]) < this.state.startDate) {
        i++;
      }

      while (i < sortable.length && parseFloat(sortable[i][1]) <= this.state.endDate) {
        tempObject[sortable[i][0]['strCategory']] += 1;
        i++;
      }

      var pieData = {
        labels: ["American", "Appetizers", "Asian", "Italian", "Meat", "Mexican", "Salads"],
        datasets: [{
          label: "Percentage of Sales (%)",
          backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#ec6f9c", "#c4a755"],
          data: [tempObject["American"], tempObject["Appetizers"], tempObject["Asian"], tempObject["Italian"], tempObject["Meat"], tempObject["Mexican"], tempObject["Salads"]]
        }]
      };

      // Frequented Users
      var tempUserOrders = new DefaultDict(0);
      var tempUserOrderTimes = new DefaultDict(0);
      var tempUserOrderHeadshots = new DefaultDict("");
      for (i = 0; i < sortable.length; i++) {
        tempUserOrders[sortable[i][0]['name']] += 1;
        tempUserOrderHeadshots[sortable[i][0]['name']] = sortable[i][0]['headshot'];
        if (tempUserOrderTimes[sortable[i][0]['name']] < parseFloat(sortable[i][0]['datePurchased'])) {
          tempUserOrderTimes[sortable[i][0]['name']] = parseFloat(sortable[i][0]['datePurchased']);
        }
      }

      tempArray = [];
      for (var user in tempUserOrders) {
        tempArray.push({ name: user, orders: tempUserOrders[user], lastPurchased: dateformat(tempUserOrderTimes[user], 'dddd, mmmm d, yyyy'), headshot: tempUserOrderHeadshots[user] });
      }
      this.setState({ salesData: lineChartData, orderCategoriesData: pieData, orderTitle: tempOrderTitle, usersData: tempArray });
    }
  }

  async handleTypeChange(event) {
    await this.setState({ type: event.target.value });
    await this.processData();
    this.plotGraphs();
  }

  async handleRangeChange(event) {
    await this.setState({ range: event.target.value });
    if (this.state.range === "Daily") {
      this.setState({ startDate: Date.now() - (60 * 60 * 24 * 1000) });
    }
    else if (this.state.range === "Weekly") {
      this.setState({ startDate: Date.now() - (60 * 60 * 24 * 1000 * 7) });
    }
    else if (this.state.range === "Monthly") {
      this.setState({ startDate: Date.now() - (60 * 60 * 24 * 1000 * 30) });
    }
    else if (this.state.range === "Yearly") {
      this.setState({ startDate: Date.now() - (60 * 60 * 24 * 1000 * 365) });
    }
    else {
      this.setState({ startDate: 0 });
    }
    await this.processData();
    this.plotGraphs();
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    const type = this.state.type;
    return (
      <div>
      { type === "Orders" ? (
          <div>
            <div className="stats-container">
              <h6 className="header-text">Statistics</h6>
              <div>
                <div className="select-container">
                  <label className="range-select-container">Type</label>
                  <label className="range-select-container">Range</label>
                </div>
                <div className="select-container">
                  <select onChange={this.handleTypeChange} id="type_select" className="form-control range-select-container" value={this.state.type}>
                    <option>Orders</option>
                    <option>Inventory</option>
                  </select>
                  <select onChange={this.handleRangeChange} id="range_select" className="form-control range-select-container" value={this.state.range}>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Yearly</option>
                    <option>All-Time</option>
                  </select>
                </div>
              </div>
            </div>
            <ResponsiveGridLayout className="layout" layouts={layouts}
              breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
              cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}>
              <div key='a' className="data-container">
                <h6 className="header-text">Sales</h6>
                <canvas id="sales_container" className="data-container"></canvas>
              </div>
              <div key='b' className="data-container">
                <h6 className="header-text">Percentage of Orders by Category</h6>
                <canvas id="order_category_container" className="data-container"></canvas>
              </div>
              <div key='c' className="data-container">
                <h6 className="header-text">Recent Orders</h6>
                <div id="recent_orders_container" className="data-container" />
              </div>
              <div key='d' className="data-container">
                <h6 className="header-text">Highest Frequented Users</h6>
                <div id="users_container" className="data-container" />
              </div>
            </ResponsiveGridLayout>
          </div>) : (
            <div>
              <div className="stats-container">
                <h6 className="header-text">Statistics</h6>
                <div>
                  <div className="select-container">
                    <label className="range-select-container">Type</label>
                    <label className="range-select-container">Range</label>
                  </div>
                  <div className="select-container">
                    <select onChange={this.handleTypeChange} id="type_select" className="form-control range-select-container" >
                      <option>Orders</option>
                      <option>Inventory</option>
                    </select>
                    <select onChange={this.handleRangeChange} id="range_select" className="form-control range-select-container">
                      <option>Daily</option>
                      <option>Monthly</option>
                      <option>Yearly</option>
                      <option>All-Time</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="data-container">
                <h6 className="header-text">Inventory Statistics</h6>
                <canvas id="inventory_stats_container"></canvas>
              </div>
            </div>
          )
        }
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

const Stats = connect(mapStateToProps)(StatisticsPage);
export default Stats;
