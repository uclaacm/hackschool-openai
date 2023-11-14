import './App.css';
import { useEffect, useState } from 'react';
import Note from './components/Note';
import NoteSubmitter from './components/NoteSubmitter';
import OpenAI from "openai";

const App = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [openai] = useState(new OpenAI({
    apiKey: import.meta.env.VITE_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  }));
  const [systemPrompt, setSystemPrompt] = useState("");
  const [image, setImage] = useState("");

  const titleHandler = (e) => {
    setTitle(e.target.value);
  }

  const contentHandler = (e) => {
    setContent(e.target.value);
  }

  // submit note
  const submit = async () => {
    // check for @gpt command
    let newContent = content.trim();
    if (title.includes('@gpt') || content.includes('@gpt')) {
      const prompt = title + " " + content;

      setContent(newContent + `\n\nThinking...`);

      const response = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ]
      });

      const data = response.choices[0].message.content;
      newContent += `\n\n${data}`;
      setTitle(title.replace("@gpt", ""));
      setContent(newContent.replace("@gpt", ""));
      return;
    }

    // check for @img command
    if (title.includes('@img') || content.includes('@img')) {
      const prompt = title + " " + content;

      setContent(newContent + `\n\nThinking...`);

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
      });

      setImage(response.data[0].url);

      // remove image command so that user can submit note with new image
      setTitle(title.replace("@img", ""));
      setContent(content.replace("@img", ""));
      return;
    }

    // check for @cat command
    if (title.includes('@cat') || content.includes('@cat')) {
      const response = await fetch('http://localhost:8080/fact');
      const data = await response.text();
      newContent += `\n\nCat Fact: ${data}`;
      setContent(newContent);
      return;
    }

    // prevent empty note
    if (title === '' || content === '') {
      alert("Cannot submit empty note!");
      return;
    }

    // add new note
    const newNote = {
      title: title,
      content: newContent,
      image: image
    }
    const newNotes = [newNote, ...notes]
    setNotes(newNotes);

    // write to local storage
    localStorage.setItem('notes', JSON.stringify(newNotes));

    // clear the form
    setTitle('');
    setContent('');
    setImage('');
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

  // initialize system prompt to include all notes
  useEffect(() => {
    let prompt = "Answer questions based on the user's notes. You should always identify the notes where you got the information by title. If the user does not ask a question about the notes, then answer as an AI assistant. The notes are shown here: \n\n";
    
    notes.forEach((note) => {
      prompt += `(Title: ${note.title}\n\nContent:\n${note.content})\n\n`;
    });
    setSystemPrompt(prompt);
  }, [notes]);

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
              image={note.image}
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
