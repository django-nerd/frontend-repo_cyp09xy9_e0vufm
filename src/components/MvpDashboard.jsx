import { useEffect, useMemo, useState } from 'react'
import Section from './Section'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function MvpDashboard(){
  const [tab, setTab] = useState('personas')
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <Section title="MVP Control Center" description="Manage personas, accounts, templates, and run personalization & simulations.">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              {k:'personas', l:'Personas'},
              {k:'accounts', l:'Accounts & Contacts'},
              {k:'templates', l:'Templates'},
              {k:'sequences', l:'Sequences'},
              {k:'console', l:'Personalize & Simulate'},
              {k:'audit', l:'Audit'},
            ].map(t => (
              <button key={t.k} onClick={()=>setTab(t.k)} className={`px-3 py-2 rounded-md text-sm border ${tab===t.k? 'bg-blue-600 border-blue-500':'bg-slate-800/60 border-slate-700 hover:bg-slate-700/60'}`}>{t.l}</button>
            ))}
          </div>
        </Section>

        {tab==='personas' && <Personas />}
        {tab==='accounts' && <Accounts />}
        {tab==='templates' && <Templates />}
        {tab==='sequences' && <Sequences />}
        {tab==='console' && <Console />}
        {tab==='audit' && <Audit />}
      </div>
    </div>
  )
}

function Personas(){
  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    key:'CTO', role:'Chief Technology Officer', technical_proficiency:'Very High',
    responsibilities:[], pain_points:[], buying_triggers:[], objections:[], preferred_channels:['email','linkedin'], sample_quotes:[]
  })

  const load = async ()=>{
    const r = await fetch(`${API}/personas`)
    setItems(await r.json())
  }
  useEffect(()=>{load()},[])

  const save = async ()=>{
    await fetch(`${API}/personas`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)})
    setForm({...form, key:'', role:''})
    load()
  }

  return (
    <Section title="Personas" description="Central library that powers personalization logic across channels.">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <input className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Key (e.g., CTO)" value={form.key} onChange={e=>setForm({...form, key:e.target.value})} />
          <input className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Role" value={form.role} onChange={e=>setForm({...form, role:e.target.value})} />
          <input className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Preferred channels (comma separated)" value={form.preferred_channels?.join(',')||''} onChange={e=>setForm({...form, preferred_channels:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />
          <button onClick={save} className="px-3 py-2 bg-blue-600 rounded">Save Persona</button>
        </div>
        <div className="space-y-3">
          {items.map(it=> (
            <div key={it._id} className="p-3 bg-slate-800/80 rounded border border-slate-700">
              <div className="text-sm text-slate-300">{it.key} • {it.role}</div>
              <div className="text-xs text-slate-400">Channels: {it.preferred_channels?.join(', ')}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Accounts(){
  const [accounts, setAccounts] = useState([])
  const [contacts, setContacts] = useState([])
  const [selected, setSelected] = useState(null)
  const [accountForm, setAccountForm] = useState({name:'', domain:'', industry:'Managed IT', employee_count:120, timezone:'America/New_York', tech_stack:['Azure','Fortinet'], compliance_tags:['SOC2']})
  const [contactForm, setContactForm] = useState({account_id:'', first_name:'', last_name:'', title:'', email:'', linkedin_url:''})

  const load = async ()=>{
    const a = await (await fetch(`${API}/accounts`)).json()
    setAccounts(a)
    if(a[0]) setSelected(a[0])
    if(a[0]){
      const c = await (await fetch(`${API}/contacts?account_id=${a[0]._id}`)).json()
      setContacts(c)
      setContactForm({...contactForm, account_id:a[0]._id})
    }
  }
  useEffect(()=>{load()},[])

  const createAccount = async ()=>{
    await fetch(`${API}/accounts`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(accountForm)})
    setAccountForm({name:'', domain:'', industry:'', employee_count:undefined, timezone:'', tech_stack:[], compliance_tags:[]})
    load()
  }

  const createContact = async ()=>{
    await fetch(`${API}/contacts`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(contactForm)})
    setContactForm({...contactForm, first_name:'', last_name:'', title:'', email:'', linkedin_url:''})
    if(selected){
      const c = await (await fetch(`${API}/contacts?account_id=${selected._id}`)).json()
      setContacts(c)
    }
  }

  return (
    <Section title="Accounts & Contacts" description="ABM map: create accounts and key stakeholders to target.">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-slate-200 font-medium">New Account</h3>
          <input className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Company name" value={accountForm.name} onChange={e=>setAccountForm({...accountForm, name:e.target.value})} />
          <input className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Domain" value={accountForm.domain||''} onChange={e=>setAccountForm({...accountForm, domain:e.target.value})} />
          <input className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Industry" value={accountForm.industry||''} onChange={e=>setAccountForm({...accountForm, industry:e.target.value})} />
          <input type="number" className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Employee count" value={accountForm.employee_count||''} onChange={e=>setAccountForm({...accountForm, employee_count:Number(e.target.value)})} />
          <input className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Timezone" value={accountForm.timezone||''} onChange={e=>setAccountForm({...accountForm, timezone:e.target.value})} />
          <input className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Tech stack (comma separated)" value={accountForm.tech_stack?.join(',')||''} onChange={e=>setAccountForm({...accountForm, tech_stack:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />
          <input className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Compliance tags (comma separated)" value={accountForm.compliance_tags?.join(',')||''} onChange={e=>setAccountForm({...accountForm, compliance_tags:e.target.value.split(',').map(s=>s.trim()).filter(Boolean)})} />
          <button onClick={createAccount} className="px-3 py-2 bg-blue-600 rounded">Create Account</button>
        </div>

        <div className="space-y-4">
          <h3 className="text-slate-200 font-medium">Contacts for Selected Account</h3>
          <select className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" value={selected?._id||''} onChange={async e=>{
            const a = accounts.find(x=>x._id===e.target.value)
            setSelected(a)
            const c = await (await fetch(`${API}/contacts?account_id=${a._id}`)).json()
            setContacts(c)
            setContactForm({...contactForm, account_id:a._id})
          }}>
            <option value="">Select account</option>
            {accounts.map(a=> <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="First name" value={contactForm.first_name} onChange={e=>setContactForm({...contactForm, first_name:e.target.value})} />
            <input className="px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Last name" value={contactForm.last_name} onChange={e=>setContactForm({...contactForm, last_name:e.target.value})} />
            <input className="px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Title" value={contactForm.title} onChange={e=>setContactForm({...contactForm, title:e.target.value})} />
            <input className="px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Email" value={contactForm.email} onChange={e=>setContactForm({...contactForm, email:e.target.value})} />
            <input className="px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="LinkedIn URL" value={contactForm.linkedin_url||''} onChange={e=>setContactForm({...contactForm, linkedin_url:e.target.value})} />
          </div>
          <button onClick={createContact} className="px-3 py-2 bg-blue-600 rounded">Add Contact</button>

          <div className="mt-4 grid gap-2">
            {contacts.map(c=> (
              <div key={c._id} className="p-3 bg-slate-800/80 rounded border border-slate-700 text-sm">
                {c.first_name} {c.last_name} • {c.title} • {c.email}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

function Templates(){
  const [items, setItems] = useState([])
  const [form, setForm] = useState({name:'Intro Email', channel:'email', persona_key:'CTO', goal:'book meeting', variables:['first_name','company','tech_stack'], content:'Hi {{first_name}}, quick note on {{company}}\'s {{tech_stack}}.'})
  const load = async ()=>{ setItems(await (await fetch(`${API}/templates`)).json()) }
  useEffect(()=>{load()},[])
  const save = async ()=>{ await fetch(`${API}/templates`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)}); setForm({...form, name:'', content:''}); load() }
  return (
    <Section title="Templates" description="Channel-specific templates with variables for deterministic personalization.">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <input className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <select className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" value={form.channel} onChange={e=>setForm({...form, channel:e.target.value})}>
            {['email','voice','whatsapp','linkedin'].map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
          <input className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Persona key" value={form.persona_key||''} onChange={e=>setForm({...form, persona_key:e.target.value})} />
          <textarea rows={6} className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Content with {{variables}}" value={form.content} onChange={e=>setForm({...form, content:e.target.value})} />
          <button onClick={save} className="px-3 py-2 bg-blue-600 rounded">Save Template</button>
        </div>
        <div className="space-y-3">
          {items.map(t=> (
            <div key={t._id} className="p-3 bg-slate-800/80 rounded border border-slate-700">
              <div className="text-sm text-slate-200">{t.name} • {t.channel} • {t.persona_key}</div>
              <div className="text-xs text-slate-400 whitespace-pre-wrap mt-1">{t.content}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Sequences(){
  const [items, setItems] = useState([])
  const [form, setForm] = useState({name:'CTO 4-touch', description:'Email + LinkedIn', steps:[{day_offset:0, channel:'email'},{day_offset:3, channel:'linkedin'}], success_conditions:['meeting booked']})
  const load = async ()=>{ setItems(await (await fetch(`${API}/sequences`)).json()) }
  useEffect(()=>{load()},[])
  const save = async ()=>{ await fetch(`${API}/sequences`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)}); load() }
  return (
    <Section title="Sequences" description="Build multi-touch, multi-channel flows with compliance gating coming next.">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <input className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
          <textarea rows={5} className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Description" value={form.description||''} onChange={e=>setForm({...form, description:e.target.value})} />
          <div className="space-y-2">
            {form.steps.map((s, i)=> (
              <div key={i} className="grid grid-cols-3 gap-2">
                <input type="number" className="px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" value={s.day_offset} onChange={e=>{
                  const steps=[...form.steps]; steps[i].day_offset = Number(e.target.value); setForm({...form, steps})
                }} />
                <select className="px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" value={s.channel} onChange={e=>{const steps=[...form.steps]; steps[i].channel=e.target.value; setForm({...form, steps})}}>
                  {['email','voice','whatsapp','linkedin'].map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
                <input className="px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" placeholder="Template Id (optional)" value={s.template_id||''} onChange={e=>{const steps=[...form.steps]; steps[i].template_id=e.target.value; setForm({...form, steps})}} />
              </div>
            ))}
            <button onClick={()=>setForm({...form, steps:[...form.steps, {day_offset:3, channel:'email'}]})} className="px-3 py-1.5 bg-slate-700 rounded text-xs">Add Step</button>
          </div>
          <button onClick={save} className="px-3 py-2 bg-blue-600 rounded">Save Sequence</button>
        </div>
        <div className="space-y-3">
          {items.map(s=> (
            <div key={s._id} className="p-3 bg-slate-800/80 rounded border border-slate-700 text-sm">
              <div className="text-slate-200">{s.name}</div>
              <div className="text-slate-400">Steps: {s.steps?.map(x=>x.channel).join(' → ')}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Console(){
  const [accounts, setAccounts] = useState([])
  const [contacts, setContacts] = useState([])
  const [templates, setTemplates] = useState([])
  const [sequences, setSequences] = useState([])

  const [state, setState] = useState({account_id:'', contact_id:'', template_id:'', sequence_id:''})
  const [preview, setPreview] = useState('')
  const [schedule, setSchedule] = useState([])
  const [warnings, setWarnings] = useState([])

  const load = async ()=>{
    const a = await (await fetch(`${API}/accounts`)).json(); setAccounts(a)
    const t = await (await fetch(`${API}/templates`)).json(); setTemplates(t)
    const s = await (await fetch(`${API}/sequences`)).json(); setSequences(s)
  }
  useEffect(()=>{load()},[])

  useEffect(()=>{
    (async()=>{
      if(state.account_id){
        const c = await (await fetch(`${API}/contacts?account_id=${state.account_id}`)).json(); setContacts(c)
      }
    })()
  },[state.account_id])

  const runPreview = async ()=>{
    const r = await fetch(`${API}/personalize`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({template_id: state.template_id, account_id: state.account_id, contact_id: state.contact_id, extra_context:{}})})
    const data = await r.json(); setPreview(data.preview)
  }

  const runSim = async ()=>{
    const r = await fetch(`${API}/simulate-sequence`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({sequence_id: state.sequence_id, account_id: state.account_id, contact_id: state.contact_id})})
    const data = await r.json(); setSchedule(data.schedule||[]); setWarnings(data.warnings||[])
  }

  return (
    <Section title="Personalization & Simulation" description="Preview personalized content and validate sequence timing against guardrails.">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <select className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" value={state.account_id} onChange={e=>setState({...state, account_id:e.target.value, contact_id:''})}>
            <option value="">Select Account</option>
            {accounts.map(a=> <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
          <select className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" value={state.contact_id} onChange={e=>setState({...state, contact_id:e.target.value})}>
            <option value="">Select Contact</option>
            {contacts.map(c=> <option key={c._id} value={c._id}>{c.first_name} {c.last_name}</option>)}
          </select>
          <select className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" value={state.template_id} onChange={e=>setState({...state, template_id:e.target.value})}>
            <option value="">Select Template</option>
            {templates.map(t=> <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <button onClick={runPreview} className="px-3 py-2 bg-blue-600 rounded">Generate Preview</button>
          <textarea rows={10} className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" value={preview} readOnly />
        </div>
        <div className="space-y-3">
          <select className="w-full px-3 py-2 bg-slate-900/70 border border-slate-700 rounded" value={state.sequence_id} onChange={e=>setState({...state, sequence_id:e.target.value})}>
            <option value="">Select Sequence</option>
            {sequences.map(s=> <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <button onClick={runSim} className="px-3 py-2 bg-blue-600 rounded">Simulate</button>
          <div className="space-y-2">
            {schedule.map(s=> (
              <div key={`${s.index}-${s.when}`} className="p-2 bg-slate-800/70 rounded border border-slate-700 text-sm">
                Step {s.index+1}: {s.channel} at {s.when}
              </div>
            ))}
          </div>
          {warnings.length>0 && (
            <div className="p-3 bg-amber-500/20 border border-amber-400/40 rounded text-amber-200 text-sm">
              <div className="font-medium mb-1">Compliance Warnings</div>
              <ul className="list-disc list-inside space-y-1">
                {warnings.map((w,i)=> <li key={i}>{w}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Section>
  )
}

function Audit(){
  const [items, setItems] = useState({agent_runs:[], interactions:[]})
  const load = async ()=>{ setItems(await (await fetch(`${API}/audit?limit=50`)).json()) }
  useEffect(()=>{load()},[])
  return (
    <Section title="Audit & Traceability" description="View agent runs and recent interactions for compliance and ops.">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-slate-200">Agent Runs</h3>
          {items.agent_runs.map(r=> (
            <details key={r._id} className="p-3 bg-slate-800/80 rounded border border-slate-700 text-xs">
              <summary className="cursor-pointer text-slate-200">{r.agent} • {new Date(r.created_at || r._id?.substring(0,8)).toLocaleString()}</summary>
              <pre className="whitespace-pre-wrap mt-2 text-slate-300">{JSON.stringify(r, null, 2)}</pre>
            </details>
          ))}
        </div>
        <div className="space-y-2">
          <h3 className="text-slate-200">Interactions</h3>
          {items.interactions.map(i=> (
            <div key={i._id} className="p-3 bg-slate-800/80 rounded border border-slate-700 text-xs">
              <div>{i.channel} • {i.direction} • {i.status}</div>
              {i.subject && <div className="mt-1 text-slate-300">{i.subject}</div>}
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
