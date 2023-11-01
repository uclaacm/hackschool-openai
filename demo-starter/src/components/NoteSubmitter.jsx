import React from "react";
import "./NoteSubmitter.css";

const NoteSubmitter = ({
    titleHandler, title,
    contentHandler, content,
    buttonHandler
    }) => {
    return (
        <>
            <div id="note-submit">
                <input
                    id="title-input"
                    type="text"
                    placeholder="Title"
                    onChange={titleHandler}
                    value={title}
                />
                <textarea
                    placeholder="Content"
                    onChange={contentHandler}
                    value={content}
                />
                <button
                    id="button-submit"
                    onClick={(buttonHandler)}>+
                </button>
            </div>
        </>
    );
}

export default NoteSubmitter;