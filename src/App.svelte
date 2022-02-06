
<script>
	import { onMount } from 'svelte'
	import Login from './pages/Login.svelte'
	import Layout from './pages/_layout.svelte'
	let isAuth = false
	onMount(() => {
		console.log('from app')
		if (localStorage.auth) isAuth = true
	})
	const handleLogin = (e) => {		
		isAuth = e.detail.isAuth
	}
</script>

<main class="h-screen">
	{#if isAuth}

		<Layout/>
	{:else} 
		<Login on:login={handleLogin}/>
	{/if}
	
</main>
	
<style lang="postcss" global>
	@tailwind base;
	@tailwind components;
	@tailwind utilities;

	button {
		@apply border-none outline-none;
	}
	.no-scrollbar::-webkit-scrollbar {
  		display: none;
	}
</style>