import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSets, addEditSets, deleteSets, getSetsByUserId } from '../../redux/actions/sets'
import { getFolder } from '../../redux/actions/folder'
import { toaster } from '../../helper/Toaster'
import { ModalPopup } from '../../helper/ModalPopup'

import Meta from '../../helper/seoMeta'
import OrganizationSchema from '../../schemas/Organization.json'
import WebpageSchema from '../../schemas/WebPage.json'
import BreadcrumbSchema from '../../schemas/BreadcrumbList.json'
import WebsiteSchema from '../../schemas/Website.json'
import { withRouter } from 'next/router'

let addFlag = false
let editFlag = false
let deleteFlag = false

const Sets = withRouter(class extends Component {
  constructor(props) {
    super(props)
    let storageData = typeof window !== 'undefined' ?? localStorage.getItem('active_user_data')
      ? JSON.parse(localStorage.getItem('active_user_data'))
      : {}
    this.state = {
      name: '',
      description: '',
      select_folder: '',
      image: '',
      set_id: '',
      sets: [],
      folders: [],
      add_folder: [],
      filtered_sets: [],
      role: storageData && storageData.role,
      user_id: storageData && storageData.login_user_id,
      addEditFunc: '',
      deletFunc: false,
      alertFunc: false,
      toggleFlag: true,
      filter_folder: '',
      applied_folder_data: this.props.router.query,
    }
    console.log("this", this.state);
  }

  UNSAFE_componentWillMount() {
    window.scrollTo(0, 0)
    console.log("🚀 ~ file: index.js ~ line 50 ~ extends ~ UNSAFE_componentWillMount ~ this.state.user_id", this.state.user_id)
    this.props.getFolder(this.state.user_id)
    console.log(this.state.applied_folder_data);
    console.log(this.state.applied_folder_data === undefined);
    console.log(Object.keys(this.state.applied_folder_data).length);
    if (this.state.applied_folder_data === undefined || Object.keys(this.state.applied_folder_data).length === 0) {
      this.props.getSetsByUserId(this.state.user_id)
    } else {
      this.props.getSets(this.state.applied_folder_data.folder_id)
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { sets_list, add_response, edit_response, delete_response, folder_list } = newProps
    console.log("🚀 ~ file: index.js ~ line 59 ~ extends ~ UNSAFE_componentWillReceiveProps ~ sets_list", sets_list.data)

    if (folder_list && folder_list.code === 200) {
      let folders = []
      let add_folder = []
      folders = folder_list.data
      folder_list &&
        folder_list.data.map((o, i) => {
          if (this.state.applied_folder_data === undefined) {
            if (o.user_id === this.state.user_id || this.state.role === 'admin') {
              add_folder.push(o)
            }
          } else {
            if (o.folder_id === this.state.applied_folder_data.folder_id) {
              add_folder.push(o)
            }
          }
        })
      this.setState({
        folders,
        add_folder,
      })
    }
    if (sets_list && sets_list.code === 200) {
      this.setState({
        sets: sets_list.data,
        filtered_sets: sets_list.data,
      })
    } else if (sets_list && sets_list.code === 400) {
      return toaster('error', sets_list.message)
    }

    if (add_response && add_response.code === 200 && addFlag) {
      toaster('success', add_response.message)
      addFlag = false
      this.setState({ addEditFunc: '' })
      console.log('DATA: ', this.state.applied_folder_data)
      if (!this.state.applied_folder_data || Object.keys(this.state.applied_folder_data).length === 0) {
        this.props.getSetsByUserId(this.state.user_id)
      } else {
        this.props.getSets(this.state.applied_folder_data.folder_id)
      }
    } else if (add_response && add_response.code === 400 && addFlag) {
      toaster('error', add_response.message)
      addFlag = false
    }

    if (edit_response && edit_response.code === 200 && editFlag) {
      toaster('success', edit_response.message)
      if (!this.state.applied_folder_data || Object.keys(this.state.applied_folder_data).length === 0) {
        this.props.getSetsByUserId(this.state.user_id)
      } else {
        this.props.getSets(this.state.applied_folder_data.folder_id)
      }
      editFlag = false
      this.setState({ addEditFunc: '' })
    } else if (edit_response && edit_response.code === 400 && editFlag) {
      toaster('error', edit_response.message)
      editFlag = false
    }

    if (delete_response && delete_response.code === 200 && deleteFlag) {
      toaster('success', delete_response.message)
      if (!this.state.applied_folder_data || Object.keys(this.state.applied_folder_data).length === 0) {
        this.props.getSetsByUserId(this.state.user_id)
      } else {
        this.props.getSets(this.state.applied_folder_data.folder_id)
      }
      deleteFlag = false
      this.setState({ deletFunc: false })
    } else if (delete_response && delete_response.code === 400 && deleteFlag) {
      toaster('error', delete_response.message)
      deleteFlag = false
    }
  }

  handleActions = (e, flag, data) => {
    const { applied_folder_data, user_id, role } = this.state
    if (flag === 'view') {
      this.props.router.push({ pathname: `/sets/${data.name}`, query: data })
    } else if (flag === 'add') {
      if (false && applied_folder_data !== undefined && applied_folder_data.user_id !== user_id && role !== 'admin') {
        this.setState({ alertFunc: true })
      } else {
        this.setState({
          addEditFunc: 'add',
          name: '',
          description: '',
          set_id: '',
          select_folder: '',
        })
      }
    } else if (flag === 'edit') {
      this.setState({
        addEditFunc: 'edit',
        name: data.name,
        description: data.description,
        set_id: data.set_id,
        select_folder: data.folder_id,
      })
    } else if (flag === 'delete') {
      this.setState({ set_id: data.set_id, deletFunc: true })
    }
  }
  handleChange = (e, name) => {
    if (name === 'name' && e.target.value.length > 20) {
      return
    } else if (name === 'description' && e.target.value.length > 100) {
      return
    }
    this.setState({ [name]: e.target.value })
  }
  handleSearch = e => {
    const filter = []
    this.state.filtered_sets &&
      this.state.filtered_sets.map(item => {
        if (item.name.toLowerCase().includes(e.target.value.toLowerCase())) {
          filter.push(item)
        }
      })
    this.setState({ filtered_sets: filter })
    if (e.target.value.length < 1) {
      this.setState({ filtered_sets: this.state.sets })
    }
  }

  modalClose = (e, name) => {
    if (name === 'delete_popup') {
      this.setState({
        set_id: '',
        deletFunc: false,
      })
    } else if (name === 'add_edit_popup') {
      this.setState({
        addEditFunc: '',
        name: '',
        description: '',
        set_id: '',
      })
    } else if (name === 'alert_popup') {
      this.setState({
        alertFunc: false,
      })
    }
  }

  submitData = (e, flag) => {
    const { name, description, user_id, set_id, select_folder } = this.state

    let formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('user_id', user_id)
    formData.append('folder_id', select_folder)

    if (flag === 'add') {
      if (select_folder === '') {
        return toaster('error', 'Please select folder')
      } else if (name === '') {
        return toaster('error', 'Please enter set name')
      }
      this.props.addEditSets(formData, 'add')
      addFlag = true
    } else if (flag === 'edit') {
      if (select_folder === '') {
        return toaster('error', 'Please select folder')
      } else if (name === '') {
        return toaster('error', 'Please enter set name')
      }
      formData.append('set_id', set_id)
      this.props.addEditSets(formData, 'edit')
      editFlag = true
    } else if (flag === 'delete') {
      this.props.deleteSets(set_id)
      deleteFlag = true
    }
  }

  handleSelect = (e, name) => {
    let sets = this.state.sets

    if (name === 'filter_folder') {
      let data = []
      if (e.target.value !== '') {
        sets.map((o, i) => {
          if (o.folder_id === parseInt(e.target.value)) {
            data.push(o)
          }
        })
      } else {
        data = sets
      }

      this.setState({ filtered_sets: data })
    }
    this.setState({ [name]: e.target.value })
  }

  render() {
    const {
      filtered_sets,
      folders,
      add_folder,
      name,
      description,
      addEditFunc,
      toggleFlag,
      deletFunc,
      alertFunc,
      user_id,
      role,
      select_folder,
      filter_folder,
      applied_folder_data,
    } = this.state

    return (
      <div className="step10">
        <Meta
          title="Sets - LetsFlash - Virtual Study Assistant"
          desc="Virtual Study Assistant for any Occasion."
          canonical="https://letsflash.co/sets"
          schema={OrganizationSchema}
          schema2={WebpageSchema.sets}
          schema3={BreadcrumbSchema.sets}
          schema4={WebsiteSchema}
        />
        {toggleFlag ? (
          <div>
            <section className="cate-hdng">
              <div className="container">
                <div className="cate_hdng">
                  <div className="inner-logo">
                    <input
                      type="text"
                      id="searchInput"
                      onChange={e => this.handleSearch(e)}
                      placeholder="Search something here"
                    />

                    <div className="srchbr-usricn">
                      <div className="search-bar-catagory"></div>
                      <div className="usr-icn dropdown" style={{ cursor: 'pointer' }}>
                        <button
                          className="addNewHeaderButton btn btn-default"
                          onClick={e => this.handleActions(e, 'add')}
                        >
                          <i className="fa fa-plus"></i> Add New
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="sets_heading">
                    <h2>Sets</h2>
                  </div>
                  <div className="categories_recents">
                    <div className="home_recents-body row">
                      {filtered_sets &&
                        filtered_sets.map(set => {
                          return (
                            <>
                              <div
                                className="box19 home_recents-item sets_recents_item col-lg-2 col-12 col-md-3 col-sm-5"
                                key={set.sets_id}
                              >
                                <span>
                                  <img src="/images/Copy.png" alt="copy icon" />
                                </span>
                                <div className="home_recents-text">
                                  <div>{set.name}</div>
                                  <span>Set</span>
                                </div>
                                <div class="box-content" style={{ paddingTop: '9%' }}>
                                  <ul class="icon">
                                    <li class="mx-1">
                                      {(role === 'admin' || user_id === set.user_id) && (
                                        <img
                                          src="/images/icon5.svg"
                                          alt="edit"
                                          width="34px"
                                          onClick={e => this.handleActions(e, 'edit', set)}
                                        />
                                      )}
                                    </li>
                                    <li class="mx-1">
                                      <img
                                        src="/images/icon3.svg"
                                        alt="view"
                                        width="34px"
                                        onClick={e => this.handleActions(e, 'view', set)}
                                      />
                                    </li>
                                    <li class="mx-1">
                                      {(role === 'admin' || user_id === set.user_id) && (
                                        <img
                                          src="/images/icon4.svg"
                                          alt="delete"
                                          width="34px"
                                          onClick={e => this.handleActions(e, 'delete', set)}
                                        />
                                      )}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </>
                          )
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {alertFunc && (
              <ModalPopup
                className="alert-flag"
                popupOpen={alertFunc}
                popupHide={e => this.modalClose(e, 'alert_popup')}
                title="Alert"
                content={<span className="permit-c">You don't have a permission to add in other user's folder.</span>}
              />
            )}

            {deletFunc && (
              <ModalPopup
                className="delete-flag"
                popupOpen={deletFunc}
                popupHide={e => this.modalClose(e, 'delete_popup')}
                title="Delete Set"
                content={<span>Are you sure you want to delete.</span>}
                footer={
                  <div>
                    <button
                      type="button"
                      className="btn btn-outline-danger px-4 mr-4"
                      onClick={e => this.modalClose(e, 'delete_popup')}
                    >
                      CANCEL
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-success px-4"
                      onClick={e => this.submitData(e, 'delete')}
                    >
                      PROCEED
                    </button>
                  </div>
                }
              />
            )}
            {addEditFunc !== '' && (
              <ModalPopup
                className="add-edit-flag edit-set"
                popupOpen={addEditFunc}
                popupHide={e => this.modalClose(e, 'add_edit_popup')}
                title={addEditFunc === 'add' ? 'Add Set' : 'Edit Set'}
                content={
                  <div>
                    <div className="row px-md-2">
                      <div className="col-12 mt-1">
                        <div className="form-label-group label-group-circle">
                          <select
                            className="form-control"
                            id="sel1"
                            value={select_folder}
                            onChange={e => this.handleSelect(e, 'select_folder')}
                          >
                            <option value="">Choose Folder</option>
                            {folders.map(data => {
                              return <option value={data.folder_id}>{data.name}</option>
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="col-12 mt-1">
                        <div className="form-label-group label-group-circle">
                          <input
                            type="text"
                            name="name"
                            id="c_name"
                            className="form-control"
                            placeholder="Name"
                            value={name}
                            onChange={e => this.handleChange(e, 'name')}
                          />
                          <label for="c_name">Set Name</label>
                        </div>
                      </div>

                      <div className="col-12 mt-1">
                        <div className="form-label-group label-group-circle">
                          <input
                            type="text"
                            id="c_description"
                            className="form-control"
                            placeholder="Description"
                            name="description"
                            value={description}
                            onChange={e => this.handleChange(e, 'description')}
                          />
                          <label for="c_description">Set Description</label>
                        </div>
                      </div>
                    </div>
                  </div>
                }
                footer={
                  <div>
                    <button
                      type="button"
                      className="btn btn-outline-danger px-4 mr-4"
                      onClick={e => this.modalClose(e, 'add_edit_popup')}
                    >
                      CANCEL
                    </button>
                    {addEditFunc === 'add' && (
                      <button
                        type="button"
                        className="btn btn-outline-success px-4"
                        onClick={e => this.submitData(e, 'add')}
                      >
                        ADD
                      </button>
                    )}
                    {addEditFunc === 'edit' && (
                      <button
                        type="button"
                        className="btn btn-outline-success px-4"
                        onClick={e => this.submitData(e, 'edit')}
                      >
                        EDIT
                      </button>
                    )}
                  </div>
                }
              />
            )}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    )
  }
})

const mapStateToProps = store => {
  return {
    folder_list: store.folder.folder_list,
    sets_list: store.sets.sets_list,
    add_response: store.sets.add_response,
    edit_response: store.sets.edit_response,
    delete_response: store.sets.delete_response,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getFolder: params => dispatch(getFolder(params)),
    getSets: params => dispatch(getSets(params)),
    addEditSets: (params, flag) => dispatch(addEditSets(params, flag)),
    deleteSets: params => dispatch(deleteSets(params)),
    getSetsByUserId: params => dispatch(getSetsByUserId(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sets)
