import React, { Component } from 'react';
import { connect } from 'react-redux';

class InventoryPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      radioSelected: 2,
    };
  }

  async componentDidMount() {
    const { dispatch, user, userData } = this.props;
    //await dispatch(dataActions.addMeal());
  }


  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    return (
      <div className="data-container">
        <h6 className="header-text">Manage Inventory</h6>
        <div id="locations_container"></div>
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

const Inventory = connect(mapStateToProps)(InventoryPage);
export default Inventory;
