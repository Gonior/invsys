<script>
    export let title
    export let icon
    export let qty
    export let color
</script>

<div class="py-2 px-4 shadow w-full rounded-lg flex bg-base-200 flex-col">
    <div class="flex items-center justify-between w-full">
        <h1 class="text-2xl font-bold">{qty}</h1>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-7 h-7 {color == 'warning' ? 'text-warning' : color == "error" ? 'text-error' : 'text-info'}">
            {@html icon}
        </svg>
    </div>
    <h2 class="opacity-50 text-xs">{title}</h2>
</div>