import './App.css';
import { useEffect, useState } from 'react';
import Note from './components/Note';
import NoteSubmitter from './components/NoteSubmitter';

const App = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [image, setImage] = useState("");

  const titleHandler = (e) => {
    setTitle(e.target.value);
  }

  const contentHandler = (e) => {
    setContent(e.target.value);
  }

  // submit note
  const submit = () => {
    // prevent empty note
    if (title === '' || content === '') {
      alert("Cannot submit empty note!");
      return;
    }

    // add new note
    const newNote = {
      title: title,
      content: content,
      image: image
    }
    const newNotes = [newNote, ...notes]
    setNotes(newNotes);

    // write to local storage
    localStorage.setItem('notes', JSON.stringify(newNotes));

    // clear the form
    setTitle('');
    setContent('');
  }

  const deleteNote = (id) => {
    const newNotes = [...notes];
    newNotes.splice(id, 1);
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
  }

  // load notes from local storage upon first render
  useEffect(() => {
    const notes = JSON.parse(localStorage.getItem('notes'));
    if (notes) {
      setNotes(notes);
    }
  }, []);


  return (
    <>
      <div className="App">
        <h1>Notes</h1>
        <div className="notes">
          {notes.map((note, id) => (
            <Note
              key={id}
              title={note.title}
              content={note.content}
              iamge={note.image}
              deleteHandler={() => deleteNote(id)}
            />
          ))}
          <NoteSubmitter
            titleHandler={titleHandler}
            title={title}
            contentHandler={contentHandler}
            content={content}
            buttonHandler={submit}
            image={image}
          />
        </div>
      </div>
    </>
  );
}

export default App
