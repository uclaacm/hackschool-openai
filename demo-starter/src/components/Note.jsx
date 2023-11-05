import React from 'react';
import './Note.css';

const Note = ({title, content, deleteHandler}) => {
    return (
        <>
        <div className="card">
            <button className="button-delete" onClick={deleteHandler}>x</button>
            <h2>{title}</h2>
            <p style={{whiteSpace: "pre-line"}}>{content}</p>
        </div>        
        </>
    );
}

export default Note;