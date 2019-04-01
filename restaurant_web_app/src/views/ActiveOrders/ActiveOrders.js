import React, { Component } from 'react';

export default class ActiveOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      org: null,
      purchasedNotCompleted: null,
      uid: null,
      total: null,
    };
  }

  processData() {
    var purchasedNotCompleted = [];
    for (var i in this.props.purchased) {
      if (!(i in this.props.completed)) {
        purchasedNotCompleted.push(this.props.purchased[i]);
      }
    }
    return purchasedNotCompleted;
  }

  async componentDidMount() {
    var purchasedNotCompleted = this.processData();
    this.setState({ purchasedNotCompleted });
  }

  renderItems() {
    return (
      this.state.purchasedNotCompleted.map((order, index) =>
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
    if (this.state.purchasedNotCompleted) {
      return (
        <div>
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
              <a href="http://fudlkr.com" className="check-text">Check all the orders</a>
            </div>
          </div>
        </div>
      );
    }
    return <div>Loading...</div>;
  }
}

