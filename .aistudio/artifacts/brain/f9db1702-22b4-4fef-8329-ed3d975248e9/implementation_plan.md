# Chronos Earth: 1900–Present 3D Historical Time Machine & Reenactment Engine

Chronos Earth transforms the application into a global 3D historical time machine (1900–Present) where users can enter any street address or landmark worldwide, scrub across any year from 1900 to the present day, and explore high-detail 3D historical reenactments—from Great Depression breadlines and Hoovervilles to World War II homefront blackouts, air-raid defenses, industrial transit booms, and Cold War transformations—grounded by real-world Google Maps geospatial data and server-side AI historical synthesis.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and product decisions incorporate your confirmed selections and define how the hybrid 3D geospatial and historical simulation engine will operate.

- **Confirmed Decision 1 — Hybrid Google 3D Maps + Three.js Reenactment Stage**: Combining real-world Google Maps geospatial lookup, satellite/3D terrain context, and street geometry with a custom, physically based Three.js WebGL reenactment viewport. Users can inspect real geospatial coordinates alongside a high-detail 3D diorama of that exact location reconstructed for the chosen year.
- **Confirmed Decision 2 — Full-Spectrum 1900–Present Historical Simulation + Custom User Prompts**: Supporting all major 20th- and 21st-century eras (Early 1900s Industrial & Transit Boom, 1920s Jazz/Prohibition, 1929–1939 Great Depression as it happened, 1939–1945 World War II theaters and homefront, 1950s–1980s Cold War & Space Age, and 1990s–Present), plus an open-ended **Custom Reenactment Prompt** so users can request any specific historical event, atmospheric condition, or local moment at their chosen address.
- **Confirmed Decision 3 — Tri-Modal Camera System**: Seamless switching between **Orbital Drone Camera** (360° tactical inspection with smooth exponential damping), **Street-Level First-Person Walkthrough** (WASD/Arrow ground-level exploration at human eye height), and **Cinematic Event Replay** (choreographed multi-angle camera sweeps synchronized with historical narration and period soundscapes).
- **Confirmed Decision 4 — Complete Replacement with 1900–Present World History Time Machine**: Replacing the legacy Chaco Canyon experience entirely with the 1900–Present Global Historical Digital Twin and curated iconic historical presets (e.g., Times Square & Wall Street 1929/1933, London Blitz 1940, Normandy/Paris 1944, San Francisco Market Street 1906/1936, Berlin 1961/1989) alongside instant search for any custom address on Earth.

---

## 1. Overview & Core Concept

- **What It Does**: Users type any address, intersection, city, or landmark into the location search bar (powered by Google Maps Places Autocomplete & Geocoding) and select any year between **1900 and 2026** (plus optional custom historical event instructions). The engine resolves the real-world geography and surroundings via Google Maps, synthesizes verifiable local historical events and architectural parameters for that address and year via a server-side Gemini historical research pipeline with Google Search & Maps grounding, and procedurally constructs a living, animated 3D Three.js scene complete with period-accurate architecture, vehicles, animated crowds, weather, lighting, and interactive historical hotspots.
- **Target Audience / Persona**: History enthusiasts, educators, documentary researchers, urban historians, and explorers who want to witness history where it actually happened—down to specific neighborhoods and street corners—in interactive 3D.
- **Key Value**: Bridges real-world geospatial precision with studio-grade 3D procedural storytelling, allowing anyone to see what their own street, hometown, or world landmarks looked and felt like during pivotal moments of the 20th and 21st centuries.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Address & Timeframe Selection**:
   - In the top bar or command bar, the user searches any address worldwide using Google Places Autocomplete or picks from curated historical presets (e.g., *1932 Great Depression Breadline & Shantytown — Wall Street / Times Square, NY*, *1940 Battle of Britain Searchlights & Air Raid — Westminster, London*, *1944 Liberation / WWII Theater — Rue de Rivoli, Paris*, *1912 Industrial Streetcar Era — Market St, San Francisco*, *1969 Apollo Era — Cape Canaveral / Houston*).
   - Using the **Chronos Timeline Dock** at the bottom of the viewport, the user scrubs continuously from **1900 to 2026** or enters a custom scenario prompt (e.g., *"Show 1933 winter soup kitchen line and vintage Ford Model A traffic during the Great Depression"*).
2. **Synchronized Geospatial & 3D Reenactment Synthesis**:
   - The Google Maps 3D/Satellite Locator locks onto the exact coordinates, street orientation, and nearby landmarks.
   - Simultaneously, the server-side Historical Synthesis Engine retrieves documented historical facts for that locality and year and emits a structured 3D Scene Blueprint (`eraArchitecture`, `reenactmentType`, `vehicles`, `crowdFormations`, `weatherAndAtmosphere`, `soundscapeProfile`, and `historicalHotspots`).
3. **Interactive 3D Exploration & Reenactment**:
   - The full-bleed Three.js stage dynamically builds multi-part procedural buildings (1900s brick tenements, 1920s Art Deco towers, 1930s Great Depression soup kitchens and Hooverville shanties, 1940s sandbagged storefronts with anti-aircraft searchlights, mid-century neon diners, or modern glass skylines), period vehicles (horse carriages, 1910s streetcars, 1930s sedans, 1940s military convoys and aircraft, 1950s cruisers, modern transit), and animated citizen/soldier formations.
   - Hovering and clicking 3D historical markers in the scene opens the **Archival Dossier Drawer**, displaying verified historical facts, primary-source citations, grounding links, and AI-generated period archival photography.
4. **Camera Mode Switching & Audio Immersion**:
   - Users toggle effortlessly between **Orbit View**, **Street Walkthrough** (first-person WASD + pointer look at `1.7m` eye level), and **Cinematic Replay** (automated director camera with period Web Audio soundscape—steam whistles, 1930s crowd murmur, WWII air-raid sirens and searchlight hums, vintage radio crackle, or rain).

### Visual Identity & Theme

- **Aesthetic Direction**: **Archival Chronometer & Studio 3D Observatory** — combining museum-grade editorial refinement with high-contrast dark obsidian HUD surfaces that leave the central 3D viewport 100% unobstructed.
- **Color Palette & Mood (60-30-10 Discipline)**:
  - **60% Dominant Viewport & Canvas**: Full-screen 3D WebGL stage with physically calibrated sky, horizon exponential fog (`FogExp2`), and era-graded post-processing (warm sepia-tinted sunlight for 1900–1920, stark desaturated overcast slate `#1C1F24` for the 1930s Great Depression, dramatic searchlight amber & midnight indigo `#0B101B` for WWII night scenes, kodachrome warmth for the 1950s–1970s, and crisp daylight for modern years).
  - **30% Structural HUD Surfaces**: Deep obsidian slate (`#0D0F12` at `90%` solid opacity—avoiding GPU-stalling `backdrop-filter` over the active WebGL canvas) with `1px solid rgba(226, 217, 201, 0.16)` hairline dividers and warm parchment primary typography (`#F5F2EB`).
  - **10% Accent Budget**: Chronometer Brass Gold (`#E5A93C`) for active timeline keyframes, primary CTAs, and selected 3D hotspots, paired with semantic status indicators accompanied by explicit text labels.
- **Typography & Hierarchy (2+1 Font Rule)**:
  - **Display / Era Titles**: `Cinzel` (`600`–`700` weight) with `text-wrap: balance` for historical era titles and dossier headings.
  - **Body & UI Controls**: `Plus Jakarta Sans` (`400` regular, `600` semibold) for crisp, high-legibility narratives, address search inputs, and single-line buttons (`whitespace-nowrap shrink-0`).
  - **Telemetry, Coordinates & Years**: `JetBrains Mono` with `font-variant-numeric: tabular-nums` for latitude/longitude coordinates, azimuths, and year counters (`1900`–`2026`).
- **Component Styling & Viewport Governance**:
  - **Top Bar Contract**: Strictly one row with three zones separated by `gap-8`:
    1. *Brand Wordmark*: `CHRONOS EARTH` (single-line display wordmark).
    2. *Navigation Links*: 4 concise single-line links (`Reenactment Stage`, `Geospatial Map`, `Historical Presets`, `Archival Dossier`).
    3. *Primary Action*: `Synthesize Timeframe` CTA button.
  - **Collapsible Bottom Control Dock**: Pinned to the bottom center (`max-width: min(960px, 94vw)`) with a `▾ Hide Controls (H)` Zen-mode drawer toggle so users can admire the 3D reenactment without any side-panel clutter. Houses the address bar, 1900–2026 timeline scrubber, era quick-jump tabs, camera mode selector (`Orbit` · `Street Walk` · `Cinematic`), and custom reenactment prompt input.
  - **Zero-Pill Metadata Discipline**: Dates, coordinates, and historical classifications render as clean inline typography separated by middle dots (`1932 · 40.7060° N, 74.0088° W · Great Depression Reenactment`), never wrapped in decorative pill capsules or pulsing dots.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Hybrid Google Maps + Procedural Three.js Studio Engine**
  - *Chosen Approach*: Use `@vis.gl/react-google-maps` for authentic address autocomplete, geocoding, place context, and interactive 3D/satellite geospatial inspection (either as an inset PiP radar or split/full toggle), while rendering the historical reenactment in a dedicated Three.js PBR WebGL viewport with composite 3–12 part procedural models (`THREE.Group`) and `InstancedMesh` crowds.
  - *Why*: Google Maps provides present-day satellite/3D tiles, whereas historical reenactments of 1900–1945 require period-accurate buildings, unpaved or cobblestone streets, Depression-era shantytowns, WWII sandbags, searchlights, vintage vehicles, and animated crowds that only a custom Three.js PBR scene can dynamically construct and animate at 60 FPS.
  - *Alternatives Considered*: Relying solely on static Google Street View imagery (which lacks historical 1900–1990 coverage and 3D reenactments) or purely ungrounded 3D scenes (which lack real-world street topology and landmark context).

- **Decision 2: Server-Side Gemini Historical & Spatial Synthesis (`server.ts`)**
  - *Chosen Approach*: Route all AI historical research, Google Search/Maps grounding, and archival image generation through Express backend endpoints (`/api/history/synthesize`, `/api/history/grounding`, `/api/history/archival-photo`) using `@google/genai` on the server.
  - *Why*: Protects the API key on the server, grounds every address + year combination in real historical records and geographic data, and produces a deterministic JSON scene specification that drives the Three.js procedural generator alongside rich archival imagery.
  - *Alternatives Considered*: Hardcoding only a few cities (rejected because the user requires *any* address from 1900 to present day to work seamlessly).

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        CHRONOS EARTH CLIENT (React + Vite)                   │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Top Bar (3-Zone Contract: Brand Wordmark | 4 Nav Views | Synthesize)   │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────┬────────────────────────┐  │
│  │                                               │ Geospatial Map &       │  │
│  │       THREE.JS 3D REENACTMENT VIEWPORT        │ Archival Dossier Panel │  │
│  │   (Isolated WebGL Canvas Ref • 60 FPS PBR)    │ (Collapsible Drawer)   │  │
│  │                                               │                        │  │
│  │  • Procedural Era Architecture (1900–2026)    │ • @vis.gl/react-       │  │
│  │  • Reenactment Systems (Depression Breadlines,│   google-maps          │  │
│  │    WWII Searchlights/Convoys, Vintage Transit)│ • Places Autocomplete  │  │
│  │  • InstancedMesh Crowds & Period Vehicles     │ • Grounded Citations   │  │
│  │  • Orbit / WASD Street Walk / Cinematic Cam   │ • AI Archival Photo    │  │
│  │  • 3D Raycast Hotspots & Web Audio Soundscape │   Viewer               │  │
│  └───────────────────────────────────────────────┴────────────────────────┘  │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Collapsible Bottom Control Dock (Zen Toggle [H])                       │  │
│  │ [ Address Search ] [ 1900 ══════●══════ 2026 ] [ Camera ] [ Prompt ]   │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────┬───────────────────────────────────────┘
                                       │ REST JSON (/api/*)
                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                     EXPRESS FULL-STACK SERVER (server.ts)                    │
│                                                                              │
│  • POST /api/history/synthesize  ──► Gemini 3.8 Flash (Structured Scene JSON │
│                                      + Google Search Grounding)              │
│  • POST /api/history/places      ──► Gemini 3.8 Flash + Google Maps Grounding│
│                                      (Extracts groundingChunks.maps.uri)     │
│  • POST /api/history/snapshot    ──► Gemini 3.1 Flash Lite Image             │
│                                      (Period-authentic archival photograph)  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & Procedural 3D Scene Blueprint

For any `(address, lat, lng, year, customPrompt)` tuple, the synthesis engine resolves a `HistoricalSceneBlueprint` containing:
- **Location & Geodesy**: Resolved formatted address, `lat`, `lng`, street grid azimuth, elevation profile, and regional architectural archetype (e.g., *Northeast Brick & Cast-Iron Urban*, *Midwest Main Street*, *European Stone Boulevard*, *Pacific Coast Timber & Art Deco*, *Industrial Waterfront*, *Rural Homestead*).
- **Era & Reenactment Configuration (`1900`–`2026`)**:
  - `1900–1919` (*Turn-of-the-Century & WWI Era*): Gas streetlamps, electric streetcars on rails, early Model T & horse-drawn wagons, brick and stone facades, coal-smoke atmospheric haze.
  - `1920–1928` (*Roaring Twenties*): Art Deco stepped skyscrapers, marquee theater lights, vintage coupes, bustling pedestrian avenues.
  - `1929–1939` (*The Great Depression Reenactment*): Soup kitchen & breadline queues along sidewalks, boarded-up storefronts with "CLOSED" signage, Hooverville corrugated-tin & timber shantytown encampments, barrel warming fires with volumetric ember particles, muted overcast lighting.
  - `1939–1945` (*World War II Reenactment*): Sandbagged fortifications, Czech hedgehogs, rotating anti-aircraft sky searchlight beams slicing through night fog, military trucks, Willys jeeps, overhead propeller squadron flyovers, wartime ration & recruitment banners.
  - `1946–1989` (*Post-War Boom, Civil Rights & Cold War*): Mid-century chrome cars, neon street signage, modernist glass-and-steel towers, historic public gatherings and rallies.
  - `1990–2026` (*Contemporary Digital Twin*): High-rise modern glass curtain walls, contemporary vehicles, bike lanes, LED street lighting, and present-day urban geometry aligned with Google Maps.
- **Interactive 3D Hotspots**: 4–6 spatially anchored points of interest (`x, y, z` world coordinates) representing real documented events, buildings, or eyewitness vignettes at that location and year, clickable via Three.js raycasting.

### Interactive Component & State Mapping

- **Google Maps Address Search & Geolocation**: Uses `@vis.gl/react-google-maps` with an imperatively mounted `PlaceAutocompleteElement` (or Places API New / Geocoding fallback) plus instant clickable world presets so selecting any address pans the Google Map, updates `lat/lng`, and triggers the 3D scene reconstruction.
- **Timeline Scrubber & Era Quick-Jumps (`1900`–`2026`)**: Scrubbing the year slider immediately updates lighting, solar/atmospheric grading, and procedural era props in real time, while clicking **"Synthesize Timeframe"** or pressing Enter on a custom reenactment prompt fetches deep AI-researched local history and rebuilds the 3D diorama for that exact year.
- **Camera Controller (`Orbit` | `Street Walk` | `Cinematic`)**:
  - *Orbit*: Damped `OrbitControls` focused on the central street plaza.
  - *Street Walk*: Keyboard (`WASD` / Arrow keys) + drag-look first-person movement along the reconstructed street with ground height clamping.
  - *Cinematic Replay*: Automated keyframe camera choreography that orbits and dollies through each historical hotspot in sequence while displaying subtitle captions and playing procedural Web Audio period sound effects.
- **Archival Dossier & Grounded Sources Drawer**: Clicking any 3D hotspot or the `Archival Dossier` nav link opens a clean museum-grade side sheet showing the AI-synthesized local history, an on-demand generated archival period photograph (`POST /api/history/snapshot`), and clickable Google Search & Google Maps grounding source links.
