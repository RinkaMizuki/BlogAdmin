import React from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Collapse,
  NavItem,
  NavLink
} from "shards-react";
import { withRouter } from 'react-router-dom';

import { get as getLogoutUser } from "../../../../services/httpRequest"

class UserActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      userLogin: localStorage.getItem("userLogin") ? JSON.parse(localStorage.getItem("userLogin")) : null
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.toggleUserActions = this.toggleUserActions.bind(this);
  }

  toggleUserActions() {
    this.setState({
      visible: !this.state.visible
    });
  }

  handleLogout = async () => {
    try {
      const logoutData = await getLogoutUser('/logout');
      console.log(logoutData)
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.removeItem('userLogin');
      this.props.history.push('/');
    }
  }

  render() {
    return (
      <NavItem tag={Dropdown} caret toggle={this.toggleUserActions}>
        <DropdownToggle caret tag={NavLink} className="text-nowrap px-3">
          <img
            className="user-avatar rounded-circle mr-2"
            style={{
              objectFit: "cover",
              maxHeight: "2.5rem",
              width: "100%",
              height: "100%"
            }}
            src={this.state.userLogin ? this.state.userLogin.avatar : ""}
            alt={this.state.userLogin ? this.state.userLogin.url : ""}
          />{" "}
          <span className="d-none d-md-inline-block">{this.state.userLogin ? this.state.userLogin.username : ""}</span>
        </DropdownToggle>
        <Collapse tag={DropdownMenu} right small open={this.state.visible}>
          <DropdownItem tag={Link} to="user-profile">
            <i className="material-icons">&#xE7FD;</i> Profile
          </DropdownItem>
          <DropdownItem tag={Link} to="edit-user-profile">
            <i className="material-icons">&#xE8B8;</i> Edit Profile
          </DropdownItem>
          <DropdownItem tag={Link} to="file-manager-list">
            <i className="material-icons">&#xE2C7;</i> Files
          </DropdownItem>
          <DropdownItem tag={Link} to="transaction-history">
            <i className="material-icons">&#xE896;</i> Transactions
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem className="text-danger" onClick={this.handleLogout}>
            <i className="material-icons text-danger">&#xE879;</i> Logout
          </DropdownItem>
        </Collapse>
      </NavItem>
    );
  }
}

export default withRouter(UserActions)