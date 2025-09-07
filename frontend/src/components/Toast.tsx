

export type ToastItem = { id: number; type: 'success'|'error'|'info'; message: string }


export function ToastStack({ items, remove }:{ items: ToastItem[]; remove:(id:number)=>void }){
return (
<div className="fixed top-4 right-4 z-50 space-y-2">
{items.map(t => (
<div key={t.id}
className={`min-w-[220px] rounded-lg px-4 py-3 shadow text-white ${
t.type==='success'?'bg-green-600':t.type==='error'?'bg-red-600':'bg-blue-600'}`}
onAnimationEnd={()=>{
setTimeout(()=>remove(t.id), 3200)
}}
>
{t.message}
</div>
))}
</div>
)
}