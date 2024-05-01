<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		gameReady: boolean;
	}

	let termShown = $state(false);
	let termButtonShown = $state(false);

	const { gameReady = false }: Props = $props();

	onMount(() => {
		window.toggleDebug = () => {
			termShown = !termShown;
			if (termShown) {
				termButtonShown = true;
			}
		};
	});
</script>

<div class="console h-full max-w-2/3 flex flex-row absolute top-0 left-0 z-50">
	<div class="flex flex-row size-full">
		<div id="pyconsole" class="h-full overflow-y-auto" class:collapsed="{!termShown}">
			<div id="terminal" class="size-full"></div>
		</div>
		{#if termButtonShown}
			<button onclick="{window.toggleDebug}" class="termButton min-h-screen w-6 bg-gray-800"
			></button>
		{/if}
	</div>
</div>

<style>
	.collapsed {
		width: 0;
		display: none;
	}
</style>
