import React from "react";
import "./Modal.css";

const BetModal = props => {
  if(!props.show) {
    return null
  }
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-body">
          Bet in Progress... Please Wait!!!
        </div>
      </div>
    </div>
  )
}

export default BetModal