const React = require('react');
const ReactDOM = require('react-dom');
import * as $ from 'jquery';
import firebase from '../firebase';
const e = React.createElement;

export default class ActiveInventory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      headshot: null,
      email: null,
      phone: null,
    };
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

  async check_logged_in() {
    await firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
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

  async componentDidMount() {
    await this.check_logged_in();
  }

  render() {
    if (this.state.name) {
      return (
        <div className="layer w-100">
          <ul className="list-task list-group" data-role="tasklist">
            <li className="list-group-item bdw-0" data-role="task" id="order1">
              <div className="checkbox checkbox-circle checkbox-info peers ai-c">
                <input type="checkbox" id="inputCall1" name="inputCheckboxesCall" className="peer"/>
                  <label htmlFor="inputCall1" className=" peers peer-greed js-sb ai-c">
                    <span className="peer peer-greed">Order #: 316 (Tomato Basil Pizza)</span>
                    <span className="peer">
                      <span className="badge badge-pill fl-r badge-danger lh-0 p-10">~2 minutes</span>
                    </span>
                  </label>
                </div>
              </li>
              <li className="list-group-item bdw-0" data-role="task" id="order2">
                <div className="checkbox checkbox-circle checkbox-info peers ai-c">
                  <input type="checkbox" id="inputCall2" name="inputCheckboxesCall" className="peer"/>
                    <label htmlFor="inputCall1" className=" peers peer-greed js-sb ai-c">
                      <span className="peer peer-greed">Order #: 320 (Tomato Soup)</span>
                      <span className="peer">
                        <span className="badge badge-pill fl-r badge-warning lh-0 p-10">10 minutes</span>
                      </span>
                    </label>
                  </div>
                </li>
                <li className="list-group-item bdw-0" data-role="task" id="order3">
                  <div className="checkbox checkbox-circle checkbox-info peers ai-c">
                    <input type="checkbox" id="inputCall3" name="inputCheckboxesCall" className="peer"/>
                      <label htmlFor="inputCall1" className=" peers peer-greed js-sb ai-c">
                        <span className="peer peer-greed">Order #: 321 (French Onion Soup)</span>
                        <span className="peer">
                          <span className="badge badge-pill fl-r badge-warning lh-0 p-10">15 minutes</span>
                        </span>
                      </label>
                    </div>
                  </li>
                  <li className="list-group-item bdw-0" data-role="task" id="order4">
                    <div className="checkbox checkbox-circle checkbox-info peers ai-c">
                      <input type="checkbox" id="inputCall4" name="inputCheckboxesCall" className="peer"/>
                       <label htmlFor="inputCall1" className=" peers peer-greed js-sb ai-c">
                          <span className="peer peer-greed">Order #: 317 (Mushroom Pizza)</span>
                          <span className="peer">
                            <span className="badge badge-pill fl-r badge-success lh-0 p-10">28 minutes</span>
                          </span>
                        </label>
                      </div>
                    </li>
                    <li className="list-group-item bdw-0" data-role="task" id="order5">
                      <div className="checkbox checkbox-circle checkbox-info peers ai-c">
                        <input type="checkbox" id="inputCall5" name="inputCheckboxesCall" className="peer"/>
                          <label htmlFor="inputCall1" className=" peers peer-greed js-sb ai-c">
                            <span className="peer peer-greed">Order #: 318 (Shrimp Alfredo)</span>
                            <span className="peer">
                              <span className="badge badge-pill fl-r badge-success lh-0 p-10">47 min</span>
                            </span>
                          </label>
                        </div>
                      </li>
                      <li className="list-group-item bdw-0" data-role="task" id="order6">
                        <div className="checkbox checkbox-circle checkbox-info peers ai-c">
                          <input type="checkbox" id="inputCall6" name="inputCheckboxesCall" className="peer"/>
                            <label htmlFor="inputCall1" className=" peers peer-greed js-sb ai-c">
                              <span className="peer peer-greed">Order #: 319 (Reuben Sandwich)</span>
                              <span className="peer">
                                <span className="badge badge-pill fl-r badge-success lh-0 p-10">1 hour</span>
                              </span>
                            </label>
                        </div>
                      </li>
                    </ul>
                  </div>);
    }
    return <div>Loading...</div>;
  }
}

