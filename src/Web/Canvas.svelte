<script lang="ts">
	const { gameReady = false } = $props();

	let parent = $state<HTMLElement | null>(null);
	let canvas = $state<HTMLCanvasElement | null>(null);

	const calculateSize = () => {
		if (parent && canvas) {
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
		}
	};
</script>

<div
	bind:this="{parent}"
	onresize="{calculateSize}"
	class="flex flex-row justify-center align-middle items-center size-full"
>
	<div class="wrapper w-full h-auto md:h-full lg:h-full md:w-auto lg:w-auto">
		<canvas bind:this="{canvas}" id="canvas" class="" class:hidden="{!gameReady}"> </canvas>
	</div>
</div>

<style>
	.wrapper {
		aspect-ratio: 8/7;
	}
</style>
