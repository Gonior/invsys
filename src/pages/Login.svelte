<script>
    import Alert from '../components/Alert.svelte'
    import {createEventDispatcher} from 'svelte'
    const dispatch = createEventDispatcher()
    import {BASE_URL} from '../store'
    let username, password
    let isLoading = false
    let showAlert = {
        show : false,
        type : "",
        msg : ""
    }
    const auth = async (username, password) => {
        let res = await fetch($BASE_URL+'/login', {
            headers : {
                'Content-Type': 'application/json',
            },
            method : "POST",
            body : JSON.stringify({username, password})
        })
        if (res.status === 200) {
            let json = await res.json()
            //success
            localStorage.setItem("auth", JSON.stringify(json))
            dispatch('login', {isAuth : true})

        } else {
            let json = await res.json()
            handleShowError(json.message, "error")
        }
        
    }

    const handleSubmit = async () => {
        isLoading = true
        await auth(username, password)
        isLoading = false
        
    }

    const handleShowError = (msg, type) => {
        showAlert.show = true
        showAlert.type = type
        showAlert.msg = msg
        setTimeout(() => {
            showAlert.show = false
        }, 3000);
        
    }
</script>
{#if showAlert.show}
    <Alert {...showAlert} />
{/if}

<div class="flex justify-center items-center h-full">
    <div class="card bg-base-200 flex p-4 shadow-lg text-base-content flex-col">
        <div>
            <h1 class="text-2xl font-semibold">Selamat Datang :)</h1>
            <p class="text-base-content opacity-70">Silahkan masukan username dan password anda</p>
        </div>
        <form on:submit|preventDefault="{handleSubmit}">
            <div class="flex-1 mt-2 space-y-2">
                <div class="form-control relative">
                    <div class="absolute inset-y-0 flex justify-center items-center left-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <input type="text" class="input pl-10" required placeholder="username" bind:value={username}>
                </div>
                <div class="form-control relative">
                    <div class="absolute inset-y-0 flex justify-center items-center left-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>                        
                    </div>
                    <input type="password" class="input pl-10" required placeholder="password" bind:value="{password}">
                </div>
            </div>
            <div class="flex justify-end mt-2">
                <button disabled={isLoading} type="submit" class="{isLoading ? 'disabled' : ''} btn btn-primary" >masuk</button>
            </div>
        </form>
    </div>
</div>