import React, { Component } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { loginApi, loginResponseApi } from "../../redux/actions/auth";
import { toaster } from "../../helper/Toaster";
import Meta from "../../helper/seoMeta";
import OrganizationSchema from "../../schemas/Organization.json";
import WebpageSchema from "../../schemas/WebPage.json";
import BreadcrumbSchema from "../../schemas/BreadcrumbList.json";
import WebsiteSchema from "../../schemas/Website.json";
import { withRouter } from "next/router";

import { loginWithFacebook, loginWithGoogle, loginWithEmail } from "../../Firebase";
import Header from "../components/header";

const Login = withRouter(
  class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        email: "",
        password: "",
        password_show: false,
        role: "user",
        readyForRender: false,
      };

      this.first = React.createRef();
    }

    UNSAFE_componentWillMount() {
      console.log("UNSAFE_componentWillMount");
      if (typeof window !== "undefined") {
        if (localStorage.getItem("luke_token")) {
          this.props.router.push("/home");
        } else this.setState({ readyForRender: true });
      }
    }

    UNSAFE_componentWillReceiveProps(newProps) {
      const { login_response } = newProps;
      if (login_response && login_response.code === 200) {
        toaster("success", login_response.message);
        this.props.router.push("/home");
        this.props.setLukeToken(login_response.token);
      } else if (login_response && login_response.code === 400) {
        return toaster("error", login_response.message);
      }
    }

    onKeyPress = (e) => {
      if (e.key === "Enter") {
        this.submitData();
      }
    };

    handleChange = (e, name) => {
      if (name === "password" && e.target.value.length > 25) {
        return;
      }
      this.setState({ [name]: e.target.value });
    };
    handleClick = (e, name) => {
      this.setState({ role: name, email: "", password: "" });
    };

    loginGoogleUser = async (e) => {
      try {
        let res = await loginWithGoogle();
        if (res) {
          var formData = new FormData();
          formData.append("email", res.user.providerData[0].email);
          formData.append("uid", res.user.uid);
          formData.append("name", res.user.providerData[0].displayName);
          formData.append("type", "gmail");
          this.props.loginResponseApi(formData);
        }
      } catch (err) {
        toaster("error", err.message);
      }
    };

    loginFacebookUser = async (e) => {
      try {
        let res = await loginWithFacebook();
        if (res) {
          var formData = new FormData();
          formData.append("email", res.user.providerData[0].email);
          formData.append("uid", res.user.uid);
          formData.append("name", res.user.providerData[0].displayName);
          formData.append("type", "facebook");
          this.props.loginResponseApi(formData);
        }
      } catch (err) {
        toaster("error", err.message);
      }
    };

    loginEmailUser = async (e) => {
      this.first.current.focus();
      const { first_name, last_name, email, phone_number, password } = this.state;
      if (first_name !== "" && last_name !== "" && email !== "" && phone_number !== "" && password !== "") {
        if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,3})$/i)) {
          return toaster("error", "Email should be in proper format.");
        }
        try {
          e.preventDefault();
          const { email, password } = this.state;
          console.log(email, password);
          let res = await loginWithEmail(email, password);
          console.log("🚀 ~ file: index.js ~ line 112 ~ extends ~ loginEmailUser= ~ res", res)
          if (res) {
            var formData = new FormData();
            formData.append("email", res.user.providerData[0].email);
            formData.append("uid", res.user.uid);
            formData.append("name", res.user.providerData[0].displayName);
            formData.append("type", "continue_with_email");
            this.props.loginResponseApi(formData);
          }
        } catch (err) {
          console.log("🚀 ~ file: index.js ~ line 122 ~ extends ~ loginEmailUser= ~ err", err)
          toaster("error", err.message);
        }
      } else {
        return toaster("error", "Please fill all fields");
      }
    };

    submitData = () => {
      const { email, password, role } = this.state;
      if (email !== "" && password !== "") {
        var formData = new FormData();
        formData.append("user_name", email);
        formData.append("password", password);
        formData.append("role", role);
        this.props.loginApi(formData);
      } else {
        return toaster("error", "Please fill all fields");
      }
    };

    render() {
      const { email, password, role, password_show } = this.state;

      return (
        <>
          {this.state.readyForRender && (
            <>
              <Header />
              <section className="section_login">
                <Meta
                  title="Login - LetsFlash - Virtual Study Assistant"
                  desc="Virtual Study Assistant for any Occasion."
                  canonical="https://letsflash.co/login"
                  schema={OrganizationSchema}
                  schema2={WebpageSchema.login}
                  schema3={BreadcrumbSchema.login}
                  schema4={WebsiteSchema}
                />
                <div className="container">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="login_txt">
                        <h1>Hello!</h1>
                        <p>Enter your email and password to login or login with Google or Facebook.</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card form_card">
                        <h3>Login here</h3>
                        <div className="login_radio">
                          <div className="custom-control custom-radio custom-control-inline">
                            <input
                              type="radio"
                              className="custom-control-input"
                              name="role"
                              checked={role === "user"}
                              value="user"
                              id="user"
                              onChange={(e) => this.handleClick(e, "user")}
                            />
                            <label className="custom-control-label" htmlFor="user">
                              User
                            </label>
                          </div>
                          <div className="custom-control custom-radio custom-control-inline">
                            <input
                              type="radio"
                              className="custom-control-input"
                              name="role"
                              value="admin"
                              id="admin"
                              checked={role === "admin"}
                              onChange={(e) => this.handleClick(e, "admin")}
                            />
                            <label className="custom-control-label" htmlFor="admin">
                              Admin
                            </label>
                          </div>
                        </div>
                        <form>
                          <div className="form-group">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Email"
                              name="email"
                              autoComplete="new-password"
                              value={email}
                              ref={this.first}
                              onChange={(e) => this.handleChange(e, "email")}
                            />
                          </div>
                          <div className="form-group">
                            <input
                              type={password_show ? "text" : "password"}
                              className="form-control"
                              placeholder="Password"
                              name="password"
                              autoComplete="new-password"
                              value={password}
                              onPaste={(e) => e.preventDefault()}
                              onChange={(e) => this.handleChange(e, "password")}
                              onKeyPress={this.onKeyPress}
                            />
                            {password_show ? (
                              <i
                                className="fa fa-eye"
                                aria-hidden="true"
                                onClick={() => this.setState({ password_show: false })}
                              >
                                {" "}
                                <span className="tooltiptext">Hide Password</span>
                              </i>
                            ) : (
                              <i
                                className="fa fa-eye-slash"
                                aria-hidden="true"
                                onClick={() => this.setState({ password_show: true })}
                              >
                                {" "}
                                <span className="tooltiptext">Show Password</span>
                              </i>
                            )}
                          </div>
                          <div className="form-group mb-1">
                            <div className="forgot_psd text-right w-100">
                              <Link href="/forgot-password" className="forgot_link">
                                Forgot password?
                              </Link>
                            </div>
                            <button type="button" className="btn btn-success w-100" onClick={() => this.submitData()}>
                              Login
                            </button>
                            {role === "user" && (
                              <React.Fragment>
                                <button
                                  className="btn btn_google"
                                  type="button"
                                  onClick={(e) => this.loginGoogleUser(e)}
                                >
                                  <i className="google_icon" /> Continue with google
                                </button>
                                <button
                                  className="btn btn_facebook"
                                  type="button"
                                  onClick={(e) => this.loginFacebookUser(e)}
                                >
                                  <i className="facebook_icon" /> Continue with facebook
                                </button>

                                <button className="btn btn_email" type="button" onClick={(e) => this.loginEmailUser(e)}>
                                  <i className="email_icon" /> Continue with email
                                </button>
                              </React.Fragment>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </>
      );
    }
  }
);

const mapStateToProps = (store) => {
  return {
    login_response: store.auth.login_response,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loginApi: (params) => dispatch(loginApi(params)),
    loginResponseApi: (params) => dispatch(loginResponseApi(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
