import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  HardDrives, 
  Funnel, 
  MapPin, 
  Sparkle, 
  TrendDown 
} from '@phosphor-icons/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { REGIONS, getTierBadge } from '../data/regions';

// Helper to generate native Leaflet robust SVG location pin icons
const createSvgPinIcon = (color, isSelected) => {
  const width = isSelected ? 36 : 26;
  const height = isSelected ? 46 : 34;
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 32">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 20 12 20s12-11 12-20c0-6.63-5.37-12-12-12z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
    <circle cx="12" cy="10" r="3.5" fill="#ffffff" />
  </svg>`;

  return L.icon({
    iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [0, -height]
  });
};

export default function GridEnergyMap() {
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);
  const [tierFilter, setTierFilter] = useState('All');

  // Migration Estimator
  const [sourceRegionId, setSourceRegionId] = useState('ap-south-1');
  const [targetRegionId, setTargetRegionId] = useState('eu-north-1');

  // Leaflet map refs
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  // Filter logic
  const filteredRegions = REGIONS.filter(r => {
    if (tierFilter === 'clean' && r.intensity >= 150) return false;
    if (tierFilter === 'moderate' && (r.intensity < 150 || r.intensity > 400)) return false;
    if (tierFilter === 'high' && r.intensity <= 400) return false;
    return true;
  });

  // Calculate carbon savings
  const srcRegion = REGIONS.find(r => r.id === sourceRegionId) || REGIONS[10];
  const tgtRegion = REGIONS.find(r => r.id === targetRegionId) || REGIONS[0];
  const savingsPct = srcRegion.intensity > 0 
    ? (((srcRegion.intensity - tgtRegion.intensity) / srcRegion.intensity) * 100).toFixed(1)
    : 0;

  // Safe Leaflet Map Initialization with OpenStreetMap + Dark CSS filter
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    if (container._leaflet_id) {
      container._leaflet_id = null;
    }
    container.innerHTML = '';

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(container, {
      center: [20.0, 0.0],
      zoom: 2,
      minZoom: 1,
      maxZoom: 12,
      zoomControl: false,
      attributionControl: false
    });

    // Add zoom control in top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Standard OpenStreetMap Tile Layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Invalidate size & fit bounds to display all 12 global cloud regions
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        const bounds = L.latLngBounds(REGIONS.map(r => [r.lat, r.lon]));
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 3 });
      }
    }, 150);

    // ResizeObserver for dynamic resizes
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    resizeObserver.observe(container);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (container) {
        container._leaflet_id = null;
        container.innerHTML = '';
      }
    };
  }, []);

  // Render Base64 SVG Location Pins when filteredRegions or selectedRegion changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!markersLayerRef.current) {
      markersLayerRef.current = L.layerGroup().addTo(map);
    } else {
      markersLayerRef.current.clearLayers();
    }

    filteredRegions.forEach((region) => {
      const isSelected = selectedRegion.id === region.id;
      const badge = getTierBadge(region.tier, region.intensity);

      const pinIcon = createSvgPinIcon(badge.dot, isSelected);

      const marker = L.marker([region.lat, region.lon], { 
        icon: pinIcon, 
        zIndexOffset: isSelected ? 1000 : 0 
      });

      // Outer Ambient Glow Pulse Circle
      if (isSelected) {
        const glowMarker = L.circleMarker([region.lat, region.lon], {
          radius: 18,
          fillColor: badge.dot,
          fillOpacity: 0.35,
          color: badge.dot,
          weight: 1,
          opacity: 0.8,
          interactive: false
        });
        markersLayerRef.current.addLayer(glowMarker);
      }

      // Permanent Dark Datacenter Badge & Intensity Tooltip Label
      marker.bindTooltip(`
        <div style="
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(10, 13, 22, 0.95);
          border: 1px solid ${isSelected ? badge.dot : 'rgba(255, 255, 255, 0.12)'};
          padding: 3px 8px;
          border-radius: 9999px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.6);
          font-family: ui-monospace, monospace;
          font-size: 10px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
          pointer-events: none;
        ">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: ${badge.dot};"></span>
          <span>${region.name.split(',')[0]}</span>
          <span style="color: ${badge.dot};">${region.intensity}g</span>
        </div>
      `, {
        permanent: true,
        direction: 'bottom',
        offset: [0, 4],
        className: 'datacenter-label-tooltip'
      });

      // Pin Click Event
      marker.on('click', () => {
        setSelectedRegion(region);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.panTo([region.lat, region.lon], { animate: true, duration: 0.8 });
        }
      });

      markersLayerRef.current.addLayer(marker);
    });
  }, [filteredRegions, selectedRegion]);

  const handleSelectRegionFromList = (region) => {
    setSelectedRegion(region);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo([region.lat, region.lon], { animate: true, duration: 0.8 });
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2 animate-fade-up">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-medium self-start">
            <Globe size={13} weight="bold" />
            <span>CLOUD REGION GRID TELEMETRY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Global Cloud Energy Grid Map
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Real-time grid carbon intensity coefficients (<strong className="text-slate-800 dark:text-slate-200">g CO2e / kWh</strong>), Power Usage Effectiveness (<strong className="text-slate-800 dark:text-slate-200">PUE</strong>), and energy generation mix across cloud regions.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-white/[0.04] p-1.5 rounded-2xl border border-slate-200 dark:border-white/[0.06] shrink-0">
          <span className="text-[11px] font-mono font-bold text-slate-500 px-2 flex items-center gap-1">
            <Funnel size={13} weight="bold" /> Tier:
          </span>
          {['All', 'clean', 'moderate', 'high'].map((t) => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`btn-press px-3 py-1 rounded-xl text-xs font-semibold uppercase transition cursor-pointer ${
                tierFilter === t 
                  ? 'bg-emerald-500 text-slate-950 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive Real World Map (2/3) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl flex flex-col gap-4 relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] pb-3">
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase flex items-center gap-2">
              <MapPin size={15} weight="fill" className="text-emerald-500 dark:text-emerald-400" />
              <span>Interactive Real World Grid Map</span>
            </h3>
            <div className="flex items-center gap-3.5 text-[11px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Clean (&lt;150g)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Moderate
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> High (&gt;400g)
              </span>
            </div>
          </div>

          {/* Real World Map Container */}
          <div className="relative w-full rounded-2xl border border-slate-200 dark:border-white/[0.08] overflow-hidden shadow-inner bg-[#060912] dark-map-tiles">
            <div 
              ref={mapContainerRef} 
              style={{ width: '100%', height: '440px', background: '#060912' }} 
              className="rounded-2xl z-10" 
              role="application"
              aria-label="Global Cloud Regions Leaflet Map"
            />
          </div>

          {/* Quick Select Datacenter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200 dark:border-white/[0.06]">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">Quick Select:</span>
            {REGIONS.map((r) => {
              const badge = getTierBadge(r.tier, r.intensity);
              const isSel = selectedRegion.id === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => handleSelectRegionFromList(r)}
                  className={`btn-press px-2.5 py-1 rounded-xl text-[11px] font-mono transition cursor-pointer flex items-center gap-1.5 border ${
                    isSel 
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-sm' 
                      : 'bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/[0.06] hover:border-slate-300 dark:hover:border-white/[0.12]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: badge.dot }}></span>
                  <span>{r.name.split(',')[0]}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Selected Data Center Inspector Panel (1/3) */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl flex flex-col gap-5 shadow-2xl">
          
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.06] pb-3">
            <h3 className="text-xs font-mono font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase flex items-center gap-2">
              <HardDrives size={15} weight="duotone" className="text-emerald-500 dark:text-emerald-400" />
              <span>Data Center Inspector</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500">{selectedRegion.provider}</span>
          </div>

          {/* Region Title & Badge */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{selectedRegion.name}</h4>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]">
                {selectedRegion.id}
              </span>
            </div>

            <div className={`self-start px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${getTierBadge(selectedRegion.tier, selectedRegion.intensity).bg}`}>
              {getTierBadge(selectedRegion.tier, selectedRegion.intensity).label}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-3 rounded-2xl flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Grid Intensity</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {selectedRegion.intensity} <span className="text-[11px] font-normal text-slate-500">gCO2e</span>
              </span>
            </div>

            <div className="glass-card p-3 rounded-2xl flex flex-col gap-0.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Power PUE</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
                {selectedRegion.pue.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Energy Mix Breakdown Bars */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              Generation Mix
            </span>
            
            <div className="flex flex-col gap-2">
              {Object.entries(selectedRegion.mix).map(([source, pct]) => (
                <div key={source} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="capitalize text-slate-700 dark:text-slate-300">{source}</span>
                    <span className="text-slate-500">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/[0.06] overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GreenOps Recommendation */}
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.06] text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
            <Sparkle size={16} weight="fill" className="text-emerald-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{selectedRegion.recommendation}</p>
          </div>

        </div>

      </div>

      {/* Regional Carbon Savings Migration Estimator */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl flex flex-col gap-5 shadow-2xl">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Migration Estimator</span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Simulate Cloud Region Relocation Impact</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select your current deployment region and target green region to calculate potential infrastructure carbon reductions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
          
          {/* Source Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-slate-500">Current Workload Region:</label>
            <select
              value={sourceRegionId}
              onChange={(e) => setSourceRegionId(e.target.value)}
              aria-label="Current Workload Region"
              className="glass-input p-2.5 rounded-xl text-xs font-mono font-bold focus:outline-none cursor-pointer"
            >
              {REGIONS.map(r => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                  {r.name} ({r.id}) - {r.intensity} gCO2e/kWh
                </option>
              ))}
            </select>
          </div>

          {/* Target Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-slate-500">Target Clean Region:</label>
            <select
              value={targetRegionId}
              onChange={(e) => {
                const newTgt = e.target.value;
                setTargetRegionId(newTgt);
                const tgtObj = REGIONS.find(r => r.id === newTgt);
                if (tgtObj) setSelectedRegion(tgtObj);
              }}
              aria-label="Target Clean Region"
              className="glass-input p-2.5 rounded-xl text-xs font-mono font-bold focus:outline-none cursor-pointer"
            >
              {REGIONS.map(r => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                  {r.name} ({r.id}) - {r.intensity} gCO2e/kWh
                </option>
              ))}
            </select>
          </div>

          {/* Carbon Reduction Result Card */}
          <div className="glass-card p-4 rounded-2xl border border-emerald-500/25 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Est. Carbon Reduction</span>
              <span className={`text-xl font-bold font-mono ${Number(savingsPct) > 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400'}`}>
                {Number(savingsPct) > 0 ? `-${savingsPct}%` : `+${Math.abs(savingsPct)}%`}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <TrendDown size={20} weight="bold" />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
