import { userConstants } from '../constants';

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user !== 'null' ? { loggedIn: true, user } : {};

export function authentication(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user,
        userData: action.userData,
      };
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.UPDATE_REQUEST:
      return {
        loggedIn: true,
        user: action.user,
        userData: action.userData,
      };
    case userConstants.UPDATE_SUCCESS:
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.UPDATE_FAILURE:
      return {};
    case userConstants.LOGOUT:
      return {};
    default:
      return state
  }
}
