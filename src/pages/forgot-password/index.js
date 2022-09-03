import React, { Component } from "react";
import { connect } from "react-redux";
import { forgotPassApi } from "../../redux/actions//auth";
import { toaster } from "../../helper/Toaster";
import { withRouter } from "next/router";
import Header from "../components/header";

const ForgotPassword = withRouter(class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      readyForRender: false
    };
  }

  UNSAFE_componentWillMount() {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("luke_token")) {
        this.props.router.push("/home");
      } else this.setState({ readyForRender: true });
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { forgot_response } = newProps;
    if (forgot_response && forgot_response.code === 200) {
      toaster("success", forgot_response.message);
      this.props.router.push("/");
    } else if (forgot_response && forgot_response.code === 400) {
      return toaster("error", forgot_response.message);
    }
  }

  onKeyPress = e => {
    if (e.key === "Enter") {
      this.submitData();
    }
  };

  handleChange = (e, name) => {
    this.setState({ [name]: e.target.value });
  };

  submitData = () => {
    const { email } = this.state;
    if (email !== "") {
      if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,3})$/i)) {
        return toaster("error", "Email should be in proper format.");
      }
      this.props.forgotPassApi(email);
    } else {
      return toaster("error", "Please fill email address");
    }
  };

  render() {
    const { email } = this.state;

    if (this.state.readyForRender) {

      return (
        <>
          <Header /> 
          <section className="section_login">
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div className="login_txt">
                    <h1>Hello!</h1>
                    <p>
                      Enter email to reset password.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card form_card">
                    <h3>Forgot Password</h3>
                    <form>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Email"
                          name="email"
                          autoComplete="new-password"
                          value={email}
                          onChange={e => this.handleChange(e, "email")}
                        />
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
        </>
      );
    } else return <></>
  }
})

const mapStateToProps = store => {
  return {
    forgot_response: store.auth.forgot_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    forgotPassApi: params => dispatch(forgotPassApi(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
