<script lang="ts">
	import '../app.css';
	
	let { children } = $props();
</script>
	
<svelte:head>
	<!-- SEO Meta Tags -->
	<title>Hubku SSO - Secure Single Sign-On</title>
	<meta name="description" content="Log in securely to all Hubku services with one set of credentials. Fast, simple, and safe single sign-on solution." />
	<meta name="keywords" content="Hubku SSO, single sign-on, secure login, authentication, Hubku services" />
	<meta name="author" content="Hubku" />

	<!-- Open Graph (OG) Tags for Social Sharing -->
	<meta property="og:title" content="Hubku SSO - Secure Single Sign-On" />
	<meta property="og:description" content="Access all Hubku services with one secure login. Simplify your authentication with Hubku SSO." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://sso.hubku.com" />
	<meta property="og:image" content="https://sso.hubku.com/og-image.jpg" />
	<meta property="og:site_name" content="Hubku" />

	<!-- Twitter Card Tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Hubku SSO - Secure Single Sign-On" />
	<meta name="twitter:description" content="Access all Hubku services with one secure login. Simplify your authentication with Hubku SSO." />
	<meta name="twitter:image" content="https://sso.hubku.com/og-image.jpg" />
	<!-- Replace with your Twitter acc -->
	<meta name="twitter:site" content="@hubkudev" /> 

	<!-- Favicon and Brand Icons -->
	<link rel="manifest" href="/site.webmanifest" />

	<!-- Brand Colors and Theme -->
	<meta name="theme-color" content="#ef562f" />

	<link rel="canonical" href="https://sso.hubku.com" />
</svelte:head>

{@render children()}
