import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import{ Layout, Menu } from "antd";
// import "antd/dist/antd.css";
import Link from "next/link";

import { toaster } from "../../../helper/Toaster";
import { Howl, Howler } from "howler";
import {
  getCard,
  addEditCard,
  deleteCard,
  findAccuracy,
  resultData,
  getCategoryByUserId,
} from "../../../redux/actions/category";

import useDidUpdateEffect from "../../../helper/useDidUpdateEffect";

// import './Questions.css'
import FlashCard from "../../components/Questions/FlashCard";
import TestCard from "../../components/Questions/TestCard";
import AddEdit from "../../components/Questions/AddEdit";
import DeleteQuestionModal from "../../components/Questions/DeleteQuestionModal";
import baseAudio from '/public/notification.mp3'
import { useRouter } from "next/router";
import Image from "next/image";

// import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';

const { Sider } = Layout;

let storageData =
  typeof window !== "undefined" ?? localStorage.getItem("active_user_data")
    ? JSON.parse(localStorage.getItem("active_user_data"))
    : {};

const Questions = (props) => {
  const router = useRouter();
  console.log("in category/[categoryName]/index.js");

  const {
    category_id,
    description,
    folder_id,
    name: category_name,
    recent_date,
    role,
    set_id,
    user_id,
  } = router.query || {};
  const { categoryName, id } = props;
  const {
    question_list,
    result_response,
    accuracy_response,
    isAccuracyLoading,
    categories,
    add_response,
    edit_response,
    delete_response,
    getCard,
    deleteCard,
    findAccuracy,
    resultData,
    getCategoryByUserId,
    addEditCard,
  } = props;

  //Component States ---->
  const [categoryId, setCategoryId] = useState(false);
  const [showGoToReports, setShowGoToReports] = useState(false);
  const [toggleItemIndex, setToggleItemIndex] = useState(1);
  const [addEditFunc, setAddEditFunc] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [bulkQuestion, setBulkQuestion] = useState([]);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    hint: "",
  });

  const [isAdmin, setIsAdmin] = useState((storageData && storageData.login_user_id === user_id) || role === "admin");

  useEffect(() => {
    console.log("in category/[categoryName]");
    if (id) {
      setCategoryId(id);
      getCard(id);
    }
    if (category_id) {
      setCategoryId(category_id);
      getCard(category_id);
    } else if (!category_id) {
      if (storageData) getCategoryByUserId(storageData.login_user_id);
    }
  }, []);

  useEffect(() => {
    if (category_id) {
      setCategoryId(category_id);
    }
  }, [category_id]);

  useDidUpdateEffect(() => {
    let catId;
    if (categories && categories.code === 200) {
      categories.data.forEach((cat) => {
        if (cat.name.toLowerCase() === categoryName.toLowerCase()) {
          catId = cat.category_id;
        }
      });
      console.log("ID: ", catId);
      setCategoryId(catId);
      getCard(catId);
    }
  }, [categories]);

  useDidUpdateEffect(() => {
    if (result_response && result_response.code === 200) {
      setShowGoToReports(true);
    }
  }, [result_response]);

  useDidUpdateEffect(() => {
    if (add_response) handleAddEditDeleteResponse(add_response);
  }, [add_response]);
  useDidUpdateEffect(() => {
    if (edit_response) handleAddEditDeleteResponse(edit_response);
  }, [edit_response]);
  useDidUpdateEffect(() => {
    if (delete_response) handleAddEditDeleteResponse(delete_response);
  }, [delete_response]);
  const handleAddEditDeleteResponse = (res) => {
    if (res && res.code === 200) {
      toaster("success", res.message);
      setAddEditFunc(null);
      getCard(categoryId);
    } else if (res && res.code === 400) {
      toaster("error", edit_response.message);
    }
  };

  const handleActions = (e, flag, data) => {
    if (flag === "addMore") {
      setBulkQuestion([...bulkQuestion, { question: "", answer: "", hint: "" }]);
    } else if (flag === "add" && isAdmin) {
      setAddEditFunc("add");
      setBulkQuestion([{ question: "", answer: "", hint: "" }]);
    } else if (flag === "edit" && isAdmin) {
      setAddEditFunc("edit");
      setBulkQuestion(data);
    } else if (flag === "cross") {
      const tempBulkQuestion = bulkQuestion.filter((item, i) => i !== data);
      setBulkQuestion(tempBulkQuestion);
    } else if (flag === "viewBack") {
      setAddEditFunc(null);
    } else if (flag === "delete") {
      setSelectedQuestion(data);
      setShowModal(true);
    }
  };
  const handleChange = (e, name, index) => {
    if (name === "question" && /^[A-Z a-z$&+,:;=?@#|'<>.^*()%!-]{0,200}$/.test(e.target.value) === false) {
      return toaster("error", "Question should be at most 200 chars long");
    } else if (name === "answer" && /^[A-Z a-z$&+,:;=?@#|'<>.^*()%!-]{0,500}$/.test(e.target.value) === false) {
      return toaster("error", "Answer should be at most 500 chars long");
    } else if (name === "hint" && /^[A-Z a-z$&+,:;=?@#|'<>.^*()%!-]{0,100}$/.test(e.target.value) === false) {
      return toaster("error", "Hint should be at most 100 chars long");
    }
    setFormData({ ...formData, [name]: e.target.value });
    const editBulk = bulkQuestion;
    editBulk[index][name] = e.target.value;
    setBulkQuestion(editBulk);
  };
  const goBackToCategory = () => {
    router.back();
  };
  const onToggleSidebar = (index) => {
    const sound = new Howl({
      src: [baseAudio],
      volume: 100,
      autoUnlock: true,
      preload: true,
    })
    sound.play()
    setToggleItemIndex(+index.key);
  };
  const submitData = async (e, flag) => {
    let formData = new FormData();
    if (bulkQuestion.some((data) => data.question === "" || data.answer === "")) {
      return toaster("error", "Please fill all the fields");
    } else {
      if (flag === "add") {
        formData.append("category_id", categoryId);
        formData.append("question_data", JSON.stringify(bulkQuestion));
        addEditCard(formData, "add");
      } else if (flag === "edit") {
        formData.append("category_id", categoryId);
        formData.append("question_data", JSON.stringify(bulkQuestion));
        addEditCard(formData, "edit");
      }
    }
  };
  const onDelete = async (data) => {
    if (data) {
      await deleteCard(data.card_content_id);
      setShowModal(false);
      await getCard(data.categoryId);
    }
  };

  const items = [
    { key: "1", label: 'Flashcard', icon: <svg id="mode-cards-large" viewBox="0 0 32 32" height="24" width="30"><path d="M28 22.28c0 .396-.323.72-.72.72H8.72a.721.721 0 0 1-.72-.72V21h15.28c1.5 0 2.72-1.22 2.72-2.72V13h1.28a.72.72 0 0 1 .72.72v8.56M8 15a1 1 0 1 1 0-2h12a1 1 0 1 1 0 2H8m-4 3.28V9.72A.72.72 0 0 1 4.72 9h18.56a.72.72 0 0 1 .72.72v8.56c0 .396-.323.72-.72.72H4.72a.721.721 0 0 1-.72-.72M27.28 11H26V9.72C26 8.22 24.78 7 23.28 7H4.72C3.22 7 2 8.22 2 9.72v8.56C2 19.78 3.22 21 4.72 21H6v1.28C6 23.78 7.22 25 8.72 25h18.56c1.5 0 2.72-1.22 2.72-2.72v-8.56c0-1.5-1.22-2.72-2.72-2.72z" fill="#4257b2"></path></svg> },
    { key: "2", label: 'Test', icon: <svg id="mode-test-large" viewBox="0 0 32 32" height="24" width="30"><path d="M24.277 26.777H7.722A.723.723 0 0 1 7 26.054V5.72A.72.72 0 0 1 7.72 5H18v4.057c0 1.5 1.22 2.72 2.72 2.72H25v14.277a.733.733 0 0 1-.723.723M20 6.36l3.53 3.417h-2.81a.73.73 0 0 1-.72-.72V6.36m-1 16.417a1 1 0 1 1 0 2h-9a1 1 0 1 1 0-2h9m-9-2a1 1 0 1 1 0-2h7a1 1 0 1 1 0 2h-7m12-6a1 1 0 1 1 0 2H10a1 1 0 1 1 0-2h12m4.988-4.06a.997.997 0 0 0-.055-.27.722.722 0 0 0-.034-.092.976.976 0 0 0-.177-.262l-.019-.026-.007-.009-7-6.777a.982.982 0 0 0-.279-.184c-.03-.014-.065-.022-.098-.033a.997.997 0 0 0-.253-.05C19.043 3.01 19.023 3 19 3H7.72C6.22 3 5 4.22 5 5.72v20.334a2.726 2.726 0 0 0 2.722 2.723h16.555A2.727 2.727 0 0 0 27 26.054V10.777c0-.02-.01-.039-.012-.06z" fill="#4257b2"></path></svg> }
  ];

  return (
    <>
      <DeleteQuestionModal
        showModal={showModal}
        setShowModal={setShowModal}
        onDelete={onDelete}
        data={selectedQuestion}
      />
      {addEditFunc === "add" || addEditFunc === "edit" ? (
        <AddEdit
          bulk_question={bulkQuestion}
          addEditFunc={addEditFunc}
          handleChange={handleChange}
          handleActions={handleActions}
          submitData={submitData}
        />
      ) : (
        <div className="container px-md-5 px-sm-1 py-4">
          <div className="row justify-content-end">
            <button onClick={goBackToCategory} type="button" className={`button_add_edit btn mx-1 ml-auto`}>
              BACK
            </button>
            {question_list && question_list.length ? (
              <button
                onClick={(e) => handleActions(e, "edit", question_list)}
                type="button"
                className={`button_add_edit btn mx-1`}
              >
                {" "}
                EDIT{" "}
              </button>
            ) : (
              <button onClick={(e) => handleActions(e, "add")} type="button" className={`button_add_edit btn mx-1`}>
                ADD
              </button>
            )}
            {showGoToReports ? (
              <Link
                href={{
                  pathname: `/reports`,
                  query: { categoryId },
                }}
              >
                <button type="button" className={`button_goto_reports btn mx-1`}>
                  REPORTS
                </button>
              </Link>
            ) : null}
          </div>
          <div className="row instructionText">
            {toggleItemIndex === 2 ? (
              <p className="py-2">
                {" "}
                To get hints please speak 'Show me hint' and if you don't know the answer please speak 'I don't know'
              </p>
            ) : null}
          </div>
          <div className="row my-md-5">
            <Sider theme="light" className="site-layout-background siderCustom d-block d-md-none">
              <div className="logo px-1 py-3 font-weight-bold text-muted">STUDY</div>
              <Menu onClick={onToggleSidebar} mode="horizontal" defaultSelectedKeys={["1"]} items={items} />
            </Sider>
            <Layout style={{ padding: "0 0", background: "#fff" }}>
              <Sider theme="light" breakpoint={"lg"} className="site-layout-background siderCustom d-none d-md-block">
                <div className="logo px-1 py-3 font-weight-bold text-muted">STUDY</div>
                <Menu onClick={onToggleSidebar} mode="inline" defaultSelectedKeys={["1"]} items={items} />
              </Sider>
              {toggleItemIndex === 1 ? (
                <FlashCard question_list={question_list} deleteCard={deleteCard} getCard={getCard} />
              ) : toggleItemIndex === 2 ? (
                <TestCard
                  question_list={question_list}
                  handleActions={handleActions}
                  isAdmin={isAdmin}
                  findAccuracy={findAccuracy}
                  getCard={getCard}
                  accuracy_response={accuracy_response}
                  category_id={categoryId}
                  resultData={resultData}
                  storageData={storageData}
                  result_response={result_response}
                  isAccuracyLoading={isAccuracyLoading}
                />
              ) : null}
            </Layout>
          </div>
        </div>
      )}
    </>
  );
};

Questions.propTypes = {
  //   user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  question_list: state.category.question_list.data,
  add_response: state.category.add_response,
  edit_response: state.category.edit_response,
  delete_response: state.category.delete_response,
  accuracy_response: state.category.accuracy_response,
  result_response: state.category.result_response,
  isAccuracyLoading: state.category.isAccuracyLoading,
  categories: state.category.category_list,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getCard: (params) => dispatch(getCard(params)),
    addEditCard: (params, flag) => dispatch(addEditCard(params, flag)),
    deleteCard: (params) => dispatch(deleteCard(params)),
    findAccuracy: (params) => dispatch(findAccuracy(params)),
    resultData: (params) => dispatch(resultData(params)),
    getCategoryByUserId: (params) => dispatch(getCategoryByUserId(params)),
  };
};

export async function getServerSideProps(ctx) {
  const { query } = ctx;
  const categoryName = query.categoryName;

  return { props: { categoryName: categoryName } };
}

export default connect(mapStateToProps, mapDispatchToProps)(Questions);