type Listener=(shopId:string)=>void;const listeners=new Set<Listener>();
export const queueEvents={publish(shopId:string){for(const listener of listeners)listener(shopId)},subscribe(listener:Listener){listeners.add(listener);return()=>listeners.delete(listener)}};
