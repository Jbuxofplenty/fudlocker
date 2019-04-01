import { dataConstants } from '../constants';

let dataTemp = JSON.parse(localStorage.getItem('data'));
const initialState = dataTemp !== 'null' ? { data } : {};

export function data(state = initialState, action) {
  switch (action.type) {
    case dataConstants.UPDATE_MEALS_REQUEST:
      return {
        ...state,
        meals: {
          isPending: true
        }
      };
    case dataConstants.UPDATE_MEALS_SUCCESS:
      return {
        ...state,
        meals: {
          isLoaded: true,
          isPending: false,
          data: action.data
        }
      };
    case dataConstants.UPDATE_MEALS_FAILURE:
      return {
        ...state,
        meals: {}
      };
    case dataConstants.UPDATE_MEALS_FOR_SALE_REQUEST:
      return {
        ...state,
        mealsForSale: {
          isPending: true
        }
      };
    case dataConstants.UPDATE_MEALS_FOR_SALE_SUCCESS:
      return {
        ...state,
        mealsForSale: {
          isLoaded: true,
          isPending: false,
          data: action.data
        }
      };
    case dataConstants.UPDATE_MEALS_FOR_SALE_FAILURE:
      return {
        ...state,
        mealsForSale: {}
      };
    case dataConstants.UPDATE_PURCHASED_SUCCESS:
      return {
        ...state,
        purchasedMeals: {
          isLoaded: true,
          isPending: false,
          data: action.data
        }
      };
    case dataConstants.UPDATE_PURCHASED_FAILURE:
      return {
        ...state,
        purchasedMeals: {}
      };
    case dataConstants.UPDATE_COMPLETED_ORDERS_SUCCESS:
      return {
        ...state,
        completedOrders: {
          isLoaded: true,
          isPending: false,
          data: action.data
        }
      };
    case dataConstants.UPDATE_COMPLETED_ORDERS_FAILURE:
      return {
        ...state,
        completedOrders: {}
      };
    case dataConstants.UPDATE_LOCATIONS_REQUEST:
      return {
        ...state,
        locations: {
          isPending: true
        }
      };
    case dataConstants.UPDATE_LOCATIONS_SUCCESS:
      return {
        ...state,
        locations: {
          isLoaded: true,
          isPending: false,
          data: action.data
        }
      };
    case dataConstants.UPDATE_LOCATIONS_FAILURE:
      return {
        ...state,
        locations: {}
      };
    case dataConstants.UPDATE_INVENTORY_REQUEST:
      return {
        ...state,
        inventory: {
          isPending: true
        }
      };
    case dataConstants.UPDATE_INVENTORY_SUCCESS:
      return {
        ...state,
        inventory: {
          isLoaded: true,
          isPending: false,
          data: action.data
        }
      };
    case dataConstants.UPDATE_INVENTORY_FAILURE:
      return {
        ...state,
        inventory: {}
      };
    case dataConstants.UPDATE_PICKEDUP_REQUEST:
      return {
        ...state,
        pickedUp: {
          isPending: true
        }
      };
    case dataConstants.UPDATE_PICKEDUP_SUCCESS:
      return {
        ...state,
        pickedUp: {
          isLoaded: true,
          isPending: false,
          data: action.data
        }
      };
    case dataConstants.UPDATE_PICKEDUP_FAILURE:
      return {
        ...state,
        pickedUp: {}
      };
    default:
      return state
  }
}
