import React, { Component, useEffect } from 'react'
import { connect } from 'react-redux'
import { ModalPopup } from '../../../helper/ModalPopup'
import 'antd/dist/antd.css'
import 'react-animated-slider/build/horizontal.css'

export class AddEdit extends Component {
  // shouldComponentUpdate(nextProps) {
  //   return nextProps.bulk_question !== this.props.bulk_question;
  // }
  render() {
    const { bulk_question, addEditFunc } = this.props
    return (
      <div>
        <section className="cate-hdng">
          <div className="container">
            <div className="cate_hdng mb-3 mb-lg-4">
              <div className="category_heading">
                {addEditFunc === 'add' && <h1>Add Questions</h1>}
                {addEditFunc === 'edit' && <h1>Edit Questions</h1>}
                <div className="filter_add mr-0">
                  <button
                    type="button"
                    className="ques_back_button mr-0"
                    onClick={e => this.props.handleActions(e, 'viewBack')}
                  >
                    BACK
                  </button>
                </div>
              </div>
              <p>
                This section is to edit your Questions. Press 'Add More' button to add additional questions and 'Edit'
                button when completed with your changes.
              </p>
            </div>
          </div>
        </section>
        <section className="add_Questions mb-lg-4 mb-3">
          <div className="container">
            {bulk_question &&
              bulk_question.map((data, index) => {
                return (
                  <div className="card border-0 rounded-0 shadow mb-lg-4 mb-3">
                    <div className="card-header d-flex align-items-center justify-content-between py-2 bg-white">
                      <h5 className="m-0">
                        <span className="badge badge-pill bg-light">{index + 1}</span>
                      </h5>
                      {data.card_content_id ? (
                        <i
                          className="fa fa-trash text-danger"
                          onClick={e => this.props.handleActions(e, 'delete', data)}
                        />
                      ) : (
                        <i
                          className="fa fa-times-circle text-danger cursorPointer"
                          onClick={e => this.props.handleActions(e, 'cross', index)}
                        />
                      )}
                    </div>
                    <div className="card-body px-3 pt-3 pb-3">
                      <div className="row">
                        <div className="col-12 col-lg-9 order-lg-1  mt-1">
                          <div className="form-label-group label-group-circle">
                            <input
                              type="text"
                              className="form-control"
                              id="ques"
                              name="question"
                              autoComplete="off"
                              placeholder="Question"
                              value={data.question}
                              onChange={e => this.props.handleChange(e, 'question', index)}
                            />
                            <label for="ques">Question</label>
                          </div>
                        </div>
                        <div className="col-12 col-lg-12 order-lg-3  mt-1">
                          <div className="form-label-group label-group-circle">
                            <input
                              type="text"
                              className="form-control"
                              id="ans"
                              name="answer"
                              placeholder="Answer"
                              autoComplete="off"
                              value={data.answer}
                              onChange={e => this.props.handleChange(e, 'answer', index)}
                            />
                            <label for="ans">Answer</label>
                          </div>
                        </div>
                        <div className="col-12 col-lg-3 order-lg-2 pl-lg-1 mt-1">
                          <div className="form-label-group label-group-circle">
                            <input
                              type="text"
                              className="form-control"
                              id="hint"
                              name="hint"
                              placeholder="Hint"
                              autoComplete="off"
                              value={data.hint}
                              onChange={e => this.props.handleChange(e, 'hint', index)}
                            />
                            <label for="hint">Hint</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

            <div className="w-100 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-outline-primary px-4 mr-2"
                onClick={e => this.props.handleActions(e, 'addMore')}
              >
                Add More <i className="fa fa-arrow-right" aria-hidden="true"></i>
              </button>
              {addEditFunc === 'add' && (
                <button
                  type="button"
                  className="btn btn-outline-success px-4"
                  onClick={e => this.props.submitData(e, 'add')}
                >
                  Submit
                </button>
              )}
              {addEditFunc === 'edit' && (
                <button
                  type="button"
                  className="btn btn-outline-success px-4"
                  onClick={e => this.props.submitData(e, 'edit')}
                >
                  EDIT
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    )
  }
}
const mapStateToProps = store => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(AddEdit)
