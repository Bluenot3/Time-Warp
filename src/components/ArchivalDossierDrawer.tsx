import React, { useMemo } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, ExternalLink, MapPin, X } from 'lucide-react';
import { HistoricalHotspot, HistoricalSceneBlueprint } from '../types/history';
import { renderArchivalPlateDataUrl } from '../engine/ProceduralTextures';

interface ArchivalDossierDrawerProps {
  blueprint: HistoricalSceneBlueprint;
  selectedHotspot: HistoricalHotspot | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectHotspot: (hotspot: HistoricalHotspot | null) => void;
}

export const ArchivalDossierDrawer: React.FC<ArchivalDossierDrawerProps> = ({
  blueprint,
  selectedHotspot,
  isOpen,
  onClose,
  onSelectHotspot,
}) => {
  const archivalPlateUrl = useMemo(
    () => renderArchivalPlateDataUrl(blueprint),
    [blueprint]
  );

  if (!isOpen) return null;

  const currentIdx = selectedHotspot
    ? blueprint.hotspots.findIndex((h) => h.id === selectedHotspot.id)
    : -1;

  const handleStepHotspot = (dir: -1 | 1) => {
    if (blueprint.hotspots.length === 0) return;
    const nextIdx =
      currentIdx === -1
        ? 0
        : (currentIdx + dir + blueprint.hotspots.length) % blueprint.hotspots.length;
    onSelectHotspot(blueprint.hotspots[nextIdx]);
  };

  return (
    <aside
      className="fixed top-16 left-5 bottom-28 z-30 w-[410px] max-w-[92vw] bg-[#0D0F12]/95 border border-[#F5F2EB]/16 rounded-lg shadow-2xl flex flex-col overflow-hidden text-[#F5F2EB]"
      aria-label="Archival Historical Monograph Dossier"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F5F2EB]/12 shrink-0">
        <div className="flex items-center gap-2 text-xs text-[#F5F2EB]/70">
          <BookOpen className="w-4 h-4 text-[#E5A93C]" />
          <span>Archival Monograph</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-[#E5A93C]">{blueprint.year}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-[#F5F2EB]/60 hover:text-[#F5F2EB] transition-colors"
          aria-label="Close Archival Dossier"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Editorial Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Era & Coordinates Metadata Line (Unboxed with middle-dot separators) */}
        <div className="text-xs text-[#F5F2EB]/65 leading-relaxed">
          <span>{blueprint.eraLabel}</span>
          <span aria-hidden="true"> · </span>
          <span className="font-mono tabular-nums">
            {blueprint.lat.toFixed(4)}° N, {blueprint.lng.toFixed(4)}° E
          </span>
        </div>

        {/* Main Monograph Headline */}
        <div>
          <h2 className="font-display text-xl font-semibold text-[#F5F2EB] leading-snug">
            {blueprint.headline}
          </h2>
          <p className="text-xs text-[#E5A93C] mt-1 font-medium">
            {blueprint.address}
          </p>
        </div>

        {/* Archival Survey Plate (Guaranteed Zero-404 High-Contrast Plate) */}
        <figure className="space-y-1.5">
          <div className="overflow-hidden rounded border border-[#F5F2EB]/15 bg-[#090B0E]">
            <img
              src={archivalPlateUrl}
              alt={`Archival reconstruction plate of ${blueprint.address} in ${blueprint.year}`}
              referrerPolicy="no-referrer"
              className="w-full h-44 object-cover"
            />
          </div>
          <figcaption className="text-[11px] text-[#F5F2EB]/60 italic">
            Fig. 1 — Reconstructed perspective plate of {blueprint.address.split(',')[0]} ({blueprint.year}), oriented at {blueprint.streetAzimuth}° azimuth.
          </figcaption>
        </figure>

        {/* Active 3D Hotspot Callout (if selected) */}
        {selectedHotspot && (
          <div className="p-3.5 rounded bg-[#151921] border border-[#E5A93C]/45 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#E5A93C]">
              <span>
                Focused 3D Marker · {selectedHotspot.category} · {selectedHotspot.yearBadge}
              </span>
              <button
                type="button"
                onClick={() => onSelectHotspot(null)}
                className="text-[#F5F2EB]/60 hover:text-[#F5F2EB] underline"
              >
                Reset Camera
              </button>
            </div>
            <h3 className="font-display text-sm font-semibold text-[#F5F2EB]">
              {selectedHotspot.title}
            </h3>
            <p className="text-xs text-[#F5F2EB]/85 leading-relaxed">
              {selectedHotspot.description}
            </p>
            <div className="text-[11px] text-[#F5F2EB]/55 pt-1 border-t border-[#F5F2EB]/10">
              Source: {selectedHotspot.citation}
            </div>
          </div>
        )}

        {/* Historical Narrative Paragraphs */}
        <div className="space-y-3 text-sm text-[#F5F2EB]/85 leading-relaxed">
          {blueprint.historicalSummary.split('\n\n').map((para, index) => (
            <p
              key={index}
              className={
                index === 0
                  ? 'first-letter:text-3xl first-letter:font-display first-letter:font-bold first-letter:text-[#E5A93C] first-letter:float-left first-letter:mr-2.5 first-letter:leading-none'
                  : ''
              }
            >
              {para}
            </p>
          ))}
        </div>

        {/* 3D Reenactment Highlights */}
        <div className="pt-3 border-t border-[#F5F2EB]/12 space-y-2">
          <h3 className="text-xs font-semibold tracking-wider uppercase text-[#F5F2EB]/70">
            01. Active 3D Reenactment Systems
          </h3>
          <ul className="space-y-1.5 text-xs text-[#F5F2EB]/80">
            {blueprint.reenactmentHighlights.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#E5A93C] font-mono tabular-nums">0{idx + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Architectural & Material Survey */}
        <div className="pt-3 border-t border-[#F5F2EB]/12 space-y-1.5">
          <h3 className="text-xs font-semibold tracking-wider uppercase text-[#F5F2EB]/70">
            02. Architectural &amp; Street Survey
          </h3>
          <p className="text-xs text-[#F5F2EB]/75 leading-relaxed">
            {blueprint.architecturalNotes}
          </p>
        </div>

        {/* Interactive 3D Hotspot Directory */}
        <div className="pt-3 border-t border-[#F5F2EB]/12 space-y-2">
          <h3 className="text-xs font-semibold tracking-wider uppercase text-[#F5F2EB]/70">
            03. Spatially Anchored 3D Hotspots ({blueprint.hotspots.length})
          </h3>
          <div className="space-y-1.5">
            {blueprint.hotspots.map((hs, i) => {
              const isSelected = selectedHotspot?.id === hs.id;
              return (
                <button
                  key={hs.id}
                  type="button"
                  onClick={() => onSelectHotspot(hs)}
                  className={`w-full text-left p-2.5 rounded border transition-colors ${
                    isSelected
                      ? 'bg-[#E5A93C]/15 border-[#E5A93C] text-[#F5F2EB]'
                      : 'bg-[#13161C] border-[#F5F2EB]/10 text-[#F5F2EB]/80 hover:border-[#F5F2EB]/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-[#F5F2EB]/60">
                    <span>
                      0{i + 1} · {hs.category}
                    </span>
                    <span className="font-mono tabular-nums text-[#E5A93C]">
                      {hs.yearBadge}
                    </span>
                  </div>
                  <div className="text-xs font-semibold mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#E5A93C] shrink-0" />
                    <span className="truncate">{hs.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grounded Primary Sources */}
        {blueprint.groundingSources && blueprint.groundingSources.length > 0 && (
          <div className="pt-3 border-t border-[#F5F2EB]/12 space-y-1.5">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-[#F5F2EB]/70">
              04. Archival &amp; Grounding Citations
            </h3>
            {blueprint.groundingSources.map((src, i) => (
              <a
                key={i}
                href={src.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-xs text-[#E5A93C] hover:underline py-1"
              >
                <span className="truncate">{src.title}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Footer Hotspot Stepper */}
      <div className="px-5 py-3 border-t border-[#F5F2EB]/12 bg-[#090B0E] flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={() => handleStepHotspot(-1)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#161920] hover:bg-[#1E232D] border border-[#F5F2EB]/15 rounded transition-colors whitespace-nowrap shrink-0"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev Marker</span>
        </button>
        <span className="text-xs font-mono tabular-nums text-[#F5F2EB]/70">
          {currentIdx >= 0 ? `${currentIdx + 1} / ${blueprint.hotspots.length}` : `All ${blueprint.hotspots.length} Markers`}
        </span>
        <button
          type="button"
          onClick={() => handleStepHotspot(1)}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#161920] hover:bg-[#1E232D] border border-[#F5F2EB]/15 rounded transition-colors whitespace-nowrap shrink-0"
        >
          <span>Next Marker</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
