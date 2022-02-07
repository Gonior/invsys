
<script>
	import { onMount } from 'svelte'
	import Login from './pages/Login.svelte'
	import Layout from './pages/_layout.svelte'
	import {BASE_URL} from './store.js'
	let isAuth = false
	onMount(async () => {
		if (localStorage.auth) {
			let token = JSON.parse(localStorage.auth).token
			let req = await fetch($BASE_URL+"/login/verif", {
				headers : {
					"Content-Type" : "application/json"
				}, 
				method : "POST",
				body : JSON.stringify({token})
			})

			if (req.ok) {
				isAuth = true
			}
			
		}
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