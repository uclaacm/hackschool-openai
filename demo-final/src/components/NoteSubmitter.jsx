import "./NoteSubmitter.css";

import PropTypes from 'prop-types';

const NoteSubmitter = ({
    titleHandler, title,
    contentHandler, content,
    buttonHandler,
    image,
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
                {image ? <img 
                    src={image}
                    height="400px"
                /> : null }
                <button
                    id="button-submit"
                    onClick={(buttonHandler)}>+
                </button>
            </div>
        </>
    );
}

NoteSubmitter.propTypes = {
    titleHandler: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    contentHandler: PropTypes.func.isRequired,
    content: PropTypes.string.isRequired,
    buttonHandler: PropTypes.func.isRequired,
    image: PropTypes.string,
};

export default NoteSubmitter;