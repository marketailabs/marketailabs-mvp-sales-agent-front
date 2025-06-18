import { useEffect, useRef, useState, useTransition } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Button } from "./ui/button";
import { AudioLines, X } from "lucide-react";

type SpeechToTextProps = {
  onText: (text: string) => void;
};

export const SpeechToText = ({ onText }: SpeechToTextProps) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const manuallyStopped = useRef(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || (window as any).webkitSpeechRecognition);

    if (!SpeechRecognition) {
      alert("Tu navegador no soporta reconocimiento de voz");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event: SpeechRecognitionResultEvent) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        }
      }

      if (finalTranscript) {
        onText(finalTranscript);
      }
    };

    recognition.onerror = (event: ErrorEvent) => {
      console.error("Error en reconocimiento:", event.error);
      if (event.error === "aborted") {
        recognition.stop();
      }
    };

    recognition.onend = () => {
      // Solo reiniciar si no fue detenido por el usuario
      if (!manuallyStopped.current) {
        try {
          recognition.start();
        } catch (e) {
          console.warn("No se pudo reiniciar el reconocimiento:", e);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      manuallyStopped.current = true;
      recognition.abort();
    };
  }, [onText]);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    // Si se está escuchando, detenemos
    if (isListening) {
      startTransition(() => {
        manuallyStopped.current = true;
        setIsListening(false);
        recognition.stop();
      });
    } else {
      manuallyStopped.current = false;
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.warn("No se pudo iniciar el reconocimiento:", e);
      }
    }
  };

  return (
    <div className="absolute bottom-1.5 right-1.5">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"default"}
              size={"icon"}
              className="rounded-full flex items-center justify-center"
              onClick={toggleListening}
              type="button"
              disabled={isPending}
            >
              {isListening ? (
                <X className="size-5" />
              ) : (
                <AudioLines className="size-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isPending
                ? "Finalizando reconocimiento..."
                : isListening
                ? "Apagar micrófono"
                : "Encender micrófono"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
