<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		error: (e: string) => void;
		toggleDebug: () => void;
	}

	let errorMsg = $state<string>();

	onMount(() => {
		window.gameError = (e: string) => {
			console.error(e);
			errorMsg = e;
		};
	});
</script>

{#if errorMsg}
	<div
		class="absolute top-0 left-0 size-full flex flex-col justify-center align-middle items-center"
	>
		<div
			class="bg-gray-800 p-4 rounded-lg min-h-1/2 w-1/2 flex flex-col justify-center align-middle text-center items-center"
		>
			<h1 class="text-2xl text-red-500">The Game Crashed</h1>
			<code
				>{#each errorMsg.split('\n') as line}
					<pre>{line}</pre>
				{/each}</code
			>
			<div class="flex flex-row gap-3">
				<button onclick="{() => window.location.reload()}" class="bg-gray-600 p-2 rounded-lg"
					>Reload</button
				>
				<button onclick="{window.toggleDebug}" class="bg-gray-600 p-2 rounded-lg">Open Logs</button>
				<button onclick="{window.downloadLogsCallback}" class="bg-gray-600 p-2 rounded-lg"
					>Download Logs</button
				>
			</div>
		</div>
	</div>
{/if}
