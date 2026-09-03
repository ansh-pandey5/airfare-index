import { useMemo, useState } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, Airplay, BarChart3, CheckCircle2, ChevronDown, Database, Download, ExternalLink, Gauge, Menu, Plane, RefreshCw, Search, Settings2, Table2, X } from 'lucide-react';

const routes = [
  { route: 'DEL → BOM', fare: 5960, change: 4.8, demand: 'High', pressure: 86, note: 'Peak-weekend sensitivity' },
  { route: 'DEL → BLR', fare: 6410, change: 5.6, demand: 'High', pressure: 91, note: 'Tight near-term inventory' },
  { route: 'DEL → GOI', fare: 6840, change: 7.1, demand: 'High', pressure: 94, note: 'Leisure demand elevated' },
  { route: 'BOM → BLR', fare: 4820, change: 2.9, demand: 'High', pressure: 74, note: 'Stable capacity' },
  { route: 'CCU → DEL', fare: 5710, change: 3.2, demand: 'Medium', pressure: 63, note: 'Moderate upward drift' },
  { route: 'HYD → DEL', fare: 5280, change: -1.4, demand: 'Medium', pressure: 48, note: 'Improving availability' },
  { route: 'BLR → HYD', fare: 3310, change: 1.1, demand: 'Medium', pressure: 44, note: 'Short-haul stable' },
  { route: 'MAA → BOM', fare: 4550, change: -2.2, demand: 'Low', pressure: 39, note: 'Competitive market' },
];

const indexData = [
  121.2, 121.7, 122.1, 121.6, 122.8, 123.1, 122.7, 123.4, 124.0, 123.8,
  124.6, 124.2, 125.1, 124.9, 125.6, 126.0, 125.7, 126.4, 126.8, 126.2,
  127.1, 126.7, 127.5, 127.2, 128.0, 127.6, 128.4, 128.1, 127.9, 128.7,
  128.2, 129.0, 128.6, 129.4, 129.1, 130.0, 129.6, 130.3, 130.1, 130.8,
  130.4, 131.0, 130.7, 131.5, 131.2,
].map((value, index) => ({ day: `Aug ${21 + index}`, value, avg: Number((value - 0.55 + Math.sin(index / 3) * 0.18).toFixed(1)) }));

const airlines = [
  { name: 'IndiGo', fare: 5220, share: 38 },
  { name: 'Air India', fare: 5940, share: 25 },
  { name: 'Akasa Air', fare: 5480, share: 15 },
  { name: 'SpiceJet', fare: 4710, share: 12 },
  { name: 'Vistara*', fare: 6210, share: 10 },
];

const navItems = [
  ['Overview', 'overview', Gauge],
  ['Airfare Index', 'index', Activity],
  ['Routes', 'routes', Plane],
  ['Price Trends', 'trends', BarChart3],
  ['Airlines', 'airlines', Airplay],
  ['Fare Explorer', 'explorer', Search],
];

const formatINR = (value) => `₹${value.toLocaleString('en-IN')}`;

function App() {
  const [active, setActive] = useState('Overview');
  const [horizon, setHorizon] = useState('T+15');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('pressure');
  const [from, setFrom] = useState('DEL');
  const [to, setTo] = useState('BOM');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fare, setFare] = useState(5960);

  const visibleRoutes = useMemo(() => {
    const filtered = routes.filter((item) => item.route.toLowerCase().includes(search.toLowerCase()));
    return [...filtered].sort((a, b) => {
      if (sort === 'fare') return b.fare - a.fare;
      if (sort === 'change') return b.change - a.change;
      return b.pressure - a.pressure;
    });
  }, [search, sort]);

  const chartData = useMemo(() => {
    const count = Number(horizon.replace('T+', '')) || 15;
    return indexData.slice(-count);
  }, [horizon]);

  const jump = (label, id) => {
    setActive(label);
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 700);
  };

  const explore = () => {
    const seed = (from.charCodeAt(0) * 19 + to.charCodeAt(0) * 11) % 900;
    setFare(4300 + seed + (from === 'DEL' ? 420 : 0));
  };

  return (
    <div className="app">
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Plane size={17} strokeWidth={2.5} /></div>
          <div><div className="brand-name">Airfare Index</div><div className="brand-caption">Pricing Intelligence</div></div>
          <button className="mobile-close" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>
        <div className="nav-label">Workspace</div>
        <nav>
          {navItems.map(([label, id, Icon]) => (
            <button key={id} className={active === label ? 'nav-item active' : 'nav-item'} onClick={() => jump(label, id)}>
              <Icon size={16} /><span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="nav-label reference">Reference</div>
        <nav>
          <button className="nav-item" onClick={() => jump('Data Quality', 'quality')}><CheckCircle2 size={16} /><span>Data Quality</span></button>
          <button className="nav-item" onClick={() => jump('Methodology', 'methodology')}><Table2 size={16} /><span>Methodology</span></button>
          <button className="nav-item" onClick={() => jump('API Access', 'api')}><Database size={16} /><span>API Access</span></button>
        </nav>
        <div className="sidebar-bottom"><div className="demo-card"><span>DEMO ENVIRONMENT</span><p>All observations are synthetic and for product demonstration only.</p></div></div>
      </aside>

      <main>
        <header className="topbar">
          <div className="mobile-brand"><button onClick={() => setMobileOpen(true)}><Menu size={21} /></button><strong>Airfare Index</strong></div>
          <div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{active}</strong></div>
          <div className="top-actions"><div className="status-dot"><i /> Demo data</div><button className="icon-btn"><Settings2 size={17} /></button><button className="icon-btn"><Download size={17} /></button></div>
        </header>

        <section className="hero" id="overview">
          <div><div className="eyebrow">India domestic aviation</div><h1>Airfare market monitor</h1><p>Track price movement, route pressure and booking-horizon signals across major domestic sectors.</p></div>
          <div className="hero-actions"><button className="secondary-btn">Last 45 days <ChevronDown size={14} /></button><button className="primary-btn" onClick={refresh}><RefreshCw size={14} className={refreshing ? 'spin' : ''} />{refreshing ? 'Refreshing…' : 'Refresh data'}</button></div>
        </section>

        <section className="kpi-grid">
          <Kpi title="Airfare Price Index" value="131.2" change="+3.8%" context="vs. 30-day baseline" accent="mint" />
          <Kpi title="Median one-way fare" value="₹5,840" change="+2.1%" context="vs. prior period" accent="blue" />
          <Kpi title="Routes monitored" value="42" change="98.2%" context="coverage score" accent="amber" suffix="" />
          <Kpi title="Data quality" value="96.8" change="+0.7" context="points this week" accent="violet" suffix="/100" />
        </section>

        <section className="section-grid" id="index">
          <div className="panel chart-panel">
            <PanelHeader title="Airfare Price Index" subtitle="Weighted composite · base = 100 · indicative demo series" right={<div className="segmented">{['T+1','T+7','T+15','T+30','T+45'].map((item) => <button key={item} className={horizon === item ? 'selected' : ''} onClick={() => setHorizon(item)}>{item}</button>)}</div>} />
            <div className="chart-legend"><span><i className="legend-mint" />Market index</span><span><i className="legend-blue" />Rolling 7D average</span></div>
            <div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}><defs><linearGradient id="fillMint" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#76e4bd" stopOpacity={0.22}/><stop offset="100%" stopColor="#76e4bd" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#1c2632" /><XAxis dataKey="day" tick={{ fill:'#647080', fontSize:10 }} axisLine={false} tickLine={false} minTickGap={30}/><YAxis domain={['dataMin - 2','dataMax + 1']} tick={{ fill:'#647080', fontSize:10 }} axisLine={false} tickLine={false}/><Tooltip contentStyle={{ background:'#101720', border:'1px solid #273241', borderRadius:10, fontSize:11 }} labelStyle={{ color:'#8d9aaa' }}/><Area type="monotone" dataKey="value" stroke="#76e4bd" strokeWidth={2.2} fill="url(#fillMint)"/><Area type="monotone" dataKey="avg" stroke="#79a8ff" strokeWidth={1.5} strokeDasharray="4 4" fill="none"/></AreaChart></ResponsiveContainer></div>
          </div>

          <div className="panel" id="routes">
            <PanelHeader title="Route pressure" subtitle="Highest current fare movement" right={<span className="live-pill"><i/>Simulated</span>} />
            <div className="pressure-list">{routes.slice(0,5).map((item) => <div className="pressure-row" key={item.route}><div className="route-code">{item.route}</div><div className="pressure-track"><span style={{width:`${item.pressure}%`}} /></div><b>{item.pressure}</b></div>)}</div>
            <div className="panel-foot">Pressure combines fare change, demand and inventory signals.</div>
          </div>
        </section>

        <section className="section-grid two" id="trends">
          <div className="panel" id="airlines">
            <PanelHeader title="Airline comparison" subtitle="Median fare across monitored sectors" right={<span className="muted-small">₹ / one-way</span>} />
            <div className="airline-list">{airlines.map((item) => <div className="airline-row" key={item.name}><div className="airline-name">{item.name}</div><div className="airline-bar"><span style={{width:`${(item.fare/6500)*100}%`}} /></div><strong>{formatINR(item.fare)}</strong></div>)}</div>
            <div className="panel-foot">* Legacy brand grouping used only in this synthetic dataset.</div>
          </div>
          <div className="panel">
            <PanelHeader title="Sector heatmap" subtitle="Relative fare pressure by corridor" />
            <div className="heatmap">{Array.from({length:42}, (_,i) => { const value=(i*23+17)%100; const level=value>82?6:value>68?5:value>52?4:value>35?3:value>17?2:1; return <div key={i} className={`heat-cell h${level}`} title={`Pressure ${value}`}>{value}</div>; })}</div>
            <div className="heat-labels"><span>Lower pressure</span><span>Higher pressure</span></div>
          </div>
        </section>

        <section className="panel full-panel" id="routes-table">
          <PanelHeader title="Route-wise airfare tracking" subtitle="Indicative median one-way economy fares" right={<div className="table-tools"><div className="search"><Search size={14}/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search route…"/></div><select value={sort} onChange={(e)=>setSort(e.target.value)}><option value="pressure">Sort: pressure</option><option value="fare">Sort: fare</option><option value="change">Sort: change</option></select></div>} />
          <div className="table-wrap"><table><thead><tr><th>Sector</th><th>Median fare</th><th>30D change</th><th>Demand</th><th>Pressure</th><th>Signal</th></tr></thead><tbody>{visibleRoutes.map((item)=><tr key={item.route}><td><strong>{item.route}</strong></td><td>{formatINR(item.fare)}</td><td className={item.change > 0 ? 'red' : 'mint'}>{item.change > 0 ? '▲' : '▼'} {Math.abs(item.change)}%</td><td><span className="tag">{item.demand}</span></td><td><span className={`pressure-tag ${item.pressure > 80 ? 'high' : item.pressure > 55 ? 'mid' : 'low'}`}>{item.pressure}/100</span></td><td className="muted">{item.note}</td></tr>)}</tbody></table></div>
        </section>

        <section className="panel full-panel" id="explorer">
          <PanelHeader title="Fare explorer" subtitle="Query the synthetic market model by sector and booking horizon" right={<span className="live-pill">MODEL READY</span>} />
          <div className="explorer-grid"><Field label="From"><select value={from} onChange={(e)=>setFrom(e.target.value)}>{['DEL','BOM','BLR','HYD','CCU','MAA'].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="To"><select value={to} onChange={(e)=>setTo(e.target.value)}>{['BOM','DEL','BLR','HYD','CCU','MAA'].map(x=><option key={x}>{x}</option>)}</select></Field><Field label="Travel date"><input type="date" defaultValue="2026-09-18"/></Field><Field label="Cabin"><select><option>Economy</option><option>Premium Economy</option></select></Field><button className="primary-btn explore-btn" onClick={explore}>Find indicative fare</button></div>
          <div className="fare-result"><div><span>INDICATIVE MEDIAN</span><strong>{formatINR(fare)}</strong></div><div className="result-meta">{from} → {to} · T+15 · Demo estimate</div></div>
        </section>

        <section className="info-grid">
          <div className="panel" id="quality"><PanelHeader title="Data quality" subtitle="Pipeline health snapshot" right={<span className="live-pill"><i/>Healthy</span>} /><div className="quality-grid"><Metric value="98.2%" label="Route coverage"/><Metric value="99.1%" label="Schema validity"/><Metric value="0.8%" label="Missing values"/><Metric value="4m" label="Freshness lag"/></div></div>
          <div className="panel" id="methodology"><PanelHeader title="Methodology" subtitle="Transparent index design"/><p className="info-copy">The production index is designed as a route-weighted measure of domestic airfare movement. Inputs can include fare observations, booking horizon, cabin, airline, demand and data-quality flags. This interface currently uses synthetic observations.</p><button className="text-link">Read methodology <ExternalLink size={13}/></button></div>
          <div className="panel" id="api"><PanelHeader title="API & data access" subtitle="Production interface preview" right={<span className="tag">v0.1</span>}/><pre>GET /api/v1/index?route=DEL-BOM&horizon=T+15{`\n`}GET /api/v1/routes?date=2026-09-03{`\n`}GET /api/v1/fare-explorer?from=DEL&to=BOM</pre></div>
        </section>
        <footer>Airfare Index · Demo environment · Synthetic data · Built as a frontend prototype for aviation pricing intelligence</footer>
      </main>
    </div>
  );
}

function Kpi({ title, value, change, context, accent, suffix='' }) { return <div className={`kpi-card ${accent}`}><div className="kpi-top"><span>{title}</span><div className="mini-icon"><Activity size={14}/></div></div><div className="kpi-value">{value}<small>{suffix}</small></div><div className="kpi-change"><b>{change}</b><span>{context}</span></div></div>; }
function PanelHeader({ title, subtitle, right }) { return <div className="panel-header"><div><h2>{title}</h2><p>{subtitle}</p></div>{right}</div>; }
function Field({label,children}) { return <div className="field"><label>{label}</label>{children}</div>; }
function Metric({value,label}) { return <div className="metric"><strong>{value}</strong><span>{label}</span></div>; }

export default App;
