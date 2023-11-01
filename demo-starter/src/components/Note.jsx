import React from 'react';

const Note = ({title, content}) => {
    return (
        <>
        <div className="card">
            <h2>{title}</h2>
            <p>{content}</p>
        </div>        
        </>
    );
}

export default Note;