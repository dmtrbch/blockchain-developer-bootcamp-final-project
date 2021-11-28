import React from "react";
import "./Modal.css";

const TransactionModal = props => {
  if(!props.show) {
    return null
  }
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-body">
          Transaction Pending... Please Wait!!!
        </div>
      </div>
    </div>
  )
}

export default TransactionModal