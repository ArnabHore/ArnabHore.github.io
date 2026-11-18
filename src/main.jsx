import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import Markdown from 'react-markdown';
import {Layers3,LayoutDashboard,Bookmark,CodeXml,GitFork,PanelsTopLeft,Smartphone,Boxes,Braces,Network,ArrowRight,ArrowUpRight,BookOpen,Check,ChevronRight,Menu,X,Compass,ChartNoAxesColumnIncreasing,Search} from 'lucide-react';
import bank from './bank.json';
import './style.css';
import { priorities, priorityFor } from './priority.js';

const icons=[CodeXml,GitFork,PanelsTopLeft,Smartphone,Boxes,Braces,Network];
const short=['Advanced Swift','Concurrency','SwiftUI','UIKit','Architecture','Coding & Algorithms','System Design'];
const descriptions=['Explore value semantics, generics, memory management, and the Swift runtime.','Work through actors, structured concurrency, and thread safety.','Study view identity, state management, layout, and rendering.','Understand the view lifecycle, Core Animation, and platform performance.','Reason about modularity, design decisions, and technical leadership.','Practice algorithms, data structures, and implementation in Swift.','Design mobile systems for scale, reliability, and offline use.'];
const num=n=>String(n).padStart(2,'0');
function useSaved(key,initial){
 const [value,setValue]=useState(()=>{try{return JSON.parse(localStorage.getItem(key))??initial}catch{return initial}});
 function update(next){setValue(next);try{localStorage.setItem(key,JSON.stringify(next))}catch{}}
 return [value,update];
}
function QuestionNumber({id, reviewed}) {
 const priority = priorityFor(id);
 const status = priority ? priority.code + ' · ' + priority.label : 'Unassigned';
 return <span className="number-group" aria-label={`Question ${id}, ${status}${reviewed ? ', reviewed' : ''}`} title={status}>
   <span className="qid" data-priority={priority?.code}>{num(id)}</span>
   <small>{priority?.code ?? '—'}{reviewed && <Check size={12} aria-label="Reviewed"/>}</small>
 </span>;
}
function Artwork(){return <div className="art" aria-hidden="true"><div className="orbit o1"/><div className="orbit o2"/><div className="chip base"/><div className="chip middle"/><div className="chip top"><CodeXml size={68} strokeWidth={1.45}/></div><i className="point p1"/><i className="point p2"/><i className="point p3"/></div>}
function App(){
 const [route,setRoute]=useState(location.hash.slice(1)||'dashboard'),[mobile,setMobile]=useState(false),[query,search]=useState(''),[open,reveal]=useState(null);
 const [done,setDone]=useSaved('atlas.reviewed',[]),[saved,setSaved]=useSaved('atlas.bookmarks',[]),[last,setLast]=useSaved('atlas.last',0);
 React.useEffect(()=>{const fn=()=>{setRoute(location.hash.slice(1)||'dashboard');search('');reveal(null);setMobile(false);window.scrollTo(0,0)};window.addEventListener('hashchange',fn);return()=>window.removeEventListener('hashchange',fn)},[]);
 const section=bank.findIndex((_,i)=>route==='module-'+(i+1)),bookmarks=route==='bookmarks',home=section<0&&!bookmarks;
 function visit(i){setLast(i);location.hash='module-'+(i+1)}
 function toggle(list,fn,id){fn(list.includes(id)?list.filter(x=>x!==id):[...list,id])}
 const pct=Math.round(done.length/150*100),active=bank[last]?last:0,count=i=>bank[i].questions.filter(q=>done.includes(q.id)).length;
 const title=home?'Study dashboard':bookmarks?'Bookmarks':short[section];
 const qs=home?[]:(bookmarks?bank.flatMap(s=>s.questions).filter(q=>saved.includes(q.id)):bank[section].questions).filter(q=>q.title.toLowerCase().includes(query.toLowerCase()));
 return <div className="app">{mobile&&<button aria-label="Close menu" className="scrim" onClick={()=>setMobile(false)}/>}<aside className={mobile?'shown':''}><a className="brand" href="#dashboard"><span><Layers3/></span>Swift Atlas</a><div className="navlabel">WORKSPACE</div><nav><a href="#dashboard" className={home?'sel':''}><LayoutDashboard/>Study dashboard</a><a href="#bookmarks" className={bookmarks?'sel':''}><Bookmark/>Bookmarks{saved.length>0&&<small>{saved.length}</small>}</a></nav><div className="navlabel">STUDY MODULES</div><nav>{bank.map((s,i)=>{let Icon=icons[i];return <button key={s.name} className={section===i?'sel':''} onClick={()=>visit(i)}><Icon/>{short[i]}</button>})}</nav><div className="sidebottom"><span><ChartNoAxesColumnIncreasing size={15}/>Overall progress <b>{pct}%</b></span><progress max="150" value={done.length}/><small>{done.length} of 150 questions reviewed</small></div></aside>
 <main><header><button className="menubtn" aria-label="Open menu" onClick={()=>setMobile(true)}><Menu/></button><span>Workspace</span><ChevronRight size={14}/><strong>{title}</strong></header><div className="content">
 {home?<><div className="eyebrow"><b/> STUDY WORKSPACE</div><h1>Study dashboard</h1><p className="intro">Your personal workspace for iOS interview preparation.</p>
 <section className="hero"><div className="herotext"><div className="eyebrow"><Compass size={14}/> INTERVIEW FIELD GUIDE</div><h2>iOS Interview Atlas</h2><p>150 questions across seven core iOS disciplines.</p><button onClick={()=>visit(active)}>{last||done.length?'Continue studying':'Start studying'}<ArrowRight size={16}/></button></div><Artwork/></section>
 <div className="sectionhead"><div><div className="eyebrow"><b/> CURRICULUM</div><h2>Preparation tracker</h2></div><span className="modulecount"><Layers3 size={15}/>{bank.length} modules</span></div>
 <div className="cards">{bank.map((s,i)=>{const Icon=icons[i],n=count(i);return <button key={s.name} className={'card tone'+i} onClick={()=>visit(i)}><div className="cardtop"><span className="tile"><Icon/></span><span className="index">MODULE {num(i+1)}</span><ArrowUpRight className="up" size={16}/></div><h3>{s.name}</h3><p>{descriptions[i]}</p><div className="foot"><BookOpen size={14}/>{s.questions.length} questions<span>{Math.round(n/s.questions.length*100)}%</span></div><progress value={n} max={s.questions.length}/></button>})}</div></>:
 <><div className="eyebrow"><b/>{bookmarks?'STUDY WORKSPACE':'MODULE '+num(section+1)}</div><h1>{bookmarks?'Bookmarks':bank[section].name}</h1><p className="intro">{bookmarks?'Revisit questions you saved for another practice session.':descriptions[section]}</p>{!bookmarks&&<div className="reviewbar"><span>{count(section)} of {bank[section].questions.length} reviewed</span><progress max={bank[section].questions.length} value={count(section)}/><button onClick={()=>{const ids=bank[section].questions.map(q=>q.id);setDone(count(section)===ids.length?done.filter(id=>!ids.includes(id)):[...new Set([...done,...ids])])}}>{count(section)===bank[section].questions.length?'Clear section progress':'Mark section reviewed'}</button></div>}
 <label className="filter"><Search size={17}/><input aria-label="Filter questions" placeholder="Find a question…" value={query} onChange={e=>search(e.target.value)}/></label>
 <div className="priority-legend" aria-label="Question priorities">
 {priorities.map(({code,label})=><span key={code}><b data-priority={code}>{code}</b>{label}</span>)}
 {qs.some(q=>!priorityFor(q.id)) && <span><b>—</b>Unassigned</span>}
 </div>
 <div className="questions">{qs.map(q=><article key={q.id}><div className="question"><button className="questiontitle" aria-expanded={open===q.id} onClick={()=>reveal(open===q.id?null:q.id)}><QuestionNumber id={q.id} reviewed={done.includes(q.id)}/>{q.title}<ChevronRight size={17} className={open===q.id?'turned':''}/></button><button className="save" aria-label={'Bookmark question '+q.id} aria-pressed={saved.includes(q.id)} onClick={()=>toggle(saved,setSaved,q.id)}><Bookmark size={17} fill={saved.includes(q.id)?'currentColor':'none'}/></button></div>{open===q.id&&<div className="answer"><div className="eyebrow">ANSWER</div><Markdown>{q.answer}</Markdown><button onClick={()=>toggle(done,setDone,q.id)}><Check size={15}/>{done.includes(q.id)?'Reviewed · Undo':'Mark reviewed'}</button></div>}</article>)}{!qs.length&&<p>{query?'No matching questions.':'Use the bookmark icon beside a question to save it here.'}</p>}</div></>}</div></main></div>
}
createRoot(document.getElementById('root')).render(<App/>);
