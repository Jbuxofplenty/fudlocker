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
      intervalId: null,
    };
  }

  async updateData() {
    const { dispatch, user, userData, history } = this.props;
    if (user && userData && userData.org) {
      await dispatch(dataActions.populateInventory());
      var inventory = await JSON.parse(localStorage.getItem('inventory'));
      var locations = await JSON.parse(localStorage.getItem('locations'));
      if (inventory && locations) {
        inventory = Object.values(inventory);
        await this.setState({ inventory, locations });
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
    var intervalId = setInterval(() => { this.updateData() }, 2000);
    this.setState({ intervalId });
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
