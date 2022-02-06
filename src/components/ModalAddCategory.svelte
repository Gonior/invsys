<script>
    export let showModal = false
    import {createEventDispatcher} from 'svelte'
    import SkeletonModal from "./SkeletonModal.svelte"
    import Alert from './Alert.svelte'
    import {BASE_URL} from "../store"
    import {fly} from 'svelte/transition'


    const dispatch = createEventDispatcher()

    let showAlert = {
        show: false,
        type : "",
        msg : ""
    }
    let nameOfCategory = ""
    let isLoading = false
    const handleSubmit = async () => {
        isLoading = true
        let token = JSON.parse(localStorage.getItem('auth')).token
        let res = await fetch($BASE_URL+'/category',{
            headers : {
                'Content-Type' : "application/json",
                'Authorization' : token
            }, 
            method : "POST",
            body : JSON.stringify({name : nameOfCategory})
        })
        
        if (res.ok) {
            let data = await res.json()
            try {
                
                handleShowAlert(data.message.replace(/katerogi/gi, "kategori"), 'success')
                
            } catch (error) {
                handleShowAlert(data.error, 'error')
            }
            
        } else {
            let data = await res.json()
            try {
                let msg = data.message + "," + data.errors[0].message.replace(/Pengguna/gi, "Kategori")
                handleShowAlert(msg, 'error')
            } catch (error) {
                handleShowAlert(data.error, 'error')
            }
        }

        isLoading = false
    }

    const handleShowAlert = (msg, type) => {
        showAlert.show = true
        showAlert.type = type
        showAlert.msg = msg
        setTimeout(() => {
            showAlert.show = false
        }, 3000);
        
    }
    const closeModal = () => {
        dispatch('closeModal', {showModal : !showModal})
    }
</script>


{#if showAlert.show}
    <Alert {...showAlert} />
{/if}
{#if showModal}
<SkeletonModal >
    <div class="flex justify-center items-center h-full p-10">
        <div in:fly={{y :100 , duration : 200}}  class="p-4 rounded bg-base-200 shadow-lg flex flex-col">
            <div class="flex justify-between items-center">
                <h1 class="text-xl font-bold">Tambah Kategori</h1>
                <button on:click={() => closeModal() } class="opacity-50 transition-opacity hover:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <form on:submit|preventDefault="{handleSubmit}" class="mt-4">
                <div class="form-control">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label">
                        <span class="label-text">Nama Kategori</span>
                    </label> 
                    <input type="text" bind:value="{nameOfCategory}" placeholder="EX Camilan" class="input input-bordered"> 
                </div> 
                <div class="flex justify-end mt-4 items-center space-x-2">
                    <button disabled={isLoading} type="button" on:click={() => closeModal()} class="text-xs uppercase opacity-80">Cancel</button>
                    <button disabled={isLoading} type="submit" class=" btn btn-primary btn-xs rounded-full">Simpan</button>
                </div>
            </form>
        </div>
    </div>
</SkeletonModal>
{/if}