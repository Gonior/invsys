<script>
    export let showModal = false
    import {createEventDispatcher, onMount} from 'svelte'
    import SkeletonModal from "./SkeletonModal.svelte"
    import Alert from './Alert.svelte'
    import {BASE_URL} from "../store"
    import {fly} from 'svelte/transition'
    let categories = []
    let errors = []
    let editedItem = false
    onMount(async () => {
        await getCategories()
    })
    const dispatch = createEventDispatcher()

    const getCategories = async () => {
        let token = JSON.parse(localStorage.getItem('auth')).token
        let res = await fetch($BASE_URL+'/category',{
            headers : {
                'Content-Type' : "application/json",
                'Authorization' : token
            },  
            method : "GET"
        })
        
        if (res.ok) {
            let data = await res.json()
            categories = [...data]
        
            categories.map(v => {
                return {name : v.name, _id : v._id, active : false}
            })
        }
    }
    let showAlert = {
        show: false,
        type : "",
        msg : ""
    }
    export let item = {
        _id : "",   
        name : "",
        unit : "",
        category : {},
        qty : 1,
        min : 0,
        gap : 0,
        max : 0,
    }
    export let editMode = false

    let isLoading = false
    const handleSubmit = async () => {
        let token = JSON.parse(localStorage.getItem('auth')).token
        isLoading = true
        let url = !editMode ? $BASE_URL+'/item' : $BASE_URL+`/item/${item._id}`
        let res = await fetch(url,{
            headers : {
                'Content-Type' : "application/json",
                'Authorization' : token
            }, 
            method : `${!editMode ? "POST" : "PUT"}`,
            body : JSON.stringify(item)
        })


        if (res.ok) {
            let data = await res.json()
            handleShowAlert(data.message, "success")
            if (!editMode) handleReset()
            else editedItem = true
        } else {
            let data = await res.json()
            errors = [...data.errors]
            handleShowAlert(data.message,"error")
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
    
    const handleReset = () => {
        item = {
            name : "",
            unit : "",
            category : {},
            qty : 1,
            min : 0,
            gap : 0,
            max : 0,
        }
    }

    const closeModal = () => {
        handleReset()
        let detail
        if (!editMode) detail = {showModal : !showModal}
        else detail = {showModal : !showModal, edited : editedItem}
        dispatch('closeModal', detail)
    }
</script>


{#if showAlert.show}
    <Alert {...showAlert} />
{/if}
{#if showModal}
<div class="absolute inset-0 z-30 bg-base-100">
    <div class="flex flex-col p-4 h-screen">
        <div class="flex items-center space-x-2">
            <button on:click={() => closeModal() } class="opacity-50 transition-opacity hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
            </button>
            <p class="text-xl font-bold">{!editMode ? "Tambah Barang" : "Edit Barang"}</p>
        </div>
        <div in:fly={{y :100 , duration : 200}}  class="">
            <form on:submit|preventDefault="{handleSubmit}" on:reset|preventDefault="{handleReset}" class="mt-4 space-y-4">
                <div class="flex flex-col">
                    <span class="label-text mb-1">Nama Barang</span>
                    <input type="text" bind:value="{item.name}" placeholder="EX Ayam Boiler" class="border-none p-2 bg-base-200 rounded-lg outline-none focus:ring-2 focus:ring-base-content focus:ring-offset-2" required> 
                    <span class="text-2xs">{errors.find(v => v.field === "name") ? errors.find(v => v.field === "name").message.replace('pengguna', 'barang') : ""}</span>
                </div> 
                <div class="flex w-full space-x-2">
                    <div class="flex flex-col flex-1">
                        <span class="label-text mb-1">Kuantitas</span>
                        <input type="number" bind:value="{item.qty}" step="0.1" class="w-full border-none p-2 bg-base-200 rounded-lg outline-none focus:ring-2 focus:ring-base-content focus:ring-offset-2" required> 
                        <span class="text-2xs">{errors.find(v => v.field === "qty") ? errors.find(v => v.field === "qty").message : ""}</span>
                    </div> 
                    <div class="flex flex-col flex-1">
                        <span class="label-text mb-1">Satuan</span>
                        <input type="text" bind:value="{item.unit}" placeholder="pcs" class="w-full border-none p-2 bg-base-200 rounded-lg outline-none focus:ring-2 focus:ring-base-content focus:ring-offset-2" required> 
                        <span class="text-2xs">{errors.find(v => v.field === "unit") ? errors.find(v => v.field === "unit").message : ""}</span>
                    </div> 
                </div>
                <div class="flex w-full space-x-2">
                    <div class="flex flex-col flex-1">
                        <span class="label-text mb-1">Min.</span>
                        <input type="number" bind:value="{item.min}" class="w-full border-none p-2 bg-base-200 rounded-lg outline-none focus:ring-2 focus:ring-base-content focus:ring-offset-2" required> 
                        <!-- <span class="text-2xs">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore, maxime atque magnam adipisci hic a explicabo rem dolorem</span> -->
                    </div>
                    <div class="flex flex-col flex-1">
                        <span class="label-text mb-1">Maks.</span>
                        <input type="number" bind:value="{item.max}" class="w-full border-none p-2 bg-base-200 rounded-lg outline-none focus:ring-2 focus:ring-base-content focus:ring-offset-2" required> 
                        <!-- <span class="text-2xs">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore, maxime atque magnam adipisci hic a explicabo rem dolorem</span> -->
                    </div> 
                    <div class="flex flex-col flex-1">
                        <span class="label-text mb-1">Gap</span>
                        <input type="number" bind:value="{item.gap}" placeholder="EX Camilan" class="w-full border-none p-2 bg-base-200 rounded-lg outline-none focus:ring-2 focus:ring-base-content focus:ring-offset-2" required> 
                        <!-- <span class="text-2xs">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Inventore, maxime atque magnam adipisci hic a explicabo rem dolorem</span> -->
                    </div> 
                </div>
                <div class="flex flex-col flex-1">
                    <span class="label-text mb-1">Kategori</span>
                    <select class="select select-bordered w-full" required bind:value="{item.category._id}">
                        {#each categories as category}
                            <option value="{category._id}">{category.name}</option>
                        {/each}
                    </select>
                    <span class="text-2xs">{errors.find(v => v.field === "category") ? errors.find(v => v.field === "category").message : ""}</span>
                </div> 
                
                <div class="flex justify-end mt-4 items-center space-x-2">
                    <button disabled={isLoading || editMode} type="reset"  class="text-sm uppercase opacity-80">Reset</button>
                    <button disabled={isLoading} type="submit" class=" btn btn-primary btn-sm">{!editMode ? "Simpan" : "Ubah"}</button>
                </div>
            </form>
        </div>
    </div>
</div>
{/if}