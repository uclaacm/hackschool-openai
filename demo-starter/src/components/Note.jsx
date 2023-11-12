import './Note.css';

import PropTypes from 'prop-types';

const Note = ({title, content, deleteHandler, image}) => {
    return (
        <>
        <div className="card">
            <button className="button-delete" onClick={deleteHandler}>x</button>
            <h2>{title}</h2>
            <p style={{whiteSpace: "pre-line"}}>{content}</p>
            {image ? <img
                src={image}
                height="300px"
            /> : null}
        </div>        
        </>
    );
}

Note.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    deleteHandler: PropTypes.func.isRequired,
    image: PropTypes.string
};


export default Note;