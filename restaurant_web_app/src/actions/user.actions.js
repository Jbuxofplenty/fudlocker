import { userConstants } from '../constants';
import { alertActions } from './';
import fire from "../firebase";

export const userActions = {
    login,
    logout,
    //register,
    //delete: _delete
};

function login(email, password, history) {
  return dispatch => {
    fire.auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        var tempUser = {};
        if (user) {
          fire.database().ref('/users/' + user.user.uid).once('value').then(function (snapshot) {
            tempUser["name"] = snapshot.val().name;
            tempUser["headshot"] = snapshot.val().headshot;
            tempUser["phone"] = snapshot.val().phone;
            tempUser["org"] = snapshot.val().org;
            localStorage.setItem('user', JSON.stringify(user.valueOf()));
            localStorage.setItem('userData', JSON.stringify(tempUser));
            dispatch(success(user, tempUser));
            history.push('/');
          },
            error => {
              localStorage.setItem('user', null);
              localStorage.setItem('userData', null);
              dispatch(failure(error.toString()));
              dispatch(alertActions.error(error.toString()));
            });
          dispatch(request({ email }));
        }
      },
      error => {
          localStorage.setItem('user', null);
          localStorage.setItem('userData', null);
          dispatch(failure(error.toString()));
          dispatch(alertActions.error(error.toString()));
        });
    
  };

  function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
  function success(user, userData) { return { type: userConstants.LOGIN_SUCCESS, user, userData } }
  function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout(firebase) {
    fire.auth().signOut();
    return { type: userConstants.LOGOUT };
}

//function register(user) {
//    return dispatch => {
//        dispatch(request(user));

//        userService.register(user)
//            .then(
//                user => { 
//                    dispatch(success());
//                    history.push('/login');
//                    dispatch(alertActions.success('Registration successful'));
//                },
//                error => {
//                    dispatch(failure(error.toString()));
//                    dispatch(alertActions.error(error.toString()));
//                }
//            );
//    };

//    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
//    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
//    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
//}

//function getAll() {
//    return dispatch => {
//        dispatch(request());

//        userService.getAll()
//            .then(
//                users => dispatch(success(users)),
//                error => dispatch(failure(error.toString()))
//            );
//    };

//    function request() { return { type: userConstants.GETALL_REQUEST } }
//    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
//    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
//}

//// prefixed function name with underscore because delete is a reserved word in javascript
//function _delete(id) {
//    return dispatch => {
//        dispatch(request(id));

//        userService.delete(id)
//            .then(
//                user => dispatch(success(id)),
//                error => dispatch(failure(id, error.toString()))
//            );
//    };

//    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
//    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
//    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
//}
