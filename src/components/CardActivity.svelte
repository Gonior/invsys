<script>
    export let name
    export let time
    export let reason
    export let user
    export let qty
    export let unit
    export let increase = true
</script>

<div class="flex border-l-2 {increase ? 'border-success' : 'border-error'} pl-3 rounded">
    <div class="flex-1 flex-col">
        <div class="flex space-x-2 items-center">
            <h1 class="font-bold">{name}</h1>
            <div class="px-2 rounded-full {increase ? 'bg-success' : 'bg-error'} bg-opacity-30"><span class="{increase ? 'text-success' : 'text-error'} text-xs font-semibold">{increase ? "+" : "-"} {qty} {unit} </span></div>
        </div>
        <p class="opacity-50 text-xs">{reason}</p>
        
    </div>
    <div class="flex-0 px-2 flex flex-col items-end">
        <span class="text-xs opacity-50">{time}</span>
        <div class="text-xs "><span class="opacity-50 ">by</span> <span class="opacity-100">{user}</span></div>
    </div>
</div>