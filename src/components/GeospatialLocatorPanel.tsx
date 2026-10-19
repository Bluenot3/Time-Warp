import React, { useState } from 'react';
import {
  Compass,
  ExternalLink,
  Globe,
  Layers,
  MapPin,
  Navigation,
  X,
} from 'lucide-react';
import { HistoricalSceneBlueprint, WorldCityNode, ZoomTier } from '../types/history';
import { getWorldCitiesForYear } from '../data/presets';

interface GeospatialLocatorPanelProps {
  blueprint: HistoricalSceneBlueprint;
  zoomTier: ZoomTier;
  isOpen: boolean;
  onClose: () => void;
  onQuickCoordinateSelect: (lat: number, lng: number, label: string) => void;
  onSelectWorldCity: (cityNode: WorldCityNode) => void;
  onZoomTierChange: (tier: ZoomTier) => void;
}

type MapTileMode = 'satellite' | 'street' | 'topographic';

/**
 * Converts latitude/longitude and zoom to slippy-map tile coordinates (X, Y)
 */
function latLngToTileXY(
  lat: number,
  lng: number,
  zoom: number
): { x: number; y: number; offsetX: number; offsetY: number } {
  const n = Math.pow(2, zoom);
  const xFloat = ((lng + 180) / 360) * n;
  const clampedLat = Math.max(-85, Math.min(85, lat));
  const latRad = (clampedLat * Math.PI) / 180;
  const yFloat =
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n;

  const x = Math.floor(xFloat);
  const y = Math.floor(yFloat);
  const offsetX = (xFloat - x) * 256;
  const offsetY = (yFloat - y) * 256;
  return { x, y, offsetX, offsetY };
}

function getTileUrl(mode: MapTileMode, z: number, x: number, y: number): string {
  const n = Math.pow(2, z);
  const wrappedX = ((x % n) + n) % n;
  const clampedY = Math.max(0, Math.min(n - 1, y));
  if (mode === 'satellite') {
    return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${clampedY}/${wrappedX}`;
  }
  if (mode === 'topographic') {
    return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/${z}/${clampedY}/${wrappedX}`;
  }
  return `https://tile.openstreetmap.org/${z}/${wrappedX}/${clampedY}.png`;
}

export const GeospatialLocatorPanel: React.FC<GeospatialLocatorPanelProps> = ({
  blueprint,
  zoomTier,
  isOpen,
  onClose,
  onQuickCoordinateSelect,
  onSelectWorldCity,
  onZoomTierChange,
}) => {
  const [tileMode, setTileMode] = useState<MapTileMode>('satellite');
  const [zoom, setZoom] = useState<number>(15);

  if (!isOpen) return null;

  const centerTile = latLngToTileXY(blueprint.lat, blueprint.lng, zoom);
  const gridOffsets = [-1, 0, 1];
  const worldCities = getWorldCitiesForYear(blueprint.year);

  return (
    <aside
      className="fixed top-16 right-5 z-30 w-[400px] max-w-[92vw] max-h-[calc(100vh-140px)] flex flex-col bg-[#0D0F12]/95 border border-[#F5F2EB]/16 rounded-lg shadow-2xl overflow-hidden text-[#F5F2EB]"
      aria-label="Geospatial Map and Global Multi-City Radar"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#F5F2EB]/12 shrink-0">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#E5A93C]" />
          <h2 className="font-display text-sm font-semibold tracking-wide text-[#F5F2EB]">
            Geospatial Radar &amp; Global Cities ({blueprint.year < 1000 ? `AD ${blueprint.year}` : blueprint.year})
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-[#F5F2EB]/60 hover:text-[#F5F2EB] transition-colors"
          aria-label="Close Geospatial Map"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 divide-y divide-[#F5F2EB]/10">
        {/* Interactive Multi-Tile Satellite / Street / Topographic Map Viewport */}
        <div className="relative w-full h-52 bg-[#07090C] overflow-hidden">
          <div
            className="absolute"
            style={{
              width: 768,
              height: 768,
              left: `calc(50% - ${256 + centerTile.offsetX}px)`,
              top: `calc(50% - ${256 + centerTile.offsetY}px)`,
            }}
          >
            {gridOffsets.map((dy) =>
              gridOffsets.map((dx) => {
                const tx = centerTile.x + dx;
                const ty = centerTile.y + dy;
                return (
                  <img
                    key={`${tileMode}-${zoom}-${tx}-${ty}`}
                    src={getTileUrl(tileMode, zoom, tx, ty)}
                    alt={`Geospatial tile ${tx},${ty}`}
                    referrerPolicy="no-referrer"
                    className="absolute w-64 h-64 object-cover select-none pointer-events-none"
                    style={{
                      left: (dx + 1) * 256,
                      top: (dy + 1) * 256,
                      filter:
                        blueprint.year <= 1945 && tileMode !== 'satellite'
                          ? 'sepia(0.45) contrast(1.1) brightness(0.85)'
                          : 'contrast(1.05)',
                    }}
                  />
                );
              })
            )}
          </div>

          {/* Azimuth Street Vector Reticle Overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-36 h-36 rounded-full border border-[#E5A93C]/40 flex items-center justify-center">
              <div
                className="w-32 h-0.5 bg-[#E5A93C]/70"
                style={{ transform: `rotate(${blueprint.streetAzimuth}deg)` }}
              />
            </div>
            <div className="absolute w-3.5 h-3.5 rounded-full bg-[#E5A93C] border-2 border-[#090B0E] shadow-md" />
          </div>

          {/* Layer Switcher Controls */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-[#0D0F12]/90 p-1 rounded border border-[#F5F2EB]/15">
            {(['satellite', 'street', 'topographic'] as MapTileMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setTileMode(m)}
                className={`px-2 py-1 text-[11px] font-medium rounded capitalize transition-colors whitespace-nowrap shrink-0 ${
                  tileMode === m
                    ? 'bg-[#E5A93C] text-[#090B0E] font-semibold'
                    : 'text-[#F5F2EB]/75 hover:text-[#F5F2EB]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Map Zoom Controls (Z3 Global to Z18 Street) */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 bg-[#0D0F12]/90 p-1 rounded border border-[#F5F2EB]/15">
            <button
              type="button"
              onClick={() => setZoom(4)}
              className="px-1.5 py-0.5 text-[10px] font-mono text-[#E5A93C] hover:underline"
              title="Zoom Map Out to Continental View"
            >
              World
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(3, z - 2))}
              className="px-2 py-0.5 text-xs font-mono text-[#F5F2EB] hover:text-[#E5A93C]"
              title="Zoom Out"
            >
              −
            </button>
            <span className="px-1 text-[11px] font-mono tabular-nums text-[#F5F2EB]/80">
              Z{zoom}
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(18, z + 2))}
              className="px-2 py-0.5 text-xs font-mono text-[#F5F2EB] hover:text-[#E5A93C]"
              title="Zoom In"
            >
              +
            </button>
          </div>
        </div>

        {/* 3D Camera Altitude / Multi-City Theater Switcher */}
        <div className="p-3.5 bg-[#12151C]">
          <div className="text-[11px] text-[#F5F2EB]/65 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium text-[#F5F2EB]">
              <Globe className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>3D Viewport Altitude &amp; Multi-City Zoom</span>
            </span>
            <span className="font-mono text-[10px] text-[#E5A93C]">Scroll Wheel Enabled</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(
              [
                { id: 'street', label: 'Street (1x)', desc: 'Close-up actors' },
                { id: 'district', label: 'District (5x)', desc: '6-block grid' },
                { id: 'world', label: 'World (30x)', desc: 'All 17 cities' },
              ] as Array<{ id: ZoomTier; label: string; desc: string }>
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onZoomTierChange(t.id)}
                className={`p-2 rounded border text-left transition-colors ${
                  zoomTier === t.id
                    ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-[#F5F2EB]'
                    : 'bg-[#171B24] border-[#F5F2EB]/12 text-[#F5F2EB]/75 hover:border-[#F5F2EB]/30'
                }`}
              >
                <div className="text-xs font-semibold text-[#E5A93C]">{t.label}</div>
                <div className="text-[10px] text-[#F5F2EB]/65 mt-0.5">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Geodesic Metadata & 4-Way Cardinal Sector Stepping */}
        <div className="p-3.5 space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-[#F5F2EB]/70 font-mono tabular-nums">
            <span>
              {blueprint.lat.toFixed(4)}° N · {blueprint.lng.toFixed(4)}° E
            </span>
            <span>Azimuth {blueprint.streetAzimuth}°</span>
          </div>

          <div className="text-xs font-medium text-[#F5F2EB] leading-snug">
            {blueprint.address}
          </div>

          <div className="pt-1">
            <div className="text-[11px] text-[#F5F2EB]/55 mb-1.5 flex items-center gap-1.5">
              <Navigation className="w-3 h-3 text-[#E5A93C]" />
              <span>Traverse to Neighboring District Sectors</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() =>
                  onQuickCoordinateSelect(
                    blueprint.lat + 0.004,
                    blueprint.lng,
                    `North District of ${blueprint.city}`
                  )
                }
                className="px-2.5 py-1.5 text-[11px] bg-[#161920] hover:bg-[#1E232D] border border-[#F5F2EB]/12 rounded text-left transition-colors truncate"
              >
                ↑ North District (+450m)
              </button>
              <button
                type="button"
                onClick={() =>
                  onQuickCoordinateSelect(
                    blueprint.lat - 0.004,
                    blueprint.lng,
                    `South District of ${blueprint.city}`
                  )
                }
                className="px-2.5 py-1.5 text-[11px] bg-[#161920] hover:bg-[#1E232D] border border-[#F5F2EB]/12 rounded text-left transition-colors truncate"
              >
                ↓ South District (−450m)
              </button>
              <button
                type="button"
                onClick={() =>
                  onQuickCoordinateSelect(
                    blueprint.lat,
                    blueprint.lng - 0.005,
                    `West Sector of ${blueprint.city}`
                  )
                }
                className="px-2.5 py-1.5 text-[11px] bg-[#161920] hover:bg-[#1E232D] border border-[#F5F2EB]/12 rounded text-left transition-colors truncate"
              >
                ← West Sector (−450m)
              </button>
              <button
                type="button"
                onClick={() =>
                  onQuickCoordinateSelect(
                    blueprint.lat,
                    blueprint.lng + 0.005,
                    `East Sector of ${blueprint.city}`
                  )
                }
                className="px-2.5 py-1.5 text-[11px] bg-[#161920] hover:bg-[#1E232D] border border-[#F5F2EB]/12 rounded text-left transition-colors truncate"
              >
                → East Sector (+450m)
              </button>
            </div>
          </div>
        </div>

        {/* Simultaneous Global Cities Live Feed for Current Year */}
        <div className="p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E5A93C]">
              What’s Happening Across Other Cities ({blueprint.year < 1000 ? `AD ${blueprint.year}` : blueprint.year})
            </span>
          </div>
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {worldCities.map((c) => {
              const isActive =
                c.city.toLowerCase().includes(blueprint.city.toLowerCase()) ||
                blueprint.city.toLowerCase().includes(c.city.toLowerCase());
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onSelectWorldCity(c)}
                  className={`w-full text-left p-2 rounded border transition-colors ${
                    isActive
                      ? 'bg-[#10B981]/15 border-[#10B981]'
                      : 'bg-[#151820] border-[#F5F2EB]/10 hover:border-[#E5A93C]/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-[#F5F2EB]">
                    <span>
                      {c.city}, {c.country}
                    </span>
                    <span className="text-[10px] font-mono text-[#E5A93C]">
                      {isActive ? 'ACTIVE' : 'Fly Here ↗'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#F5F2EB]/75 mt-0.5 line-clamp-1">
                    {c.yearHeadline}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* External Google Earth Link & Grounding Citations */}
        <div className="p-3.5 space-y-2 text-xs">
          <a
            href={`https://www.google.com/maps/@${blueprint.lat},${blueprint.lng},18z/data=!3m1!1e3`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#E5A93C] hover:underline font-medium"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Open Coordinates in Google Earth / Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {blueprint.groundingSources && blueprint.groundingSources.length > 0 && (
            <div className="pt-2 border-t border-[#F5F2EB]/10 space-y-1">
              <div className="text-[11px] text-[#F5F2EB]/55 flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-[#E5A93C]" />
                <span>Verified Grounding Citations</span>
              </div>
              {blueprint.groundingSources.slice(0, 3).map((src, i) => (
                <a
                  key={i}
                  href={src.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-[11px] text-[#F5F2EB]/80 hover:text-[#E5A93C] py-0.5 truncate"
                >
                  <span className="truncate">{src.title}</span>
                  <ExternalLink className="w-3 h-3 shrink-0 ml-1" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
