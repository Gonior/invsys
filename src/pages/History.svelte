<script>
    import { onMount } from 'svelte';
    import CardActivity from '../components/CardActivity.svelte'
    import EmptyState from '../components/EmptyState.svelte'
    import LoadingState from '../components/LoadingState.svelte'
    import {BASE_URL} from '../store.js'
    let isLoading = true
    let activities =[]
    onMount(async () => {
        await getActivities()
        isLoading = false
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

        let url = $BASE_URL+`/activity/`
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
</script>

<div class="overflow-hidden" style="height:85vh;">
    <div class="h-full flex no-scrollbar overflow-y-auto flex-col px-4 py-2 space-y-2 relative">
    {#if isLoading}
        <LoadingState />
    {:else}
        {#each activities as act }
            <CardActivity {...act} />
            {:else}
            <EmptyState msg="Belum Ada Aktifitas"/>
        {/each}
    {/if}
    </div>  
</div>


