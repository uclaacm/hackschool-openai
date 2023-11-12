import './App.css';
import { useEffect, useState } from 'react';
import Note from './components/Note';
import NoteSubmitter from './components/NoteSubmitter';
import OpenAI from "openai";

const App = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState([]);
  const [openai, _] = useState(new OpenAI({
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
    // process @gpt command to get assistant response
    if (title.includes("@gpt") || content.includes("@gpt")) {
      const prompt = `${title.replace("@gpt", "")} ${content.replace("@gpt", "")}`;
      const trimmedContent = content.trimEnd();

      // indicate that the query is being processed
      setContent(`${trimmedContent}\n\nThinking...`.trim());

      let response = await openai.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        model: "gpt-4-1106-preview",
      })
      response = response.choices[0].message.content;
      setContent(`${trimmedContent}\n\n${response}`.trim());

      return;
    }

    // process @img command to generate image
    if (title.includes("@img") || content.includes("@img")) {
      const prompt = `${title.replace("@img", "")} ${content.replace("@img", "")}`;
      const trimmedContent = content.trimEnd();

      // indicate that the query is being processed
      setContent(`${trimmedContent}\n\nThinking...`.trim());

      const imgResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt
      });
      setImage(imgResponse.data[0].url);
      console.log(imgResponse.data[0].url);

      // remove image command so that user can submit note with new image
      setTitle(`${title.replace("@img", "")}`);
      setContent(`${trimmedContent.replace("@img", "")}`.trim());
      return;
    }

    // prevent empty note
    if (title === '' || content === '') {
      alert("Cannot submit empty note!");
      return;
    }

    // add new note
    const newNote = {
      title,
      content,
      image,
    }
    const newNotes = [newNote, ...notes]
    setNotes(newNotes);
    setImage(""); // clear image

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

  // initialize system prompt to include all notes
  useEffect(() => {
    let prompt = "Answer questions based on the user's notes. You should always identify the notes where you got the information by title. If the user does not ask a question about the notes, then answer as an AI assistant. The notes are shown here: \n\n";
    notes.forEach((note) => {
      prompt += `(Title: ${note.title}\n\nContent:\n${note.content})\n\n`;
    });
    setSystemPrompt(prompt);
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
