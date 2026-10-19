import React, { useCallback, useEffect, useState } from 'react';
import {
  Building2,
  Car,
  ChevronDown,
  ChevronUp,
  Compass,
  Eye,
  Film,
  Footprints,
  Globe,
  History,
  Layers,
  Lock,
  MapPin,
  Search,
  Sparkles,
  Sun,
  Unlock,
  User,
  Volume2,
  VolumeX,
  X,
  ZoomOut,
} from 'lucide-react';
import {
  CameraMode,
  GranularEntityRecord,
  HistoricalHotspot,
  HistoricalSceneBlueprint,
  WorldCityNode,
  ZoomTier,
} from './types/history';
import {
  HISTORICAL_PRESETS,
  buildFallbackBlueprint,
  getPresetById,
  getWorldCitiesForYear,
} from './data/presets';
import { HistoricalStage3D } from './components/HistoricalStage3D';
import { GeospatialLocatorPanel } from './components/GeospatialLocatorPanel';
import { ArchivalDossierDrawer } from './components/ArchivalDossierDrawer';
import { soundscapeEngine } from './engine/SoundscapeEngine';

const TIMELINE_TICKS = [
  { year: 80, label: '80 AD Colosseum' },
  { year: 1050, label: '1050 Chaco' },
  { year: 1880, label: '1880 Gilded Age' },
  { year: 1906, label: '1906 SF Quake' },
  { year: 1927, label: '1927 Jazz Age' },
  { year: 1932, label: '1932 Depression' },
  { year: 1940, label: '1940 The Blitz' },
  { year: 1944, label: '1944 Liberation' },
  { year: 1961, label: '1961 Cold War' },
  { year: 1989, label: '1989 Wall Falls' },
  { year: 2024, label: 'Present' },
];

// Non-linear timeline mapping so 1900–2026 has 72% of slider precision while 80 AD–1900 has 28%
function yearToSliderVal(year: number): number {
  if (year <= 1900) {
    return ((year - 80) / (1900 - 80)) * 280;
  }
  return 280 + ((year - 1900) / (2026 - 1900)) * 720;
}

function sliderValToYear(val: number): number {
  if (val <= 280) {
    return Math.round(80 + (val / 280) * (1900 - 80));
  }
  return Math.round(1900 + ((val - 280) / 720) * (2026 - 1900));
}

function formatSolarHour(hour: number): string {
  const h = Math.floor(hour) % 24;
  const m = Math.floor((hour % 1) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function App() {
  const [blueprint, setBlueprint] = useState<HistoricalSceneBlueprint>(
    () => HISTORICAL_PRESETS[0]
  );
  const [addressInput, setAddressInput] = useState<string>(
    HISTORICAL_PRESETS[0].address
  );
  const [yearInput, setYearInput] = useState<number>(HISTORICAL_PRESETS[0].year);
  const [promptInput, setPromptInput] = useState<string>('');
  const [cameraMode, setCameraMode] = useState<CameraMode>('orbit');
  const [zoomTier, setZoomTier] = useState<ZoomTier>('street');

  // New High-Quality Visual & Simulation States
  const [solarHour, setSolarHour] = useState<number>(15.5); // Golden afternoon default
  const [xrayCutaway, setXrayCutaway] = useState<boolean>(false);
  const [cinematicBloom, setCinematicBloom] = useState<boolean>(true);
  const [selectedEntity, setSelectedEntity] =
    useState<GranularEntityRecord | null>(null);
  const [followedEntityId, setFollowedEntityId] = useState<string | null>(null);

  const [selectedHotspot, setSelectedHotspot] =
    useState<HistoricalHotspot | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<{
    hotspot: HistoricalHotspot;
    x: number;
    y: number;
  } | null>(null);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [isGeoPanelOpen, setIsGeoPanelOpen] = useState<boolean>(true);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);

  useEffect(() => {
    soundscapeEngine.updateMode(blueprint.reenactmentMode);
  }, [blueprint.reenactmentMode]);

  const handleToggleAudio = () => {
    const isNowPlaying = soundscapeEngine.toggleAudio(blueprint.reenactmentMode);
    setIsAudioMuted(!isNowPlaying);
  };

  const reconstructScene = useCallback(
    async (targetAddress: string, targetYear: number, customFocus: string) => {
      const clampedYear = Math.max(80, Math.min(2026, Math.round(targetYear)));
      setIsGenerating(true);
      setStatusBanner(
        `Synthesizing 3D geospatial & archival reconstruction for "${targetAddress}" (${
          clampedYear < 1000 ? `${clampedYear} AD` : clampedYear
        })...`
      );
      setSelectedHotspot(null);
      setSelectedEntity(null);
      setFollowedEntityId(null);

      try {
        const res = await fetch('/api/reconstruct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: targetAddress,
            year: clampedYear,
            customPrompt: customFocus,
          }),
        });

        if (!res.ok) {
          throw new Error(`Server returned ${res.status}`);
        }

        const data = (await res.json()) as HistoricalSceneBlueprint;
        if (data && data.address && Array.isArray(data.hotspots)) {
          setBlueprint(data);
          setAddressInput(data.address);
          setYearInput(data.year);
          setStatusBanner(null);
          setIsGenerating(false);
          return;
        }
      } catch {
        // Fallback to client-side procedural synthesis
      }

      const fallback = buildFallbackBlueprint(
        targetAddress,
        clampedYear,
        customFocus
      );
      setBlueprint(fallback);
      setAddressInput(fallback.address);
      setYearInput(fallback.year);
      setStatusBanner(null);
      setIsGenerating(false);
    },
    []
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    reconstructScene(addressInput.trim(), yearInput, promptInput.trim());
  };

  const handleSelectPreset = (presetId: string) => {
    const found = getPresetById(presetId);
    if (!found) return;
    setBlueprint(found);
    setAddressInput(found.address);
    setYearInput(found.year);
    setPromptInput('');
    setSelectedHotspot(null);
    setSelectedEntity(null);
    setFollowedEntityId(null);
    setIsPresetsOpen(false);
    setZoomTier('street');
    if (found.weatherMood === 'wwii_night_blitz') {
      setSolarHour(22.5);
    } else {
      setSolarHour(15.5);
    }
  };

  const handleSelectWorldCity = useCallback(
    (cityNode: WorldCityNode) => {
      if (cityNode.presetId) {
        const preset = getPresetById(cityNode.presetId);
        if (preset && Math.abs(preset.year - yearInput) <= 6) {
          setBlueprint(preset);
          setAddressInput(preset.address);
          setYearInput(preset.year);
          setSelectedHotspot(null);
          setSelectedEntity(null);
          setFollowedEntityId(null);
          setZoomTier('street');
          return;
        }
      }
      setZoomTier('street');
      reconstructScene(cityNode.address, yearInput, cityNode.activeHeadline);
    },
    [reconstructScene, yearInput]
  );

  const handleTimelineScrub = (newYear: number) => {
    const clamped = Math.max(80, Math.min(2026, newYear));
    setYearInput(clamped);
    const matchingPreset = HISTORICAL_PRESETS.find(
      (p) =>
        p.year === clamped &&
        p.city.toLowerCase() === blueprint.city.toLowerCase()
    );
    if (matchingPreset) {
      setBlueprint(matchingPreset);
      setAddressInput(matchingPreset.address);
      setSelectedHotspot(null);
      setSelectedEntity(null);
      setFollowedEntityId(null);
      return;
    }

    const updated = buildFallbackBlueprint(
      addressInput || blueprint.address,
      clamped,
      promptInput
    );
    updated.lat = blueprint.lat;
    updated.lng = blueprint.lng;
    updated.city = blueprint.city;
    updated.country = blueprint.country;
    setBlueprint(updated);
  };

  const handleHoverHotspot = useCallback(
    (
      hotspot: HistoricalHotspot | null,
      screenPos: { x: number; y: number } | null
    ) => {
      if (hotspot && screenPos) {
        setHoveredHotspot({ hotspot, x: screenPos.x, y: screenPos.y });
      } else {
        setHoveredHotspot(null);
      }
    },
    []
  );

  const handleSelectHotspot = useCallback(
    (hotspot: HistoricalHotspot | null) => {
      setSelectedHotspot(hotspot);
      if (hotspot) {
        setSelectedEntity(null);
        setFollowedEntityId(null);
        setIsDossierOpen(true);
      }
    },
    []
  );

  const handleSelectEntity = useCallback(
    (entity: GranularEntityRecord | null) => {
      setSelectedEntity(entity);
      if (!entity) {
        setFollowedEntityId(null);
      }
    },
    []
  );

  const sliderVal = yearToSliderVal(yearInput);
  const activeWorldCities = getWorldCitiesForYear(yearInput);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0b0d11] text-[#f5f2eb] select-none">
      {/* ===================================================================== */}
      {/* 100vw x 100vh FULL-VIEWPORT 3D HISTORICAL STAGE                       */}
      {/* ===================================================================== */}
      <HistoricalStage3D
        blueprint={blueprint}
        cameraMode={cameraMode}
        zoomTier={zoomTier}
        solarHour={solarHour}
        xrayCutaway={xrayCutaway}
        cinematicBloom={cinematicBloom}
        selectedHotspot={selectedHotspot}
        selectedEntity={selectedEntity}
        followedEntityId={followedEntityId}
        onSelectHotspot={handleSelectHotspot}
        onSelectEntity={handleSelectEntity}
        onFollowEntity={setFollowedEntityId}
        onHoverHotspot={handleHoverHotspot}
        onSelectWorldCity={handleSelectWorldCity}
        onZoomTierChange={setZoomTier}
      />

      {/* ===================================================================== */}
      {/* TOP BAR: OMNI-SEARCH (ANY ADDRESS + ANY YEAR 80 AD–2026 + PRESETS)    */}
      {/* ===================================================================== */}
      <header className="fixed top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Brand Identity + Search Bar */}
        <form
          onSubmit={handleFormSubmit}
          className="pointer-events-auto flex flex-wrap sm:flex-nowrap items-center gap-2 bg-[#0b0d11]/90 backdrop-blur-md border border-white/15 rounded-lg p-1.5 shadow-2xl max-w-4xl flex-1"
        >
          <div className="flex items-center gap-2 px-2.5 py-1 border-r border-white/10">
            <Compass className="w-5 h-5 text-[#e5a93c] shrink-0" />
            <div className="hidden md:block">
              <div className="font-serif text-xs font-bold tracking-wider uppercase text-[#f5f2eb] leading-none">
                Chronos Earth
              </div>
              <div className="font-mono text-[9px] text-[#e5a93c] tracking-widest uppercase mt-0.5">
                80 AD – 2026 3D Engine
              </div>
            </div>
          </div>

          {/* Address Input */}
          <div className="relative flex-1 min-w-[170px]">
            <MapPin className="w-3.5 h-3.5 text-[#e5a93c] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="Enter any street address, monument, or city..."
              className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.09] text-xs text-[#f5f2eb] placeholder-[#a39e93]/60 pl-8 pr-2.5 py-2 rounded border border-transparent focus:border-[#e5a93c]/60 focus:outline-none transition-colors"
            />
          </div>

          {/* Direct Year Input (80 AD – 2026) */}
          <div className="flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded px-2 py-1">
            <span className="font-mono text-[9px] uppercase text-[#a39e93]">
              Year
            </span>
            <input
              type="number"
              min={80}
              max={2026}
              value={yearInput}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!Number.isNaN(val)) {
                  setYearInput(val);
                }
              }}
              onBlur={() => handleTimelineScrub(yearInput)}
              className="w-14 bg-transparent font-mono text-xs font-bold text-[#e5a93c] text-center focus:outline-none"
              title="Enter any year from 80 AD to 2026"
            />
          </div>

          {/* Optional Event Focus Input */}
          <div className="hidden xl:block w-48">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Focus (e.g. Breadline, WWII Blitz)..."
              className="w-full bg-white/[0.04] hover:bg-white/[0.07] focus:bg-white/[0.09] text-xs text-[#f5f2eb] placeholder-[#a39e93]/60 px-2.5 py-2 rounded border border-transparent focus:border-[#e5a93c]/60 focus:outline-none transition-colors"
            />
          </div>

          {/* Submit Reconstruct Button */}
          <button
            type="submit"
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#e5a93c] hover:bg-[#f0b84d] disabled:opacity-50 text-[#0b0d11] font-mono text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Building...' : 'Time Travel'}</span>
          </button>

          {/* Curated Historical Presets Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsPresetsOpen((prev) => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-mono text-[#f5f2eb] transition-colors cursor-pointer"
              title="Curated Historical Reenactments (80 AD – Present)"
            >
              <History className="w-3.5 h-3.5 text-[#e5a93c]" />
              <span className="hidden sm:inline">Eras</span>
              {isPresetsOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#a39e93]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#a39e93]" />
              )}
            </button>

            {isPresetsOpen && (
              <div className="absolute right-0 mt-2 w-84 max-h-[72vh] overflow-y-auto bg-[#0b0d11]/95 backdrop-blur-xl border border-white/15 rounded-lg shadow-2xl p-2 z-30 space-y-1">
                <div className="px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-[#a39e93] border-b border-white/10">
                  Verified 3D Historical Reenactments (80 AD – 2026)
                </div>
                {HISTORICAL_PRESETS.map((preset) => {
                  const isActive =
                    preset.id === blueprint.id && preset.year === blueprint.year;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`w-full text-left px-2.5 py-2 rounded transition-colors flex items-start justify-between gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-[#e5a93c]/20 border border-[#e5a93c]/40'
                          : 'hover:bg-white/[0.06]'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-[#f5f2eb]">
                          {preset.title}
                        </div>
                        <div className="text-[11px] text-[#a39e93] truncate max-w-[215px]">
                          {preset.address}
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#e5a93c] shrink-0">
                        {preset.year < 1000 ? `${preset.year} AD` : preset.year}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </form>

        {/* Top-Right Utility Controls (World Zoom + Geospatial Radar + Dossier + Audio) */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setZoomTier((prev) => (prev === 'world' ? 'street' : 'world'))
            }
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-mono uppercase tracking-wider transition-colors backdrop-blur-md cursor-pointer ${
              zoomTier === 'world'
                ? 'bg-[#38bdf8]/20 border-[#38bdf8]/60 text-[#38bdf8]'
                : 'bg-[#0b0d11]/85 border-white/15 text-[#f5f2eb] hover:bg-white/10'
            }`}
            title="Zoom all the way out to see all 17 world cities and what is happening simultaneously"
          >
            <ZoomOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {zoomTier === 'world'
                ? 'Return to Street (1x)'
                : `World Theater (${activeWorldCities.length} Cities)`}
            </span>
          </button>

          {!isGeoPanelOpen && (
            <button
              type="button"
              onClick={() => setIsGeoPanelOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0b0d11]/85 hover:bg-[#0b0d11] border border-white/15 text-xs font-mono text-[#f5f2eb] shadow-lg backdrop-blur-md transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span className="hidden sm:inline">Radar & Cities</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsDossierOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-mono transition-colors backdrop-blur-md cursor-pointer ${
              isDossierOpen
                ? 'bg-[#e5a93c]/20 border-[#e5a93c]/50 text-[#e5a93c]'
                : 'bg-[#0b0d11]/85 border-white/15 text-[#f5f2eb] hover:bg-[#0b0d11]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Archival Dossier</span>
          </button>

          <button
            type="button"
            onClick={handleToggleAudio}
            className={`p-2 rounded-lg border transition-colors backdrop-blur-md cursor-pointer ${
              !isAudioMuted
                ? 'bg-[#e5a93c]/20 border-[#e5a93c]/50 text-[#e5a93c]'
                : 'bg-[#0b0d11]/85 border-white/15 text-[#a39e93] hover:text-[#f5f2eb]'
            }`}
            title={
              isAudioMuted
                ? 'Enable Era Ambient Soundscape'
                : 'Mute Ambient Soundscape'
            }
          >
            {isAudioMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* ACTIVE SCENE HEADLINE BANNER + ERA COMPARISON BAR                     */}
      {/* ===================================================================== */}
      <div className="fixed top-20 left-4 z-10 pointer-events-none max-w-md space-y-2">
        <div className="bg-[#0b0d11]/80 backdrop-blur-md border-l-2 border-[#e5a93c] pl-3 pr-4 py-2 rounded-r shadow-lg pointer-events-auto">
          <div className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-widest text-[#e5a93c]">
            <span>
              {blueprint.year < 1000
                ? `${blueprint.year} AD`
                : blueprint.year}{' '}
              · {blueprint.eraLabel}
            </span>
            <span className="text-[#38bdf8]">
              {formatSolarHour(solarHour)} Solar
            </span>
          </div>
          <h1 className="font-serif text-base sm:text-lg font-semibold text-[#f5f2eb] leading-snug">
            {blueprint.title}
          </h1>
          <p className="text-[11px] text-[#a39e93] line-clamp-2 mt-0.5">
            {blueprint.summary}
          </p>

          {/* Instant Same-Address Era Comparison Strip */}
          <div className="mt-2 pt-2 border-t border-white/10 flex items-center gap-1 flex-wrap">
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#a39e93] mr-1">
              Compare Same Address:
            </span>
            {[
              { label: '1927 Boom', yr: 1927 },
              { label: '1932 Depression', yr: 1932 },
              { label: '1944 WWII', yr: 1944 },
              { label: '2024 Modern', yr: 2024 },
            ].map((cmp) => (
              <button
                key={cmp.yr}
                type="button"
                onClick={() => handleTimelineScrub(cmp.yr)}
                className={`px-1.5 py-0.5 rounded font-mono text-[9px] transition-colors cursor-pointer ${
                  blueprint.year === cmp.yr
                    ? 'bg-[#e5a93c] text-[#0b0d11] font-bold'
                    : 'bg-white/[0.06] hover:bg-white/[0.14] text-[#f5f2eb]'
                }`}
              >
                {cmp.label}
              </button>
            ))}
          </div>
        </div>

        {statusBanner && (
          <div className="bg-[#e5a93c]/20 border border-[#e5a93c]/50 backdrop-blur-md px-3 py-1.5 rounded text-xs font-mono text-[#e5a93c] animate-pulse">
            {statusBanner}
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* GRANULAR MICRO-INSPECTOR HUD CARD (CLICK ANY CITIZEN, VEHICLE, BLDG)  */}
      {/* ===================================================================== */}
      {selectedEntity && (
        <aside
          aria-label="Granular Entity Micro-Inspector"
          className="fixed left-4 bottom-28 z-20 w-80 sm:w-96 bg-[#0b0d11]/95 backdrop-blur-xl border border-[#e5a93c]/50 rounded-lg shadow-2xl p-3.5 text-[#f5f2eb]"
        >
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-[#e5a93c]/15 border border-[#e5a93c]/40 text-[#e5a93c]">
                {selectedEntity.entityType === 'citizen' ? (
                  <User className="w-4 h-4" />
                ) : selectedEntity.entityType === 'vehicle' ? (
                  <Car className="w-4 h-4" />
                ) : (
                  <Building2 className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#e5a93c]/20 text-[#e5a93c]">
                    {selectedEntity.entityType}
                  </span>
                  <span className="font-mono text-[10px] text-[#38bdf8]">
                    {selectedEntity.yearBadge}
                  </span>
                </div>
                <h2 className="font-serif text-sm font-semibold text-[#f5f2eb] mt-0.5 leading-snug">
                  {selectedEntity.name}
                </h2>
                <div className="text-[11px] text-[#e5a93c]">
                  {selectedEntity.roleOrClass}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedEntity(null);
                setFollowedEntityId(null);
              }}
              className="p-1 rounded hover:bg-white/10 text-[#a39e93] hover:text-white transition-colors cursor-pointer"
              title="Close Micro-Inspector"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Archival Micro-Biography */}
          <p className="text-xs text-[#f5f2eb]/90 leading-relaxed mt-2.5">
            {selectedEntity.microBiography}
          </p>

          {/* Granular Technical / Historical Specs Grid */}
          <div className="mt-3 grid grid-cols-1 gap-1.5 bg-white/[0.03] border border-white/10 rounded p-2">
            {selectedEntity.granularSpecs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center justify-between gap-2 text-[11px]"
              >
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#a39e93]">
                  {spec.label}
                </span>
                <span className="font-mono text-[#f5f2eb] font-medium text-right">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>

          {/* Archival Source & Follow Camera Lock Button */}
          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
            <div className="text-[10px] font-mono text-[#a39e93] truncate">
              Source: {selectedEntity.archivalSource}
            </div>

            <button
              type="button"
              onClick={() =>
                setFollowedEntityId((prev) =>
                  prev === selectedEntity.id ? null : selectedEntity.id
                )
              }
              className={`flex items-center gap-1 px-2.5 py-1 rounded font-mono text-[10px] uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                followedEntityId === selectedEntity.id
                  ? 'bg-[#38bdf8] text-[#0b0d11] font-bold'
                  : 'bg-[#e5a93c]/20 hover:bg-[#e5a93c]/35 text-[#e5a93c] border border-[#e5a93c]/40'
              }`}
            >
              {followedEntityId === selectedEntity.id ? (
                <>
                  <Unlock className="w-3 h-3" />
                  <span>Following (Unlock)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  <span>Lock & Follow</span>
                </>
              )}
            </button>
          </div>
        </aside>
      )}

      {/* ===================================================================== */}
      {/* FLOATING GEOSPATIAL LOCATOR & WORLD CITIES RADAR (TOP-RIGHT)          */}
      {/* ===================================================================== */}
      <GeospatialLocatorPanel
        blueprint={blueprint}
        zoomTier={zoomTier}
        isOpen={isGeoPanelOpen}
        onClose={() => setIsGeoPanelOpen(false)}
        onSelectWorldCity={handleSelectWorldCity}
        onZoomTierChange={setZoomTier}
        onNavigateOffset={(dLat, dLng, dirLabel) => {
          const nextLat = Number((blueprint.lat + dLat).toFixed(4));
          const nextLng = Number((blueprint.lng + dLng).toFixed(4));
          reconstructScene(
            `${blueprint.city} (${dirLabel} Sector ${nextLat}, ${nextLng})`,
            yearInput,
            promptInput
          );
        }}
      />

      {/* ===================================================================== */}
      {/* HOVER CALLOUT TOOLTIP FOR 3D HISTORICAL HOTSPOTS                      */}
      {/* ===================================================================== */}
      {hoveredHotspot && (
        <div
          className="fixed z-30 pointer-events-none px-3 py-2 rounded border border-[#e5a93c]/50 bg-[#0b0d11]/95 backdrop-blur-md shadow-xl max-w-xs"
          style={{
            left: Math.min(hoveredHotspot.x + 16, window.innerWidth - 260),
            top: Math.max(hoveredHotspot.y - 60, 16),
          }}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#e5a93c]">
            {hoveredHotspot.hotspot.yearBadge} · Click to Inspect
          </div>
          <div className="font-serif text-xs font-semibold text-[#f5f2eb] mt-0.5">
            {hoveredHotspot.hotspot.title}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* SLIDE-OVER ARCHIVAL DOSSIER DRAWER                                    */}
      {/* ===================================================================== */}
      <ArchivalDossierDrawer
        blueprint={blueprint}
        selectedHotspot={selectedHotspot}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        onSelectHotspot={handleSelectHotspot}
      />

      {/* ===================================================================== */}
      {/* BOTTOM DOCK: 80 AD–2026 TIMELINE + SOLAR CLOCK + X-RAY + 3-TIER ZOOM  */}
      {/* ===================================================================== */}
      <footer className="fixed bottom-4 left-4 right-4 z-20 pointer-events-none flex flex-col items-center">
        <div className="pointer-events-auto w-full max-w-6xl bg-[#0b0d11]/90 backdrop-blur-md border border-white/15 rounded-xl px-4 py-2.5 shadow-2xl flex flex-col lg:flex-row items-center gap-3">
          {/* Camera Mode Switcher */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setCameraMode('orbit')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                cameraMode === 'orbit'
                  ? 'bg-[#e5a93c] text-[#0b0d11] font-semibold'
                  : 'text-[#a39e93] hover:text-[#f5f2eb]'
              }`}
              title="Free 3D Orbit & Pan Camera"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Orbit</span>
            </button>
            <button
              type="button"
              onClick={() => setCameraMode('walkthrough')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                cameraMode === 'walkthrough'
                  ? 'bg-[#e5a93c] text-[#0b0d11] font-semibold'
                  : 'text-[#a39e93] hover:text-[#f5f2eb]'
              }`}
              title="1.8m Eye-Level Pedestrian Street Walkthrough (WASD / Arrows)"
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Street Walk</span>
            </button>
            <button
              type="button"
              onClick={() => setCameraMode('cinematic')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                cameraMode === 'cinematic'
                  ? 'bg-[#e5a93c] text-[#0b0d11] font-semibold'
                  : 'text-[#a39e93] hover:text-[#f5f2eb]'
              }`}
              title="Automated Documentary Crane Sweep"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Cinematic</span>
            </button>
          </div>

          {/* 3-Tier Altitude Zoom Switcher (Street 1x / District 5x / World Cities 30x) */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setZoomTier('street')}
              className={`px-2 py-1.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                zoomTier === 'street'
                  ? 'bg-[#38bdf8] text-[#0b0d11] font-semibold'
                  : 'text-[#a39e93] hover:text-[#f5f2eb]'
              }`}
              title="Close-up Street & Room Level (1x)"
            >
              Street 1x
            </button>
            <button
              type="button"
              onClick={() => setZoomTier('district')}
              className={`px-2 py-1.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                zoomTier === 'district'
                  ? 'bg-[#38bdf8] text-[#0b0d11] font-semibold'
                  : 'text-[#a39e93] hover:text-[#f5f2eb]'
              }`}
              title="Multi-Block District Grid (5x)"
            >
              District 5x
            </button>
            <button
              type="button"
              onClick={() => setZoomTier('world')}
              className={`px-2 py-1.5 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                zoomTier === 'world'
                  ? 'bg-[#38bdf8] text-[#0b0d11] font-semibold'
                  : 'text-[#a39e93] hover:text-[#f5f2eb]'
              }`}
              title="Zoom all the way out to the 17-City 3D World Theater (30x)"
            >
              World 30x
            </button>
          </div>

          {/* X-Ray Building Cutaway + Bloom FX + Solar Time-of-Day Scrubber */}
          <div className="flex items-center gap-1.5 bg-white/[0.04] px-2.5 py-1 rounded-lg border border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setXrayCutaway((prev) => !prev)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                xrayCutaway
                  ? 'bg-[#e5a93c] text-[#0b0d11] font-semibold'
                  : 'text-[#a39e93] hover:text-[#f5f2eb]'
              }`}
              title="X-Ray Architectural Cutaway: See inside multi-story rooms, floor plates, and rafters"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>X-Ray Rooms</span>
            </button>

            <button
              type="button"
              onClick={() => setCinematicBloom((prev) => !prev)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
                cinematicBloom
                  ? 'bg-[#e5a93c]/25 text-[#e5a93c] border border-[#e5a93c]/40'
                  : 'text-[#a39e93] hover:text-[#f5f2eb]'
              }`}
              title="Toggle UnrealBloom Post-Processing Glow"
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden xl:inline">Bloom</span>
            </button>

            {/* Solar Time-of-Day Slider (00:00 - 24:00) */}
            <div
              className="flex items-center gap-1.5 pl-1.5 border-l border-white/10"
              title="Scrub Solar Time of Day (00:00 Midnight – 12:00 Noon – 24:00)"
            >
              <Sun className="w-3.5 h-3.5 text-[#e5a93c]" />
              <input
                type="range"
                min={0}
                max={24}
                step={0.25}
                value={solarHour}
                onChange={(e) => setSolarHour(parseFloat(e.target.value))}
                className="w-16 sm:w-20 h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#e5a93c]"
              />
              <span className="font-mono text-[10px] text-[#e5a93c] w-10">
                {formatSolarHour(solarHour)}
              </span>
            </div>
          </div>

          {/* 80 AD – 2026 Non-Linear Scrubber */}
          <div className="flex-1 w-full flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#a39e93]">
                Historical Timeline Scrubber (80 AD – 2026 · Click Any Citizen, Car, or Building)
              </span>
              <span className="font-mono text-sm font-bold text-[#e5a93c]">
                {yearInput < 1000 ? `${yearInput} AD` : yearInput}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={1000}
              step={1}
              value={sliderVal}
              onChange={(e) => {
                const yr = sliderValToYear(parseInt(e.target.value, 10));
                handleTimelineScrub(yr);
              }}
              className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#e5a93c]"
            />

            {/* Quick Era Tick Jump Buttons */}
            <div className="flex items-center justify-between gap-1 pt-0.5 overflow-x-auto">
              {TIMELINE_TICKS.map((tick) => {
                const isNear = Math.abs(yearInput - tick.year) <= 3;
                return (
                  <button
                    key={tick.year}
                    type="button"
                    onClick={() => handleTimelineScrub(tick.year)}
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded transition-colors shrink-0 cursor-pointer ${
                      isNear
                        ? 'bg-[#e5a93c]/25 text-[#e5a93c] font-semibold'
                        : 'text-[#a39e93] hover:text-[#f5f2eb]'
                    }`}
                  >
                    {tick.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default App;
