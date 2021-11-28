import React from "react";
import "./Modal.css";

const ResultModal = props => {
  if(!props.show) {
    return null
  }
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-body-result">
          {props.resultText}
        </div>
      </div>
    </div>
  )
}

export default ResultModal