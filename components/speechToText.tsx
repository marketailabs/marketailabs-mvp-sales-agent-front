"use client";

import { useRef, useState, useTransition } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { AudioLines, Mic, X } from "lucide-react";
import { toast } from "sonner";

type SpeechToTextProps = {
  onText: (text: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
};

export const SpeechToText = ({
  onText,
  isListening,
  setIsListening,
}: SpeechToTextProps) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isRecognitionActive = useRef(false);
  const manuallyStopped = useRef(false);

  // Inicializar el reconocimiento
  const initRecognition = () => {
    const SpeechRecognition =
      typeof window !== "undefined" &&
      (window.SpeechRecognition || (window as Window).webkitSpeechRecognition);

    if (!SpeechRecognition) {
      toast.error("Tu navegador no soporta reconocimiento de voz.");
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
      if (finalTranscript) onText(finalTranscript);
    };

    recognition.onerror = (event: ErrorEvent) => {
      console.error("Error en reconocimiento:", event.error);
      if (event.error === "not-allowed") {
        toast.error("Permisos del micrófono denegados.");
        setHasPermission(false);
        setIsListening(false);
      } else if (event.error === "aborted") {
        console.warn("Reconocimiento abortado.");
        setIsListening(false);
      }
      isRecognitionActive.current = false;
    };

    recognition.onend = () => {
      if (!manuallyStopped.current && isListening) {
        try {
          recognition.start();
          isRecognitionActive.current = true;
        } catch (e) {
          console.warn("No se pudo reiniciar el reconocimiento:", e);
        }
      } else {
        isRecognitionActive.current = false;
      }
    };

    recognitionRef.current = recognition;
  };

  // Pedir permiso al micrófono
  const requestMicrophonePermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
      return true;
    } catch (error: Error | unknown) {
      setHasPermission(false);
      console.error(error);
      toast.warning(
        "Debes permitir el acceso al micrófono para usar esta función."
      );
      return false;
    }
  };

  // Toggle del micrófono
  const toggleListening = async () => {
    // Pedir permisos si no se hizo antes
    if (hasPermission === null) {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
      initRecognition(); // Inicializar luego de permisos
    }

    // Esperar a tener instancia válida
    if (!recognitionRef.current) {
      toast.error("No se pudo inicializar el reconocimiento.", {
        description:
          "Por favor, concede permiso al micrófono para usar esta función.",
      });
      return;
    }

    const recog = recognitionRef.current;

    if (isListening) {
      startTransition(() => {
        manuallyStopped.current = true;
        setIsListening(false);
        recog.stop();
        isRecognitionActive.current = false;
      });
    } else {
      manuallyStopped.current = false;
      try {
        recog.start();
        isRecognitionActive.current = true;
        setIsListening(true);
      } catch (error: Error | unknown) {
        console.error(error);
        toast.error("No se pudo activar el reconocimiento.", {
          description:
            "Por favor, concede permiso al micrófono para usar esta función.",
        });
      }
    }
  };

  return (
    <div className="absolute bottom-[6px] right-[87px]">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="icon"
              onClick={toggleListening}
              type="button"
              disabled={isPending}
              className="rounded-full flex items-center justify-center"
            >
              {isListening ? (
                <X className="size-5" />
              ) : (
                <Mic className="size-5" />
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
