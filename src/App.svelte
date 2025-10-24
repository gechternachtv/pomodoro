<script>
	import Counter from "./Counter.svelte";
	import { onMount } from "svelte";
	import Todo from "./Todo.svelte";

	import audiocowUrl from "/cow.wav?url";
	import audiostartUrl from "/start.wav?url";
	import audioboingUrl from "/boing.wav?url";
	import audioflowerUrl from "/flower.wav?url";
	import audiostartshortUrl from "/startshort.wav?url";
	import audiomarinbaUrl from "/marinba.wav?url";
	import audiofinishbreakUrl from "/finishbreak.wav?url";

	let isPlaying = false;
	let tab = "working";
	let worksessions = 0;
	let longbreakcounter = 0;
	let audiostart,
		audioboing,
		audioflower,
		audiostartshort,
		audiomarinba,
		audiofinishbreak,
		audiocow;

	let firststart = true;
	let starttime = "";
	function setStartTime() {
		const now = new Date();
		const hours = now.getHours();
		const minutes = now.getMinutes();
		starttime = `${hours}:${minutes}`;
	}

	function onFinished() {
		console.log("⏰ Timer finished!");
		isPlaying = false;
	}
	let permissionGranted = false;

	onMount(() => {
		if ("Notification" in window) {
			Notification.requestPermission().then((permission) => {
				permissionGranted = permission === "granted";
			});
		}
	});

	function notify(title, options) {
		if ("Notification" in window && Notification.permission === "granted") {
			new Notification(title, options);
		}
	}
</script>

<main>
	<audio bind:this={audiocow} src={audiocowUrl} preload="auto"></audio>
	<audio bind:this={audiostart} src={audiostartUrl} preload="auto"></audio>
	<audio bind:this={audioboing} src={audioboingUrl} preload="auto"></audio>
	<audio bind:this={audioflower} src={audioflowerUrl} preload="auto"></audio>
	<audio bind:this={audiostartshort} src={audiostartshortUrl} preload="auto"
	></audio>
	<audio bind:this={audiomarinba} src={audiomarinbaUrl} preload="auto"
	></audio>
	<audio bind:this={audiofinishbreak} src={audiofinishbreakUrl} preload="auto"
	></audio>

	<div class="dash">
		<div>work sessions: {worksessions}</div>
		{#if !firststart}
			<div>start: {starttime}</div>
		{/if}
	</div>

	<div class="tabs">
		<button
			class="working"
			on:click={() => {
				document.title = `work`;
				isPlaying = false;
				tab = "working";
			}}>work</button
		>
		<button
			class="short"
			on:click={() => {
				document.title = `shortbreak`;
				isPlaying = false;
				tab = "short";
			}}>short break</button
		>
		<button
			class="long"
			on:click={() => {
				document.title = `longbreak`;
				isPlaying = false;
				tab = "long";
			}}>long break</button
		>
	</div>

	{#if tab == "working"}
		<div class="container working">
			<div>workin</div>
			<Counter
				title="work"
				minutes={25}
				isRunning={isPlaying}
				on:finished={() => {
					worksessions += 1;
					longbreakcounter += 1;
					if (longbreakcounter > 3) {
						longbreakcounter = 0;
						tab = "long";
						notify("long break");
					} else {
						tab = "short";
						notify("short break");
					}
					audioboing.play();
					onFinished();
				}}
			></Counter>
		</div>
		<button
			class="startbtn"
			on:click={() => {
				if (isPlaying) {
					audiocow.play();
				} else {
					audiostart.play();
				}
				if (firststart) {
					firststart = false;
					setStartTime();
				}

				isPlaying = !isPlaying;
			}}
		>
			{isPlaying ? "Pause" : "Start"}
		</button>
	{:else if tab == "short"}
		<div class="container short">
			<div>short break</div>
			<Counter
				title="short"
				minutes={5}
				isRunning={isPlaying}
				on:finished={() => {
					audiomarinba.play();
					tab = "working";
					notify("back to work");
					onFinished();
				}}
			></Counter>
		</div>
		<button
			class="startbtn"
			on:click={() => {
				if (isPlaying) {
					audiocow.play();
				} else {
					audiostartshort.play();
				}

				isPlaying = !isPlaying;
			}}
		>
			{isPlaying ? "Pause" : "Start"}
		</button>
	{:else if tab == "long"}
		<div class="container long">
			<div>long break</div>
			<Counter
				title="long"
				minutes={15}
				isRunning={isPlaying}
				on:finished={() => {
					audiofinishbreak.play();
					tab = "working";
					notify("back to work");
					onFinished();
				}}
			></Counter>
		</div>
		<button
			class="startbtn"
			on:click={() => {
				if (isPlaying) {
					audiocow.play();
				} else {
					audioflower.play();
				}

				isPlaying = !isPlaying;
			}}
		>
			{isPlaying ? "Pause" : "Start"}
		</button>
	{/if}

	<Todo></Todo>
</main>

<style>
	* {
		font-family: "bitbuntu";
		font-size: 12px;
	}

	.container {
		padding: 15px;
	}
	.working {
		background: #a72145;
		color: white;
	}

	.short {
		background: #00a493;
		color: white;
	}

	.long {
		background: #2d2d5c;
		color: white;
	}

	main {
		max-width: 200px;
		margin: auto;
	}

	button {
		border: 0px;
		margin: 0;
		padding: 4px;
		border-radius: 10px 10px 0 0;
		width: 100%;
	}
	.startbtn {
		border-radius: 0px 0px 10px 10px;
	}

	.tabs {
		display: flex;
		width: 100%;
	}

	.dash {
		background: #005541;
		padding: 10px;
		border-radius: 10px;
		margin-bottom: 10px;
	}

	.startbtn {
		background: #ffc832;
	}
</style>
