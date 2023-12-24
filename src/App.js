import React from "react";
import { create } from "apisauce";
import "./App.css";
import Cookies from "universal-cookie";
import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import api, { userLogin } from "./api";
import { useLocation } from "react-router-dom";
import styles from "./styles";
// import {ListUserUnAuthorization} from "./Components/ListUserUnAuthorization";

function App() {
  let location = useLocation();

  return <LoginForm location={location} />;
}

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loginStatus: false,
      loginString: null,
      usersMatch: [],
      tokenId: null,
      width: 0
    };
    this.api = create({
      baseURL: process.env.REACT_APP_API_ROOT,
      withCredentials: true,
    });
    this.loginRef = React.createRef();
  }

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);

    if (query.get("logout") === "true") {
      const api2 = create({
        baseURL: process.env.REACT_APP_API_ROOT,
        withCredentials: true,
      });
      api2.post(`/v1/logout`).then((res) => {
        if (res.ok || res.status === 200) {
          this.setState({
            loginStatus: false,
            loginString: "Logout Success!",
          });
        }
      });
    }

    const base64LastActivity = new Cookies().get('atla')
    if (base64LastActivity) {
      const lastActivityData = atob(base64LastActivity).split('@')
      if (lastActivityData.length > 1) {
        const ts = lastActivityData[0]
        const maxInactiveTime = lastActivityData[1]
        if (maxInactiveTime > 0) {
          if (new Date().getTime() > parseInt(ts) + parseInt(maxInactiveTime) * 60 * 1000) {
            this.setState({
              loginStatus: false,
              loginString: "You has been logged out due to inactivity for a long time",
            });
          }
        }

      }
    }

    this.updateWidthGoogle();
    window.addEventListener('resize', this.updateWidthGoogle);
  }

  componentDidUpdate() {
    window.addEventListener('resize', this.updateWidthGoogle);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidthGoogle);
  }

  updateWidthGoogle = () => {
    this.setState({ width: Math.ceil((this.loginRef.current?.clientWidth - 30) * 0.85)});
  }

  validateForm() {
    return this.state.username.length > 0 && this.state.password.length > 0;
  }

  login = (event) => {
    var username = this.state.username;
    var password = this.state.password;

    if (username === "") {
      this.setState({
        loginStatus: false,
        loginString: "username is not empty",
      });
      return false;
    } else if (password === "") {
      this.setState({
        loginStatus: false,
        loginString: "password is not empty",
      });
      return false;
    }

    userLogin(username, password)
      .then((response) => {
        if (response.ok) {
          switch (response.status) {
            case 200:
              // get next parameter
              const next = this.getURLParameter("next");
              this.setState({
                loginStatus: true,
                loginString: "Login Success",
              });
              // Redirect URL
              setTimeout(
                function () {
                  if (next) {
                    window.location.href = next;
                  } else {
                    window.location.href = "/";
                  }
                }.bind(this),
                300
              );
              break;
            case 202:
              window.location.href = "/change_password?expire=true";
              break;
            default:
              this.setState({
                loginStatus: false,
                loginString: response.data,
              });
          }
        } else {
          this.setState({
            loginStatus: false,
            loginString: response.data,
          });
        }
      });
  };

  responseGoogleSuccess = (response) => {
    const that = this;
    this.setState({ tokenId: response.credential }, () => {
      that.api
        .post(
          "/v1/login/google",
          { google_token_id: response.credential },
          { headers: { "Content-Type": "application/json" } }
        )
        .then((response) => {
          if (response && response.status === 200) {
            const next = this.getURLParameter("next");
            that.setState({
              loginStatus: true,
              loginString: "Login Success",
            });
            // Redirect URL
            setTimeout(
              function () {
                if (next) {
                  window.location.href = next;
                } else {
                  window.location.href = "/";
                }
              }.bind(this),
              300
            );
          } else {
            if (response.data.error_code === "MULTIPLE_USER_MATCHES") {
              that.setState({
                loginStatus: false,
                loginString: response.data.message,
                usersMatch: response.data.user_matches,
              });
            } else {
              this.setState({
                loginStatus: false,
                loginString: response.data.message,
                usersMatch: [],
              });
            }
          }
        });
    });
  };

  responseGoogleFail = (response) => {
    console.log("Login google failed");
  };

  getURLParameter(name) {
    const params = new URL(document.location).searchParams;

    return params.get(name);
  }

  backToLogin = () => {
    this.setState({
      loginString: null,
      usersMatch: [],
      loginStatus: false,
    });
  };

  listMatchedUsersToSelect() {
    const tokenId = this.state.tokenId;
    const warning = this.state.loginString;
    const users = this.state.usersMatch;
    const selectAccount = (tokenId, userId) => {
      if (!tokenId) {
        return;
      }
      // const confirmAction = window.confirm(
      //   `Are you sure login user - ${userId}`
      // );

      // if (!confirmAction) {
      //   return false;
      // }

      api
        .post(
          "/v1/login/google",
          {
            google_token_id: tokenId,
            selected_user_id: userId,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          if (res.ok || res.status === 200) {
            const next = this.getURLParameter("next");
            this.setState({
              loginStatus: true,
              loginString: "Login Success",
            });
            // Redirect URL
            setTimeout(
              function () {
                if (next) {
                  window.location.href = next;
                } else {
                  window.location.href = "/";
                }
              }.bind(this),
              300
            );
          }
        });
    };

    return (
      <div className="text-center login-container">
        <div style={styles.container}>
          <div style={styles.inner}>
            {warning && <div style={styles.textWarning}>{warning}</div>}
            <br />
            <div style={styles.textIntro}>{`Select your account:`}</div>
            <br />
            <div style={styles.scrollList}>
              <div style={styles.wrap}>
                {users.map((user, index) => (
                  <div
                    style={styles.boxWrap}
                    key={index}
                    onClick={() => selectAccount(tokenId, user.id)}
                  >
                    <div style={styles.row}>
                      <b style={{ minWidth: '80px' }}>Username:</b>  <div style={styles.rowContent}>{user.username}</div>
                    </div>
                    <div style={styles.row}>
                      <b style={{ minWidth: '80px' }}>ID:</b>  <div style={styles.rowContent}>{user.id}</div>
                    </div>
                    <div style={styles.row}>
                      <b style={{ minWidth: '80px' }}>Email:</b>  <div style={styles.rowContent}>{user.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <br />
            <button
              type="submit"
              className="u-max-full-width button-secondary"
              value="Login"
              onClick={this.backToLogin}
            >{`Back to Login`}</button>
          </div>
        </div>
      </div>
    );
  }

  showDefaultLoginForm() {
    return (
      <div className="text-center login-container">
        <img src="/static/assets/favicon.svg" className="favicon" />
        <form className="form-login" onSubmit={(e) => e.preventDefault()} ref={this.loginRef}>
          <div>
            <input
              placeholder={`Username`}
              type="text"
              value={this.state.username}
              onChange={(e) => this.setState({ username: e.target.value })}
            ></input>
          </div>
          <div>
            <input
              placeholder={`Password`}
              type="password"
              value={this.state.password}
              onChange={(e) => this.setState({ password: e.target.value })}
            ></input>
          </div>
          {!!this.state.loginString && (
            <div>
              {this.state.loginStatus ? (
                <span className="alert-success text-alert">
                  {this.state.loginString}
                </span>
              ) : (
                <span className="alert-error text-alert">
                  {this.state.loginString}
                </span>
              )}
            </div>
          )}
          {this.state.picture_url && (
            <div>
              <img src={this.state.picture_url} />
            </div>
          )}
          <button
            type="submit"
            className="u-full-width button-primary"
            value="Login"
            onClick={this.login}
          >{`Login`}</button>
          <div style={{marginTop: '10px', display:'flex', justifyContent: 'center'}}>
            <GoogleLogin
              onSuccess={this.responseGoogleSuccess}
              onError={this.responseGoogleFail}
              locale="en_US"
              width={this.state.width}
            />
          </div>
        </form>
      </div>
    );
  }

  render() {
    return (
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <div className="background">
          <div className="container body-container">
            {!this.state.usersMatch.length
              ? this.showDefaultLoginForm()
              : this.listMatchedUsersToSelect()}
          </div>
        </div>
      </GoogleOAuthProvider>
    );
  }
}

export default App;
