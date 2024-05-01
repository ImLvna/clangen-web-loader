<script lang="ts">
	import { onMount } from 'svelte';

	let closedGracefully = $state(false);

	onMount(() => {
		window.closeGracefully = () => {
			closedGracefully = true;
			window.FS.syncfs(false, console.log);
		};
	});
</script>

{#if closedGracefully}
	<div
		class="absolute top-0 left-0 size-full flex flex-col justify-center align-middle items-center"
	>
		<div
			class="bg-gray-800 p-4 rounded-lg min-h-1/2 w-1/4 flex flex-col justify-center align-middle text-center items-center"
		>
			<h1 class="text-2xl text-white">The Game Closed</h1>
			<div class="flex flex-row gap-3">
				<button onclick="{() => window.location.reload()}" class="bg-gray-600 p-2 rounded-lg"
					>Reload</button
				>
			</div>
		</div>
	</div>
{/if}
