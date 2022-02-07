<script>
    export let date
    export let doing
    export let itemId
    export let typeOfActivity
    export let userId
    export let value
        
    import TimeAgo from 'javascript-time-ago'
    const timeAgo = new TimeAgo('id-ID')
</script>

<div class="flex border-l-2 {typeOfActivity === "increase" ? 'border-success' : 'border-error'} pl-3 rounded">
    <div class="flex-1 flex-col">
        <div class="flex space-x-2 items-center">
            <h1 class="font-bold">{itemId.name}</h1>
            <div class="px-2 rounded-full {typeOfActivity === "increase" ? 'bg-success' : 'bg-error'} bg-opacity-30"><span class="{typeOfActivity === "increase" ? 'text-success' : 'text-error'} text-xs font-semibold">{typeOfActivity === "increase" ? "+" : "-"} {value} {itemId.unit} </span></div>
        </div>
        <p class="opacity-50 text-xs">{doing}</p>
        
    </div>
    <div class="flex-0 px-2 flex flex-col items-end">
        <span class="text-xs opacity-50">{timeAgo.format(new Date(date).valueOf() - 60 * 1000)}</span>
        <div class="text-xs "><span class="opacity-50 ">by</span> <span class="opacity-100">{userId.name}</span></div>
    </div>
</div>