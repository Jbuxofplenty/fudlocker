import React, { Component } from 'react';
import { connect } from 'react-redux';
import { dataActions } from '../../actions';
import MealTable from './MealTable';

class InventoryPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      inventory: null,
      locations: null,
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch(dataActions.populateInventory());
    var temp = await localStorage.getItem('inventory');
    var inventory = Object.values(JSON.parse(temp));
    temp = localStorage.getItem('locations');
    var locations = JSON.parse(temp);
    await this.setState({ inventory, locations });
  }


  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {
    const { history } = this.props;
    if (this.state.inventory && this.state.locations) {
      return (
        <div className="data-container">
          <h6 className="header-text">Manage Inventory</h6>
          <div id="locations_container"></div>
          <MealTable inventory={this.state.inventory} locations={this.state.locations} history={history} />
        </div>
      );
    }
    else {
      return null;
    }
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
