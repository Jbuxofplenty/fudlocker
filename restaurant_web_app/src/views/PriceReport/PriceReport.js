import React, { Component } from 'react';
const dateformat = require('dateformat');

export default class PriceReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: null,
      org: null,
      mealsForSale: null,
      uid: null,
      total: null,
    };
  }

  processData() {
    var sortable = [];
    Object.entries(this.props.purchased).forEach(entry => {
      let key = entry[0];
      let value = entry[1];
      sortable.push([value, this.props.purchased[key]['datePurchased']]);
    });

    sortable.sort(function (a, b) {
      return a[1] - b[1];
    });

    var tempArray = [];
    var total = 0.0;
    var count = 0;
    for (var i = 0; i < sortable.length && count < 10; i++) {
      if (parseFloat(sortable[i][0]['datePurchased']) > this.props.startDate) {
        tempArray.push(sortable[i][0]);
        total += parseFloat(sortable[i][0]['strCost']);
        count++;
      }
    }
    this.setState({ total });
    return tempArray;
  }

  async componentDidMount() {
    var orders = this.processData();
    this.setState({ orders });
  }

  renderItems() {
    return (
      this.state.orders.map((order, index) =>
        <tr key={index}>
          <td className="fw-600">{order.strMeal}</td>
          <td><span>{order.name}</span> </td>
          <td>{order.strDatePurchased.slice(order.strDatePurchased.lastIndexOf(',') + 1, order.strDatePurchased.length)}</td>
          <td><span className="text-info">${order.strCost}</span></td>
        </tr>
      )
      );
  }

  render() {
    var date = Date.now();
    var d = dateformat(date, 'dddd, mmmm d, yyyy');
    if (this.state.orders) {
      return (
        <div>
          <div className="sales-report-container">
            <div className="peers ai-c jc-sb gap-40">
              <div className="peer peer-greed">
                <h5>{d}</h5>
                <p className="mB-0">Sales Report</p>
              </div>
              <div className="peer">
                <h3 className="text-right">${this.state.total.toFixed(2)}</h3>
              </div>
            </div>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th className=" bdwT-0">Name</th>
                  <th className=" bdwT-0">Customer</th>
                  <th className=" bdwT-0">Time</th>
                  <th className=" bdwT-0">Price</th>
                </tr>
              </thead>
              <tbody>
                {this.renderItems()}
              </tbody>
            </table>
            <div className="check-container">
              <a href="http://fudlkr.com" className="check-text">Check all the sales</a>
            </div>
          </div>
        </div>
      );
    }
    return <div>Loading...</div>;
  }
}

