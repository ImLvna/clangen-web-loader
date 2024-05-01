<script lang="ts">
	import { onMount } from 'svelte';

	interface UploadState {
		accept?: string;
		cancel?: () => void;
	}

	let files = $state<FileList>();

	let uploadState = $state<UploadState>();

	let input: HTMLInputElement;

	onMount(() => {
		if (!window.files) {
			window.files = {} as typeof window.files;
		}
		window.files.upload = (filePath: string, accept?: string): Promise<string> => {
			return new Promise(async (resolve, reject) => {
				uploadState = {
					accept,
					cancel: () => {
						uploadState = undefined;
						input.value = '';
						reject('Upload cancelled');
					}
				};

				input.click();

				while (!files?.length) {
					await new Promise((resolve) => setTimeout(resolve, 100));
				}
				const file = files[0];
				if (file) {
					input.value = '';
					uploadState = undefined;
					window.VM.FS.writeFile(filePath, new Uint8Array(await file.arrayBuffer()));
					resolve(file.name);
				}
			});
		};
	});
</script>

{#if uploadState}
	<div
		class="absolute top-0 left-0 w-screen h-screen backdrop-blur-xl flex flex-col justify-center align-middle items-center"
	></div>
{/if}

<input
	type="file"
	class="hidden"
	bind:this="{input}"
	id="file"
	bind:files="{files}"
	accept="{uploadState?.accept}"
/>
