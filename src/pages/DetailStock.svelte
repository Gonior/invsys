<script>
    import { createEventDispatcher, onMount } from "svelte";
    import {fly} from 'svelte/transition'
    import ModalAddProduct from '../components/ModalAddProduct.svelte'
    import {BASE_URL} from '../store'
    import Alert from '../components/Alert.svelte'
    import CardActivity from '../components/CardActivity.svelte'
    import EmptyState from '../components/EmptyState.svelte'
    const dispatch = createEventDispatcher()
    export let showModal = false
    export let item
    export let openModalDelete = false
    export let openModalEdit = false
    let isLoading = false
    let isLoadingDelete = false
    let showAlert = {
        type : "",
        msg : "",
        show : false
    }

    let activities = []
    const closeModal = () => { 
        dispatch("closeModal", { showModal: !showModal })
    }
    onMount(async() => {
        await getActivities()
    })

    const getActivities = async (   ) => {
        let token = JSON.parse(localStorage.getItem('auth')).token
        let opt = {
            headers : {
                "Content-Type" : "application/json",
                'Authorization' : token
            }, 
            method : "GET"
        }

        let url = $BASE_URL+`/activity/${item._id}`
        let req = await fetch(url, opt)
        if (req.ok) {
            let data = await req.json()
            activities = [...data.map(d => {
                d.doing = d.do
                delete d.do
                return d
            })]
        }
    }

    const deleteProduct = async  () => {
        isLoadingDelete = true
        let token = JSON.parse(localStorage.getItem('auth')).token
        let req = await fetch($BASE_URL+`/item/${item._id}`,{
            headers : {
                'Content-Type' : "application/json",
                'Authorization' : token
            }, 
            method : "DELETE"
        })
        if (req.ok) {
            let res = await req.json()
            
            openModalDelete = !openModalDelete
            handleShowAlert(res.message,"success" )
            
        } else {
            let res = await req.json()
            handleShowAlert(res.message,"error" )
        }
        isLoadingDelete = true
    }
    const handleShowAlert = (msg, type) => {
        showAlert.show = true
        showAlert.type = type
        showAlert.msg = msg
        setTimeout(() => {
            showAlert.show = false
            
            closeModal()
        }, 2000);
        
    }

    let openModalChangeStock = false
    let changeStock = {
        type : {
            typeOfActivity : "",
            value : 0,
            reason : ""
        },
        userId : JSON.parse(localStorage.getItem('auth')).id
    }
    const getItem = async () => {
        let token = JSON.parse(localStorage.getItem('auth')).token
        let res = await fetch($BASE_URL+`/item/${item._id}`,{
            headers : {
                'Content-Type' : "application/json",
                'Authorization' : token
            }, 
            method : "GET"
        })
        if (res.ok) { 
            let data = await res.json()
            item = {...data}
        }
    }
    const handleCloseModal = async (e) => {
        openModalEdit = e.detail.showModal
        if (e.detail.edited && e.detail.edited === true) await getItem()
    }

    const handleOpenModalChangeStock = (type) => {
        changeStock.type.value = 0
        changeStock.type.reason = ""
        openModalChangeStock = !openModalChangeStock
        changeStock.type.typeOfActivity = type
        changeStock._id = item.id
    }
    const handleChangeStock = async () => {
        
        isLoading = true
        let token = JSON.parse(localStorage.getItem('auth')).token
        let req = await fetch($BASE_URL+`/item/changeStock/${item._id}`,{
            headers : {
                'Content-Type' : "application/json",
                'Authorization' : token
            }, 
            method : "PUT",
            body : JSON.stringify(changeStock)
        })
        
        if (req.ok) {
            let res = await req.json()
            await getItem()
            await getActivities()
            openModalChangeStock = !openModalChangeStock
            showAlert.show = true
            showAlert.type = "success"
            showAlert.msg = res.message
            setTimeout(() => {
                showAlert.show = false
            }, 2000);
            
            
        } else {
            let res = await req.json()
            showAlert.show = true
            showAlert.type = "error"
            showAlert.msg = res.message
        }

        isLoading = false
    }
</script>

{#if showModal}
{#if showAlert.show}
    <Alert {...showAlert} />
{/if}
{#if openModalEdit}
    <ModalAddProduct showModal={openModalEdit} {item} on:closeModal={handleCloseModal} editMode={true} />    
{/if}
{#if openModalChangeStock}
    <div class="absolute inset-0 z-40 flex justify-center items-center p-6">
        <div in:fly={{y :100 , duration : 200}}  class="bg-base-200 p-4 rounded-lg shadow-lg flex flex-col">
            <div class="flex justify-between items-center">
                <h1 class="text-xl font-semibold">{changeStock.type.typeOfActivity === "increase" ? "Tambah Stok" : "Kurangi Stok"}</h1>
                <button class="text-base-content text-opacity-80" on:click={() => openModalChangeStock = !openModalChangeStock}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6"><path style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" d="M19 19 5 5"/><path data-name="primary" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" d="M19 5 5 19"/></svg>
                </button>
            </div>
            <div class="flex flex-col">
                <div class="form-control">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label">
                        <span class="label-text">Jumlah</span>
                    </label> 
                    <input required type="number" bind:value="{changeStock.type.value}" placeholder="0" class="input input-bordered">
                </div>
                <div class="form-control">
                    <!-- svelte-ignore a11y-label-has-associated-control -->
                    <label class="label">
                        <span class="label-text">Keterangan</span>
                    </label> 
                    <textarea bind:value={changeStock.type.reason} class="textarea h-24 textarea-bordered" placeholder="Ket"></textarea>
                </div>
            </div>
            <div class="flex justify-end mt-2">
                <button disabled={isLoading} on:click={() => handleChangeStock()} class="btn btn-sm btn-outline  {changeStock.type.typeOfActivity === 'increase' ? 'btn-success' : 'btn-error'}">
                    {changeStock.type.typeOfActivity === "increase" ? "Tambah" : "Kurangi"}
                </button>
            </div>
        </div>
    </div>
{/if}
<input type="checkbox" bind:checked="{openModalDelete}" class="modal-toggle"> 
<div class="modal">
    <div class="modal-box select-none" >
        <p>Apakah Kamu ingin menghapus barang <span class="font-bold">{item.name}</span>?</p> 
        <div class="modal-action">
            <button disabled={isLoadingDelete} class="btn" on:click="{() => openModalDelete = !openModalDelete}">Tidak</button>
            <button disabled={isLoadingDelete} class="btn btn-primary" on:click={() => deleteProduct()}>Hapus</button> 
        </div>
    </div>
</div>
<div class="absolute inset-0 z-20 bg-base-100 h-screen flex flex-col p-4">
    <div class="flex items-center justify-between">
        <button on:click={() => closeModal() } class="opacity-50 transition-opacity hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>
        <div class="flex items-center space-x-2">
            <button on:click="{() => openModalEdit = !openModalEdit}" class="text-base-content opacity-50 transition-opacity hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6"><path d="M19.88 7 11 15.83 7 17l1.17-4 8.88-8.88A2.09 2.09 0 0 1 20 4a2.09 2.09 0 0 1-.12 3ZM21 21H3" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/></svg>
            </button>
            <button on:click="{() => openModalDelete = !openModalDelete}" class="text-base-content opacity-50 transition-opacity hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6"><path d="M4 7h16m-4 0V4a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3m9.07 13.07L18 7H6l.93 13.07a1 1 0 0 0 1 .93h8.14a1 1 0 0 0 1-.93ZM12 11v6" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/></svg>
            </button>
        </div>
    </div>
    <div class="flex flex-col mt-2 overflow-hidden">
        <h1 class="font-bold text-2xl mb-1">{item.name}</h1>
        <div class="flex justify-between space-x-2">
            <div class="p-3 flex-1 rounded bg-base-200 flex justify-between">
                <div class="flex flex-col">
                    <h1 class="font-bold">{item.qty} {item.unit}</h1>
                    <h4 class="text-opacity-60 text-xs text-base-content">Jumlah Stok</h4>
                </div>
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10 text-info text-opacity-70"><path d="m20 6-8 3-8-3 8-3Zm-8 9-8 3 8 3 8-3ZM4 6v12m8-9v12m8-15v12" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/></svg>
            </div>
            <div class="p-2 flex-1 rounded bg-base-200 flex flex-col">
                <h4 class="text-opacity-60 text-xs text-base-content">Status Stok</h4>
                <div class="w-full flex justify-center">
                    <div 
                    class:aman = {item.status === "Aman"}
                    class:mantul = {item.status === "Mantul"}
                    class:over = {item.status === "Over"}
                    class:bahaya = {item.status === "Bahaya"}
                    class:unknow = {item.status === "Tidak Diketahui"}
                    class="flex justify-center   items-center px-4 py-1 rounded-full space-x-2">
                        <p >{item.status}</p>   
                    </div>
                </div>
            </div>
        </div>
        <h1 class="uppercase opacity-50 text-xs my-2 font-bold">detail</h1>
        <div class="flex flex-col px-4 space-y-2">
            <div class="flex justify-between items-center">
                <h4 class="text-opacity-60 text-xs text-base-content">Minimal Stok</h4>
                <h1 class="font-bold">{item.min}</h1>
            </div>
            <div class="flex justify-between items-center">
                <h4 class="text-opacity-60 text-xs text-base-content">Maksimal Stok</h4>
                <h1 class="font-bold">{item.max}</h1>
            </div>
            <div class="flex justify-between items-center">
                <h4 class="text-opacity-60 text-xs text-base-content">Gap</h4>
                <h1 class="font-bold">{item.gap}</h1>
            </div>
            <div class="flex justify-between items-center">
                <h4 class="text-opacity-60 text-xs text-base-content">Satuan</h4>
                <h1 class="font-bold">{item.unit}</h1>
            </div>
            <div class="flex justify-between items-center">
                <h4 class="text-opacity-60 text-xs text-base-content">Kategori</h4>
                <h1 class="font-bold">{item.category.name}</h1>
            </div>
        </div>
        <h1 class="uppercase opacity-50 text-xs my-2 font-bold">Aktifitas</h1>
        <div class="flex-1 flex no-scrollbar overflow-y-auto flex-col px-4 py-2 space-y-2">
            {#each activities as act }
                <CardActivity {...act} />
                {:else}
                <EmptyState msg="Belum Ada Aktifitas"/>
            {/each}
        </div>  
    </div>
    <div class="flex justify-between mt-2"> 
        <button class="btn btn-sm btn-outline rounded-full btn-error" on:click={() => handleOpenModalChangeStock('decrease')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5"><path style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" d="M19 12H5"/></svg>
            Kurangi Stok
        </button>
        <button class="btn btn-sm btn-outline rounded-full btn-primary" on:click={() => handleOpenModalChangeStock('increase')}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5"><path d="M5 12h14m-7-7v14" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/></svg>
            Tambah Stok
        </button>
    </div>

</div>
{/if}

<style>
    .aman {
        @apply bg-info text-info bg-opacity-20;
    }

    .bahaya {
        @apply bg-error text-error bg-opacity-20;
    }

    .over {
        @apply bg-warning text-warning bg-opacity-20;
    }

    .mantul {
        @apply bg-success text-success bg-opacity-20 ;
    }

    .unknow {
        @apply bg-gray-600 text-gray-600;
    }
</style>
