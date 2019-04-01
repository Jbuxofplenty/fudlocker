import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { history } from '../../helpers';

import { AppAsideToggler, AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/fudlkr.png'
import sygnet from '../../assets/img/logo.png'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeaderPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      headshot: null,
    }
  }
  navigate(route) {
    history.push(route);
  }
  componentDidMount() {
    var user = localStorage.getItem('user');
    if (user.user) {
      this.setState({ headshot: user.user.headshot });
    }
  }

  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    if (this.props.userData) {
          return (
            <React.Fragment>
              <AppSidebarToggler className="d-lg-none" display="md" mobile />
              <AppNavbarBrand
                full={{ src: logo, width: 89, height: 40, alt: 'Fudlkr Logo' }}
                minimized={{ src: sygnet, width: 30, height: 30, alt: 'Fudlkr Logo' }}
              />
              <AppSidebarToggler className="d-md-down-none" display="lg" />

              <Nav className="d-md-down-none" navbar>
                <NavItem className="px-3">
                  <NavLink href="#" onClick={() => { this.navigate('/'); }}>Dashboard</NavLink>
                </NavItem>
                <NavItem className="px-3">
                  <Link to="/users">Users</Link>
                </NavItem>
                <NavItem className="px-3">
                  <NavLink href="#">Settings</NavLink>
                </NavItem>
              </Nav>
              <Nav className="ml-auto" navbar>
                <NavItem className="d-md-down-none">
                  <NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
                </NavItem>
                <div>{this.props.userData.name}</div>
                <AppHeaderDropdown direction="down">
                  <DropdownToggle nav>
                    <img src={this.props.userData.headshot} className="img-avatar" alt="admin@bootstrapmaster.com" />
                  </DropdownToggle>
                  <DropdownMenu right style={{ right: 'auto' }}>
                    <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
                    <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
                    <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
                    <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
                    <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
                    <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
                    <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
                    <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
                    <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
                    <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem>
                    <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem>
                  </DropdownMenu>
                </AppHeaderDropdown>
              </Nav>
              <AppAsideToggler className="d-md-down-none" />
              {/*<AppAsideToggler className="d-lg-none" mobile />*/}
            </React.Fragment>
          );
        }
    else {
      return null;
    }
  }
}

DefaultHeaderPage.propTypes = propTypes;
DefaultHeaderPage.defaultProps = defaultProps;

function mapStateToProps(state) {
  const { authentication } = state;
  const { user, userData } = authentication;
  return {
    user,
    userData
  };
}

const DefaultHeader = connect(mapStateToProps)(DefaultHeaderPage);
export default DefaultHeader;
