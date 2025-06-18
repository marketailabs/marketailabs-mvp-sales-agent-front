export {};

// Podés poner esto al principio del archivo o en types/speech.d.ts

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: (event: any) => void;
    onerror: (event: any) => void;
    onend: () => void;
    start(): void;
    stop(): void;
  }

  type SpeechRecognitionResultEvent = {
    results: SpeechRecognitionResultList;
    resultIndex: number;
  };
}
