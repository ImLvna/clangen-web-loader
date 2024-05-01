/// <reference types="svelte" />
/// <reference types="vite/client" />

declare global {
  interface Window {
    toggleDebug: () => void;
    gameReady: () => void;
    gameError: (error: string) => void;
    downloadLogsCallback: () => void;
    gameApkUrl: string;
    closeGracefully: () => void;

    files: {
      upload: (path: string, accept?: string) => Promise<string>;
    };

    python: {
      vt: {
        xterm: Terminal;
      };
    };

    VM: {
      FS: {
        writeFile: (path: string, data: string | Uint8Array) => void;
      };
    };
    FS: {
      syncfs: (pull: boolean, callback: () => void) => void;
    };
  }
}

export {};
