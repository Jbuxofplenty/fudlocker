import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { userActions } from '../../../actions';
import { connect } from 'react-redux';

const pathToBackground = require('../../../assets/img/bg.jpg');
const pathToLogo = require('../../../assets/img/logo.png');

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      submitted: false,
      validated: false,
      org: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  async validate() {
    this.setState({ validated: true });
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(this.state.email).toLowerCase())) {
      document.getElementById("inputEmail").style.borderColor = "green";
    }
    else {
      this.setState({ validated: false });
      alert("Email formatted incorrectly!");
      document.getElementById("inputEmail").style.borderColor = "red";
      return false;
    }
    if (this.state.password.length > 5) {
      document.getElementById("inputPassword").style.borderColor = "green";
    }
    else {
      this.setState({ validated: false });
      alert("Password not at least 6 characters long!");
      document.getElementById("inputPassword").style.borderColor = "red";
      return false;
    }
    return true;
  }


  async handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    const { email, password } = this.state;
    const { dispatch, history } = this.props;
    var temp = await this.validate();
    if (temp) {
      dispatch(userActions.login(email, password, history));
    }

  }
  render() {
    const { loggingIn } = this.props;
    const { email, password, submitted } = this.state;
    return (
      <div className="split background" style={{ backgroundImage: "url(" + pathToBackground + ")" }}>
        <div className="split left">
          <div className="centered">
            <div className="bgc-white bdrs-50p pos-r" style={{ width: 180, height: 120 }}>
              <img className="pos-a centerXY" src={pathToLogo} width="150" height="150" alt=""/>
            </div>
          </div>
        </div>
        <div className="split right">
          <div className="centered">
            <h2>Login</h2>
            <form name="form" onSubmit={this.handleSubmit}>
              <div className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                <label htmlFor="email">Email</label>
                <input id="inputEmail" type="text" className="form-control" name="email" value={email} onChange={this.handleChange} />
                {submitted && !email &&
                  <div className="help-block">Email is required</div>
                }
              </div>
              <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                <label htmlFor="password">Password</label>
                <input id="inputPassword" type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                {submitted && !password &&
                  <div className="help-block">Password is required</div>
                }
              </div>
              <div className="form-group">
                <button className="btn btn-primary">Login</button>
                {loggingIn &&
                  <img alt="" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                }
                <Link to="/register" className="btn btn-link">Register</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const Login = connect(null)(LoginPage);
export default Login;
  
