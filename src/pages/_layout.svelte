<script>
    import { onMount } from "svelte";
    import Home from "./Home.svelte"
    import Stock from "./Stock.svelte"
    import History from "./History.svelte"

    let buttons = [
        {
            //home
            id : 1, 
            icon : '<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />',
            active : true,
            name :"Dashboard",
            pages : Home
        },
        {
            //stock
            id : 2, 
            icon : `<path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
  <path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd" />`,
            active : false,
            name :"Stock Barang",
            pages : Stock
        },
        {
            // history
            id : 3, 
            icon : `<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />`,
            active : false,
            name :"Aktifitas",
            pages : History
        },
    ]
    onMount(()=> {
        if (localStorage.selectedMenu) changeMenu(+localStorage.selectedMenu)
    })
    $: selectedMenu = buttons.find(v => v.active === true).pages
    const changeMenu = (id) => {
        if (buttons.find(v => v.active === true).id !== id) {
            buttons = [...buttons.map((v) => {
                v.active = false
                return v
            })]
            buttons.find(v => v.id === id).active = true
            buttons = [...buttons]
            localStorage.setItem('selectedMenu', id)
        } 
    }
</script>
<div class="h-screen max-h-screen w-full flex flex-col text-base-content py-4 px-2">
    <div class="flex justify-between my-2 items-center">
        <h1 class="text-2xl font-bold ">{buttons.find(v => v.active === true).name}</h1>
        {#if buttons.find(v => v.active === true).id === 2}
            <button>cari</button>
        {/if}
    </div>
    <div class="flex-1 flex flex-col">
        <svelte:component this="{selectedMenu}"/>
    </div>
    <div class="flex items-center justify-around py-2">
        {#each buttons as btn} 
            <button on:click={() => changeMenu(btn.id)} class="transition-transform {btn.active ? 'opacity-100 text-primary scale-125' : 'opacity-50 text-base-content scale-100'} ">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    {@html btn.icon}
                </svg>
            </button>
        {/each}
    </div>
    
    
    
</div>