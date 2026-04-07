"use client";
import { useState, useEffect } from "react";
import { Plus, X, Check, ChevronRight, Users, Layers, Building2, BarChart3, Shield, Sparkles, TrendingUp, FileText, Download, Loader2, ArrowLeft } from "lucide-react";

const init = [
  { id:1, name:"Paylogix", albert:50, ryan:50 },
  { id:2, name:"Peplogix RWE", albert:80, ryan:20 },
  { id:3, name:"DuraBlue", albert:50, ryan:50 },
  { id:4, name:"Dexcom G7", albert:null, ryan:null },
  { id:5, name:"GoldPath", albert:null, ryan:null },
  { id:6, name:"Epic", albert:null, ryan:null },
  { id:7, name:"Sri Lanka Project", albert:null, ryan:null },
];

const toRoman = (n) => { const v=[10,9,5,4,1],s=["X","IX","V","IV","I"]; let r=""; for(let i=0;i<v.length;i++) while(n>=v[i]){r+=s[i];n-=v[i];} return r; };

const DOC_TYPES = [
  { id:"mou", label:"MOU", desc:"Memorandum of Understanding", icon:"📋" },
  { id:"oa", label:"Operating Agreement", desc:"Full LLC governance", icon:"📜" },
  { id:"nda", label:"NDA / NCNDA", desc:"Non-disclosure + non-circumvention", icon:"🔒" },
];

const SYSTEM_PROMPT = `You are a legal document drafting assistant for Mammoth Holdings, LLC. Draft professional legal documents following these rules:

PARTIES: Albert Mizuno (Managing Member) and Ryan (Member) operating under Mammoth Holdings, LLC as the parent holding company.

GOVERNING LAW: California for disputes, Delaware for entity governance.

FOR MOUs: Include these sections — Purpose & Scope, Roles & Responsibilities, Equity & Economics, Decision Authority & Governance, IP, Mutual Protections (BINDING: non-circumvention 24mo, non-solicitation 24mo, confidentiality 36mo), Removal & Departure Protections (BINDING: for-cause only with defined cause, cure periods, mediation, liquidity tail 24mo, anti-sidelining), Consent Rights (BINDING), Definitive Agreement timeline (60 days), Independence of Projects, General Provisions.

FOR OPERATING AGREEMENTS: Include — Formation, Purpose, Members & Interests (cap table), Capital Contributions, Allocations & Distributions, Management & Governance, Protective Provisions (non-circumvention, anti-sidelining, for-cause removal with specific definition, cure periods), Transfer Restrictions (ROFR, tag-along, drag-along), Buy-Sell (shotgun clause for deadlocks), Confidentiality with carve-outs, Indemnification, Dissolution, General Provisions.

FOR NDAs: Include — Definition of Confidential Information (broad), Obligations, Exclusions, Non-Circumvention, Non-Solicitation, 2yr active + 2yr survival, Return/Destruction, Injunctive relief available.

KEY PRINCIPLES:
- "For Cause" must be specifically defined (felony/fraud, material breach with 30-day cure, willful sustained neglect). Disagreements and missed targets do NOT constitute cause.
- Pro-rata dilution with floor percentage, not absolute anti-dilution blocking.
- No cross-liability between ventures.
- 60-day written notice with 30-day cure minimum on everything.
- Mediation before arbitration (AAA, Orange County CA).

Format with numbered sections (SECTION 1, SECTION 2), subsections (1.1, 1.2), and lettered sub-clauses (a), (b), (c). Include signature blocks at the end.

Add "CONFIDENTIAL — DRAFT FOR REVIEW" header. Add disclaimer: "This document is a draft for discussion purposes only and should be reviewed by licensed legal counsel before execution."`;

function generatePrompt(venture, docType, parentName) {
  if (docType === "mou") {
    return `Draft a Memorandum of Understanding for the venture "${venture.name}" (to be formed as an LLC subsidiary of ${parentName}). ${venture.albert !== null ? `Ownership: Albert Mizuno ${venture.albert}%, Ryan ${venture.ryan}%.` : "Ownership percentages are to be determined."} This is a subsidiary venture. Make it thorough and professional.`;
  } else if (docType === "oa") {
    return `Draft an Operating Agreement for "${venture.name}, LLC" — a subsidiary of ${parentName}. ${venture.albert !== null ? `Membership interests: Albert Mizuno ${venture.albert}%, Ryan ${venture.ryan}%.` : "Membership interests TBD."} Include full governance, capital contributions, distributions, protective provisions, transfer restrictions, buy-sell, and dissolution. Manager-managed with Albert Mizuno as Managing Member.`;
  } else {
    return `Draft a Non-Disclosure and Non-Circumvention Agreement (NCNDA) between Albert Mizuno and Ryan regarding the venture "${venture.name}" under ${parentName}. Include broad confidential information definition, 2-year active term + 2-year survival, non-solicitation, and injunctive relief.`;
  }
}

async function callAPI(system, prompt) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ system, prompt }),
  });
  const data = await res.json();
  if (data.error) return "Error: " + data.error;
  return data.text || "Error generating document.";
}

function Card({ venture, index, onUpdate, onRemove, onGenerate }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(venture.name);
  const [pct, setPct] = useState(venture.albert ?? "");
  const hasPct = venture.albert !== null;
  const save = () => { const a=Math.min(100,Math.max(0,parseInt(pct)||0)); onUpdate({...venture,name,albert:a,ryan:100-a}); setEditing(false); };
  const cancel = () => { setName(venture.name); setPct(venture.albert??""); setEditing(false); };

  return (
    <div className="group" style={{ animation:`fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) ${index*70}ms both` }}>
      <div className="glass relative flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12]"
        style={{ padding:'20px 18px', minHeight:260, borderRadius:16 }}>
        <button onClick={() => onRemove(venture.id)}
          className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer hover:bg-red-500/10"
          style={{ color:'rgba(255,120,120,0.4)' }}>
          <X size={12} />
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="pill w-9 h-9 rounded-xl flex items-center justify-center">
            <Layers size={14} style={{ color:'#38d7ff' }} />
          </div>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:3, textTransform:'uppercase', color:'rgba(56,215,255,0.45)' }}>
            {toRoman(index+1)}
          </span>
        </div>
        {editing ? (
          <div className="flex flex-col flex-1">
            <input autoFocus value={name} onChange={(e)=>setName(e.target.value)} className="pill-input" placeholder="Name" />
            <label className="field-label">Albert %</label>
            <input type="number" min="0" max="100" value={pct} onChange={(e)=>setPct(e.target.value)}
              className="pill-input" style={{ color:'#38d7ff', fontSize:18, fontWeight:700 }} placeholder="50" />
            {pct!=="" && <p style={{ fontSize:13, marginTop:4, color:'rgba(255,213,0,0.55)', fontWeight:600 }}>Ryan: {100-Math.min(100,Math.max(0,parseInt(pct)||0))}%</p>}
            <div className="flex gap-2 mt-auto" style={{ paddingTop:10 }}>
              <button onClick={save} className="flex-1 flex items-center justify-center gap-2 cursor-pointer gradient-btn"
                style={{ padding:'9px 0', borderRadius:12, fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', border:'none', color:'white' }}>
                <Check size={12}/> Save
              </button>
              <button onClick={cancel} className="flex-1 cursor-pointer pill"
                style={{ padding:'9px 0', borderRadius:12, fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'rgba(255,255,255,0.3)' }}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div onClick={() => setEditing(true)} className="cursor-pointer">
              <h3 style={{ fontSize:18, fontWeight:700, color:'rgba(255,255,255,0.88)', lineHeight:1.25, marginBottom:2 }}>{venture.name}</h3>
              <span className="muted" style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', fontWeight:500 }}>LLC</span>
            </div>
            <div style={{ marginTop:12 }}>
              <div style={{ height:1, background:'rgba(255,255,255,0.04)', marginBottom:12 }} />
              {hasPct ? (<>
                <div style={{ display:'flex', height:6, borderRadius:4, overflow:'hidden', background:'rgba(255,255,255,0.06)', marginBottom:8 }}>
                  <div className="bar-cyan" style={{ width:`${venture.albert}%` }} />
                  <div className="bar-yellow" style={{ width:`${venture.ryan}%`, marginLeft:2 }} />
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, fontWeight:700, marginBottom:12 }}>
                  <span style={{ color:'#38d7ff' }}>Albert {venture.albert}%</span>
                  <span style={{ color:'#ffd500' }}>Ryan {venture.ryan}%</span>
                </div>
              </>) : (
                <div className="muted" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, fontSize:11, marginBottom:12 }}>
                  <ChevronRight size={11}/> Tap name to configure
                </div>
              )}
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={() => setEditing(true)}
                  className="flex-1 flex items-center justify-center gap-2 cursor-pointer transition-all pill hover:border-white/20"
                  style={{ padding:'8px 0', borderRadius:10, fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'rgba(255,255,255,0.45)' }}>
                  <TrendingUp size={11}/> Edit %
                </button>
                <button onClick={() => onGenerate(venture)}
                  className="flex-1 flex items-center justify-center gap-2 cursor-pointer transition-all hover:brightness-110"
                  style={{ padding:'8px 0', borderRadius:10, background:'rgba(56,215,255,0.06)', border:'1px solid rgba(56,215,255,0.15)', color:'rgba(56,215,255,0.7)', fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase' }}>
                  <FileText size={11}/> Docs
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DocGenerator({ venture, parentName, onClose }) {
  const [docType, setDocType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [doc, setDoc] = useState("");

  const generate = async (type) => {
    setDocType(type);
    setLoading(true);
    setDoc("");
    const prompt = generatePrompt(venture, type, parentName);
    const result = await callAPI(SYSTEM_PROMPT, prompt);
    setDoc(result);
    setLoading(false);
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.7)' }}
      onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="glass"
        style={{ width:'90%', maxWidth:800, maxHeight:'85vh', borderRadius:20, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {docType && (
              <button onClick={() => { setDocType(null); setDoc(""); }} className="cursor-pointer" style={{ color:'rgba(56,215,255,0.6)', background:'none', border:'none' }}>
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <div style={{ fontSize:18, fontWeight:700, color:'rgba(255,255,255,0.9)' }}>{venture.name}</div>
              <div className="muted" style={{ fontSize:12 }}>{docType ? DOC_TYPES.find(d=>d.id===docType)?.label : "Select document type"}</div>
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer pill" style={{ width:32, height:32, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <X size={14} />
          </button>
        </div>
        <div style={{ flex:1, overflow:'auto', padding:24 }}>
          {!docType ? (
            <div style={{ display:'grid', gap:12 }}>
              <div className="muted" style={{ fontSize:13, marginBottom:4 }}>Choose a document to generate:</div>
              {DOC_TYPES.map(dt => (
                <button key={dt.id} onClick={() => generate(dt.id)}
                  className="pill cursor-pointer transition-all hover:border-white/20"
                  style={{ padding:'18px 20px', borderRadius:14, textAlign:'left', display:'flex', alignItems:'center', gap:16 }}>
                  <div style={{ fontSize:28 }}>{dt.icon}</div>
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.85)' }}>{dt.label}</div>
                    <div className="muted" style={{ fontSize:12, marginTop:2 }}>{dt.desc}</div>
                  </div>
                  <ChevronRight size={16} className="ml-auto" style={{ color:'rgba(255,255,255,0.2)' }} />
                </button>
              ))}
              <div className="muted" style={{ fontSize:11, marginTop:8, lineHeight:1.6 }}>
                Documents are generated using AI and should be reviewed by Sharon before execution.
              </div>
            </div>
          ) : loading ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 0', gap:16 }}>
              <Loader2 size={28} style={{ color:'#38d7ff', animation:'spin 1s linear infinite' }} />
              <div style={{ fontSize:14, fontWeight:600, color:'rgba(56,215,255,0.7)' }}>Generating {DOC_TYPES.find(d=>d.id===docType)?.label}...</div>
              <div className="muted" style={{ fontSize:12 }}>This may take a moment</div>
            </div>
          ) : (
            <div>
              <div style={{ display:'flex', gap:8, marginBottom:16 }}>
                <button onClick={() => navigator.clipboard.writeText(doc)} className="pill cursor-pointer transition-all hover:border-white/20"
                  style={{ padding:'8px 16px', borderRadius:10, fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
                  <Download size={12}/> Copy to Clipboard
                </button>
                <button onClick={() => generate(docType)} className="pill cursor-pointer transition-all hover:border-white/20"
                  style={{ padding:'8px 16px', borderRadius:10, fontSize:12, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
                  <Sparkles size={12}/> Regenerate
                </button>
              </div>
              <pre style={{ fontSize:13, lineHeight:1.7, color:'rgba(255,255,255,0.75)', whiteSpace:'pre-wrap', wordBreak:'break-word', fontFamily:'Manrope, sans-serif' }}>
                {doc}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [ventures, setVentures] = useState(init);
  const [parentName, setParentName] = useState("Mammoth Holdings, LLC");
  const [editP, setEditP] = useState(false);
  const [ready, setReady] = useState(false);
  const [genVenture, setGenVenture] = useState(null);
  useEffect(() => setReady(true), []);
  const update = (u) => setVentures(v => v.map(x => x.id===u.id ? u : x));
  const remove = (id) => setVentures(v => v.filter(x => x.id !== id));
  const add = () => { setVentures([...ventures, { id: Math.max(...ventures.map(v=>v.id),0)+1, name:"New Venture", albert:null, ryan:null }]); };
  const configured = ventures.filter(v => v.albert !== null);
  const avgA = configured.length ? Math.round(configured.reduce((s,v) => s+v.albert, 0)/configured.length) : 0;
  const pctConfigured = ventures.length ? Math.round((configured.length / ventures.length) * 100) : 0;

  return (
    <div className="min-h-screen text-white" style={{ background:'radial-gradient(1200px 600px at 0% 0%, #1e6a7a 0%, #0b1016 45%, #0a0c11 100%)' }}>
      <div className={`max-w-[1400px] mx-auto px-6 py-6 transition-opacity duration-700 ${ready?'opacity-100':'opacity-0'}`}>
        {/* Nav */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, animation:'fadeUp 0.5s ease both' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <img src="/logo.png" alt="Mammoth" style={{ height:56, opacity:0.92 }} />
            <span style={{ fontSize:18, fontWeight:700, color:'rgba(255,255,255,0.85)' }}>Mammoth</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <button className="pill" style={{ padding:'8px 20px', borderRadius:20, fontSize:13, display:'flex', alignItems:'center', gap:6, cursor:'pointer', background:'linear-gradient(90deg, rgba(56,215,255,0.15), rgba(56,215,255,0.05))', border:'1px solid rgba(56,215,255,0.3)', color:'rgba(220,250,255,0.9)' }}>
              <Layers size={13}/> Structure
            </button>
            <button className="pill" style={{ padding:'8px 20px', borderRadius:20, fontSize:13, display:'flex', alignItems:'center', gap:6, cursor:'pointer', color:'rgba(255,255,255,0.5)' }}>
              <FileText size={13}/> Documents
            </button>
            <button className="pill" style={{ padding:'8px 20px', borderRadius:20, fontSize:13, display:'flex', alignItems:'center', gap:6, cursor:'pointer', color:'rgba(255,255,255,0.5)' }}>
              <Shield size={13}/> Compliance
            </button>
          </div>
          <div className="pill" style={{ width:36, height:36, borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
            <Sparkles size={14} style={{ color:'rgba(255,255,255,0.5)' }} />
          </div>
        </div>

        {/* Hero */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28, animation:'fadeUp 0.5s ease 60ms both' }}>
          <div>
            <h1 style={{ fontSize:36, fontWeight:700, color:'rgba(255,255,255,0.92)' }}>Corporate Structure</h1>
            <p className="muted" style={{ marginTop:8, fontSize:15 }}>Manage entities, ownership splits, and generate legal documents</p>
          </div>
          <button onClick={add} className="neon" style={{ padding:'12px 24px', borderRadius:20, fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:8, cursor:'pointer', background:'linear-gradient(90deg, rgba(56,215,255,0.2), rgba(56,215,255,0.05))', border:'1px solid rgba(56,215,255,0.4)', color:'rgba(220,250,255,0.9)' }}>
            <Plus size={14}/> Add Entity
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-12 gap-4" style={{ marginBottom:16, animation:'fadeUp 0.5s ease 120ms both' }}>
          <div className="col-span-5 glass" style={{ borderRadius:16, padding:24, cursor:'pointer', position:'relative', overflow:'hidden' }} onClick={() => setEditP(true)}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg, transparent, #38d7ff, transparent)' }} />
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <Building2 size={16} style={{ color:'#38d7ff' }} />
              <span className="panel-title" style={{ fontSize:16, fontWeight:600 }}>Parent Holding Company</span>
            </div>
            {editP ? (
              <input autoFocus value={parentName} onChange={(e)=>setParentName(e.target.value)} onBlur={()=>setEditP(false)} onKeyDown={(e)=>e.key==="Enter"&&setEditP(false)}
                className="pill-input" style={{ fontSize:22, fontWeight:700, marginBottom:0, background:'transparent', border:'none', borderBottom:'1px solid rgba(56,215,255,0.3)', borderRadius:0, padding:'4px 0' }} />
            ) : <div style={{ fontSize:24, fontWeight:700, color:'rgba(255,255,255,0.92)' }}>{parentName}</div>}
            <div style={{ display:'flex', alignItems:'center', gap:20, marginTop:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#38d7ff', boxShadow:'0 0 8px rgba(56,215,255,0.4)' }} />
                <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.7)' }}>Albert Mizuno</span>
                <span className="muted" style={{ fontSize:11 }}>Managing Member</span>
              </div>
              <div style={{ width:1, height:16, background:'rgba(255,255,255,0.08)' }} />
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#ffd500', boxShadow:'0 0 8px rgba(255,213,0,0.3)' }} />
                <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.7)' }}>Ryan</span>
                <span className="muted" style={{ fontSize:11 }}>Member</span>
              </div>
            </div>
          </div>
          <div className="col-span-2 glass" style={{ borderRadius:16, padding:20, textAlign:'center', display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <div style={{ fontSize:36, fontWeight:700 }}>{ventures.length}</div>
            <div className="pill" style={{ display:'inline-flex', margin:'8px auto 0', padding:'4px 14px', borderRadius:20, fontSize:11, fontWeight:600 }}>Entities</div>
          </div>
          <div className="col-span-2 glass" style={{ borderRadius:16, padding:20, textAlign:'center', display:'flex', flexDirection:'column', justifyContent:'center' }}>
            <div style={{ fontSize:36, fontWeight:700, color:'#38d7ff' }}>{configured.length}</div>
            <div className="pill" style={{ display:'inline-flex', margin:'8px auto 0', padding:'4px 14px', borderRadius:20, fontSize:11, fontWeight:600 }}>Configured</div>
          </div>
          <div className="col-span-3 glass" style={{ borderRadius:16, padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <BarChart3 size={15} style={{ color:'#38d7ff' }} />
                <span className="panel-title" style={{ fontSize:14, fontWeight:600 }}>Completion</span>
              </div>
              <div style={{ fontSize:24, fontWeight:700 }}>{pctConfigured}<span style={{ fontSize:12 }}>%</span></div>
            </div>
            <div style={{ marginTop:14, height:8, borderRadius:8, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
              <div className="bar-blue" style={{ height:'100%', width:`${pctConfigured}%`, borderRadius:8 }} />
            </div>
            <div className="muted" style={{ fontSize:11, marginTop:10 }}>{ventures.length - configured.length} pending configuration</div>
          </div>
        </div>

        {/* Connector */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', margin:'0 0 4px', animation:'fadeUp 0.4s ease 160ms both' }}>
          <div style={{ width:1, height:16, background:'linear-gradient(180deg, rgba(56,215,255,0.2), rgba(56,215,255,0.05))' }} />
          <div className="pill" style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 16px', borderRadius:16 }}>
            <Users size={11} style={{ color:'rgba(56,215,255,0.5)' }} />
            <span style={{ fontSize:10, letterSpacing:2, textTransform:'uppercase', fontWeight:700, color:'rgba(255,255,255,0.25)' }}>Subsidiaries</span>
          </div>
          <div style={{ width:1, height:10, background:'linear-gradient(180deg, rgba(56,215,255,0.05), transparent)' }} />
        </div>
        <div style={{ maxWidth:1100, margin:'0 auto 4px', height:1, background:'linear-gradient(90deg, transparent, rgba(56,215,255,0.12), transparent)' }} />

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" style={{ maxWidth:1100, margin:'0 auto' }}>
          {ventures.map((v, i) => <Card key={v.id} venture={v} index={i} onUpdate={update} onRemove={remove} onGenerate={setGenVenture} />)}
          <div style={{ animation:`fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) ${ventures.length*70+70}ms both` }}>
            <button onClick={add} className="w-full flex flex-col items-center justify-center gap-4 cursor-pointer group transition-all duration-300"
              style={{ minHeight:260, borderRadius:16, border:'1px dashed rgba(255,255,255,0.08)', background:'transparent' }}>
              <div className="transition-transform group-hover:scale-110" style={{ width:46, height:46, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
                <Plus size={18} style={{ color:'rgba(255,255,255,0.12)' }} />
              </div>
              <span style={{ fontSize:10, letterSpacing:3, textTransform:'uppercase', fontWeight:700, color:'rgba(255,255,255,0.1)' }}>Add Venture</span>
            </button>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-12 gap-4" style={{ maxWidth:1100, margin:'24px auto 0', animation:'fadeUp 0.5s ease 500ms both' }}>
          <div className="col-span-4 glass" style={{ borderRadius:16, padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}><TrendingUp size={15} style={{ color:'#38d7ff' }} /><span className="panel-title" style={{ fontSize:14, fontWeight:600 }}>Avg. Albert</span></div>
              <div style={{ fontSize:24, fontWeight:700 }}>{avgA}<span style={{ fontSize:12 }}>%</span></div>
            </div>
            <div style={{ marginTop:12, height:8, borderRadius:8, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
              <div className="bar-cyan" style={{ height:'100%', width:`${avgA}%`, borderRadius:8 }} />
            </div>
          </div>
          <div className="col-span-4 glass" style={{ borderRadius:16, padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}><Shield size={15} style={{ color:'#ffd500' }} /><span className="panel-title" style={{ fontSize:14, fontWeight:600 }}>Avg. Ryan</span></div>
              <div style={{ fontSize:24, fontWeight:700 }}>{configured.length ? 100-avgA : 0}<span style={{ fontSize:12 }}>%</span></div>
            </div>
            <div style={{ marginTop:12, height:8, borderRadius:8, background:'rgba(255,255,255,0.06)', overflow:'hidden' }}>
              <div className="bar-yellow" style={{ height:'100%', width:`${configured.length ? 100-avgA : 0}%`, borderRadius:8 }} />
            </div>
          </div>
          <div className="col-span-4 glass" style={{ borderRadius:16, padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}><Sparkles size={15} style={{ color:'#38d7ff' }} /><span className="panel-title" style={{ fontSize:14, fontWeight:600 }}>Next Steps</span></div>
            <div className="pill" style={{ padding:10, borderRadius:10, marginBottom:6, borderLeft:'3px solid #38d7ff' }}>
              <div style={{ fontWeight:600, fontSize:12 }}>Generate docs for each entity</div>
              <div className="muted" style={{ fontSize:10, marginTop:2 }}>Click "Docs" on any card</div>
            </div>
            <div className="pill" style={{ padding:10, borderRadius:10, borderLeft:'3px solid #ffd500' }}>
              <div style={{ fontWeight:600, fontSize:12 }}>Review with Sharon</div>
              <div className="muted" style={{ fontSize:10, marginTop:2 }}>Submit drafts to attorney</div>
            </div>
          </div>
        </div>

        <p style={{ textAlign:'center', marginTop:28, fontSize:11, color:'rgba(255,255,255,0.06)', maxWidth:500, margin:'28px auto 0', lineHeight:1.7 }}>
          Draft structure for internal review only. Documents generated by AI require review by licensed legal counsel.
        </p>
      </div>

      {genVenture && <DocGenerator venture={genVenture} parentName={parentName} onClose={() => setGenVenture(null)} />}
    </div>
  );
}
