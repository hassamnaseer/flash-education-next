import React, { Component } from "react";
import { connect } from "react-redux";
import { getUser, addEditUser, deleteUser } from "../../redux/actions//user";
import { toaster } from "../../helper/Toaster";
import { ModalPopup } from "../../helper/ModalPopup";

let addFlag = false;
let editFlag = false;
let deleteFlag = false;

export class Users extends Component {
  constructor(props) {
    super(props);
    let storageData = typeof window !== 'undefined' ?? localStorage.getItem("active_user_data")
      ? JSON.parse(localStorage.getItem("active_user_data"))
      : {};
    this.state = {
      first_name: "",
      last_name: "",
      password: "",
      email: "",
      phone_number: "",
      user_id: "",
      users: [],
      role: storageData && storageData.role,
      user_id: storageData && storageData.login_user_id,
      addEditFunc: "",
      deletFunc: false,
      toggleFlag: true,
      password_show: false
    };
  }
  UNSAFE_componentWillMount() {
    this.props.getUser("");
  }
  UNSAFE_componentWillReceiveProps(newProps) {
    const {
      user_list,
      add_response,
      edit_response,
      delete_response
    } = newProps;
    if (user_list && user_list.code === 200) {
      this.setState({ users: user_list.data });
    } else if (user_list && user_list.code === 400) {
      return toaster("error", user_list.message);
    }

    if (add_response && add_response.code === 200 && addFlag) {
      toaster("success", add_response.message);
      addFlag = false;
      this.setState({ addEditFunc: "" });
      this.props.getUser("");
    } else if (add_response && add_response.code === 400 && addFlag) {
      toaster("error", add_response.message);
      addFlag = false;
    }

    if (edit_response && edit_response.code === 200 && editFlag) {
      toaster("success", edit_response.message);
      this.props.getUser("");
      editFlag = false;
      this.setState({ addEditFunc: "" });
    } else if (edit_response && edit_response.code === 400 && editFlag) {
      toaster("error", edit_response.message);
      editFlag = false;
    }

    if (delete_response && delete_response.code === 200 && deleteFlag) {
      toaster("success", delete_response.message);
      this.props.getUser("");
      deleteFlag = false;
      this.setState({ deletFunc: false });
    } else if (delete_response && delete_response.code === 400 && deleteFlag) {
      toaster("error", delete_response.message);
      deleteFlag = false;
    }
  }

  handleActions = (e, flag, data) => {
    if (flag === "view") {
      this.setState({
        toggleFlag: false,
        user_id: data.user_id
      });
    } else if (flag === "add") {
      this.setState({
        addEditFunc: "add",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone_number: "",
        user_id: ""
      });
    } else if (flag === "edit") {
      this.setState({
        addEditFunc: "edit",
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
        user_id: data.user_id
      });
    } else if (flag === "delete") {
      this.setState({ user_id: data.user_id, deletFunc: true });
    }
  };
  handleChange = (e, name) => {
    if (
      (name === "first_name" || name === "last_name") &&
      /^[A-Z a-z]{0,25}$/.test(e.target.value) === false
    ) {
      return;
    }
    if (
      name === "phone_number" &&
      /^[0-9]{0,15}$/.test(e.target.value) === false
    ) {
      return;
    } else if (name === "password" && e.target.value.length > 25) {
      return;
    }
    this.setState({ [name]: e.target.value });
  };

  modalClose = (e, name) => {
    if (name === "delete_popup") {
      this.setState({
        user_id: "",
        deletFunc: false
      });
    } else if (name === "add_edit_popup") {
      this.setState({
        addEditFunc: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone_number: "",
        user_id: ""
      });
    }
  };

  submitData = (e, flag) => {
    const {
      first_name,
      last_name,
      email,
      password,
      phone_number,
      user_id
    } = this.state;
    if (flag === "delete") {
      this.props.deleteUser(user_id);
      deleteFlag = true;
      return;
    }
    if (flag === "edit") {
      if (
        first_name === "" &&
        last_name === "" &&
        email === "" &&
        phone_number === ""
      ) {
        return toaster("error", "Please fill all fields");
      }
    }
    if (flag === "add") {
      if (
        first_name === "" &&
        last_name === "" &&
        email === "" &&
        phone_number === "" &&
        password === ""
      ) {
        return toaster("error", "Please fill all fields");
      }
    }
    if (!first_name.match(/^[A-Z a-z]{3,}$/)) {
      return toaster(
        "error",
        "First name should not be less than 3 characters"
      );
    } else if (!last_name.match(/^[A-Z a-z]{3,}$/)) {
      return toaster("error", "Last name should not be less than 3 characters");
    } else if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,3})$/i)) {
      return toaster("error", "Email should be in proper format.");
    } else if (!/^[0-9]{10,}$/.test(phone_number)) {
      return toaster("error", "Mobile number must be of 10 digits");
    } else if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/
      )
    ) {
      return toaster(
        "error",
        "Password must contain atlreast one lower,upper,numeric and special charater and must have length of 6."
      );
    }
    let formData = new FormData();
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone_number", phone_number);
    if (flag === "add") {
      this.props.addEditUser(formData, "add");
      addFlag = true;
    } else if (flag === "edit") {
      formData.append("user_id", user_id);
      this.props.addEditUser(formData, "edit");
      editFlag = true;
    }
  };
  render() {
    const {
      users,
      first_name,
      last_name,
      email,
      password,
      phone_number,
      password_show,
      addEditFunc,
      toggleFlag,
      deletFunc
    } = this.state;
    return (
      <div>
        <section className="cate-hdng">
          <div className="container">
            <div className="cate_hdng">
              <div className="category_heading">
                <h1>Users </h1>

                <div className="filter_add">
                  <button
                    type="button"
                    onClick={e => this.handleActions(e, "add")}
                  >
                    ADD
                  </button>
                </div>
              </div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non
                lacus lorem. Mauris rutrum eget tortor quis molestie.
              </p>
            </div>
          </div>
        </section>
        <section className="cate-sec">
          <div className="container">
            <div className="table-responsive border mb-4">
              <table className="table table-hover table-striped m-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email </th>
                    <th>Phone No.</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users && users.map(data => {
                    return (
                      <tr>
                        <td>{data.first_name}</td>
                        <td>{data.email}</td>
                        <td>{data.phone_number}</td>
                        <td>
                          <div className="text-center icons-2">
                            <img
                              src="/images/icon5.svg"
                              width="28"
                              alt="edit"
                              onClick={e => this.handleActions(e, "edit", data)}
                            />
                            <img
                              className="ml-2"
                              src="/images/icon4.svg"
                              width="28"
                              alt="delete"
                              onClick={e =>
                                this.handleActions(e, "delete", data)
                              }
                            />
                          </div>
                        </td>
                      </tr>
                      // <div className="" key={data.user_id}>
                      //   <div className="">
                      //     <div className="">
                      //       <h3>{data.first_name}</h3>
                      //       <p>{data.last_name}</p>
                      //       <div className="">
                      //         <img
                      //           src="/images/icon5.svg"
                      //           alt="edit"
                      //           onClick={e => this.handleActions(e, "edit", data)}
                      //         />

                      //         {/* <img
                      //           src="/images/icon3.svg"
                      //           alt="view"
                      //           onClick={e => this.handleActions(e, "view", data)}
                      //         /> */}

                      //         <img
                      //           src="/images/icon4.svg"
                      //           alt="delete"
                      //           onClick={e => this.handleActions(e, "delete", data)}
                      //         />
                      //       </div>
                      //     </div>
                      //   </div>
                      // </div>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
        {deletFunc && (
          <ModalPopup
            className="delete-flag del-c"
            popupOpen={deletFunc}
            popupHide={e => this.modalClose(e, "delete_popup")}
            title="Delete User"
            content={<span>Are you sure you want to delete.</span>}
            footer={
              <div>
                <button
                  type="button"
                  className="btn btn-outline-danger px-4 mr-4"
                  onClick={e => this.modalClose(e, "delete_popup")}
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  className="btn btn-outline-success px-4"
                  onClick={e => this.submitData(e, "delete")}
                >
                  PROCEED
                </button>
              </div>
            }
          />
        )}
        {addEditFunc !== "" && (
          <ModalPopup
            className="add-edit-flag edit-set edit-user-c"
            popupOpen={addEditFunc}
            popupHide={e => this.modalClose(e, "add_edit_popup")}
            title={addEditFunc === "add" ? "Add User" : "Edit User"}
            content={
              <div className="row px-md-2">
                <div className="col-12  ">
                  <div className="form-label-group label-group-circle">
                 
                    <input
                      type="text"
                      className="form-control"
                      name="first_name"
                      id="f_name"
                      value={first_name}
                      onChange={e => this.handleChange(e, "first_name")}
                    />
                     <label for="f_name">First Name</label>
                    
                  </div>
                </div>
                <div className="col-12  mt-1">
                  <div className="form-label-group label-group-circle">
                
                    <input
                      type="text"
                      className="form-control"
                      name="last_name"
                      id="l_name"
                      value={last_name}
                      onChange={e => this.handleChange(e, "last_name")}
                    />
                      <label for="l_name">Last Name</label>
                  </div>
                </div>
                <div className="col-12  mt-1">
                  <div className="form-label-group label-group-circle">
                 
                    {addEditFunc === "add" ? (
                      <input
                        type="text"
                        className="form-control"
                        id="email"
                        name="email"
                        value={email}
                        onChange={e => this.handleChange(e, "email")}
                      />
                        
                    ) : (
                      <input
                        type="text"
                        className="form-control"
                        id="email"
                        name="email"
                        value={email}
                        readOnly
                      />
                    )}
                   <label for="email">Email</label>
                  </div>
                </div>
                <div className="col-12  mt-1">
                  <div className="form-label-group label-group-circle">
                
                    <input
                      type="text"
                      className="form-control"
                      name="phone_number"
                      id="p_number"
                      value={phone_number}
                      onChange={e => this.handleChange(e, "phone_number")}
                    />
                      <label for="p_number">Phone Number</label>
                    
                  </div>
                </div>
                <div className="col-12  mt-1">
                  <div className="form-label-group label-group-circle">
                   <label for="pwd">Password</label> 
                    <input
                      type={password_show ? "text" : "password"}
                      className="form-control"
                      name='password'
                      id="pwd"
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
                </div>
                {/* <input
                  type="file"
                  name="image"
                  value={image}
                  onChange={e => this.handleChange(e, "image")}
                /> */}
              </div>
            }
            footer={
              <div>
                <button
                  type="button"
                  className="btn btn-outline-danger px-4 mr-4"
                  onClick={e => this.modalClose(e, "add_edit_popup")}
                >
                  CANCEL
                </button>
                {addEditFunc === "add" && (
                  <button
                    type="button"
                    className="btn btn-outline-success px-4"
                    onClick={e => this.submitData(e, "add")}
                  >
                    ADD
                  </button>
                )}
                {addEditFunc === "edit" && (
                  <button
                    type="button"
                    className="btn btn-outline-success px-4"
                    onClick={e => this.submitData(e, "edit")}
                  >
                    EDIT
                  </button>
                )}
              </div>
            }
          />
        )}
      </div>
    );
  }
}
const mapStateToProps = store => {
  return {
    user_list: store.user.user_list,
    add_response: store.user.add_response,
    edit_response: store.user.edit_response,
    delete_response: store.user.delete_response
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUser: params => dispatch(getUser(params)),
    addEditUser: (params, flag) => dispatch(addEditUser(params, flag)),
    deleteUser: params => dispatch(deleteUser(params))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
