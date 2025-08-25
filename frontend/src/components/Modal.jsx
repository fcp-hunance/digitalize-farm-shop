import React from "react";
import "./Modal.css"; // falls du extra CSS auslagern willst

const Modal = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Schließen-Button */}
        <button
          className="modal-close"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Titel */}
        {title && <h2 className="modal-title">{title}</h2>}

        {/* Inhalt */}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
