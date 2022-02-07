<script>
    import DetailStock from '../pages/DetailStock.svelte'
    import SkeletonModal from './SkeletonModal.svelte'
    import {createEventDispatcher} from 'svelte'
    let modal = {
        showModal : false,
        item : {}
    }

    const dispatch = createEventDispatcher()
    export let name
    export let qty
    export let unit
    export let status
    export let _id
    export let min
    export let max
    export let gap
    export let category
    const openProduct = () => {
        let item = {name, qty, unit, status, _id, min, max, gap, category}
        dispatch('openDetailProduct', {item})
    }

</script>



<div class="flex justify-between items-center p-4">
    <div class="flex flex-col">
        <div class="flex space-x-2 items-center">
            <span class="font-bold text-lg">{name}</span>
            <span 
            class:aman = {status === "Aman"}
            class:mantul = {status === "Mantul"}
            class:over = {status === "Over"}
            class:bahaya = {status === "Bahaya"}
            class:unknow = {status === "Tidak Diketahui"}
            class="">{status}</span>
        </div>
        <div class="flex items-center space-x-1">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 text-info text-opacity-70"><path d="m20 6-8 3-8-3 8-3Zm-8 9-8 3 8 3 8-3ZM4 6v12m8-9v12m8-15v12" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2"/></svg>
            <h1 class="text-base-content text-opacity-70 uppercase">{qty} {unit}</h1>
        </div>
        </div>
        <button on:click="{() => openProduct()}">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-5 w-5 text-opacity-80" ><path style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" d="m7.5 3 9 9-9 9"/></svg>
        </button>
</div>


<style> 
    .aman {
        @apply bg-info text-info text-xs font-bold bg-opacity-10 px-3 py-1 rounded-full ;
    }

    .bahaya {
        @apply bg-error text-error text-xs font-bold bg-opacity-10 px-3 py-1 rounded-full ;
    }

    .over {
        @apply bg-warning text-warning text-xs font-bold bg-opacity-10 px-3 py-1 rounded-full ;
    }

    .mantul {
        @apply bg-success text-success text-xs font-bold bg-opacity-10 px-3 py-1 rounded-full ;
    }

    .unknow {
        @apply bg-gray-600 text-gray-600;
    }

</style>

