const React = require('react');
const ReactDOM = require('react-dom');
import firebase from '../firebase';
const e = React.createElement;

export default class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      headshot: null,
      email: null,
      phone: null,
      validated: true,
      uid: null,
    };
  }
  
  async validate(type) {
    let validated = true;
    this.setState({ validated: true });
    var email = document.getElementById("inputEmail").value;
    var password = document.getElementById("inputPassword").value;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(email).toLowerCase())) {
      document.getElementById("inputEmail").style.borderColor = "green";
    }
    else {
      validated = false;
      alert("Email formatted incorrectly!");
      document.getElementById("inputEmail").style.borderColor = "red";
      return validated;
    }
    if (password.length > 5) {
      document.getElementById("inputPassword").style.borderColor = "green";
    }
    else {
      validated = false;
      alert("Password not at least 6 characters long!");
      document.getElementById("inputPassword").style.borderColor = "red";
      return validated;
    }
    console.log(type);
    if (type.localeCompare("login") == 0) {
      await firebase.auth().signInWithEmailAndPassword(email, password).then((authData) => {
        validated = true;
        console.log(authData);
        this.setState({ uid: authData.user.uid });
      }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          document.getElementById("inputPassword").style.borderColor = "red";
          alert("Password Incorrect!");
        } else {
          document.getElementById("inputEmail").style.borderColor = "red";
          document.getElementById("inputPassword").style.borderColor = "red";
          alert("Email and/or Password Incorrect!");
        }
        this.setState({ validated: false });
        }.bind(this));
      if (this.state.validated) {
        var tempUserInfo = await this.populate_user_info(this.state.uid);
        if (tempUserInfo.org == null) {
          alert("User not associated with an organization!");
          this.setState({ validated: false });
        }
      }
      
    }
    else {
      var name = document.getElementById("inputName").value;
      var confirmPassword = document.getElementById("inputConfirmPassword").value;
      if (name.length > 0) {
        document.getElementById("inputName").style.borderColor = "green";
      }
      else {
        validated = false;
        alert("Name field is required!");
        document.getElementById("inputName").style.borderColor = "red";
        return validated;
      }
      if (confirmPassword.length > 5 && confirmPassword == password) {
        document.getElementById("inputConfirmPassword").style.borderColor = "green";
      }
      else {
        validated = false;
        alert("Password do not match!");
        document.getElementById("inputConfirmPassword").style.borderColor = "red";
        return validated;
      }
    }
    if (!this.state.validated) {
      validated = false;
    }
    return validated;
  }

  async firebase_sign_up() {
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.pass).then((authData) => {
      firebaseApp.database().ref("users/" + authData.user.uid).set({
        email: document.getElementById("inputEmail").value,
        name: document.getElementById("inputName").value,
        phone: "",
        headshot: null,
      });
      this.logInUser();
    }).catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
    }.bind(this));
  }

  async signup_user() {
    if (this.validate('signup')) {
      //this.firebase_sign_up();
    }
  }
  
  async populate_user_info(userId) {
    var user = {};
    //Get the user data
    await firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
      user["name"] = snapshot.val().name;
      user["headshot"] = snapshot.val().headshot;
      user["email"] = snapshot.val().email;
      user["phone"] = snapshot.val().phone;
      user["org"] = snapshot.val().org;
      this.setState({ name: snapshot.val().name });
      this.setState({ headshot: snapshot.val().headshot });
      this.setState({ email: snapshot.val().email });
      this.setState({ phone: snapshot.val().phone });
      this.setState({ org: snapshot.val().org });
    }.bind(this));
    return user;
  }

  async componentDidMount() {
    const { loggedIn } = this.props;
    if (loggedIn) {
      await this.check_logged_in();
    }
  }

  async check_logged_in() {
    await firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        this.setState({ uid: user.uid });
        // User is signed in.
        var tempUserInfo = this.populate_user_info(user.uid);
        tempUserInfo.then(function (value) {
          if (value.org == null) {
            alert("User not associated with an organization!");
            window.location = "../../../signin.html";
          }
        });
      } else {
        // User is signed out.
        window.location = "../../../signin.html";
      }
    }.bind(this), function (error) {
      console.log(error);
      }.bind(this));
  };

  render() {
    const { loggedIn } = this.props;
    if (this.state.name && loggedIn) {
      return (
        <div className="peer mR-10 user-container">
          <div className="peer user-info-container">
            <img className="w-2r bdrs-50p" src={this.state.headshot} alt=""></img>
          </div>
          <div className="peer user-info-container">
            <span className="fsz-sm c-grey-900">{this.state.name}</span>
          </div>
        </div>
      );
    }
    if (!loggedIn) {
      return null;
    }
    return <div>Loading...</div>;
  }
}
User.defaultProps = {
  loggedIn: "true",
};
