import React from "react";
import Loader from "react-loader-spinner";
// import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const LoaderFunc = (props) => {
  return (
    <Loader
      type="Puff"
      color="#fb5253"
      height={200}
      width={200}
      className="Loader_Class"
      visible={props.visible}
      //  timeout={3000} //3 secs
    />
  );
}

export default LoaderFunc