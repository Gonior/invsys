<script>
    import { onMount } from "svelte";
    import {BASE_URL} from '../store'
    import LoadingState from '../components/LoadingState.svelte'
    import EmptyState from '../components/EmptyState.svelte'
    import Alert from '../components/Alert.svelte'
    import ModalAddCategory from '../components/ModalAddCategory.svelte'
    let categories = []
    let selectedCategory = {}
    let items = []
    let isLoading = true
    let isLoadingDelete = false
    let showModal = {
        open : false,
        modal : ''
    }
    let showAlert = {
        show : false,
        type : "",
        msg : ""
    }
    let openModalDelete = false
    onMount(async () => {
        await getCategories()
        await getItem()
        isLoading = false
    })

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
            categories = [{name : "semua", _id : "1222", active : true},...data]
        
            categories.map(v => {
                if (v.id !== "1222") return {name : v.name, _id : v._id, active : false}
            })
        }
    }
    const getItem = async () => {
        let token = JSON.parse(localStorage.getItem('auth')).token
        let res = await fetch($BASE_URL+'/item',{
            headers : {
                'Content-Type' : "application/json",
                'Authorization' : token
            }, 
            method : "GET"
        })
        if (res.ok) {
            let data = await res.json()
            
            return data
        }
    }
    
    const openModal = (modal) => {
        console.log(modal)
        if (modal === 'addProduct') {
            showModal.open = true
            showModal.modal = modal
        } else {
            showModal.open = true
            showModal.modal = "addCategory" 
        }
    }

    const changeCategory= (id) => {
        
        if (categories.find(v => v.active === true)._id !== id) {
            console.log('yahallo')
            categories = [...categories.map((v) => {
                v.active = false
                return v
            })]
            categories.find(v => v._id === id).active = true
            categories = [...categories]
            // localStorage.setItem('selectedMenu', id)
        } 
    }
    let intervalId;
    let i = 0;
    const holdEvent = (category) => {
        intervalId = setInterval(() => {
            i++
            if(i >= 60) {
                openModalDelete = true
                selectedCategory = {...category}
                releaseEvent()
            }
        },10)
    }

    const releaseEvent = () => {
        clearInterval(intervalId)
        i = 0
    }
    const deleteCategory = async (category) => {
        let isLoadingDelete = true
        let token = JSON.parse(localStorage.getItem('auth')).token
        let req = await fetch($BASE_URL+`/category/${category._id}`,{
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
            await getCategories()
        } {
            let res = await req.json()
            
            handleShowAlert(res.message,"error" )
        }
        
    }
    const handleShowAlert = (msg, type) => {
        showAlert.show = true
        showAlert.type = type
        showAlert.msg = msg
        setTimeout(() => {
            showAlert.show = false
        }, 3000);
        
    }

    const handleCloseModal = async (e) => {
        showModal.open = e.detail.showModal
        await getCategories()

    }
</script>

{#if showAlert.show}
    <Alert {...showAlert} />
{/if}
{#if isLoading}
    <LoadingState />
{/if}
{#if showModal.open}
    <ModalAddCategory showModal={showModal.open} on:closeModal={handleCloseModal} />
{/if}
<input type="checkbox" bind:checked="{openModalDelete}" class="modal-toggle"> 
<div class="modal">
    <div class="modal-box select-none" >
        <p>Apakah Kamu ingin menghapus kategori <span class="font-bold">{selectedCategory.name}</span>?</p> 
        <div class="modal-action">
            <button disabled={isLoadingDelete} class="btn" on:click="{() => openModalDelete = !openModalDelete}">Tidak</button>
            <button disabled={isLoadingDelete} class="btn btn-primary" on:click={() => deleteCategory(selectedCategory)}>Hapus</button> 
        </div>
    </div>
</div>
<div class="flex relative h-full flex-col">
    <div class="dropdown dropdown-left dropdown-end absolute z-10 right-2 bottom-2">
        <button tabindex="0" class="btn btn-circle btn-sm btn-primary shadow">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
        </button> 
        <ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-200 rounded-box min-w-max">
            <li>
                <button on:click="{() => openModal('addProduct')}">Tambah Barang</button>
            </li> 
            <li>
                <button on:click="{() => openModal('addCategory')}">Tambah Kategori</button>
            </li> 
        </ul>
    </div>

    <div class="flex overflow-x-auto space-x-2 no-scrollbar">
        {#each categories as category}
        <div on:mousedown="{holdEvent(category)}" on:touchstart="{holdEvent(category)}" on:touchend={releaseEvent(category)} on:mouseup="{releaseEvent(category)}" on:click={() => changeCategory(category._id)} class="cursor-pointer px-2 rounded-full select-none {category.active ? "bg-primary" : ""}" >
            {category.name}
        </div>

            
        {:else}
        <p>Belum ada kategori</p>
        {/each}
    </div>
    <div class="flex flex-1 justify-center">
        {#each items as item}
            {item}    
        {:else}
        <EmptyState msg ="belum ada item"/>
        {/each}
    </div>
</div>
