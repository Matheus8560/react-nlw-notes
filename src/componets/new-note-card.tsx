import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NewNodeCardProps {
  createNote:(text:string) => void;
}

export function NewNodeCard({ createNote }: NewNodeCardProps) {
  const [shouldShowOnborading, setShouldShowOnborading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  let speechRecognition:SpeechRecognition | null = null;

  function handleStartNote() {
    setShouldShowOnborading(false);
  }

  function handleContetChange(event:ChangeEvent<HTMLTextAreaElement>) {
    setNoteText(event.target.value);

    if (event.target.value === "") {
      setShouldShowOnborading(true);
    }    
  }

  function handleSaveNote(event:FormEvent) {
    event.preventDefault();

    if (noteText === '') {
      return
    }

    createNote(noteText);

    setNoteText('');
    setShouldShowOnborading(true);

    toast.success('Nota criada com sucesso!');
  }

  function handleStartRecording() {
    setIsRecording(true);
    setShouldShowOnborading(false);

    const isSpeechRecognitionAPIAvailable = 'SpeechRecognition' in window
      || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      alert('Infelismente seu navegador não suporta a função de reconhecimento de voz.');
      return;
    }

    const speechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    speechRecognition = new speechRecognitionAPI();

    speechRecognition.lang = 'pt-br';
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;
    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, '');

      setNoteText(transcription);
    }
    speechRecognition.onerror = (event) => {
      console.error(event);
    }
    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);

    if (speechRecognition !== null) {
      speechRecognition.stop();
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 text-left p-5 gap-3 hover:ring-2 *: hover:ring-slate-600 outline-none focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">Adicionar nota</span>
        
        <p className="text-sm leading-6 text-slate-400">
          Grave um nota em audio que será convertida em áudio automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50"/>
        <Dialog.Content className="fixed inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full bg-slate-700 md:rounded-md flex flex-col outline-none overflow-hidden">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400">
            <X className="size-5"/>
          </Dialog.Close>

          <form className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-200 hover:text-slate-100">
                Adicionar nota
              </span>
              
              {shouldShowOnborading ? (
                <p className="text-sm leading-6 text-slate-300">
                  Comece <button type="button" onClick={handleStartRecording} className="font-medium text-lime-400 hover:underline">gravando uma nota</button> em audio ou se preferir <button type="button" onClick={handleStartNote} className="font-medium text-lime-400 hover:underline">digite um texto</button>.
                </p>
                ) : (
                  <textarea 
                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                    onChange={handleContetChange}
                    value={noteText}
                    autoFocus 
                    name="" 
                  />
                )
              }
              
            </div>
            
            {isRecording ? (
              <button 
                type="button"
                className="flex justify-center items-center gap-2 w-full bg-slate-900 py-3 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
                onClick={handleStopRecording}
              > 
                <div className="size-3 rounded-full bg-red-500 animate-pulse"/>
                Gravando... (Clique p/ interromper)
              </button>
            ) : (
              <button 
                type="button"
                onClick={handleSaveNote}
                className="w-full bg-lime-400 py-3 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
              >
                Salvar Nota
              </button>
            )}
            
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}