<script lang="ts">
	import {
		Card,
		Button,
		Label,
		Input,
		Hr,
		Spinner,
		Toast,
	} from "flowbite-svelte";
	import { onDestroy, onMount } from "svelte";
	import { page } from "$app/state";
	import SvelteOtp from "@k4ung/svelte-otp";
	import { slide } from "svelte/transition";

	// Constants
	const API_BASE_URL =
		import.meta.env.VITE_API_URL || "http://localhost:8181/api/v1";
	const DEFAULT_REDIRECT = "https://1001api.com";
	const OTP_LENGTH = 6;
	const INITIAL_MINUTES = 1;
	const INITIAL_SECONDS = 30;

	// Redirect URL from query
	const redirectQuery =
		page.url.searchParams.get("redirect") ?? DEFAULT_REDIRECT;

	// Reactive state
	let emailInput = $state("");
	let emailOTPError = $state("");
	let otpInput = $state("");
	let otpError = $state("");
	let enableOTPCard = $state(false);
	let loadingOTP = $state(false);
	let allowResend = $state(false);
	let otpSendToastStatus = $state(false);
	let otpSendToastCounter = $state(5);
	let minutes = $state(INITIAL_MINUTES);
	let seconds = $state(INITIAL_SECONDS);
	let intervalId: number | undefined;

	function openNewWindow(type: string, redirect: string) {
		const authUrl = `${API_BASE_URL}/auth/social/${type.toLowerCase()}?redirect=${encodeURIComponent(redirect)}`;
		const width = 500;
		const height = 600;
		const left = window.innerWidth / 2 - width / 2;
		const top = window.innerHeight / 2 - height / 2;

		const popup = window.open(
			authUrl,
			`${type} Login`,
			`width=${width},height=${height},top=${top},left=${left}`,
		);

		if (!popup) {
			alert("Popup blocked. Please allow popups for this site.");
			return;
		}

		const checkPopup = setInterval(() => {
			if (popup?.closed) clearInterval(checkPopup);
		}, 1000);
	}

	onMount(() => {
		window.addEventListener("message", (e) => {
			// Security: Validate origin in production
			// if (e.origin !== new URL(API_BASE_URL).origin) return;
			const { redirect_url, success, access_token } = e.data;

			if (success) {
				window.location.href = `/success?redirect=${encodeURIComponent(redirect_url)}`;

				// save access token to storage, ideally secure. 
				// but for now I will save it to localstorage
				localStorage.setItem("access_token", access_token);
			}
		});
	});

	// Timer logic
	function startTimer() {
		// Ensure no duplicate intervals
		stopTimer();

		intervalId = setInterval(() => {
			if (minutes === 0 && seconds === 0) {
				allowResend = true;
				stopTimer();
				return;
			}

			if (seconds === 0) {
				minutes--;
				seconds = 59;
			} else {
				seconds--;
			}
		}, 1000);
	}

	function stopTimer() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = undefined;
		}
	}

	function resetTimer() {
		stopTimer();

		minutes = INITIAL_MINUTES;
		seconds = INITIAL_SECONDS;
		allowResend = false;

		startTimer();
	}

	async function handleOTPRequest(e: Event) {
		e.preventDefault();

		if (!emailInput.trim()) {
			emailOTPError = "Email is required";
			return;
		}

		loadingOTP = true;
		emailOTPError = "";

		try {
			const res = await fetch(`${API_BASE_URL}/auth/otp`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: emailInput,
					otp: otpInput,
				}),
			});

			const data = await res.json();

			if (res.ok) {
				enableOTPCard = true;
				resetTimer();
				triggerOTPSendToast();
			} else {
				emailOTPError = data.error || "Failed to send OTP";
			}
		} catch (error) {
			emailOTPError = "Network error, please try again";
			console.error("OTP Request Error:", error);
		} finally {
			loadingOTP = false;
		}
	}

	async function handleOTPResend() {
		if (!allowResend) return;
		otpInput = "";
		await handleOTPRequest(new Event("submit"));
	}

	async function handleOTPVerify() {
		if (!otpInput || otpInput.length !== OTP_LENGTH || !emailInput) return;

		loadingOTP = true;
		otpError = "";

		try {
			const response = await fetch(`${API_BASE_URL}/auth/otp/verify`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: emailInput,
					otp: otpInput,
				}),
			});

			const data = await response.json();

			console.log(data);
			console.log(response);

			if (response.ok) {
				stopTimer();
				window.location.href = `/success?redirect=${encodeURIComponent(redirectQuery)}`;
			} else {
				otpError = data.error || "Invalid OTP";
			}
		} catch (err) {
			otpError = "Network error, please try again";
			console.error("OTP Verify Error:", err);
		} finally {
			loadingOTP = false;
		}
	}

	$effect(() => {
		if (otpInput && otpInput.length === OTP_LENGTH) {
			handleOTPVerify();
		}
	});

	function triggerOTPSendToast() {
		otpSendToastStatus = true;
		otpSendToastCounter = 6;
		timeoutOTPSendToast();
	}

	function timeoutOTPSendToast() {
		if (--otpSendToastCounter > 0)
			return setTimeout(timeoutOTPSendToast, 1000);
		otpSendToastStatus = false;
	}

	onDestroy(() => {
		stopTimer();
	});
</script>

<Toast
	bind:toastStatus={otpSendToastStatus}
	dismissable={false}
	transition={slide}
	class="max-w-full py-2 absolute"
>
	<div class="w-full flex items-center justify-between">
		<div class="flex items-center gap-1">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="size-4 animate-pulse text-orange-600"
			>
				<path
					d="M4.214 3.227a.75.75 0 0 0-1.156-.955 8.97 8.97 0 0 0-1.856 3.825.75.75 0 0 0 1.466.316 7.47 7.47 0 0 1 1.546-3.186ZM16.942 2.272a.75.75 0 0 0-1.157.955 7.47 7.47 0 0 1 1.547 3.186.75.75 0 0 0 1.466-.316 8.971 8.971 0 0 0-1.856-3.825Z"
				/>
				<path
					fill-rule="evenodd"
					d="M10 2a6 6 0 0 0-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 0 0 .515 1.076 32.91 32.91 0 0 0 3.256.508 3.5 3.5 0 0 0 6.972 0 32.903 32.903 0 0 0 3.256-.508.75.75 0 0 0 .515-1.076A11.448 11.448 0 0 1 16 8a6 6 0 0 0-6-6Zm0 14.5a2 2 0 0 1-1.95-1.557 33.54 33.54 0 0 0 3.9 0A2 2 0 0 1 10 16.5Z"
					clip-rule="evenodd"
				/>
			</svg>

			<span class="font-bold">OTP code has been sent to your email.</span>
		</div>
		<p class="text-xs">
			Autohide in {otpSendToastCounter}s
		</p>
	</div>
</Toast>

<main
	class="w-full min-h-[100dvh] flex items-center justify-center lg:justify-start bg-center"
	style="background-image: url('/bg-auth-2.png');"
>
	{#if !enableOTPCard}
		<Card class="max-w-sm lg:ml-20 shadow-2xl">
			<form class="flex flex-col space-y-6" onsubmit={handleOTPRequest}>
				<div>
					<h1
						class="text-3xl font-bold text-gray-900 dark:text-white"
					>
						Hubku SSO
					</h1>
					<p class="text-sm">
						Log into Hubku Space your way; no passwords, just
						socials or email OTP. New? Skip endless input, we
						auto-create your editable account.
					</p>
				</div>

				<div>
					<Label class="space-y-2">
						<span>One Time Password to Email</span>
						<Input
							type="email"
							name="email"
							class="mt-2"
							placeholder="name@email.com"
							bind:value={emailInput}
							required
						/>
						<p class="text-xs ml-2 text-red-500 font-bold">
							{emailOTPError}
						</p>
					</Label>

					<Button
						type="submit"
						disabled={loadingOTP}
						class="w-full mt-4 cursor-pointer"
					>
						{#if loadingOTP}
							<Spinner class="me-3" size="4" color="white" />
						{/if}
						Send Access to Email
					</Button>
				</div>

				<div>
					<Hr classHr="my-2 w-64">or</Hr>
				</div>

				<div class="flex flex-col gap-4">
					<Button
						type="button"
						color="light"
						class="w-full border-gray-500 flex items-center gap-2 cursor-pointer"
						onclick={() => openNewWindow("Google", redirectQuery)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="size-5"
							viewBox="0 0 256 262"
						>
							<path
								fill="#4285F4"
								d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
							></path>
							<path
								fill="#34A853"
								d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
							></path>
							<path
								fill="#FBBC05"
								d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
							></path>
							<path
								fill="#EB4335"
								d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
							></path>
						</svg>
						Login using Google</Button
					>
					<Button
						type="button"
						color="light"
						class="w-full border-gray-500 flex items-center gap-2 cursor-pointer"
						onclick={() => openNewWindow("Github", redirectQuery)}
					>
						<svg xmlns="http://www.w3.org/2000/svg" class="size-5">
							<path
								fill-rule="evenodd"
								d="M10 0c5.523 0 10 4.59 10 10.253 0 4.529-2.862 8.371-6.833 9.728-.507.101-.687-.219-.687-.492 0-.338.012-1.442.012-2.814 0-.956-.32-1.58-.679-1.898 2.227-.254 4.567-1.121 4.567-5.059 0-1.12-.388-2.034-1.03-2.752.104-.259.447-1.302-.098-2.714 0 0-.838-.275-2.747 1.051A9.396 9.396 0 0 0 10 4.958a9.375 9.375 0 0 0-2.503.345C5.586 3.977 4.746 4.252 4.746 4.252c-.543 1.412-.2 2.455-.097 2.714-.639.718-1.03 1.632-1.03 2.752 0 3.928 2.335 4.808 4.556 5.067-.286.256-.545.708-.635 1.371-.57.262-2.018.715-2.91-.852 0 0-.529-.985-1.533-1.057 0 0-.975-.013-.068.623 0 0 .655.315 1.11 1.5 0 0 .587 1.83 3.369 1.21.005.857.014 1.665.014 1.909 0 .271-.184.588-.683.493C2.865 18.627 0 14.783 0 10.253 0 4.59 4.478 0 10 0"
							></path>
						</svg>
						Login using Github</Button
					>
				</div>

				<div class="text-sm text-gray-500 dark:text-gray-300">
					By logging in, you agree to our <a
						href="/"
						class="text-primary-700 underline dark:text-primary-500"
					>
						Terms of Service
					</a>
					and
					<a
						href="/"
						class="text-primary-700 underline dark:text-primary-500"
					>
						Privacy Policy
					</a>
				</div>
			</form>
		</Card>
	{:else}
		<Card class="max-w-md lg:ml-20 shadow-2xl mx-4">
			<div class="flex flex-col space-y-6">
				<div>
					<h1
						class="text-2xl font-semibold text-gray-900 dark:text-white"
					>
						Enter OTP Code
					</h1>
					<p class="text-gray-600 dark:text-gray-300 mt-2">
						Please check your email inbox for the one-time
						verification code
					</p>

					<div class="w-full flex flex-col items-center my-8">
						<SvelteOtp
							bind:value={otpInput}
							numberOnly
							onlyShowMiddleSeparator
							separator="-"
							inputClass="rounded-lg border border-gray-300 bg-white font-medium text-gray-900 w-[40px] h-[55px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>

						{#if otpError}
							<p class="mt-4 text-xs text-red-500 font-bold">
								Invalid OTP Code, please retry
							</p>
						{/if}
					</div>

					<p class="text-sm text-gray-500 dark:text-gray-400">
						If you haven't received the code, please check your spam
						or promotions folder.

						{#if !allowResend}
							<span>
								You may request a new code after {minutes} minutes
								{seconds}
								seconds.
							</span>
						{/if}
					</p>

					<div>
						{#if allowResend}
							<Button
								color="alternative"
								class="w-full mt-4 cursor-pointer"
								onclick={handleOTPResend}
							>
								Resend Verification Code
							</Button>
						{/if}
						<Button
							color="alternative"
							class="w-full mt-4 cursor-pointer"
							onclick={() => (enableOTPCard = false)}
						>
							Use Social Login Instead
						</Button>
					</div>
				</div>
			</div>
		</Card>
	{/if}
</main>
