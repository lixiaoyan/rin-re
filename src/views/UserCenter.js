import React from "react";
import { observer, inject } from "mobx-react";
import { translate } from "react-i18next";

import { TransitionGroup } from "react-transition-group";
import CircularProgress from "material-ui/Progress/CircularProgress";
import Tooltip from "material-ui/Tooltip";
import IconButton from "material-ui/IconButton";
import Menu, { MenuItem } from "material-ui/Menu";
import Person from "material-ui-icons/Person";

import Fade from "./transitions/Fade";
import AuthDialog from "./dialogs/AuthDialog";

import "./UserCenter.css";

class UserCenter extends React.Component {
  state = {
    menuOpen: false,
    menuAnchorPosition: null,
    authDialogOpen: false,
  };

  componentDidMount() {
    this.auth.load();
  }

  get auth() {
    return this.props.store.auth;
  }

  handleActionClick = event => {
    const anchor = event.target.closest("button");
    const rect = anchor.getBoundingClientRect();
    this.setState({
      menuOpen: true,
      menuAnchorPosition: { left: rect.right, top: rect.bottom + 8 },
    });
  };

  handleMenuRequestClose = () => {
    this.setState({
      menuOpen: false,
      menuAnchorPosition: null,
    });
  };

  handleLogin = () => {
    this.setState({
      authDialogOpen: true,
    });
  };

  handleAuthDialogRequestClose = () => {
    this.setState({
      authDialogOpen: false,
    });
  };

  handleLogout = () => {
    this.handleMenuRequestClose();
    this.auth.logout();
  };

  render() {
    const t = this.props.t;
    const currentUser = this.auth.currentUser;
    return (
      <TransitionGroup className="UserCenter">
        {this.auth.loaded &&
          (!currentUser ? (
            <Fade key="guest">
              <div className="UserCenter-layout">
                <div className="UserCenter-action">
                  <Tooltip title={t("Login")} placement="left">
                    <IconButton
                      color="inherit"
                      aria-label={t("Login")}
                      onClick={this.handleLogin}
                    >
                      <Person />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </Fade>
          ) : (
            <Fade key="user">
              <div className="UserCenter-layout">
                <div className="UserCenter-action">
                  <IconButton
                    color="inherit"
                    aria-label={t("User Menu")}
                    aria-haspopup="true"
                    aria-owns="UserCenter-menu"
                    aria-expanded={this.state.menuOpen}
                    disabled={this.auth.state === "loading"}
                    onClick={this.handleActionClick}
                  >
                    <div className="UserCenter-avatar">
                      <img src={currentUser.avatar} alt={t("User Avatar")} />
                    </div>
                  </IconButton>
                  <Fade
                    in={this.auth.state === "loading"}
                    mountOnEnter
                    unmountOnExit
                  >
                    <div className="UserCenter-actionLoader">
                      <CircularProgress
                        color="inherit"
                        size={48}
                        thickness={2}
                      />
                    </div>
                  </Fade>
                  <Menu
                    id="UserCenter-menu"
                    open={this.state.menuOpen}
                    anchorReference={"anchorPosition"}
                    anchorPosition={this.state.menuAnchorPosition}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    onRequestClose={this.handleMenuRequestClose}
                  >
                    <MenuItem dense onClick={this.handleMenuRequestClose}>
                      {t("Profile")}
                    </MenuItem>
                    <MenuItem dense onClick={this.handleMenuRequestClose}>
                      {t("Publish Torrent")}
                    </MenuItem>
                    <MenuItem dense onClick={this.handleLogout}>
                      {t("Logout")}
                    </MenuItem>
                  </Menu>
                </div>
                <div className="UserCenter-username">
                  {currentUser.username}
                </div>
              </div>
            </Fade>
          ))}

        <AuthDialog
          open={this.state.authDialogOpen}
          onRequestClose={this.handleAuthDialogRequestClose}
        />
      </TransitionGroup>
    );
  }
}

export default translate()(inject("store")(observer(UserCenter)));
