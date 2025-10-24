<script>
	import { onDestroy, createEventDispatcher } from "svelte";

	export let minutes = 25;
	export let isRunning = false;
	export let title = "";

	const dispatch = createEventDispatcher();

	let remainingMs = minutes * 60000;
	let endTimestamp = null;
	let intervalId = null;
	let hasStarted = false;
	let hasFinished = false; // prevent repeated finished events

	function formatTime(ms) {
		const totalSeconds = Math.max(0, Math.floor(ms / 1000));
		const mins = Math.floor(totalSeconds / 60);
		const secs = totalSeconds % 60;
		return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
	}

	let display = formatTime(remainingMs);

	function tick() {
		const msLeft = endTimestamp - Date.now();
		remainingMs = Math.max(0, msLeft);
		display = formatTime(remainingMs);

		document.title = `${title} ⏳ ${display}`;

		// dispatch("update", { remainingMs, display });

		// when timer hits 0, only trigger "finished" once
		if (remainingMs <= 0 && !hasFinished) {
			hasFinished = true;
			stopTimer();
			endTimestamp = null;
			dispatch("finished");
		}
	}

	function startTimer() {
		if (intervalId) return;
		if (!endTimestamp) endTimestamp = Date.now() + remainingMs;
		hasStarted = true;
		hasFinished = false; // reset finish flag on new start
		intervalId = setInterval(tick, 100);
		dispatch("started");
	}

	function stopTimer() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
			dispatch("paused");
		}
	}

	// react to isRunning changes
	$: {
		if (isRunning && !hasFinished) {
			startTimer();
		} else if (!isRunning && intervalId) {
			remainingMs = Math.max(0, endTimestamp - Date.now());
			display = formatTime(remainingMs);
			stopTimer();
			endTimestamp = null;
		}
	}

	// reset only if minutes change and never started yet
	$: if (!hasStarted) {
		remainingMs = minutes * 60000;
		display = formatTime(remainingMs);
	}

	onDestroy(stopTimer);
</script>

<div class="timer">{display}</div>

<style>
	.timer {
		display: inline-block;
		font-size: 1.6rem;
		font-weight: 600;
		padding: 8px 12px;
		border-radius: 8px;
		background: #f3f3f3;
		font-family: system-ui, sans-serif;
		min-width: 80px;
		text-align: center;
		color: black;
	}
</style>
