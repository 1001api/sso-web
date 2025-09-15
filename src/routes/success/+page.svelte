<script lang="ts">
	import { Card } from "flowbite-svelte";
	import { onMount } from "svelte";
	import { page } from "$app/state";

	const defaultRedirect = "https://1001api.com";
	const redirectQuery =
		page.url.searchParams.get("redirect_to") ?? defaultRedirect;

	let seconds = 5;
	let interval: number | undefined;

	function setTimer() {
		interval = setInterval(() => {
			if (seconds === 0) {
				// redirect to url
				window.location.href = redirectQuery;

				// clear
				clearInterval(interval);
			} else {
				seconds--;
			}
		}, 1000);
	}

	function stopInterval() {
		if (interval) {
			clearInterval(interval);
		}
	}

	onMount(() => {
		setTimer();
	});
</script>

<main
	class="w-full min-h-[100dvh] flex items-center justify-center lg:justify-start bg-center"
	style="background-image: url('/bg-auth-success.png');"
>
	<Card class="max-w-md lg:ml-20 shadow-2xl mt-32 mx-4">
		<div class="flex flex-col space-y-6">
			<div>
				<h1 class="text-2xl font-bold text-gray-900 dark:text-white">
					Login success!
				</h1>
				<p class="mt-2">
					You will be redirected to <a
						class="underline text-primary-600 font-bold"
						href={redirectQuery}>{redirectQuery}</a
					>
				</p>

				<p>
					in <strong class="text-black font-medium">{seconds}</strong>
					seconds.

					<button
						onclick={stopInterval}
						class="hover:underline cursor-pointer"
						>Click here to cancel.</button
					>
				</p>
			</div>
		</div>
	</Card>
</main>
