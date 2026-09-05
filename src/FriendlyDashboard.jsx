import { useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowDownRight, ArrowUpRight, BarChart3, BookOpen, ChevronRight, CircleHelp, Gauge, Menu, Plane, ShieldCheck, Sparkles, X } from 'lucide-react';
import api from '../public/data/apix.json';

const money = n => `₹${Math.round(n).toLocaleString('en-IN')}`;
const horizonColors = { 'T+1':'#7c5cff', 'T+7':'#ff5c8a', 'T+15':'#00b8a9', 'T+21':'#ffad33' };
const routeColors = ['#7c5cff','#00b8a9','#ff5c8a'];

function Metric({ label, value, note, tone='purple', icon }) {
  return <div className={`metric metric-${tone}`}><div className="metric-top"><span>{label}</span><span className="metric-icon">{icon}</span></div><strong>{value}</strong><small>{note}</small></div>;
}
function SectionTitle({ eyebrow, title, text }) {
  return <div className="section-head"><div><span>{eyebrow}</span><h2>{title}</h2></div>{text && <p>{text}</p>}</div>;
}
function Tip({ children }) { return <span className="tip"><CircleHelp size={14}/><span>{children}</span></span>; }

export default function FriendlyDashboard() {
  const [menu, setMenu] = useState(false);
  const [horizon, setHorizon] = useState('T+1');
  const [route, setRoute] = useState('ALL');
  const current = api.horizonIndex.find(x => x.horizon === horizon);
  const visibleRoutes = useMemo(() => route === 'ALL' ? api.routes : api.routes.filter(r => r.route === route), [route]);
  const maxRouteIndex = Math.max(...api.routes.map(r => r.horizons[horizon].index));
  const nav = [['top','Overview'],['index','Index'],['routes','Routes'],['compare','Compare fares'],['learn','How it works']];
  const go = id => { setMenu(false); document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); };
  const trend = api.horizonIndex.map((x,i) => ({ name:x.horizon, value:x.index, fare:x.representativeFare, step:i }));

  return <div className="app">
    <aside className={menu ? 'sidebar open' : 'sidebar'}>
      <div className="brand"><div className="brand-mark"><Plane size={19}/></div><div><b>APIx</b><span>Airfare Price Index</span></div><button className="close" onClick={()=>setMenu(false)}><X/></button></div>
      <div className="side-label">DASHBOARD</div>
      {nav.map(([id,label]) => <button className="nav" key={id} onClick={()=>go(id)}><span>{id==='top'?<Gauge/>:id==='index'?<BarChart3/>:id==='routes'?<Plane/>:id==='compare'?<Sparkles/>:<BookOpen/>}</span>{label}</button>)}
      <div className="side-bottom"><ShieldCheck size={17}/><div><b>Pilot dataset</b><small>4 Sep 2026 · 124 usable observations</small></div></div>
    </aside>

    <main className="main" id="top">
      <header className="topbar"><button className="hamb" onClick={()=>setMenu(true)}><Menu/></button><div><span>India · Domestic air travel</span><b>APIx dashboard</b></div><div className="date-pill"><span className="live-dot"/> Pilot · 4 Sep 2026</div></header>

      <section className="hero">
        <div className="hero-copy"><div className="pill"><Sparkles size={13}/> A simpler way to understand airfare</div><h1>Are domestic flight prices<br/><em>going up or down?</em></h1><p>APIx turns many individual ticket prices into one easy-to-read index. Explore the number, the routes behind it, and how booking earlier changes fares.</p><div className="hero-actions"><button onClick={()=>go('index')}>Explore the index <ChevronRight size={16}/></button><button className="ghost" onClick={()=>go('learn')}>How it works</button></div></div>
        <div className="hero-card"><div className="hero-card-top"><span>Current pilot APIx</span><Tip>APIx is an index. 100 is the chosen base level. It is not an inflation percentage.</Tip></div><strong>{api.pilotComposite.toFixed(2)}</strong><div className="hero-change"><ArrowUpRight size={15}/> {((api.pilotComposite-100)).toFixed(2)} points above base</div><div className="mini-scale"><span>100 base</span><i/><b>{api.pilotComposite.toFixed(0)}</b></div></div>
      </section>

      <div className="notice"><div className="notice-icon">i</div><div><b>Quick note before you explore</b><p>This is a <strong>pilot snapshot</strong>, not a live airfare inflation rate. To measure prices rising or falling over time, the same data needs to be collected repeatedly.</p></div></div>

      <section id="index" className="section"><SectionTitle eyebrow="01 · THE BIG PICTURE" title="One number. Four booking horizons." text="The pilot looks at fares when a ticket is booked 1, 7, 15 and 21 days before travel."/>
        <div className="metric-grid"><Metric label="Pilot APIx" value={api.pilotComposite.toFixed(2)} note="100 = base level" tone="purple" icon={<Gauge/>}/><Metric label="Highest horizon" value="152.60" note="BLR–BOM · T+7" tone="pink" icon={<ArrowUpRight/>}/><Metric label="Routes covered" value="3" note="Top domestic city pairs" tone="teal" icon={<Plane/>}/><Metric label="Usable observations" value="124" note="After quality checks" tone="orange" icon={<ShieldCheck/>}/></div>
        <div className="card chart-wrap"><div className="card-head"><div><h3>Index by booking horizon <Tip>Above 100 means the observed fare level is above the selected base. Below 100 means it is below the base.</Tip></h3><p>Higher bars = higher relative airfare level</p></div><div className="base-chip">Base = 100</div></div><ResponsiveContainer width="100%" height={300}><BarChart data={api.horizonIndex} barCategoryGap="24%"><CartesianGrid vertical={false} stroke="#edf0f5"/><XAxis dataKey="horizon" axisLine={false} tickLine={false} tick={{fill:'#697386',fontSize:12,fontWeight:600}}/><YAxis domain={[90,120]} axisLine={false} tickLine={false} tick={{fill:'#9aa3b2',fontSize:11}}/><Tooltip cursor={{fill:'#f7f8fb'}} formatter={v=>[Number(v).toFixed(2),'Index']} contentStyle={{border:'1px solid #e7eaf0',borderRadius:12,boxShadow:'0 10px 30px rgba(20,30,50,.08)'}}/><Bar dataKey="index" radius={[9,9,3,3]}>{api.horizonIndex.map(x=><Cell key={x.horizon} fill={horizonColors[x.horizon]}/>)}</Bar></BarChart></ResponsiveContainer><div className="chart-caption"><b>How to read this:</b> if a bar is 110, the fare level is 10 index points above the base of 100. It does <strong>not</strong> mean fares rose 10% today.</div></div>
      </section>

      <section id="routes" className="section"><SectionTitle eyebrow="02 · ROUTES" title="Which routes matter most?" text="Route weights come from passenger traffic. A busier route has a bigger influence on the combined index."/>
        <div className="route-toolbar"><div className="segmented">{[['ALL','All routes'],...api.routes.map(r=>[r.route,r.route])].map(([v,l])=><button className={route===v?'active':''} key={v} onClick={()=>setRoute(v)}>{l}</button>)}</div><div className="selected-horizon">Showing <b>{horizon}</b> fares</div></div>
        <div className="route-grid">{visibleRoutes.map((r,i)=>{const h=r.horizons[horizon]; return <div className="route-card" key={r.route}><div className="route-top"><div className="route-code" style={{background:`${routeColors[i%3]}16`,color:routeColors[i%3]}}>{r.route}</div><span>{r.weight.toFixed(1)}% weight</span></div><h3>{r.name}</h3><div className="route-fare">{money(h.fare)}<small>typical one-way fare</small></div><div className="route-index"><span>Route index</span><strong>{h.index.toFixed(2)}</strong></div><div className="route-bar"><i style={{width:`${Math.min(100,(h.index/maxRouteIndex)*100)}%`,background:routeColors[i%3]}}/></div><div className="route-foot"><span>{(r.passengers/1e6).toFixed(1)}M passengers</span><span>{h.n} observations</span></div></div>})}</div>
      </section>

      <section id="compare" className="section"><SectionTitle eyebrow="03 · COMPARE" title="What changes when you book earlier?" text="Select a booking horizon to see the fare level and compare it across routes."/>
        <div className="compare-layout"><div className="card horizon-card"><div className="card-head"><div><h3>Choose your booking day</h3><p>T+ means “days before the flight”.</p></div><Tip>T+1 = one day before travel. T+21 = twenty-one days before travel.</Tip></div><div className="horizon-buttons">{api.horizonIndex.map(x=><button key={x.horizon} className={horizon===x.horizon?'chosen':''} onClick={()=>setHorizon(x.horizon)} style={{'--accent':horizonColors[x.horizon]}}><span>{x.horizon}</span><b>{x.index.toFixed(2)}</b><small>{money(x.representativeFare)}</small></button>)}</div><div className="selected-summary"><div><span>Selected horizon</span><b>{horizon}</b></div><div><span>Typical fare</span><b>{money(current.representativeFare)}</b></div><div><span>Index</span><b>{current.index.toFixed(2)}</b></div></div></div>
          <div className="card area-card"><div className="card-head"><div><h3>Relative fare level</h3><p>Across the four pilot horizons</p></div></div><ResponsiveContainer width="100%" height={245}><AreaChart data={trend}><defs><linearGradient id="apiGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c5cff" stopOpacity=".28"/><stop offset="100%" stopColor="#7c5cff" stopOpacity=".02"/></linearGradient></defs><CartesianGrid vertical={false} stroke="#edf0f5"/><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#697386',fontSize:11}}/><YAxis domain={[95,120]} axisLine={false} tickLine={false} tick={{fill:'#9aa3b2',fontSize:10}}/><Tooltip formatter={v=>[Number(v).toFixed(2),'Index']} contentStyle={{border:'1px solid #e7eaf0',borderRadius:12}}/><Area type="monotone" dataKey="value" stroke="#7c5cff" strokeWidth={3} fill="url(#apiGrad)"/></AreaChart></ResponsiveContainer></div></div>
      </section>

      <section className="section"><SectionTitle eyebrow="04 · THE MIX" title="Where the pilot's route weight comes from" text="Passenger traffic decides how much each route contributes. The three selected routes add up to 100%."/>
        <div className="mix-grid"><div className="card pie-card"><ResponsiveContainer width="100%" height={270}><PieChart><Pie data={api.routes.map(r=>({name:r.route,value:r.weight}))} dataKey="value" nameKey="name" innerRadius={75} outerRadius={105} paddingAngle={4}>{api.routes.map((r,i)=><Cell key={r.route} fill={routeColors[i]}/>)}</Pie><Tooltip formatter={v=>[`${Number(v).toFixed(1)}%`,'Weight']}/></PieChart></ResponsiveContainer><div className="pie-center"><strong>100%</strong><span>route weight</span></div></div><div className="weight-list">{api.routes.map((r,i)=><div className="weight-row" key={r.route}><i style={{background:routeColors[i]}}/><div><b>{r.route}</b><small>{r.name}</small></div><strong>{r.weight.toFixed(1)}%</strong></div>)}<div className="weight-note"><b>Why this matters</b><p>A fare change on a heavily travelled route moves the overall APIx more than the same change on a lighter route.</p></div></div></div>
      </section>

      <section id="learn" className="section"><SectionTitle eyebrow="05 · LEARN IN 60 SECONDS" title="No economics degree required." text="These are the only terms you need to understand the dashboard."/>
        <div className="learn-grid">{[['APIx','Airfare Price Index — one summary number for the selected fares.'],['Base = 100','The starting reference point. Every index comparison is made against this level.'],['T+1 / T+7','How many days before travel the fare was observed.'],['Median fare','The middle fare after sorting observations. It limits the effect of unusually cheap or expensive quotes.'],['Route weight','A route’s share of passenger traffic, used to give busier routes more influence.'],['Observation','One recorded fare for a particular flight, airline, travel date and booking horizon.']].map((x,i)=><div className="learn-card" key={x[0]}><div className="learn-num">0{i+1}</div><div><b>{x[0]}</b><p>{x[1]}</p></div></div>)}</div>
      </section>

      <section className="section methodology"><SectionTitle eyebrow="06 · TRUST THE NUMBER" title="How APIx is built" text="The pilot follows a simple, auditable process."/><div className="steps">{[['01','Collect','Record comparable one-way economy fares for selected routes and booking horizons.'],['02','Clean','Remove non-qualifying flights and reconcile duplicate quotes for the same flight.'],['03','Summarise','Use the median fare for each route × horizon combination.'],['04','Combine','Apply passenger-based route weights and provisional horizon weights.']].map(x=><div className="step-card" key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></div>)}</div><div className="formula"><div><b>Technical view</b><span>For analysts who want the maths</span></div><code>APIx = Σ (route weight × horizon weight × current fare ÷ base fare × 100)</code></div></section>

      <footer><div><b>APIx</b> · Airfare Price Index</div><span>Pilot data · 4 September 2026 · 3 routes · 124 qualifying observations</span></footer>
    </main>
  </div>;
}
