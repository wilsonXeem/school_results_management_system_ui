import React, { Component, createContext } from "react";

import { jwtDecode } from "jwt-decode";

import io from "socket.io-client";

const socket = io("http://127.0.0.1:1234");

export const ValueContext = createContext();
const token = localStorage.getItem("token");

export class Context extends Component {
  state = {
    alert_show: false,
    alert_message: "",
    alert_type: "",
  };

  componentDidMount() {
    socket.on("connect", () => {
      console.log("socket connected");
    });
  }

  tokenChecker = () => {
    if (!token) {
      this.setState({ show: false });
      return null;
    }
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (
        decodedToken.exp > currentTime &&
        decodedToken.user.loggedIn === true
      ) {
        this.setState({ show: false, login: true });
        return token;
      } else if (decodedToken.user.loggedIn === false) {
        this.setState({ show: true, login: false });
        return null;
      } else {
        this.setState({ show: true, login: false });
        return null;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  setAlert = (alert_show, alert_message, alert_type) =>
    this.setState({ alert_show, alert_message, alert_type });

  resetAlert = () => this.setState({ alert_show: false });

  render() {
    return (
      <ValueContext.Provider
        value={{
          ...this.state,
          socket,
          setAlert: this.setAlert,
          resetAlert: this.resetAlert,
        }}
      >
        {this.props.children}
      </ValueContext.Provider>
    );
  }
}

export default Context;
