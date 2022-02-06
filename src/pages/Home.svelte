<script>

    import Card from '../components/Card.svelte'
    import CardActivity from '../components/CardActivity.svelte';
    import EmptyState from '../components/EmptyState.svelte'
    import CardLoading from '../components/CardLoading.svelte'
    import {onMount} from 'svelte'
    let isLoading = true
    const contentCard = [
        {
            id : 0,
            title : "Jumlah Barang",
            qty : 234,
            color : "secondary",
            icon : `<path style="fill:none;stroke:currentcolor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" d="M20 16.5v-9L12 3 4 7.5v9l8 4.5 8-4.5z"/>
                <path data-name="primary" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" d="m20 7.5-8 4-8-4M12 11.5V21"/>
                <path data-name="primary" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" d="M16 14V9.5l-4-2"/>`
        },
        {
            id : 1,
            title : "Low Stock",
            qty : 32,
            color : "warning",
            icon : `<path style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" d="m3 5 5 6 6-3 7 7"/>
                    <path data-name="primary" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" d="M21 10v5h-5M3 19h18"/>`
        },{
            id :2,
            title : "Stok Habis",
            qty : 0,
            color : "error",
            icon : `<path style="fill:none;stroke:currentcolor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" d="M20 16.5v-9L12 3 4 7.5v9l8 4.5 8-4.5z"/>
                <path data-name="primary" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" d="m20 7.5-8 4-8-4M12 11.5V21"/>
                <path data-name="primary" style="fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:2" d="M16 14V9.5l-4-2"/>`
        }
    ]
    onMount(() => {
        setTimeout(() => {
            isLoading = false
        }, 3000);
    })
    const activities = [
        {
            name : "Ayam Boiler",
            user : "Dedi C.",
            reason : "lorem ipsum sir dolor amet consectetur adipisicing elit.",
            qty : 24,
            increase : true,
            unit : "KG",
            time : "04 Feb 2022 20:13"
        },
        {
            name : "Usus",
            user : "Dedi C.",
            reason : "lorem ipsum sir dolor amet consectetur adipisicing elit.",
            qty : 46,
            increase : true,
            unit : "KG",
            time : "03 Feb 2022 14:13"
        },
        {
            name : "Ayam Boiler",
            user : "Dedi C.",
            reason : "lorem ipsum sir dolor amet consectetur adipisicing elit.",
            qty : 5,
            increase : false,
            unit : "KG",
            time : "04 Feb 2022 20:13"
        },
        {
            name : "Sop Iga",
            user : "Dedi C.",
            reason : "lorem ipsum sir dolor amet consectetur adipisicing elit.",
            qty : 76,
            increase : true,
            unit : "KG",
            time : "04 Feb 2022 15:13"
        },
        {
            name : "Sop Iga",
            user : "Dedi C.",
            reason : "lorem ipsum sir dolor amet consectetur adipisicing elit.",
            qty : 12,
            increase : false,
            unit : "KG",
            time : "04 Feb 2022 20:13"
        }

    ]
</script>

<div class="flex flex-col px-3 h-full">
    <div class="flex space-x-2 mt-2">
        {#if isLoading}
            <CardLoading/>
            <CardLoading/>
            <CardLoading/>
        {:else}
            {#each contentCard as cc} 
                <Card {...cc} />
            {/each}
        {/if}
    </div>

    <div class="flex mt-4  flex-col">
        <h1 class="uppercase opacity-50 text-xs">aktifitas sebelumnya</h1>
        <div class="flex flex-col space-y-6 mt-2">
            {#if isLoading}
                <div class="flex pl-3 rounded space-x-3">
                    <div class="flex-1 flex-col space-y-2">
                        <div class="flex space-x-2 items-center">
                            <div class="animate-pulse h-4 w-24 bg-gray-400 rounded"></div>
                            <div class="animate-pulse h-4 w-20 bg-gray-400 rounded-full"></div>
                        </div>
                        <div class="animate-pulse h-4 w-3/4 rounded-full bg-gray-400"></div>
                    </div>
                </div>
            {:else}
            {#each activities as act }
                <CardActivity {...act} />
                {:else}
                <EmptyState msg="Belum Ada Aktifitas"/>
            {/each}
            {/if}
        </div>
    </div>
</div>

