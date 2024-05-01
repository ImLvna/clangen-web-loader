<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "../assets/icon.png?url";
  import Canvas from "./Canvas.svelte";
  import Debug from "./Debug.svelte";
  import Error from "./Error.svelte";
  import FileHandler from "./FileHandler.svelte";
  import LoadingGif from "./LoadingGif.svelte";
  import Shims from "./Shims.svelte";

  export const prerender = false;
  export const ssr = false;

  interface Props {
    apk: string;
    title?: string;
  }
  const { apk, title = "ClanGen Web" }: Props = $props();

  let gameReady = $state(false);

  onMount(async () => {
    window.gameApkUrl = apk;
    window.gameReady = () => (gameReady = true);

    const url = new URL(window.location.href);
    if (url.searchParams.has("-i") || url.searchParams.has("debug")) {
      window.toggleDebug();
    }
  });
</script>

<main
  class="size-full text-white flex flex-row justify-center align-middle items-center"
>
  <LoadingGif {gameReady} />

  <Canvas {gameReady} />

  <Debug {gameReady} />

  <Error />

  <Shims />

  <FileHandler />
</main>

<svelte:head>
  <title>{title}</title>

  <meta content={title} property="og:title" />
  <meta
    content="Web port of the warrior cats fangame: Clangen"
    property="og:description"
  />
  <meta content={Icon} property="og:image" />
  <meta content="#ac9d72" data-react-helmet="true" name="theme-color" />

  <script
    src="https://pygame-web.github.io/archives/0.9/pythons.js"
    type="module"
    id="site"
    data-LINES="20"
    data-CONSOLE="25"
    data-python="python3.12"
    data-os="vtx,fs,snd,gui"
    async
    defer
  >
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


  track = platform.window.MM.prepare(platform.window.gameApkUrl, json.dumps(cfg))

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

  <script
    src="https://pygame-web.github.io/archives/0.9/browserfs.min.js"
  ></script>
</svelte:head>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
</style>
