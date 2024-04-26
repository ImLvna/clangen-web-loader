<script lang="ts">
  import { onMount } from "svelte";
  import "./app.css";

  let termShown = $state(false);
  let termButtonShown = $state(false);

  let gameReady = $state(false);
  let gameError = $state<string>();

  const toggleDebug = () => {
    termShown = !termShown;
    if (termShown) {
      termButtonShown = true;
    }
  };

  onMount(async () => {
    window.toggleDebug = toggleDebug;
    window.gameReady = () => gameReady = true;
    window.gameError = (e: string) => gameError = e

    const url = new URL(window.location.href);
    if (url.searchParams.has("-i") || url.searchParams.has("debug")) {
      toggleDebug();
    }
  });
</script>

<svelte:head>
  <link rel="preload" href="loading.gif" as="image">
  <link rel="prefetch" href="https://pygame-web.github.io/archives/0.9/pythonrc.py">
  <link rel="prefetch" href="https://pygame-web.github.io/archives/0.9/vt/xterm.js">
  <link rel="prefetch" href="https://pygame-web.github.io/archives/0.9/vt/xterm-addon-image.js">
  <link rel="prefetch" href="https://pygame-web.github.io/archives/0.9/vt/xterm-addon-image.js">

  <script src="https://pygame-web.github.io/archives/0.9/pythons.js" type=module id=site data-LINES=20 data-CONSOLE=25 data-python=python3.12 data-os=vtx,fs,snd,gui async defer>
async def load():
  import sys
  import asyncio
  import platform
  import json
  from pathlib import Path

  appdir = Path("/data/data/clangen")
  appdir.mkdir()

  import embed

  # mount apk

  cfg = {
      "io": "url",
      "type":"mount",
      "mount" : {
          "point" : appdir.as_posix(),
          "path" : "/",
      },
      "path" : f"/ => {appdir.as_posix()}",
  }


  track = platform.window.MM.prepare("clangen.apk", json.dumps(cfg))

  # wait until zip mount + overlayfs is complete
  while not track.ready:
      await asyncio.sleep(.1)

  # preloader will change dir and prepend it to sys.path
  platform.run_main(PyConfig, loaderhome= appdir / "assets", loadermain=None)


  # wait preloading complete
  # that includes images and wasm compilation of bundled modules
  while embed.counter()<0:
      await asyncio.sleep(.1)

  def ui_callback(pkg, error=None):
    if error:
        platform.window.gameError(error)

  main = appdir / "assets" / "webMain.py"

  # start async top level machinery and add a console.
  await TopLevel_async_handler.start_toplevel(platform.shell, console=window.python.config.debug)

  # now that apk is mounted we have access to font cache
  # but we need to fill __file__ that is not yet set
  __import__(__name__).__file__ = str(main)

  await shell.runpy(main, callback=ui_callback)
import asyncio
asyncio.run(load())
  </script>

  <script src="https://pygame-web.github.io/archives/0.9/browserfs.min.js"></script>
</svelte:head>

<main class="bg-gray-700 size-full min-h-screen min-w-screen text-white flex flex-col justify-center align-middle">
  <div class="flex flex-row justify-center align-middle items-center size-full">
    <canvas id="canvas" class="aspect-square !h-screen !w-auto" class:hidden={!gameReady}></canvas>
    <img src="loading.gif" class="size-1/6" class:hidden={gameReady} alt="Loading..." />
  </div>
  <div class="console h-full max-w-2/3 flex flex-row absolute top-0 left-0 z-50">
    <div class="flex flex-row size-full">
    <div id="pyconsole" class="h-full" class:collapsed={!termShown}>
      <div id="terminal" class="size-full"></div>
    </div>
    {#if termButtonShown}
      <button onclick={toggleDebug} class="termButton min-h-screen w-6 bg-gray-800"></button>
    {/if}
  </div>
  </div>
  {#if gameError}
    <div class="absolute top-0 left-0 size-full flex flex-col justify-center align-middle items-center">
      <div class="bg-gray-800 p-4 rounded-lg min-h-1/2 w-1/2 flex flex-col justify-center align-middle text-center items-center">
        <h1 class="text-2xl text-red-500">The Game Crashed</h1>
        <code>{#each gameError.split("\n") as line}
          <pre>{line}</pre>
        {/each}</code>
        <div class="flex flex-row gap-3">
          <button onclick={() => window.location.reload()} class="bg-gray-600 p-2 rounded-lg">Reload</button>
          <button onclick={toggleDebug} class="bg-gray-600 p-2 rounded-lg">Open Logs</button>
        </div>
      </div>
    </div>
  {/if}

  <div id="dlg_multifile" class="hidden"></div>
  <div id="html" class="hidden"></div>
  <canvas id="canvas3d" class="hidden"></canvas>
</main>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  .collapsed {
    width: 0;
    display: none;
  }
</style>
