import { useState, useEffect, useCallback } from "react";
import { Plus, X, Check, ChevronRight, Users, Layers, Building2, BarChart3, Shield, Sparkles, TrendingUp, FileText, Download, Loader2, ArrowLeft } from "lucide-react";

const LOGO = "data:image/jpeg;base64,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";

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

function generateDoc(venture, docType, parentName) {
  const hasPct = venture.albert !== null;
  const prompt = docType === "mou"
    ? `Draft a Memorandum of Understanding for the venture "${venture.name}" (to be formed as an LLC subsidiary of ${parentName}). ${hasPct ? `Ownership: Albert Mizuno ${venture.albert}%, Ryan ${venture.ryan}%.` : "Ownership percentages are to be determined."} This is a subsidiary venture. Make it thorough and professional.`
    : docType === "oa"
    ? `Draft an Operating Agreement for "${venture.name}, LLC" — a subsidiary of ${parentName}. ${hasPct ? `Membership interests: Albert Mizuno ${venture.albert}%, Ryan ${venture.ryan}%.` : "Membership interests TBD."} Include full governance, capital contributions, distributions, protective provisions, transfer restrictions, buy-sell, and dissolution. Manager-managed with Albert Mizuno as Managing Member.`
    : `Draft a Non-Disclosure and Non-Circumvention Agreement (NCNDA) between Albert Mizuno and Ryan regarding the venture "${venture.name}" under ${parentName}. Include broad confidential information definition, 2-year active term + 2-year survival, non-solicitation, and injunctive relief.`;
  return { system: SYSTEM_PROMPT, prompt };
}

async function callAPI(system, prompt, onChunk) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    const text = data.content?.map(b => b.type === "text" ? b.text : "").join("\n") || "Error generating document.";
    return text;
  } catch (e) {
    return "Error: Could not connect to API. " + e.message;
  }
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
              {/* Action buttons */}
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
    const { system, prompt } = generateDoc(venture, type, parentName);
    const result = await callAPI(system, prompt);
    setDoc(result);
    setLoading(false);
  };

  const copyDoc = () => { navigator.clipboard.writeText(doc); };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.7)' }}
      onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="glass"
        style={{ width:'90%', maxWidth:800, maxHeight:'85vh', borderRadius:20, overflow:'hidden', display:'flex', flexDirection:'column' }}>

        {/* Header */}
        <div style={{ padding:'20px 24px', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {docType && (
              <button onClick={() => { setDocType(null); setDoc(""); }} className="cursor-pointer" style={{ color:'rgba(56,215,255,0.6)', background:'none', border:'none' }}>
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <div style={{ fontSize:18, fontWeight:700, color:'rgba(255,255,255,0.9)' }}>{venture.name}</div>
              <div className="muted" style={{ fontSize:12 }}>
                {docType ? DOC_TYPES.find(d=>d.id===docType)?.label : "Select document type"}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="cursor-pointer pill" style={{ width:32, height:32, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex:1, overflow:'auto', padding:24 }}>
          {!docType ? (
            <div style={{ display:'grid', gap:12 }}>
              <div className="muted" style={{ fontSize:13, marginBottom:4 }}>Choose a document to generate for this venture:</div>
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
                All documents include standard protective clauses, California/Delaware governance, and cure periods.
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
                <button onClick={copyDoc} className="pill cursor-pointer transition-all hover:border-white/20"
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

export default function App() {
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        * { font-family:'Manrope',system-ui,sans-serif; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .glass { background:linear-gradient(180deg,rgba(30,38,45,0.85),rgba(22,27,33,0.85)); border:1px solid rgba(255,255,255,0.08); box-shadow:0 10px 30px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.05); }
        .pill { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); }
        .neon { box-shadow:0 0 18px rgba(45,220,255,0.35); }
        .gradient-btn { background:linear-gradient(180deg,#36e3ff 0%,#1aa5ff 60%,#0f6bff 100%); }
        .gradient-btn:hover { filter:brightness(1.12); }
        .muted { color:rgba(255,255,255,0.5); }
        .panel-title { color:rgba(255,255,255,0.85); }
        .bar-cyan { background:linear-gradient(90deg,#2ee6ff,#4aa0ff); border-radius:4px; transition:width 0.7s ease; box-shadow:0 0 10px rgba(46,230,255,0.25); }
        .bar-yellow { background:linear-gradient(90deg,#ffd500,#f0c400); border-radius:4px; transition:width 0.7s ease; box-shadow:0 0 8px rgba(255,213,0,0.15); }
        .bar-blue { background:linear-gradient(90deg,#38d7ff,#1aa5ff); }
        .pill-input { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:10px 14px; color:rgba(255,255,255,0.9); font-size:15px; font-weight:600; outline:none; margin-bottom:10px; width:100%; }
        .pill-input:focus { border-color:rgba(56,215,255,0.3); box-shadow:0 0 0 2px rgba(56,215,255,0.08); }
        .field-label { font-size:10px; letter-spacing:2px; text-transform:uppercase; color:rgba(255,255,255,0.2); margin-bottom:4px; font-weight:700; }
        input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button{-webkit-appearance:none}
        input[type="number"]{-moz-appearance:textfield}
        ::selection{background:rgba(56,215,255,0.2)}
      `}</style>

      <div className={`max-w-[1400px] mx-auto px-6 py-6 transition-opacity duration-700 ${ready?'opacity-100':'opacity-0'}`}>
        {/* Nav */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, animation:'fadeUp 0.5s ease both' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <img src={LOGO} alt="Mammoth" style={{ height:56, opacity:0.92 }} />
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
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={add} className="neon" style={{ padding:'12px 24px', borderRadius:20, fontSize:13, fontWeight:600, display:'flex', alignItems:'center', gap:8, cursor:'pointer', background:'linear-gradient(90deg, rgba(56,215,255,0.2), rgba(56,215,255,0.05))', border:'1px solid rgba(56,215,255,0.4)', color:'rgba(220,250,255,0.9)' }}>
              <Plus size={14}/> Add Entity
            </button>
          </div>
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

        {/* Bottom */}
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
              <div className="muted" style={{ fontSize:10, marginTop:2 }}>Click "Generate Docs" on any card</div>
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

      {/* Doc Generator Modal */}
      {genVenture && <DocGenerator venture={genVenture} parentName={parentName} onClose={() => setGenVenture(null)} />}
    </div>
  );
}
