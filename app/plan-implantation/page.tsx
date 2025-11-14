'use client'
import React, { useMemo, useRef, useState } from 'react';
import "../global.css";
type SymbolKind = 'socket'|'lamp'|'switch'|'rj45'|'rcd'|'breaker'|'earth'|'smoke'|'motion'|'board';

type Item = {
  id: string;
  kind: SymbolKind;
  x: number; // in mm relative to A4 portrait 210x297mm
  y: number;
  rot: number; // degrees
  label?: string;
};

const A4_W = 210; // mm
const A4_H = 297; // mm

function mmToView(v:number){ return v; } // 1 unit == 1mm in viewBox

function useId() {
  const c = useRef(0);
  return () => `it_${++c.current}`;
}

function SymbolDef({kind}:{kind:SymbolKind}){
  // inline minimal paths scaled to fit 12x12mm box centered on 0,0
  const g:any = {
    socket: (<g transform="scale(0.18) translate(-176,-176)">
      <rect x="112" y="112" width="128" height="128" rx="12" />
      <circle cx="176" cy="176" r="32" />
      <circle cx="164" cy="170" r="6"/><circle cx="188" cy="170" r="6"/>
      <circle cx="176" cy="188" r="5"/>
    </g>),
    lamp: (<g transform="scale(0.18) translate(-176,-176)">
      <circle cx="176" cy="160" r="28"/><path d="M160 188h32"/><path d="M164 196h24"/><path d="M168 204h16"/>
    </g>),
    switch: (<g transform="scale(0.18)">
      <path d="M-34 0h36"/><path d="M-4 -8l24 16"/><path d="M20 0h36"/><circle cx="-6" cy="0" r="3"/><circle cx="20" cy="0" r="3"/>
    </g>),
    rj45: (<g transform="scale(0.18)">
      <rect x="-16" y="-16" width="32" height="32" rx="4"/>
      <rect x="-10" y="-6" width="20" height="12" rx="2"/>
      <path d="M-8 -4h4M-2 -4h4M4 -4h4"/><path d="M-6 6v-4M-2 6v-4M2 6v-4M6 6v-4"/>
    </g>),
    rcd: (<g transform="scale(0.18) translate(-176,-176)">
      <rect x="140" y="120" width="72" height="112" rx="8"/>
      <rect x="148" y="132" width="24" height="16"/><rect x="180" y="132" width="24" height="16"/>
      <path d="M152 180h48"/>
    </g>),
    breaker: (<g transform="scale(0.18) translate(-176,-176)">
      <rect x="152" y="120" width="48" height="112" rx="8"/>
      <rect x="156" y="136" width="40" height="20"/>
    </g>),
    earth: (<g transform="scale(0.18)">
      <path d="M0 -28v28"/><path d="M-20 8h40"/><path d="M-14 14h28"/><path d="M-8 20h16"/>
    </g>),
    smoke: (<g transform="scale(0.18)">
      <circle cx="0" cy="-4" r="16"/><path d="M-12 -4h24"/><circle cx="0" cy="-4" r="3"/>
    </g>),
    motion: (<g transform="scale(0.18)">
      <rect x="-16" y="-12" width="32" height="16" rx="3"/><path d="M-28 16c10-10 44-10 56 0"/><circle cx="0" cy="-4" r="3"/>
    </g>),
    board: (<g transform="scale(0.18) translate(-176,-176)">
      <rect x="140" y="120" width="72" height="112" rx="6"/>
      <rect x="152" y="140" width="48" height="20" rx="2"/>
      <rect x="152" y="172" width="48" height="20" rx="2"/>
    </g>),
  };
  return <g>{g[kind]}</g>;
}

export default function Page(){
  const genId = useId();
  const [items,setItems] = useState<Item[]>([]);
  const [dragId,setDragId] = useState<string|null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  function add(kind:SymbolKind){
    setItems(s=>[...s,{ id: genId(), kind, x: A4_W/2, y: A4_H/2, rot:0 }]);
  }
  function remove(id:string){ setItems(s=>s.filter(it=>it.id!==id)); }
  function rotate(id:string, d=90){ setItems(s=>s.map(it=>it.id===id?{...it, rot:(it.rot+d)%360}:it)); }

  function onPointerDown(e:React.PointerEvent, id:string){
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    setDragId(id);
  }
  function onPointerMove(e:React.PointerEvent){
    if(!dragId) return;
    if(!svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX; pt.y=e.clientY;
    const m = svgRef.current.getScreenCTM();
    if(!m) return;
    const p = pt.matrixTransform(m.inverse());
    setItems(s=>s.map(it=>it.id===dragId?{...it, x:p.x, y:p.y}:it));
  }
  function onPointerUp(){ setDragId(null); }

  const legend: {label:string, kind:SymbolKind, code:string}[] = [
    {label:'Prise', kind:'socket', code:'PC'},
    {label:'Lampe', kind:'lamp', code:'L'},
    {label:'Interrupteur', kind:'switch', code:'S'},
    {label:'RJ45', kind:'rj45', code:'RJ'},
    {label:'Différentiel', kind:'rcd', code:'IΔN'},
    {label:'Disjoncteur', kind:'breaker', code:'QF'},
    {label:'Terre', kind:'earth', code:'PE'},
    {label:'Détecteur fumée', kind:'smoke', code:'DF'},
    {label:'Détecteur mouvement', kind:'motion', code:'DM'},
    {label:'Tableau', kind:'board', code:'TGB'},
  ];

  return (
  <div className="wrapper">
    <aside className="sidebar">
      <h3 style={{marginTop:0}}>Légende</h3>
      <p className="note">Clique pour ajouter sur le plan. Sélection: glisser pour déplacer, R pour rotation, Suppr pour enlever.</p>
      <div>
        {legend.map((l)=>(
          <div className="legend-item" key={l.kind}>
            <span>{l.code} — {l.label}</span>
            <button className="btn" onClick={()=>add(l.kind)}>Ajouter</button>
          </div>
        ))}
      </div>
      <hr style={{borderColor:'var(--line)'}}/>
      <button className="btn" onClick={()=>{navigator.clipboard.writeText(JSON.stringify(items,null,2))}}>Copier JSON</button>
      <p className="note">Le JSON contient positions et rotations. Tu peux le persister.</p>
    </aside>
    <main className="main">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${A4_W} ${A4_H}`}
        width="100%"
        className="grid"
        style={{backgroundColor:'#0b1220'}}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* cadre A4 */}
        <rect x="3" y="3" width={A4_W-6} height={A4_H-6} fill="none" stroke="var(--line)" strokeWidth={0.5} />
        {/* defs: style strokes */}
        <g stroke="#e5e7eb" strokeWidth={1.2} fill="none" strokeLinecap="round" strokeLinejoin="round">
          {items.map((it)=> (
            <g key={it.id} transform={`translate(${mmToView(it.x)} ${mmToView(it.y)}) rotate(${it.rot})`} 
               onPointerDown={(e)=>onPointerDown(e,it.id)} tabIndex={0}
               onKeyDown={(e)=>{
                  if(e.key==='Delete'){ remove(it.id); }
                  if(e.key.toLowerCase()==='r'){ rotate(it.id, 90); }
               }}>
              <SymbolDef kind={it.kind} />
              <text x="10" y="-8" fontSize="5" fill="#cbd5e1">{legend.find(l=>l.kind===it.kind)?.code}</text>
            </g>
          ))}
        </g>
      </svg>
      <p className="note">Astuce: maintiens R sur un symbole pour tourner par pas de 90°. Suppr pour supprimer.</p>
    </main>
  </div>
  );
}
