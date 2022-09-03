import React, { Component } from 'react'
import { connect } from 'react-redux'
import { API_URL } from '../../config'
import { toaster } from '../../helper/Toaster'
import hark from 'hark'
import { ModalPopup } from '../../helper/ModalPopup'
// import { LoaderFunc } from '../../helper/LoaderFunc'
import { getCard, addEditCard, deleteCard, findAccuracy, resultData } from '../../redux/actions/category'

import 'antd/dist/antd.css'
import { Card } from 'antd'
import AddEdit from './AddEdit'
// import 'react-animated-slider/build/horizontal.css'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import { withRouter } from 'next/router'

const { Meta } = Card

let addFlag = false
let editFlag = false
let deleteFlag = false
let accuracyFlag = false
let reportFlag = false
let getFlag = false
let storageData = typeof window !== 'undefined' ?? localStorage.getItem('active_user_data') ? JSON.parse(localStorage.getItem('active_user_data')) : {}
let timer = ''

const Questions = withRouter(class extends Component {
  constructor(props) {
    super(props)
    console.log(this.props);

    this.state = {
      bulk_question: [],
      question: '',
      answer: '',
      hint: '',
      card_content_id: '',
      questionList: [],
      category_id: this.props.router.state && this.props.router.query.category_id,
      category_name: this.props.router.state && this.props.router.query.category_name,
      role: this.props.router.state && this.props.router.query.role,
      user_id: this.props.router.state && this.props.router.query.user_id,
      addEditFunc: '',
      deletFunc: false,
      alertFunc: false,
      control: true,
      recording: false,
      accuracy_per: '',
      accuracy_type: '',
      attempt: '1',
      current_slide: 1,
      current_hint: '',
      current_hint_flag: false,
      count: 3,
      show_count: false,
      flip_card: false,
      last_question: '',
      test_data: [],
      final_section: false,
      loaderVisible: false,
      // applied_set_data: this.props.location.state
    }
    this.saveAudio = this.saveAudio.bind(this)
  }

  componentDidMount() {
    this.props.getCard(this.state.category_id)
    this.setState({ final_section: false, loaderVisible: true })
    getFlag = true
  }

  componentWillReceiveProps(newProps) {
    const { question_list, add_response, edit_response, delete_response, accuracy_response, result_response } = newProps

    let card_content_id = this.state.card_content_id
    if (accuracy_response && accuracy_response.code === 200 && accuracyFlag) {
      console.log('voice input', accuracy_response.input_text)
      if (accuracy_response.output_type === 'error') {
        toaster('error', accuracy_response.message)
        this.setState({
          loaderVisible: false,
        })
      } else {
        let url = `${API_URL}/${accuracy_response.output_path}`
        this.audio = new Audio(url)
        const promise = this.audio.play()
        if (promise !== undefined) {
          promise
            .then(() => {
              this.setState({
                accuracy_per: accuracy_response.accuracy,
                accuracy_type: accuracy_response.output_type,
                attempt: accuracy_response.next_attempt,
                loaderVisible: false,
              })
            })
            .catch(error => console.log('Audio Play error', error))
        }
        if (accuracy_response.output_type === 'tryagain') {
          this.audio.addEventListener('ended', () => {
            this.setState({ count: 3, show_count: true })
            timer = setInterval(e => this.timer(e, true), 1000)
          })
        } else if (accuracy_response.output_type === 'move2next') {
          let test_data = this.state.test_data
          let current_slide = this.state.current_slide
          let questionList = this.state.questionList
          let voice_data = questionList[current_slide]
          if (current_slide + 1 === questionList.length) {
            this.setState({ last_question: '1' })
          }

          let dict = {}
          dict[card_content_id] = accuracy_response.accuracy
          test_data.push(dict)

          this.audio.addEventListener('ended', () => {
            this.setState({
              current_slide: current_slide + 1,
              card_content_id: voice_data.card_content_id,
              count: 3,
              show_count: true,
              test_data,
            })
            timer = setInterval(e => this.timer(e, false, voice_data), 1000)
          })
        } else if (accuracy_response.output_type === 'testover') {
          let test_data = this.state.test_data
          console.log('card_content_id', card_content_id)
          let dict = {}
          dict[card_content_id] = accuracy_response.accuracy
          test_data.push(dict)
          console.log('test_data', test_data)
          this.audio.addEventListener('ended', () => {
            var formData = new FormData()
            formData.append('category_id', this.state.category_id)
            formData.append('user_id', storageData && storageData.login_user_id)
            formData.append('test_data', JSON.stringify(test_data))
            this.props.resultData(formData)
            reportFlag = true
          })
        } else if (accuracy_response.output_type === 'testover_dont_know') {
          this.audio.addEventListener('ended', () => {
            let url = `${API_URL}/${accuracy_response.output_path_next}`
            this.audio = new Audio(url)
            const promise = this.audio.play()
            if (promise !== undefined) {
              promise
                .then(() => {
                  this.audio.addEventListener('ended', () => {
                    var formData = new FormData()
                    formData.append('category_id', this.state.category_id)
                    formData.append('user_id', storageData && storageData.login_user_id)
                    formData.append('test_data', JSON.stringify(this.state.test_data))
                    this.props.resultData(formData)
                    reportFlag = true
                  })
                })
                .catch(error => console.log('Audio Play error', error))
            }
          })
        } else if (accuracy_response.output_type === 'move2next_dont_know') {
          this.audio.addEventListener('ended', () => {
            let url = `${API_URL}/${accuracy_response.output_path_next}`
            this.audio = new Audio(url)
            const promise = this.audio.play()
            if (promise !== undefined) {
              promise
                .then(() => {
                  this.audio.addEventListener('ended', () => {
                    let current_slide = this.state.current_slide
                    let questionList = this.state.questionList
                    let voice_data = questionList[current_slide]
                    if (current_slide + 1 === questionList.length) {
                      this.setState({ last_question: '1' })
                    }
                    // document.getElementsByClassName("nextButton")[0].click();
                    this.setState({
                      current_slide: current_slide + 1,
                      card_content_id: voice_data.card_content_id,
                      count: 3,
                      show_count: true,
                    })
                    timer = setInterval(e => this.timer(e, false, voice_data), 1000)
                  })
                })
                .catch(error => console.log('Audio Play error', error))
            }
          })
        }
      }
      accuracyFlag = false
    } else if (accuracy_response && accuracy_response.code === 400 && accuracyFlag) {
      toaster('error', accuracy_response.message)
      accuracyFlag = false
    }

    if (result_response && result_response.code === 200 && reportFlag) {
      this.setState({ final_section: true })
      window.scrollTo({ top: 0, behavior: 'smooth' })
      reportFlag = false
      // window.location.href = "/reports";
    }
    if (question_list && question_list.code === 200 && getFlag) {
      if (question_list.data && question_list.data.length === 1) {
        this.setState({ last_question: '1' })
      }
      this.setState({ questionList: question_list.data, loaderVisible: false })
      getFlag = false
    } else if (question_list && question_list.code === 400 && getFlag) {
      return toaster('error', question_list.message)
      this.setState({ loaderVisible: false })
      getFlag = false
    }

    if (add_response && add_response.code === 200 && addFlag) {
      toaster('success', add_response.message)
      this.setState({ addEditFunc: '' })
      this.props.getCard(this.state.category_id)
      getFlag = true
      addFlag = false
    } else if (add_response && add_response.code === 400 && addFlag) {
      toaster('error', add_response.message)
      addFlag = false
    }

    if (edit_response && edit_response.code === 200 && editFlag) {
      toaster('success', edit_response.message)
      this.setState({ addEditFunc: '' })
      this.props.getCard(this.state.category_id)
      getFlag = true
      editFlag = false
    } else if (edit_response && edit_response.code === 400 && editFlag) {
      toaster('error', edit_response.message)
      editFlag = false
    }

    if (delete_response && delete_response.code === 200 && deleteFlag) {
      toaster('success', delete_response.message)
      this.setState({ deletFunc: false, addEditFunc: '', current_slide: 1 })

      this.props.getCard(this.state.category_id)
      getFlag = true
      deleteFlag = false
    } else if (delete_response && delete_response.code === 400 && deleteFlag) {
      toaster('error', delete_response.message)
      deleteFlag = false
    }
  }

  async startRecording() {
    console.log('Start Recording ')
    if (navigator.mediaDevices !== undefined) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      })
      var options = {}

      this.speechEvents = hark(stream, options)

      // var options = {mimeType: 'audio/webm'};
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      })
      // init data storage for video chunks
      this.chunks = []
      // listen for data from media recorder
      this.mediaRecorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          this.chunks.push(e.data)
        }
      }
    } else {
      toaster('error', 'getUserMedia is not implemented in this browser')
    }
    // wipe old data chunks
    this.chunks = []
    // start recorder with 10ms buffer
    if (this.mediaRecorder !== undefined) {
      this.mediaRecorder.start(10)
      var flag = true
      var counter = 0
      this.speechEvents.on('speaking', function () {
        flag = true
        counter = 0
      })
      this.speechEvents.on('stopped_speaking', () => {
        flag = false
        counter = 0
      })
      let time = setInterval(e => {
        if (flag === false && counter === 1) {
          this.stopRecording()
          clearInterval(time)
        }
        counter = counter + 1
      }, 1000)
    } else {
      toaster('error', 'Please connect headphones')
    }
    this.setState({ recording: true, show_count: false })
  }

  stopRecording() {
    if (this.mediaRecorder !== undefined) {
      this.saveAudio()
    } else {
      toaster('error', 'Please connect headphones')
    }
    this.setState({ recording: false })
  }

  saveAudio() {
    this.mediaRecorder.stop()
    const blob = new Blob(this.chunks)
    this.setState({ count: 3, loaderVisible: true })

    let formData = new FormData()
    formData.append('cc_id', this.state.card_content_id)
    formData.append('attempt', this.state.attempt)
    formData.append('voice_input', blob)
    formData.append('last_question', this.state.last_question)
    this.props.findAccuracy(formData)
    accuracyFlag = true
  }

  timer = async (e, flag, data) => {
    console.log('timer ')
    if (this.state.count > 0) {
      this.setState({ count: this.state.count - 1 })
    }
    if (this.state.count === 0) {
      this.setState({
        show_count: false,
      })
      clearInterval(timer)
      if (flag) {
        this.startRecording()
      } else {
        let url = `${API_URL}/${data.question_file_path}`
        this.audio = await new Audio(url)
        const promise = this.audio.play()
        if (promise !== undefined) {
          promise
            .then(() => {
              this.audio.addEventListener('ended', () => {
                this.startRecording()
              })
            })
            .catch(error => console.log('Audio Play error', error))
        }
      }
    }
  }
  camalize = str => {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase())
  }

  goBackToCategory = () => {
    this.setState({
      addEditFunc: '',
      question: '',
      answer: '',
      hint: '',
      card_content_id: '',
    })
    // this.props.location.state.category_name
    this.props.router.back()
  }

  handleActions = (e, flag, data) => {
    const { user_id, role } = this.state
    if (flag === 'play') {
      this.setState({
        card_content_id: data.card_content_id,
        count: 3,
        show_count: true,
      })
      timer = setInterval(e => this.timer(e, false, data), 1000)
    } else if (flag === 'addMore') {
      let bulk_question = this.state.bulk_question
      bulk_question.push({ question: '', answer: '', hint: '' })
      this.setState({
        bulk_question,
      })
    } else if (flag === 'add') {
      if (storageData && storageData.login_user_id !== user_id && role !== 'admin') {
        console.log('ID: ', user_id)
        console.log('ROLE: ', role)
        this.setState({ alertFunc: true })
      } else {
        console.log('ID: ', user_id)
        console.log('ROLE: ', role)
        this.setState({
          addEditFunc: 'add',

          card_content_id: '',
          bulk_question: [{ question: '', answer: '', hint: '' }],
        })
      }
    } else if (flag === 'edit') {
      // data.push({ question: "", answer: "", hint: "" });

      if (storageData && storageData.login_user_id !== user_id && role !== 'admin') {
        this.setState({ alertFunc: true })
      } else {
        this.setState({
          addEditFunc: 'edit',
          // card_content_id: data.card_content_id,
          bulk_question: data,
        })
      }
    } else if (flag === 'delete') {
      this.setState({ card_content_id: data.card_content_id, deletFunc: true })
    } else if (flag === 'viewBack') {
      this.props.router.back()
    } else if (flag === 'cross') {
      let bulk_question = this.state.bulk_question
      bulk_question.splice(data, 1)
      this.setState({
        bulk_question,
      })
    }
  }

  modalClose = (e, name) => {
    if (name === 'delete_popup') {
      this.setState({
        category_id: '',
        deletFunc: false,
      })
    } else if (name === 'add_edit_popup') {
      this.setState({
        addEditFunc: '',
        question: '',
        answer: '',
        hint: '',
        card_content_id: '',
      })
    } else if (name === 'alert_popup') {
      this.setState({
        alertFunc: false,
      })
    }
  }

  handleChange = (e, name, index) => {
    if (name === 'question' && /^[A-Z a-z$&+,:;=?@#|'<>.^*()%!-]{0,200}$/.test(e.target.value) === false) {
      return
    } else if (name === 'answer' && /^[A-Z a-z$&+,:;=?@#|'<>.^*()%!-]{0,500}$/.test(e.target.value) === false) {
      return
    } else if (name === 'hint' && /^[A-Z a-z$&+,:;=?@#|'<>.^*()%!-]{0,100}$/.test(e.target.value) === false) {
      return
    }
    this.setState({ [name]: e.target.value })
    let bulk_question = this.state.bulk_question
    bulk_question[index][name] = e.target.value
    this.setState({ bulk_question })
  }

  submitData = (e, flag) => {
    const { bulk_question, card_content_id, category_id } = this.state
    let formData = new FormData()
    if (flag === 'add') {
      let data_flag = bulk_question.some(data => data.question === '' || data.answer === '')
      if (data_flag) {
        return toaster('error', 'Please fill all the fields')
      }
      formData.append('category_id', category_id)
      formData.append('question_data', JSON.stringify(bulk_question))
      this.props.addEditCard(formData, 'add')
      this.setState({ loaderVisible: true })
      addFlag = true
    } else if (flag === 'edit') {
      let data_flag = bulk_question.some(data => data.question === '' || data.answer === '')
      if (data_flag) {
        return toaster('error', 'Please fill all the fields')
      }
      formData.append('category_id', category_id)
      formData.append('question_data', JSON.stringify(bulk_question))
      this.props.addEditCard(formData, 'edit')
      this.setState({ loaderVisible: true })
      editFlag = true
    } else if (flag === 'delete') {
      this.props.deleteCard(card_content_id)
      this.setState({ loaderVisible: true })
      deleteFlag = true
    }
  }

  handleHint = (e, data) => {
    this.setState({ current_hint: data.hint, current_hint_flag: true }, () => {
      window.scrollTo(0, this.refs.test.offsetTop)
    })
  }

  handleSlide = (e, flag) => {
    if (e + 1 === this.state.questionList.length) {
      this.setState({
        current_slide: e + 1,
        last_question: '1',
        flip_card: false,
      })
    } else {
      this.setState({ current_slide: e + 1, flip_card: false })
    }
  }

  // handlePage = () =>{
  //   window.location.href = '/reports'
  // }

  render() {
    const {
      user_id,
      category_name,
      questionList,
      addEditFunc,
      question,
      answer,
      hint,
      deletFunc,
      alertFunc,
      control,
      // recording,
      accuracy_per,
      accuracy_type,
      // category_id,
      role,
      current_slide,
      current_hint,
      current_hint_flag,
      show_count,
      count,
      flip_card,
      final_section,
      loaderVisible,
    } = this.state

    return (
      <div>
        {/* <LoaderFunc visible={loaderVisible} /> */}
        {addEditFunc === 'add' || addEditFunc === 'edit' ? (
          <AddEdit
            state={this.state}
            handleChange={this.handleChange}
            handleActions={this.handleActions}
            submitData={this.submitData}
            modalClose={this.modalClose}
          />
        ) : (
          <div>
            <section className="cate-hdng">
              <div className="container">
                <div className="cate_hdng">
                  <div className="category_heading">
                    <h1>{category_name}</h1>
                    <div className="filter_add">
                      <button type="button" className="ques_back_button" onClick={this.goBackToCategory}>
                        BACK
                      </button>
                      {questionList.length === 0 ? (
                        <button type="button" onClick={e => this.handleActions(e, 'add')}>
                          ADD
                        </button>
                      ) : (
                        <button type="button" onClick={e => this.handleActions(e, 'edit', questionList)}>
                          Edit
                        </button>
                      )}
                      {final_section && (
                        <a
                          href="/reports"
                          className="ml-2 pt-1"
                          style={{
                            width: '230px',
                            marginTop: '23px',
                            // paddingRight: "20px",
                            height: '38px',
                            textAlign: 'center',
                            color: '#fff',
                            border: '0px',
                            borderRadius: '5px',
                            fontSize: '18px',
                            fontWeight: '800',
                            backgroundColor: '#a09393',
                            cursor: 'pointer',
                          }}
                          onClick={() => this.handlePage()}
                        >
                          Go To Reports
                        </a>
                      )}
                    </div>
                  </div>
                  {!control && (
                    <p>
                      To get hints please speak 'Show me hint' and if you don't know the answer please speak 'I don't
                      know'
                    </p>
                  )}
                </div>
              </div>
            </section>
            <section>
              <div className="container">
                <div className="row">
                  <div className="col-12 col-md-9 order-md-2 mb-4">
                    <div className="main_ctg">
                      <div
                        className={
                          control
                            ? 'card bg-white border-0 px-md-4 pb-md-4 p-3 flash_card_content'
                            : 'card bg-white border-0 px-md-4 pb-md-4 p-3 test_content'
                        }
                      >
                        {questionList.length !== 0 ? (
                          <div>
                            {!control && accuracy_type === 'accurate' && (
                              <div className="accurancy_poit w-100 text-center">
                                <span>Accuracy is: {accuracy_per}</span>
                              </div>
                            )}
                            {!control && accuracy_type === 'improve' && (
                              <div className="accurancy_poit w-100 text-center">
                                <span>Improve your answer</span>
                              </div>
                            )}
                            {/* {!final_section ? ( */}
                            <div>
                              <Carousel
                                className="slider-wrapper categories_slider"
                                showStatus={false}
                                showIndicators={false}
                                showThumbs={false}
                                selectedItem={current_slide - 1}
                                transitionTime={800}
                                onChange={event => this.handleSlide(event)}
                              >
                                {/* <div className="carousel-inner" role="listbox"> */}
                                {questionList &&
                                  questionList.map((data, index) => {
                                    return (
                                      <div className="slider-content">
                                        <div className="h-100 d-inline" key={index}>
                                          <div
                                            className={
                                              flip_card ? 'flip-container second-card' : 'flip-container first-card'
                                            }
                                          >
                                            <div className="flipper">
                                              <Card
                                                style={{
                                                  marginBottom: 16,
                                                }}
                                                actions={[
                                                  !control ? (
                                                    show_count ? (
                                                      count
                                                    ) : count === 3 ? (
                                                      <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={e => this.handleActions(e, 'play', data)}
                                                      >
                                                        Start
                                                      </button>
                                                    ) : (
                                                      <button type="button" className="btn btn-outline-danger">
                                                        Active
                                                      </button>
                                                    )
                                                  ) : (
                                                    ((storageData && storageData.login_user_id) === user_id ||
                                                      role === 'admin') && (
                                                      <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={e => this.handleActions(e, 'delete', data)}
                                                      >
                                                        Delete
                                                      </button>
                                                    )
                                                  ),
                                                ]}
                                              >
                                                <Meta title="Question" description={data.question} />
                                                <span
                                                  className="badge badge-pill badge-info px-1"
                                                  onClick={e => this.handleHint(e, data)}
                                                >
                                                  Hint
                                                </span>

                                                {control && (
                                                  <span className="toggle-data px-1">
                                                    <i
                                                      className="fa fa-toggle-on"
                                                      onClick={() =>
                                                        this.setState({
                                                          flip_card: !this.state.flip_card,
                                                        })
                                                      }
                                                    ></i>
                                                  </span>
                                                )}
                                              </Card>
                                              <Card
                                                style={{
                                                  marginBottom: 16,
                                                }}
                                              >
                                                <Meta title="Answer" description={data.answer} />
                                                <span className="toggle-data px-1">
                                                  <i
                                                    className="fa fa-toggle-off"
                                                    onClick={() =>
                                                      this.setState({
                                                        flip_card: !this.state.flip_card,
                                                      })
                                                    }
                                                  ></i>
                                                </span>
                                              </Card>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  })}
                              </Carousel>
                              <div className="slider_count">
                                {current_slide}/{questionList.length}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="no_questions text-center">
                            <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
                            <h4>No questions added yet, Please add some questions</h4>
                          </div>
                        )}
                      </div>
                    </div>
                    {current_hint_flag && (
                      <div className="card card_hint p-3 shadow mt-4 bg-light" ref="test">
                        {current_hint !== '' ? (
                          <h4 className="text-center">Hint: {current_hint}</h4>
                        ) : (
                          <h4 className="text-center">No Hint Added</h4>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="col-12 col-md-3 col-lg-2 order-md-1">
                    <div className="left_ctg w-100">
                      <h6>STUDY</h6>
                      <ul>
                        <li
                          onClick={e =>
                            this.setState({
                              control: true,
                              final_section: false,
                              accuracy_type: '',
                              current_hint_flag: false,
                            })
                          }
                          className={control && 'active'}
                        >
                          <svg id="mode-cards-large" viewBox="0 0 32 32" height="24" width="30">
                            <path
                              d="M28 22.28c0 .396-.323.72-.72.72H8.72a.721.721 0 0 1-.72-.72V21h15.28c1.5 0 2.72-1.22 2.72-2.72V13h1.28a.72.72 0 0 1 .72.72v8.56M8 15a1 1 0 1 1 0-2h12a1 1 0 1 1 0 2H8m-4 3.28V9.72A.72.72 0 0 1 4.72 9h18.56a.72.72 0 0 1 .72.72v8.56c0 .396-.323.72-.72.72H4.72a.721.721 0 0 1-.72-.72M27.28 11H26V9.72C26 8.22 24.78 7 23.28 7H4.72C3.22 7 2 8.22 2 9.72v8.56C2 19.78 3.22 21 4.72 21H6v1.28C6 23.78 7.22 25 8.72 25h18.56c1.5 0 2.72-1.22 2.72-2.72v-8.56c0-1.5-1.22-2.72-2.72-2.72z"
                              fill="#4257b2"
                            ></path>
                          </svg>
                          <span>Flashcards</span>
                        </li>
                        <li
                          onClick={e =>
                            this.setState({
                              control: false,
                              accuracy_type: '',
                              flip_card: false,
                              current_hint_flag: false,
                            })
                          }
                          className={!control && 'active'}
                        >
                          <svg id="mode-test-large" viewBox="0 0 32 32" height="24" width="30">
                            <path
                              d="M24.277 26.777H7.722A.723.723 0 0 1 7 26.054V5.72A.72.72 0 0 1 7.72 5H18v4.057c0 1.5 1.22 2.72 2.72 2.72H25v14.277a.733.733 0 0 1-.723.723M20 6.36l3.53 3.417h-2.81a.73.73 0 0 1-.72-.72V6.36m-1 16.417a1 1 0 1 1 0 2h-9a1 1 0 1 1 0-2h9m-9-2a1 1 0 1 1 0-2h7a1 1 0 1 1 0 2h-7m12-6a1 1 0 1 1 0 2H10a1 1 0 1 1 0-2h12m4.988-4.06a.997.997 0 0 0-.055-.27.722.722 0 0 0-.034-.092.976.976 0 0 0-.177-.262l-.019-.026-.007-.009-7-6.777a.982.982 0 0 0-.279-.184c-.03-.014-.065-.022-.098-.033a.997.997 0 0 0-.253-.05C19.043 3.01 19.023 3 19 3H7.72C6.22 3 5 4.22 5 5.72v20.334a2.726 2.726 0 0 0 2.722 2.723h16.555A2.727 2.727 0 0 0 27 26.054V10.777c0-.02-.01-.039-.012-.06z"
                              fill="#4257b2"
                            ></path>
                          </svg>
                          <span>Test</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {alertFunc && (
                <ModalPopup
                  className="alert-flag"
                  popupOpen={alertFunc}
                  popupHide={e => this.modalClose(e, 'alert_popup')}
                  title="Alert"
                  content={<span>You don't have a permission to add in other user's card.</span>}
                />
              )}

              {deletFunc && (
                <ModalPopup
                  className="delete-flag"
                  popupOpen={deletFunc}
                  popupHide={e => this.modalClose(e, 'delete_popup')}
                  title="Delete Category"
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
            </section>
          </div>
        )}
      </div>
    )
  }
})

const mapStateToProps = store => {
  return {
    question_list: store.category.question_list,
    add_response: store.category.add_response,
    edit_response: store.category.edit_response,
    delete_response: store.category.delete_response,
    accuracy_response: store.category.accuracy_response,
    result_response: store.category.result_response,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCard: params => dispatch(getCard(params)),
    addEditCard: (params, flag) => dispatch(addEditCard(params, flag)),
    deleteCard: params => dispatch(deleteCard(params)),
    findAccuracy: params => dispatch(findAccuracy(params)),
    resultData: params => dispatch(resultData(params)),
  }
}

export async function getServerSideProps(ctx) {
  const { query } = ctx
  const categoryName = query.categoryName
  console.log('categoryName', categoryName)

  return { props: { categoryName: categoryName } }
}

export default connect(mapStateToProps, mapDispatchToProps)(Questions)
