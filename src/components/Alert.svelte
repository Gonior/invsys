<script>
    import {fly} from 'svelte/transition'
    export let msg;
    export let type;
    export let show;
    const typeAlert = [
        {
            name : "error",
            icon : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`
        }, 
        {
            name : 'success',
            icon : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>`
        }
    ]
</script>

{#if show}
<div transition:fly={{y : -200 , duration : 500}} class="alert {type === 'success' ? 'alert-success': 'alert-error'} absolute top-2 z-50 right-2 left-2 max-w-max mx-auto bg-base-200">
    <div class="flex-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-6 h-6 mx-2 stroke-current">    
            {@html typeAlert.find(v => v.name == type).icon}
        </svg>
        <span>{msg}</span>
    </div>
</div>
{/if}