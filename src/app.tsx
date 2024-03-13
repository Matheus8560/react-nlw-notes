import { ChangeEvent, useState } from "react";
import Logo  from "./assets/Logo.svg";
import { NewNodeCard } from "./componets/new-note-card";
import { NoteCard } from "./componets/note-card";

interface Note {
  id:string
  date:Date
  text:string
}

export function App() {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem('notes');
    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }
    return [];
  })

  function createNote(text:string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      text,
    }

    const notesArray = [newNote, ...notes];

    setNotes(notesArray);

    localStorage.setItem(`notes`, JSON.stringify(notesArray));
  }

  function deleteNote(id:string) {
    const notesArray = notes.filter(note => {
      return note.id !== id
    })

    setNotes(notesArray);

    localStorage.setItem(`notes`, JSON.stringify(notesArray));
  }

  function handleSearch(event:ChangeEvent<HTMLInputElement>) {
    const query = event.target.value

    setSearch(query)
  }

  const filteredNotes = search !== '' 
    ? notes.filter(note => note.text.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    : notes

  return (
    <div className="mx-auto my-12 max-w-6xl space-y-6 px-5">
      <img src={Logo} alt="NLW expert" />

      <form className="w-full mt-6">
        <input 
          type="text" 
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700"/>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
        <NewNodeCard createNote={createNote} />
        
        {filteredNotes.map(note=>{
          return <NoteCard key={note.id} note={note} deleteNote={deleteNote} />
        })}
      </div>
    </div>
  )
}
