<script>
    import { onMount } from "svelte";
    import {BASE_URL} from '../store'
    import LoadingState from '../components/LoadingState.svelte'
    import EmptyState from '../components/EmptyState.svelte'
    import Alert from '../components/Alert.svelte'
    import ModalAddCategory from '../components/ModalAddCategory.svelte'
    import ModalAddProduct from '../components/ModalAddProduct.svelte'
    import CardProduct from '../components/CardProduct.svelte'
    import DetailStock from './DetailStock.svelte'
    let categories = []
    let keyword = ""
    let filterItems = []
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
            items = [...data]  
            filterItems = [...items]
        } 
    }
    
    const openModal = (modal) => {
        if (modal === 'addProduct') {
            showModal.open = true
            showModal.modal = modal
        } else {
            showModal.open = true
            showModal.modal = "addCategory" 
        }
    }

    const changeCategory= (id) => {
        keyword = ""
        if (categories.find(v => v.active === true)._id !== id) {
            categories = [...categories.map((v) => {
                v.active = false
                return v
            })]
            categories.find(v => v._id === id).active = true
            categories = [...categories]
            let selectedCategoryId = categories.find(v => v.active === true)._id
            if (selectedCategoryId !== "1222") {
                filterItems = [...items.filter(v => v.category._id === selectedCategoryId)]
            } else filterItems = [...items]
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
        isLoadingDelete = true
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
        isLoadingDelete = true
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
        await getItem()

    }

    const handleOpenDetail = (e) => {
        showModal.open = true
        showModal.modal = "detailProduct"
        showModal.item = e.detail.item
    }

    const searchEvent = () => {
        if (!keyword) {
            let selectedCategoryId = categories.find(v => v.active === true)._id
            if (selectedCategoryId !== "1222") {
                filterItems = [...items.filter(v => v.category._id === selectedCategoryId)]
            } else filterItems = [...items]
        }
        else {
            let selectedCategoryId = categories.find(v => v.active === true)._id
            if (selectedCategoryId !== "1222") {
                filterItems = [...filterItems.filter(v => v.name.toLowerCase().includes(keyword.toLowerCase()))]
            } else filterItems = [...items.filter(v => v.name.toLowerCase().includes(keyword.toLowerCase()))]
            
        }
    }
</script>

{#if showAlert.show}
    <Alert {...showAlert} />
{/if}
{#if isLoading}
    <LoadingState />
{/if}
{#if showModal.open && showModal.modal === "addCategory"}
    <ModalAddCategory showModal={showModal.open} on:closeModal={handleCloseModal} />
{:else if showModal.open && showModal.modal === "addProduct"}
    <ModalAddProduct showModal={showModal.open} on:closeModal={handleCloseModal} />    
{:else}
    <DetailStock showModal = {showModal.open} item={showModal.item} on:closeModal={handleCloseModal} />
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
    <div class="mb-2 relative">
        <div class="flex-1">
            <input on:keyup="{searchEvent}" type="text" bind:value="{keyword}" class="rounded-lg w-full py-2 pr-2 pl-10 bg-base-200 border-none focus:outline-none" placeholder="Cari barang..">
        </div>
        <div class="absolute inset-y-0 flex justify-center items-center left-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5 text-base-content text-opacity-80"><path d="M19 11a8 8 0 1 1-8-8 8 8 0 0 1 8 8Zm2 10-4.34-4.34" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/></svg>
        </div>
        
    </div>
    <div class="flex overflow-x-scroll space-x-2 no-scrollbar">
        {#each categories as category}
        <div on:mousedown="{holdEvent(category)}" on:touchstart="{holdEvent(category)}" on:touchend={releaseEvent(category)} on:mouseup="{releaseEvent(category)}" on:click={() => changeCategory(category._id)} class="whitespace-nowrap text-xs cursor-pointer px-2 rounded-full select-none {category.active ? "bg-primary" : ""}" >
            {category.name}
        </div>
        {:else}
        <p>Belum ada kategori</p>
        {/each}
    </div>
    <h1 class="uppercase opacity-50 text-xs my-2">List barang</h1>
    <div class="flex flex-1 overflow-y-auto no-scrollbar flex-col">
        {#each filterItems as item}
            <CardProduct {...item} on:openDetailProduct={handleOpenDetail} />
        {:else}
        <div class="m-auto">

            <EmptyState msg ="belum ada item"/>
        </div>
        {/each}
    </div>
</div>
