function formatClock(time:string){
  const [hourText,minute="00"]=time.split(":");
  const hour=Number(hourText);
  if(!Number.isInteger(hour)||hour<0||hour>23)return time;
  const displayHour=hour%12||12;
  return `${displayHour}${minute==="00"?"":`:${minute}`} ${hour<12?"AM":"PM"}`;
}

export function formatTimeRange(range:string){
  const [start,end]=range.split("-");
  return start&&end?`${formatClock(start)} – ${formatClock(end)}`:range;
}
