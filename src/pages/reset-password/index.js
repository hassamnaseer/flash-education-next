import React, { Component } from "react";
import { connect } from "react-redux";
import { resetPassApi } from "../../redux/actions//auth";
import { toaster } from "../../helper/Toaster";
import { withRouter } from "next/router";

const ResetPassword = withRouter(class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: this.props.match.params.email,
      otp: "",
      password: "",
      password_show: false
    };
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { reset_response } = newProps;
    if (reset_response && reset_response.code === 200) {
      toaster("success", reset_response.message);
      this.props.router.push("/");
    } else if (reset_response && reset_response.code === 400) {
      return toaster("error", reset_response.message);
    }
  }

  onKeyPress = e => {
    if (e.key === "Enter") {
      this.submitData();
    }
  };

  handleChange = (e, name) => {
    if (name === "otp" && /^[A-Za-z]{0,6}$/.test(e.target.value) === false) {
      return;
    }
    if (name === "password" && e.target.value.length > 25) {
      return
    }
    this.setState({ [name]: e.target.value });
  };

  submitData = () => {
    const { email, otp, password } = this.state;
    if (email !== "" && otp !== "" && password !== "") {
      if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,3})$/i)) {
        return toaster("error", "Email should be in proper format.");
      } else if (otp.length < 6) {
        return toaster("error", "OTP must be of 6 digits.");
      } else if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/)) {
        return toaster("error", "Password must contain atlreast one lower,upper,numeric and special charater and must have length of 6.");
      }
      var formData = new FormData();
      formData.append("email_id", email);
      formData.append("verification_code", otp);
      formData.append("new_password", password);
      this.props.resetPassApi(formData);
    } else {
      return toaster("error", "Please fill all fields");
    }
  };

  render() {
    const { email, otp, password, password_show } = this.state;
    return (
      <section className="section_login">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="login_txt">
                <h1>Hello!</h1>
                <p>
                  Please enter email to reset your password.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card form_card">
                <h3>Reset Password</h3>
                <form>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      name="email"
                      autoComplete="new-password"
                      value={email}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="OTP"
                      name="otp"
                      autoComplete="new-password"
                      value={otp}
                      onChange={e => this.handleChange(e, "otp")}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type={password_show ? "text" : "password"}
                      className="form-control"
                      placeholder="New Password"
                      name={password}
                      value={password}
                      autoComplete="new-password"
                      onPaste={e => e.preventDefault()}
                      onChange={e => this.handleChange(e, "password")}
                      onKeyDown={this.onKeyPress}

                    />
                    {password_show ? (
                      <i
                        className="fa fa-eye"
                        aria-hidden="true"
                        onClick={() => this.setState({ password_show: false })}
                      > <span className="tooltiptext">Hide Password</span></i>
                    ) : (
                      <i
                        className="fa fa-eye-slash"
                        aria-hidden="true"
                        onClick={() => this.setState({ password_show: true })}
                      > <span className="tooltiptext">Show Password</span></i>
                    )}
                  </div>
                  <div className="form-group mb-1">
                    <button
                      type="button"
                      className="btn btn-success w-100"
                      onClick={() => this.submitData()}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
})

const mapStateToProps = store => {
  return {
    reset_response: store.auth.reset_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    resetPassApi: params => dispatch(resetPassApi(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
