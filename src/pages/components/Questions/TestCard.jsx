import React, { useEffect, useState } from 'react'
import { Layout, Menu, Card, Modal } from 'antd';
import { API_URL } from '../../../config'
import { toaster } from '../../../helper/Toaster'
import { Carousel } from 'react-responsive-carousel'
import hark from 'hark'
import { Howl, Howler } from 'howler';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import useDidUpdateEffect from '../../../helper/useDidUpdateEffect';
// import useDidUpdateEffect from '../../../../partials/useDidUpdateEffect';
// import AudioRecorder from "audio-recorder-polyfill";

var AudioRecorder;

if (typeof window !== 'undefined') {
  AudioRecorder = require('audio-recorder-polyfill');
  window.MediaRecorder = AudioRecorder;
}

// if (typeof window !== 'undefined') 

const { Meta } = Card
const { Content } = Layout;

var isEdge = typeof navigator !== 'undefined' && navigator?.userAgent?.indexOf('Edge') !== -1 && (!!navigator?.msSaveOrOpenBlob || !!navigator?.msSaveBlob);
var isSafari = /^((?!chrome|android).)*safari/i.test(typeof navigator !== 'undefined' ?? navigator?.userAgent);
// navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/)

var recInstance
var lastQuestion = 0
var answerAttempt = 1


const TestCard = ({ question_list, findAccuracy, getCard, accuracy_response, category_id, resultData,
  storageData, result_response, isAccuracyLoading }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [flipCard, setFlipCard] = useState(false)
  const [currentHintFlag, setCurrentHintFlag] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const [stopSpeak, setStopSpeak] = useState(null)
  const [listening, setListening] = useState(null)

  const [testData, setTestData] = useState([])
  const [currentCardData, setCurrentCardData] = useState(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(null)
  // const [answerAttempt, setAnswerAttempt] = useState(1)

  const [seconds, setSeconds] = useState(4)

  useEffect(() => {
    lastQuestion = 0
    answerAttempt = 1
  }, [])

  useDidUpdateEffect(() => {
    lastQuestion = currentSlide + 1
  }, [currentSlide])

  useDidUpdateEffect(() => {
    if ((seconds > 0) && (seconds < 4)) {
      setTimeout(() => { setSeconds(seconds - 1) }, 1000);
    }
  }, [seconds]);

  const handleHint = (data) => {
    setCurrentHintFlag(data.hint)
  }

  const handleSlide = (e) => {
    setCurrentSlide(e)
  }

  const onRecord = (data, index) => {
    if (data) {
      let url = `${API_URL}/${data.question_file_path}`
      setSeconds(seconds - 1)
      setTimeout(() => {
        setCurrentCardIndex(index)
        const sound = new Howl({
          src: [url],
          volume: 1.0,
          autoUnlock: true,
          preload: true,
          // html5: true,
          onend: function () {
            startRecording(data)
          }
        })
        sound.play()
      }, 3000)
    }
  }

  const startRecording = (data) => {
    if (navigator.mediaDevices !== undefined) {
      setCurrentCardData(data)
      let harkSpeechEvents = null
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then((stream) => {
          harkSpeechEvents = hark(stream, {})
          recInstance = new MediaRecorder(stream);
          recInstance.addEventListener("dataavailable", (e) => onSaveAudio(e.data, data));
          recInstance.start()
          if (recInstance && !isSafari) {
            setIsRecording(true)
            harkSpeechEvents.on('speaking', () => { setListening(true); console.log("speaking") })
            harkSpeechEvents.on('stopped_speaking', () => { setStopSpeak(true); onStop(data, stream); console.log("stopped_speaking") })
          } else if (recInstance) {
            setTimeout(() => {
              setIsRecording(true);
              setListening(true)
              setTimeout(() => {
                setStopSpeak(true);
                onStop(data, stream);
                console.log("stopped_speaking");
              }, 3600);
            }, 600);
          }
        })
        .catch(err => {
          setIsRecording(false)
        })
    } else {
      toaster('error', 'getUserMedia is not implemented in this browser')
    }
  }


  const onStop = (data, stream) => {
    setIsRecording(false)
    recInstance.stop()
    stream.getAudioTracks()[0].stop()
  }
  const onSaveAudio = (blob, data) => {
    console.log("Form Data0: ", blob)
    const audioBlob = new Blob([blob], { type: "audio/webm" })
    let formData = new FormData()
    formData.append('cc_id', data.card_content_id)
    formData.append('attempt', answerAttempt)
    formData.append('voice_input', audioBlob)
    formData.append('last_question', (lastQuestion === question_list.length) ? 1 : "")
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    findAccuracy(formData)

    //when accuracy api response is returned -futrue
    setStopSpeak(false)
    setListening(false)
    setSeconds(4)
  }
  useDidUpdateEffect(() => {
    if (accuracy_response && accuracy_response.code === 200) {
      if (accuracy_response.output_type === 'error') {
        toaster('error', accuracy_response.message)
        if (accuracy_response.message === "No data found") {
          toaster('warning', "Couldn't Capture your voice, try again")
        }
      } else {
        let url = `${API_URL}/${accuracy_response.output_path}`
        const sound = new Howl({
          src: [url],
          volume: 1.0,
          autoUnlock: true,
          preload: true,
          // html5: true,
          onend: () => {
            if (accuracy_response.output_type === 'tryagain') {
              answerAttempt = answerAttempt + 1
              onRecord(currentCardData, currentCardIndex)
            } else if (accuracy_response.output_type === 'move2next') {
              answerAttempt = 1
              setCurrentSlide(currentSlide + 1)
              let dict = {}
              dict[currentCardData.card_content_id] = accuracy_response.accuracy
              setTestData([...testData, dict])
              onRecord(question_list[currentCardIndex + 1], currentCardIndex + 1)
            } else if (accuracy_response.output_type === 'testover') {
              var formData = new FormData()
              let tempData = null
              let dict = {}
              dict[currentCardData.card_content_id] = accuracy_response.accuracy
              tempData = [...testData, dict]
              setTestData(tempData)
              formData.append('category_id', category_id)
              formData.append('user_id', storageData && storageData.login_user_id)
              formData.append('test_data', JSON.stringify(tempData))
              resultData(formData)
            } else if (accuracy_response.output_type === 'testover_dont_know') {

              let url = `${API_URL}/${accuracy_response.output_path_next}`
              const sound1 = new Howl({
                src: [url],
                volume: 1.0,
                autoUnlock: true,
                preload: true,
                // html5: true,
                onend: () => {
                  var formData = new FormData()
                  formData.append('category_id', category_id)
                  formData.append('user_id', storageData && storageData.login_user_id)
                  formData.append('test_data', JSON.stringify(testData))
                  resultData(formData)
                }
              })
              sound1.play()
            } else if (accuracy_response.output_type === 'move2next_dont_know') {
              let url = `${API_URL}/${accuracy_response.output_path_next}`
              const sound2 = new Howl({
                src: [url],
                volume: 1.0,
                autoUnlock: true,
                preload: true,
                // html5: true,
                onend: () => {
                  setCurrentSlide(currentSlide + 1)
                  onRecord(question_list[currentCardIndex + 1], currentCardIndex + 1)
                }
              })
              sound2.play()
            }
          }
        })
        sound.play();
      }
    } else if (accuracy_response && accuracy_response.code === 400) {
      toaster('error', accuracy_response.message)
    }
  }, [accuracy_response])

  useDidUpdateEffect(() => {
    if (result_response && result_response.code === 200 && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [result_response])

  return (
    <>
      <Content theme="light" className="py-1 px-4" style={{ minHeight: 280 }}>
        <div className="container flashQuestionCardParent">
          {question_list && question_list.length ? (
            <div className="card mx-auto">
              <Carousel
                className="slider-wrapper categories_slider"
                selectedItem={currentSlide}
                autoPlay={false}
                swipeable={false}
                showStatus={false}
                showIndicators={false}
                showThumbs={false}
                transitionTime={800}
                onChange={e => handleSlide(e)}>
                {question_list &&
                  question_list.map((data, index) => {
                    return (
                      <div className="slider-content">
                        <div className="h-100 d-inline" key={index}>

                          <div class="flip-card">
                            <div class={`flip-card-inner ${flipCard ? 'flip-card-inner-rotate' : ''}`}>
                              <div class="flip-card-front">
                                <Card style={{ marginBottom: 16 }}
                                  actions={[
                                    !isRecording && seconds === 4 && !isAccuracyLoading ? (
                                      <button onClick={() => onRecord(data, index)} type="button" className="btn btn-outline-success w-35 btn-sm">
                                        Start
                                      </button>
                                    ) : seconds < 4 && seconds > 0 ? (
                                      <button type="button" disabled className="btn btn-outline-danger w-35 btn-sm">
                                        {seconds}
                                      </button>
                                    ) : listening && !stopSpeak ? (
                                      <button type="button" disabled className="btn btn-outline-danger w-35 btn-sm">
                                        Listening..
                                      </button>
                                    ) : stopSpeak ? (
                                      <button type="button" disabled className="btn btn-outline-danger w-35 btn-sm">
                                        Checking...
                                      </button>
                                    ) : isAccuracyLoading ? (
                                      <button type="button" disabled className="btn btn-outline-info w-35 btn-sm">
                                        Processing...
                                      </button>
                                    ) : isRecording ? (
                                      <button type="button" disabled className="btn btn-outline-danger w-35 btn-sm">
                                        Speak
                                      </button>
                                    ) : (
                                      <button type="button" disabled className="btn btn-outline-danger w-35 btn-sm">
                                        Preparing..
                                      </button>
                                    )
                                  ]}>
                                  <Meta className="" title={
                                    <div className="row align-items-center no-gutters justify-content-end questionCard">
                                      <div className="col-2 col-md-2 d-block d-sm-none d-md-none"></div>
                                      <div className="col-4 col-md-5 text-center text-md-right">
                                        Questions
                                      </div>
                                      <div className="col-6 col-md-5 d-flex align-self-center">
                                        <div className="ml-auto">
                                          <button type="button" onClick={() => handleHint(data)} className="btn btn-danger cardHeaderButtonHint mx-1">Hint</button>
                                          <span className="mx-2 cardHeaderButtonToggle">
                                            <i className="fa fa-toggle-on"
                                              onClick={() => setFlipCard(!flipCard)}
                                            ></i>
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  } description={data.question} />
                                </Card>

                              </div>
                              <div class="flip-card-back">
                                <Card style={{ marginBottom: 16 }}
                                  actions={[
                                    <button type="button" className="d-none btn btn-outline-danger w-35 btn-sm"> </button>
                                  ]}>
                                  <Meta className="" title={
                                    <div className="row align-items-center no-gutters justify-content-end questionCard">
                                      <div className="col-3"></div>
                                      <div className="col-5 text-center">
                                        Answer
                                      </div>
                                      <div className="col-4 d-flex align-self-center">
                                        <div className="ml-auto">
                                          <span className="mx-2 cardHeaderButtonToggle">
                                            <i className="fa fa-toggle-off"
                                              onClick={() => setFlipCard(!flipCard)}
                                            ></i>
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  } description={data.answer} />
                                </Card>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                }
              </Carousel>
              <div className="slider_count">
                {currentSlide + 1}/{question_list && question_list.length}
              </div>
            </div>
          ) : (

            <div className="no_questions text-center">
              <i className="fa fa-exclamation-circle" aria-hidden="true"></i>
              <h4>No questions added yet, Please add some questions</h4>
            </div>
          )}
        </div>
        {currentHintFlag && currentHintFlag.length ? (
          <div className="card card_hint p-3 shadow mt-4 bg-light">
            <h4 className="text-center">Hint: {currentHintFlag}</h4>
          </div>
        ) : currentHintFlag && !currentHintFlag.length(
          <div className="card card_hint p-3 shadow mt-4 bg-light">
            <h4 className="text-center">No Hint Added</h4>
          </div>
        )}
      </Content>
    </>
  );
}

export default TestCard;