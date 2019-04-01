import { dataConstants } from '../constants';
import { alertActions } from './';
import fire from "../firebase";

export const dataActions = {
  populateDashboard,
  populateAddMeal,
  populateInventory,
  populateStatistics,
};

function populateStatistics() {
  populateInventory();
  var user = JSON.parse(localStorage.getItem('userData'));
  return dispatch => {
    fire.database().ref('/restaurants/' + user.org + '/lockers/data').once('value', function (snapshot) {
      let tempArray = {};
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        tempArray[childData["type"]] = childData;
      });
      localStorage.setItem('locations', JSON.stringify(tempArray));
      dispatch(locationsSuccess(tempArray));
    }, function (error) {
      if (error) {
        dispatch(locationsFailure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    });

    var pickedUp = JSON.parse(localStorage.getItem('pickedUp'));
    fire.database().ref('/restaurants/' + user.org + '/orders/purchased').once('value', function (snapshot) {
      let tempCompleted = {};
      let tempPurchased = {};
      snapshot.forEach(function (childSnapshot) {
        childSnapshot.forEach(function (childChildSnapshot) {
          var childData = childChildSnapshot.val();
          if (pickedUp[childChildSnapshot.key]) {
            for (var i in childData) {
              tempCompleted[childChildSnapshot.key] = childData[i];
            }
          }
          for (var j in childData) {
            tempPurchased[childChildSnapshot.key] = childData[j];
          }
        })
      });
      localStorage.setItem('completed', JSON.stringify(tempCompleted));
      dispatch(completedSuccess(tempCompleted));

      localStorage.setItem('purchased', JSON.stringify(tempPurchased));
      dispatch(purchasedSuccess(tempPurchased));
    }, function (error) {
      if (error) {
        dispatch(completedFailure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    });
  };
  
  function completedSuccess(data) { return { type: dataConstants.UPDATE_COMPLETED_ORDERS_SUCCESS, data } }
  function completedFailure(error) { return { type: dataConstants.UPDATE_COMPLETED_ORDERS_FAILURE, error } }
  function purchasedSuccess(data) { return { type: dataConstants.UPDATE_PURCHASED_SUCCESS, data } }

  function locationsSuccess(data) { return { type: dataConstants.UPDATE_LOCATIONS_SUCCESS, data } }
  function locationsFailure(error) { return { type: dataConstants.UPDATE_LOCATIONS_FAILURE, error } }
}


function populateAddMeal() {
  var user = JSON.parse(localStorage.getItem('userData'));
  return dispatch => {
    fire.database().ref('/restaurants/' + user.org + '/lockers/data').once('value', function (snapshot) {
      let tempArray = {};
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        tempArray[childData["type"]] = childData;
      });
      localStorage.setItem('locations', JSON.stringify(tempArray));
      dispatch(locationsSuccess(tempArray));
    }, function (error) {
      if (error) {
        dispatch(locationsFailure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    });
  };

  function locationsSuccess(data) { return { type: dataConstants.UPDATE_LOCATIONS_SUCCESS, data } }
  function locationsFailure(error) { return { type: dataConstants.UPDATE_LOCATIONS_FAILURE, error } }
}

function populateInventory() {
  var user = JSON.parse(localStorage.getItem('userData'));
  return dispatch => {
    fire.database().ref('/restaurants/' + user.org + '/templates/default/').once('value', function (snapshot) {
      let tempArray = {};
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        tempArray[childData["idTemplate"]] = childData;
      });
      localStorage.setItem('inventory', JSON.stringify(tempArray));
      dispatch(inventorySuccess(tempArray));
    }, function (error) {
      if (error) {
        dispatch(inventoryFailure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    });
  };

  function inventorySuccess(data) { return { type: dataConstants.UPDATE_INVENTORY_SUCCESS, data } }
  function inventoryFailure(error) { return { type: dataConstants.UPDATE_INVENTORY_FAILURE, error } }
}

function populateDashboard() {
  return dispatch => {
    var user = JSON.parse(localStorage.getItem('userData'));
    fire.database().ref('/restaurants/' + user.org + '/lockers/data').once('value', function (snapshot) {
      let tempArray = {};
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        tempArray[childSnapshot.val().type] = childData;
      });
      localStorage.setItem('locations', JSON.stringify(tempArray));
      dispatch(locationsSuccess(tempArray));
    }, function (error) {
      if (error) {
        dispatch(locationsFailure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
      });
    
    fire.database().ref('/meals/forSale').once('value', function (snapshot) {
      let tempArray = {};
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        tempArray[childSnapshot.key] = childData;
      });
      localStorage.setItem('mealsForSale', JSON.stringify(tempArray));
      dispatch(mealsForSaleSuccess(tempArray));
    }, function (error) {
      if (error) {
        dispatch(mealsForSaleFailure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      } 
      });

    var mealsForSale = JSON.parse(localStorage.getItem('mealsForSale'));
    fire.database().ref('/meals/all/meals').once('value', function (snapshot) {
      let tempArray = {};
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        if (mealsForSale[childSnapshot.key]) {
          for (var i in childData) {
            tempArray[childSnapshot.key] = childData[i];
          }
        }
      });
      localStorage.setItem('meals', JSON.stringify(tempArray));
      dispatch(mealsSuccess(tempArray));
    }, function (error) {
      if (error) {
        dispatch(mealsFailure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    });
    
    fire.database().ref('/restaurants/' + user.org + '/inventory/pickedUp').once('value', function (snapshot) {
      let tempArray = {};
      snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        tempArray[childSnapshot.key] = childData;
      });
      localStorage.setItem('pickedUp', JSON.stringify(tempArray));
      dispatch(pickedUpSuccess(tempArray));
    }, function (error) {
      if (error) {
        dispatch(pickedUpFailure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
      });
    
    var pickedUp = JSON.parse(localStorage.getItem('pickedUp'));
    fire.database().ref('/restaurants/' + user.org + '/orders/purchased').once('value', function (snapshot) {
      let tempCompleted = {};
      let tempPurchased = {};
      snapshot.forEach(function (childSnapshot) {
        childSnapshot.forEach(function (childChildSnapshot) {
          var childData = childChildSnapshot.val();
          if (pickedUp[childChildSnapshot.key]) {
            for (var i in childData) {
              tempCompleted[childChildSnapshot.key] = childData[i];
            }
          }
          for (var j in childData) {
            tempPurchased[childChildSnapshot.key] = childData[j];
          }
        })
      });
      localStorage.setItem('completed', JSON.stringify(tempCompleted));
      dispatch(completedSuccess(tempCompleted));

      localStorage.setItem('purchased', JSON.stringify(tempPurchased));
      dispatch(purchasedSuccess(tempPurchased));
    }, function (error) {
      if (error) {
        dispatch(completedFailure(error.toString()));
        dispatch(alertActions.error(error.toString()));
      }
    });
  };
  
  function mealsSuccess(data) { return { type: dataConstants.UPDATE_MEALS_SUCCESS, data } }
  function mealsFailure(error) { return { type: dataConstants.UPDATE_MEALS_FOR_SALE_FAILURE, error } }
  function completedSuccess(data) { return { type: dataConstants.UPDATE_COMPLETED_ORDERS_SUCCESS, data } }
  function completedFailure(error) { return { type: dataConstants.UPDATE_COMPLETED_ORDERS_FAILURE, error } }
  function purchasedSuccess(data) { return { type: dataConstants.UPDATE_PURCHASED_SUCCESS, data } }
  function mealsForSaleFailure(error) { return { type: dataConstants.UPDATE_MEALS_FAILURE, error } }
  function mealsForSaleSuccess(data) { return { type: dataConstants.UPDATE_MEALS_FOR_SALE_SUCCESS, data } }
  function locationsSuccess(data) { return { type: dataConstants.UPDATE_LOCATIONS_SUCCESS, data } }
  function locationsFailure(error) { return { type: dataConstants.UPDATE_LOCATIONS_FAILURE, error } } 
  function pickedUpSuccess(data) { return { type: dataConstants.UPDATE_PICKEDUP_SUCCESS, data } }
  function pickedUpFailure(error) { return { type: dataConstants.UPDATE_PICKEDUP_FAILURE, error } }
  };
