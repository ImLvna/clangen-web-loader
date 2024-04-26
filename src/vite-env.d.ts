/// <reference types="svelte" />
/// <reference types="vite/client" />

declare global {
  interface Window {
    toggleDebug: () => void;
    gameReady: () => void;
    gameError: (error: string) => void;

    python: {
      vt: {
        xterm: Terminal;
      };
    };
  }
}

export {};
