"use client";

import {createContext, useContext, useEffect, useState} from "react";

type Locale = "en" | "ur";
type Copy={language:string;loading:string;retry:string;back:string;services:string;professional:string;time:string;confirm:string;select:string;empty:string;queue:string};
const copy:Record<Locale,Copy> = {
  en: {language:"اردو", loading:"Loading…", retry:"Try again", back:"Back", services:"Services", professional:"Professional", time:"Time", confirm:"Confirm booking", select:"Select a time", empty:"Nothing to show yet", queue:"Today’s queue"},
  ur: {language:"English", loading:"لوڈ ہو رہا ہے…", retry:"دوبارہ کوشش کریں", back:"واپس", services:"سروسز", professional:"ماہر", time:"وقت", confirm:"بکنگ کی تصدیق کریں", select:"وقت منتخب کریں", empty:"ابھی دکھانے کے لیے کچھ نہیں", queue:"آج کی قطار"}
} as const;
const LocaleContext=createContext<{locale:Locale; t:Copy; setLocale:(locale:Locale)=>void}>({locale:"en",t:copy.en,setLocale:()=>undefined});
export function LocaleProvider({children}:{children:React.ReactNode}) { const [locale,setLocaleState]=useState<Locale>("en"); useEffect(()=>{const saved=localStorage.getItem("queuecut-locale") as Locale|null; if(saved)setLocaleState(saved)},[]); useEffect(()=>{document.documentElement.lang=locale;document.documentElement.dir=locale==="ur"?"rtl":"ltr"},[locale]); const setLocale=(value:Locale)=>{localStorage.setItem("queuecut-locale",value);setLocaleState(value)}; return <LocaleContext.Provider value={{locale,t:copy[locale],setLocale}}>{children}</LocaleContext.Provider> }
export function useI18n(){return useContext(LocaleContext)}
export function LanguageSwitcher(){const {locale,t,setLocale}=useI18n();return <button className="button ghost language" type="button" onClick={()=>setLocale(locale==="en"?"ur":"en")}>{t.language}</button>}
export function AppShell({children,title}:{children:React.ReactNode;title?:string}){return <><a className="skip" href="#main">Skip to content</a><header className="app-header"><a href="/" className="brand">QueueCut</a>{title&&<span className="page-title">{title}</span>}<LanguageSwitcher/></header>{children}</>}
export function EmptyState({children,action}:{children:React.ReactNode;action?:React.ReactNode}){return <section className="card empty" role="status"><p>{children}</p>{action}</section>}
export function LoadingCard(){const {t}=useI18n();return <section className="card skeleton" aria-busy="true"><span className="sr-only">{t.loading}</span><i/><i/><i/></section>}
