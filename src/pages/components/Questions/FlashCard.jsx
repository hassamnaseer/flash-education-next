import React, { useEffect, useState } from 'react'
import { Layout, Menu, Card, Modal } from 'antd';
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Carousel } from 'react-responsive-carousel'
import DeleteQuestionModal from './DeleteQuestionModal';
import useDidUpdateEffect from '../../../helper/useDidUpdateEffect';

const { Meta } = Card
const { Content } = Layout;

const FlashCard = ({ question_list, deleteCard, getCard }) => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [flipCard, setFlipCard] = useState(false)
    const [currentHintFlag, setCurrentHintFlag] = useState(false)
    const [selectedQuestion, setSelectedQuestion] = useState(null)

    useDidUpdateEffect(() => {
        setShowModal(false)
        setFlipCard(false)
        setCurrentSlide(0)
        setCurrentHintFlag(false)
        setSelectedQuestion(null)
    }, [question_list])

    const handleHint = (data) => {
        setCurrentHintFlag(data.hint)
    }
    const onDelete = async (data) => {
        if (data) {
            await deleteCard(data.card_content_id)
            setShowModal(false)
            await getCard(data.category_id)
        }
    }
    const handleSlide = (e) => {
        console.log(e);
        setCurrentSlide(e)
    }
    return (
        <>
            <DeleteQuestionModal showModal={showModal} setShowModal={setShowModal} onDelete={onDelete} data={selectedQuestion} />
            <Content theme="light" className="py-1 px-4" style={{ minHeight: 280 }}>
                <div className="container flashQuestionCardParent">
                    {question_list && question_list.length ? (
                        <div className="card mx-auto">
                            <Carousel
                                className="slider-wrapper categories_slider" showStatus={false} selectedItem={currentSlide}
                                autoPlay={false} swipeable={false} showIndicators={false} showThumbs={false}
                                transitionTime={800} onChange={e => handleSlide(e)}>
                                {question_list &&
                                    question_list.map((data, index) => {
                                        console.log("🚀 ~ file: FlashCard.jsx ~ line 52 ~ question_list.map ~ question_list", question_list)
                                        return (
                                            <div className="slider-content">
                                                <div className="h-100 d-inline" key={index}>
                                                    <div class="flip-card">
                                                        <div class={`flip-card-inner ${flipCard ? 'flip-card-inner-rotate' : ''}`}>
                                                            <div class="flip-card-front">
                                                                <Card style={{ marginBottom: 16 }}
                                                                    actions={[
                                                                        <button type="button" className="btn btn-outline-danger w-25 btn-sm" onClick={() => { setShowModal(true); setSelectedQuestion(data) }}>
                                                                            Delete
                                                                        </button>
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
                                                                        <button type="button" className="d-none btn btn-outline-danger w-25 btn-sm"> </button>
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

export default FlashCard;