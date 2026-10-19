import {
  HistoricalSceneBlueprint,
  ReenactmentMode,
  RegionStyle,
  WeatherMood,
  WorldCityNode,
} from '../types/history';

export const HISTORICAL_PRESETS: HistoricalSceneBlueprint[] = [
  {
    id: 'ny-depression-1932',
    address: 'Times Square & W 42nd St, Manhattan, New York, NY 10036',
    city: 'New York',
    country: 'USA',
    lat: 40.7580,
    lng: -73.9855,
    year: 1932,
    streetAzimuth: 29,
    regionStyle: 'northeast_urban',
    weatherMood: 'depression_overcast',
    reenactmentMode: 'depression_breadline',
    headline: 'Winter of the Great Depression: Times Square Relief Breadline',
    eraLabel: '1932 · Great Depression Emergency Relief · Unemployment 24.9%',
    historicalSummary:
      'By the winter of 1932, nearly one in four American workers was unemployed. In the heart of Manhattan along Broadway and West 42nd Street, municipal and newspaper-sponsored emergency kitchens served thousands of bowls of hot soup, bread, and coffee daily to long queues of men in threadbare wool overcoats and fedoras.\n\nSurrounding storefronts bore "CLOSED" and "FOR RENT" placards while street-corner apple vendors stood beside glowing 55-gallon coal braziers. Above the wet cobblestone thoroughfare, vintage 1930 Ford Model A sedans and yellow taxicabs navigated beneath shadowed brick tenements, iron fire escapes, rooftop cedar water towers, and quiet theater marquees.',
    architecturalNotes:
      'Turn-of-the-century dark red and brownstone masonry tenements with multi-story cast-iron fire escapes and rooftop wooden water tanks, paired with stepped 1920s Art Deco limestone towers, boarded-up ground-floor retail bays, wet granite cobblestone street bed with dual steel tramway rails, and wood-framed relief distribution stalls.',
    reenactmentHighlights: [
      'Double-file citizen breadline queue in wool overcoats & fedoras beside steaming soup cauldrons',
      'Street-corner Unemployed Apple Seller crate stand & glowing 55-gallon coal braziers with rising embers',
      'Multi-block Manhattan street grid with 1931 Ford Model A sedans, delivery trucks & cross-street traffic',
      'Cast-iron tenement fire escapes, rooftop cedar water towers, newsstand kiosk & boarded-up banks',
    ],
    streetSignText: 'BROADWAY & W 42ND ST • 1932',
    bannerText: 'FREE SOUP • COFFEE & BREAD',
    secondaryBannerText: 'EMERGENCY UNEMPLOYMENT RELIEF STATION',
    hotspots: [
      {
        id: 'hs-soup-kitchen',
        title: 'St. Peter’s & Municipal Relief Soup Kitchen',
        category: 'Great Depression Relief',
        yearBadge: 'Winter 1932',
        description:
          'Private charities and municipal relief committees operated curbside commissaries serving up to 3,500 meals a day. Citizens waited two to three hours in freezing temperatures for hot vegetable stew, a half-loaf of bread, and black coffee.',
        citation: 'New York Municipal Archives • Federal Writers’ Project (1932–1935)',
        position: [-10, 2.2, -6.5],
        cameraOffset: [-1, 3.8, 7.5],
      },
      {
        id: 'hs-breadline-queue',
        title: 'The Overcoat Breadline Queue',
        category: 'Social History',
        yearBadge: '1932',
        description:
          'Skilled tradesmen, clerks, and factory workers stood shoulder-to-shoulder in disciplined double-file lines stretching entire Manhattan blocks, wearing suits and fedoras from pre-Crash employment.',
        citation: 'Library of Congress FSA/OWI Collection • Breadlines of 1932',
        position: [3, 2.0, -6.8],
        cameraOffset: [8, 3.5, 5.5],
      },
      {
        id: 'hs-warming-brazier',
        title: 'Unemployed Apple Vendor & Coal Brazier',
        category: 'Street Economy',
        yearBadge: 'Nov 1932',
        description:
          'The International Apple Shippers Association provided crates of surplus Northwest apples on credit to over 6,000 unemployed New Yorkers, who sold them for 5 cents apiece beside scrap-wood barrel fires.',
        citation: 'Smithsonian National Museum of American History • Great Depression Series',
        position: [-4, 1.8, 6.4],
        cameraOffset: [-7, 3.2, 11],
      },
      {
        id: 'hs-closed-bank',
        title: 'Shuttered Commercial Bank & Foreclosed Retail Row',
        category: 'Financial Collapse',
        yearBadge: '1930–1933',
        description:
          'Over 5,000 American banks suspended operations between 1930 and 1932 prior to the March 1933 Federal Bank Holiday, leaving commercial ground floors boarded with timber slats.',
        citation: 'Federal Reserve Historical Archive • Banking Panics of 1930–1933',
        position: [14, 3.2, 8.5],
        cameraOffset: [6, 5.0, 15],
      },
      {
        id: 'hs-newsstand-1932',
        title: '42nd Street Period Newsstand & Telegraph Pole',
        category: 'Daily Press',
        yearBadge: '1932',
        description:
          'Street-corner wooden kiosks posted hourly editions on the Reconstruction Finance Corporation, Bonus Army marches in Washington, and municipal relief appropriations.',
        citation: 'New York Public Library Milstein Division',
        position: [10, 2.0, 6.4],
        cameraOffset: [14, 3.4, 11],
      },
    ],
    groundingSources: [
      {
        title: 'Library of Congress — Great Depression & New Deal Primary Sources',
        uri: 'https://www.loc.gov/classroom-materials/great-depression-and-world-war-ii-1929-1945/',
        sourceType: 'web',
      },
      {
        title: 'National Archives — Franklin D. Roosevelt Library Great Depression Records',
        uri: 'https://www.fdrlibrary.org/great-depression-facts',
        sourceType: 'web',
      },
    ],
  },
  {
    id: 'ny-hooverville-1933',
    address: 'Central Park Lower Reservoir (81st St Transverse), New York, NY',
    city: 'New York',
    country: 'USA',
    lat: 40.7812,
    lng: -73.9665,
    year: 1933,
    streetAzimuth: 29,
    regionStyle: 'northeast_urban',
    weatherMood: 'depression_overcast',
    reenactmentMode: 'depression_hooverville',
    headline: 'Central Park "Hooverville" Encampment on the Drained Reservoir',
    eraLabel: 'Spring 1933 · Great Depression Shantytown · Drained Croton Basin',
    historicalSummary:
      'When New York City drained the obsolete 35-acre Lower Croton Reservoir in Central Park between 79th and 86th Streets, hundreds of evicted workers occupied the muddy basin floor. Naming their settlement "Hoover Valley" (or Hooverville) after President Herbert Hoover, unemployed bricklayers, carpenters, and stonemasons built weatherproof shelters out of scavenged packing crates, corrugated tin, and rubble stone.\n\nDirectly above the earthen rim of the shantytown rose the newly completed luxury Art Deco twin-towered apartments of Central Park West—creating one of the starkest visual contrasts of the 20th century.',
    architecturalNotes:
      'Improvised 1-story shanties constructed from corrugated galvanized iron, wooden shipping crates, tar paper, and salvaged brick chimneys with smoking stovepipes, encircled by the dressed stone retaining wall of the reservoir and flanked by distant 1930 Art Deco residential towers.',
    reenactmentHighlights: [
      'Multi-part timber, shipping crate, and corrugated-iron Hooverville shanties with brick hearths',
      'Outdoor communal campfires, water buckets, clotheslines, and hand-painted "HOOVER VALLEY" signs',
      'Unemployed craftsmen repairing shelters and tending communal cooking pots',
      'Stark backdrop of 1930s Art Deco limestone skyscrapers along the Central Park perimeter',
    ],
    streetSignText: 'HOOVER VALLEY • CENTRAL PARK BASIN • 1933',
    bannerText: 'HOOVERVILLE NO. 1 • RENT FREE',
    secondaryBannerText: 'UNEMPLOYED COUNCIL MUTUAL AID CAMP',
    hotspots: [
      {
        id: 'hv-brick-shack',
        title: 'Stonemasons’ Salvaged Brick & Timber Dwelling',
        category: 'Vernacular Shelter',
        yearBadge: 'April 1933',
        description:
          'Built by unemployed construction tradesmen, several Central Park shanties featured mortared brick hearths, glass window panes, and patched tin roofs before the basin was graded for the Great Lawn.',
        citation: 'Museum of the City of New York • Samuel H. Gottscho Photographs (1933)',
        position: [-8, 2.0, -5],
        cameraOffset: [-2, 4.0, 6],
      },
      {
        id: 'hv-campfire',
        title: 'Communal Barrel Stove & Wash Line',
        category: 'Daily Survival',
        yearBadge: '1933',
        description:
          'Residents shared coal, driftwood gathered from the Hudson River docks, and soup kettles while maintaining strict self-governed camp sanitation rules.',
        citation: 'New York Times Archival Report • "Depression Camp in Reservoir" (1932)',
        position: [2, 1.8, 3],
        cameraOffset: [8, 3.8, 9],
      },
      {
        id: 'hv-skyline-contrast',
        title: 'Central Park West Art Deco Skyline Contrast',
        category: 'Urban Geography',
        yearBadge: '1931–1933',
        description:
          'Completed just as the 1929 crash unfolded, the surrounding limestone skyscrapers overlooked the reservoir encampment until Parks Commissioner Robert Moses cleared the site with WPA funds.',
        citation: 'NYC Landmarks Preservation Commission • Central Park Scenic Landmark',
        position: [15, 5.0, -10],
        cameraOffset: [5, 6.0, 5],
      },
      {
        id: 'hv-depression-wagon',
        title: 'Scavenged Pushcart & Fuel Supply Path',
        category: 'Material Culture',
        yearBadge: '1933',
        description:
          'Handcarts and pre-crash utility trucks hauled scrap lumber, crate planks, and food donations down the reservoir access ramp.',
        citation: 'Urban History Digital Twin Archive',
        position: [-12, 1.6, 5],
        cameraOffset: [-5, 3.5, 11],
      },
    ],
    groundingSources: [
      {
        title: 'Central Park Conservancy — Central Park During the Great Depression',
        uri: 'https://www.centralparknyc.org/articles/central-park-great-depression',
        sourceType: 'web',
      },
    ],
  },
  {
    id: 'london-blitz-1940',
    address: 'Whitehall & Parliament Square, Westminster, London SW1A 2AS, UK',
    city: 'London',
    country: 'United Kingdom',
    lat: 51.5014,
    lng: -0.1266,
    year: 1940,
    streetAzimuth: 168,
    regionStyle: 'european_stone',
    weatherMood: 'wwii_night_blitz',
    reenactmentMode: 'wwii_blitz',
    headline: 'World War II: The London Blitz & Whitehall Anti-Aircraft Defense',
    eraLabel: 'October 1940 · Battle of Britain & The Blitz · Night Air Raid Alert',
    historicalSummary:
      'Beginning on September 7, 1940, London endured 57 consecutive nights of aerial bombardment during the Blitz. Along Whitehall—the nerve center of the British war effort housing the War Office, Admiralty, and the Cabinet War Rooms beneath King Charles Street—every ground-floor window was fortified with stacked sandbags and blast-tape lattices.\n\nAs the wailing dual-tone "Alert" siren echoed across Westminster, Royal Artillery searchlight batteries swept 120-million-candlepower carbon-arc beams across the night sky to illuminate high-altitude bombers while 40mm Bofors anti-aircraft emplacements and Air Raid Precautions (ARP) wardens defended the capital.',
    architecturalNotes:
      'Neoclassical Portland stone and Victorian masonry ministries with criss-cross paper blast tape on windows, heavy timber-and-sandbag ground-level blast walls, steel Czech hedgehog roadblocks, 40mm anti-aircraft gun emplacements, masked blackout streetlamps, and wet rain-slicked tarmac.',
    reenactmentHighlights: [
      'Sweeping volumetric anti-aircraft carbon-arc searchlight cones slicing through the night sky',
      '40mm Bofors Anti-Aircraft gun emplacement ringed by stacked burlap sandbag revetments',
      'Royal Artillery military convoy, Sherman/cruiser armor, steel Czech hedgehogs & ARP wardens',
      'Overhead twin-engine bomber & RAF night-fighter squadron flyover with falling night rain',
    ],
    streetSignText: 'WHITEHALL SW1 • PUBLIC AIR RAID SHELTER ➔',
    bannerText: 'AIR RAID SHELTER • KEEP CALM & CARRY ON',
    secondaryBannerText: 'WARDEN POST W-4 • BLACKOUT IN FORCE',
    hotspots: [
      {
        id: 'ww2-searchlight-battery',
        title: '90cm Anti-Aircraft Carbon-Arc Searchlight Emplacement',
        category: 'Air Defense',
        yearBadge: 'Oct 1940',
        description:
          'Operated by the Royal Engineers and Auxiliary Territorial Service (ATS) crews, 90cm projector lamps tracked sound-located aircraft at altitudes up to 25,000 feet to coordinate anti-aircraft flak and RAF night fighters.',
        citation: 'Imperial War Museums (IWM) • London Air Defence Records 1940',
        position: [-9.5, 2.5, -4.8],
        cameraOffset: [-2, 4.5, 8.5],
      },
      {
        id: 'ww2-bofors-aa',
        title: '40mm Anti-Aircraft Gun Pit & Sandbag Revetment',
        category: 'Artillery Defense',
        yearBadge: '1940',
        description:
          'Anti-aircraft batteries positioned around Westminster and St. James’s Park engaged low- and medium-altitude raiders while barrage balloons restricted dive-bombing corridors.',
        citation: 'Royal Artillery Historical Trust • Anti-Aircraft Command 1940',
        position: [8, 2.2, -7],
        cameraOffset: [12, 4.2, 4],
      },
      {
        id: 'ww2-military-convoy',
        title: 'Wartime Armored Dispatch & ARP Rescue Convoy',
        category: 'Military Logistics',
        yearBadge: '1940–1941',
        description:
          'Equipped with slotted blackout headlamp masks and white-painted mudguard edges to prevent collisions in total darkness, military dispatch vehicles maintained 24-hour command links.',
        citation: 'Royal Logistic Corps Digital Archive',
        position: [0, 1.8, -2],
        cameraOffset: [-8, 3.8, 9],
      },
      {
        id: 'ww2-sky-squadron',
        title: 'Night Sky Interception & Searchlight Convergence Zone',
        category: 'Aerial Theater',
        yearBadge: 'Autumn 1940',
        description:
          'Look upward to observe multi-engine aircraft silhouettes caught in the converging searchlight cones above Westminster.',
        citation: 'RAF Museum Hendon • Battle of Britain & Night Blitz',
        position: [0, 22, -15],
        cameraOffset: [0, 6, 18],
      },
    ],
    groundingSources: [
      {
        title: 'Imperial War Museums — The Blitz Around Britain',
        uri: 'https://www.iwm.org.uk/history/the-blitz-around-britain',
        sourceType: 'web',
      },
    ],
  },
  {
    id: 'paris-liberation-1944',
    address: 'Rue de Rivoli & Place de la Concorde, 75001 Paris, France',
    city: 'Paris',
    country: 'France',
    lat: 48.8656,
    lng: 2.3212,
    year: 1944,
    streetAzimuth: 116,
    regionStyle: 'european_stone',
    weatherMood: 'clear_golden',
    reenactmentMode: 'wwii_liberation',
    headline: 'World War II: August 1944 Liberation of Paris along Rue de Rivoli',
    eraLabel: 'August 25, 1944 · Allied 2nd Armored Division & FFI Uprising',
    historicalSummary:
      'On August 24–25, 1944, following a week of street barricades erected by the French Forces of the Interior (FFI), General Philippe Leclerc’s French 2nd Armored Division and the U.S. 4th Infantry Division entered central Paris and advanced down the Rue de Rivoli toward the Place de la Concorde.\n\nMedium M4 Sherman tanks and Willys MB jeeps rolled past sandbagged limestone arcades as thousands of Parisians poured onto the boulevards waving tricolor flags from wrought-iron Haussmann balconies.',
    architecturalNotes:
      'Classic 5-story Haussmann cream Lutetian limestone facades with ground-floor vaulted arcades, mansard zinc roofs, wrought-iron balconies, cobblestone street barricades, and Allied military armor.',
    reenactmentHighlights: [
      'Armored column of composite M4 Sherman tanks (bogie tracks, rotating turrets, 75mm guns)',
      'Sandbag and cobblestone FFI Resistance street barricades at the arcade intersections',
      'Cheering crowds of liberated citizens and FFI partisans lining the sidewalks',
      'Low-altitude Allied reconnaissance squadron flyover above the sunlit Haussmann boulevard',
    ],
    streetSignText: 'RUE DE RIVOLI • PLACE DE LA CONCORDE • AOÛT 1944',
    bannerText: 'VIVE LA LIBÉRATION • PARIS LIBÉRÉ',
    secondaryBannerText: '2e DIVISION BLINDÉE • FORCES FRANÇAISES DE L’INTÉRIEUR',
    hotspots: [
      {
        id: 'paris-sherman-tank',
        title: 'M4A2 Sherman Tank Column (2e Division Blindée)',
        category: 'Allied Armor',
        yearBadge: 'Aug 25, 1944',
        description:
          'Sherman tanks bearing the white Allied star and Cross of Lorraine advanced along Rue de Rivoli to neutralize remaining fortified strongpoints around the Hôtel Meurice and Place de la Concorde.',
        citation: 'Musée de la Libération de Paris – Général Leclerc – Jean Moulin',
        position: [-2, 2.2, -2],
        cameraOffset: [8, 4.2, 8],
      },
      {
        id: 'paris-barricade',
        title: 'FFI Cobblestone & Sandbag Street Barricade',
        category: 'Urban Uprising',
        yearBadge: 'Aug 19–25, 1944',
        description:
          'Starting August 19, Parisian Resistance fighters pried up granite paving stones (pavés), felled street trees, and stacked sandbags to block armored counter-attacks.',
        citation: 'Archives Nationales de France • Libération de Paris 1944',
        position: [-11, 2.0, 6],
        cameraOffset: [-4, 4.0, 13],
      },
      {
        id: 'paris-haussmann-arcade',
        title: 'Haussmann Limestone Arcades & Wrought-Iron Balconies',
        category: 'Historic Architecture',
        yearBadge: '1944',
        description:
          'Designed by Percier and Fontaine and extended under Baron Haussmann, the Rue de Rivoli arcades witnessed intense skirmishes followed by jubilant liberation parades.',
        citation: 'Monuments Historiques de Paris',
        position: [10, 4.5, -7],
        cameraOffset: [2, 5.5, 6],
      },
      {
        id: 'paris-willys-jeep',
        title: 'Allied Command Post & Field Radio Station',
        category: 'Communications',
        yearBadge: 'Aug 1944',
        description:
          'Signal Corps photographers and war correspondents transmitted live dispatches from Rue de Rivoli as German garrison commander General von Choltitz surrendered at the Hôtel Meurice.',
        citation: 'U.S. National Archives Signal Corps Collection',
        position: [7, 1.8, 2],
        cameraOffset: [13, 3.8, 9],
      },
    ],
    groundingSources: [
      {
        title: 'Musée de la Libération de Paris — Historical Timeline August 1944',
        uri: 'https://www.museeliberation-leclerc-moulin.paris.fr/',
        sourceType: 'web',
      },
    ],
  },
  {
    id: 'sf-streetcar-1912',
    address: 'Market St & Embarcadero (Ferry Building), San Francisco, CA',
    city: 'San Francisco',
    country: 'USA',
    lat: 37.7955,
    lng: -122.3937,
    year: 1912,
    streetAzimuth: 52,
    regionStyle: 'west_coast',
    weatherMood: 'vintage_sepia',
    reenactmentMode: 'early_streetcar',
    headline: '1912 San Francisco: Post-Earthquake Rebirth & Electric Streetcar Roar',
    eraLabel: '1912 · Municipal Railway Opening & Beaux-Arts Reconstruction',
    historicalSummary:
      'Just six years after the devastating 1906 earthquake and fire destroyed 80% of San Francisco, Market Street re-emerged as the "Path of Gold." In December 1912, the San Francisco Municipal Railway (Muni) inaugurated public electric streetcar service along Market Street toward the Ferry Building clock tower.\n\nClanging steel streetcars shared the wide granite-paved boulevard with brass-era touring automobiles, horse-drawn freight drays, and pedestrians dressed in Edwardian wool suits and wide-brimmed hats.',
    architecturalNotes:
      'Beaux-Arts sandstone and glazed terracotta commercial palaces, ornate cast-iron triplet streetlamps ("Path of Gold"), overhead electric trolley catenary wires, and four-track steel streetcar rails embedded in granite blocks.',
    reenactmentHighlights: [
      'Animated 1912 electric streetcars with clerestory roofs and trolley poles gliding under overhead wires',
      'Transition-era street traffic mixing brass-era Model T touring cars and commercial delivery vehicles',
      'Beaux-Arts stone facades with projecting fabric shopfront awnings and ornate cast-iron streetlamps',
      'Edwardian commuters and newsboys gathered along the Market Street intersections',
    ],
    streetSignText: 'MARKET STREET & EMBARCADERO • 1912',
    bannerText: 'MUNICIPAL RAILWAY • FERRIES & PANAMA-PACIFIC EXPO',
    secondaryBannerText: 'SAN FRANCISCO REBUILT • 1906–1912',
    hotspots: [
      {
        id: 'sf-muni-car-1',
        title: '1912 Muni Type A Electric Streetcar',
        category: 'Electric Transit',
        yearBadge: 'Dec 28, 1912',
        description:
          'Painted in grey and gold trim, Car No. 1 inaugurated one of America’s first publicly owned municipal streetcar systems along Market Street.',
        citation: 'Market Street Railway Museum & SFMTA Photo Archive',
        position: [-3, 2.5, 0],
        cameraOffset: [6, 4.5, 9],
      },
      {
        id: 'sf-path-of-gold',
        title: 'Beaux-Arts "Path of Gold" Triplet Arc Lamps',
        category: 'Civic Design',
        yearBadge: '1912',
        description:
          'Designed by Willis Polk with sculpted reliefs at the base, these ornate cast-iron standards illuminated Market Street’s post-earthquake renaissance.',
        citation: 'San Francisco Historical Photograph Collection',
        position: [-12, 3.5, -6.2],
        cameraOffset: [-6, 4.5, 4],
      },
      {
        id: 'sf-brass-auto',
        title: 'Brass-Era Touring Automobile & Freight Thoroughfare',
        category: 'Transportation Shift',
        yearBadge: '1912',
        description:
          'The year 1912 marked the tipping point where gasoline-powered automobiles began outnumbering horse-drawn commercial wagons in major American ports.',
        citation: 'Bancroft Library UC Berkeley • California Street Views',
        position: [8, 1.8, 3],
        cameraOffset: [14, 3.8, 10],
      },
      {
        id: 'sf-reconstruction-facade',
        title: 'Fireproof Steel-Frame & Terracotta Commercial Block',
        category: 'Earthquake Engineering',
        yearBadge: '1908–1912',
        description:
          'Rebuilt after the 1906 disaster using riveted structural steel frames clad in fireproof glazed terracotta and Colusa sandstone.',
        citation: 'USGS & Structural Engineers Association of California',
        position: [4, 5.0, -9],
        cameraOffset: [0, 6.0, 5],
      },
    ],
    groundingSources: [
      {
        title: 'SFMTA Archive — History of Market Street Railway 1912',
        uri: 'https://www.streetcar.org/san-franciscos-historic-streetcars/',
        sourceType: 'web',
      },
    ],
  },
  {
    id: 'berlin-coldwar-1963',
    address: 'Friedrichstraße 43–45 (Checkpoint Charlie), 10969 Berlin, Germany',
    city: 'Berlin',
    country: 'Germany',
    lat: 52.5074,
    lng: 13.3904,
    year: 1963,
    streetAzimuth: 175,
    regionStyle: 'european_stone',
    weatherMood: 'rain_noir',
    reenactmentMode: 'cold_war',
    headline: 'Cold War Divided City: Checkpoint Charlie & Friedrichstraße Sector Line',
    eraLabel: 'June 1963 · Allied Sector Crossing · Divided Berlin',
    historicalSummary:
      'Constructed in August 1961 and reinforced through 1963, the Berlin Wall severed Friedrichstraße at the boundary between the American sector (Kreuzberg) and the Soviet sector (Mitte). Known as "Checkpoint Charlie," this crossing point became the focal symbol of the Cold War.\n\nIn June 1963, President John F. Kennedy visited the wooden Allied guardhouse and sandbagged observation platform at Friedrichstraße to peer across the barbed-wire and concrete barrier just hours after delivering his "Ich bin ein Berliner" address.',
    architecturalNotes:
      'Concrete Berlin Wall slab segments topped with pipe barriers, wooden white-painted U.S. Army checkpoint booth with sandbag revetment, East German watchtower in the background, and war-scarred 19th-century Berlin stucco facades alongside 1960s modernist infill.',
    reenactmentHighlights: [
      'Famous white wooden Allied checkpoint booth and sandbagged sector boundary line',
      'Concrete Berlin Wall barrier segments and border watchtower with sweeping floodlights',
      'U.S. Military Police patrol vehicles and 1960s European sedans in the rain',
      'Multilingual "YOU ARE LEAVING THE AMERICAN SECTOR" boundary signpost',
    ],
    streetSignText: 'FRIEDRICHSTRASSE • CHECKPOINT CHARLIE • 1963',
    bannerText: 'YOU ARE LEAVING THE AMERICAN SECTOR',
    secondaryBannerText: 'US ARMY CHECKPOINT C • ALLIED FORCES BERLIN',
    hotspots: [
      {
        id: 'berlin-booth',
        title: 'Allied Checkpoint Charlie Guardhouse & Sandbags',
        category: 'Cold War Frontier',
        yearBadge: '1961–1963',
        description:
          'By international agreement, the Western Allies built a temporary wooden booth rather than a permanent structure to signify they did not recognize the permanent division of Berlin.',
        citation: 'AlliiertenMuseum Berlin • Checkpoint Charlie Archive',
        position: [0, 2.2, 0],
        cameraOffset: [7, 4.0, 9],
      },
      {
        id: 'berlin-sector-sign',
        title: 'Quadripartite Sector Boundary Signpost',
        category: 'Geopolitics',
        yearBadge: '1963',
        description:
          'Inscribed in English, Russian, French, and German, marking the exact demarcation line between West and East Berlin across Friedrichstraße.',
        citation: 'Stiftung Berliner Mauer (Berlin Wall Foundation)',
        position: [-4, 2.5, 4],
        cameraOffset: [-9, 3.8, 11],
      },
      {
        id: 'berlin-wall-segment',
        title: 'First-Generation Concrete Wall & Observation Tower',
        category: 'Fortification',
        yearBadge: '1963',
        description:
          'Before the fourth-generation L-shaped Stützwandelemente of the 1970s, the 1963 barrier combined concrete blocks, bricked-up ground windows, and floodlit watchtowers.',
        citation: 'Chronik der Mauer • Zentrum für Zeithistorische Forschung',
        position: [-12, 3.5, -5],
        cameraOffset: [-4, 5.0, 6],
      },
      {
        id: 'berlin-patrol',
        title: 'Military Police Patrol & Diplomatic Crossing',
        category: 'Cold War Operations',
        yearBadge: 'June 1963',
        description:
          'Checkpoint Charlie was the sole road crossing in Berlin designated for Allied military personnel, diplomats, and foreign journalists.',
        citation: 'U.S. Army Europe Historical Archives',
        position: [7, 1.8, -2],
        cameraOffset: [13, 4.0, 6],
      },
    ],
    groundingSources: [
      {
        title: 'Stiftung Berliner Mauer — Checkpoint Charlie Historical Site',
        uri: 'https://www.berliner-mauer-gedenkstaette.de/en/',
        sourceType: 'web',
      },
    ],
  },
  {
    id: 'ny-gilded-1880',
    address: 'Lower Broadway & Fulton St, Manhattan, New York, NY 10038',
    city: 'New York',
    country: 'USA',
    lat: 40.7112,
    lng: -74.0092,
    year: 1880,
    streetAzimuth: 29,
    regionStyle: 'northeast_urban',
    weatherMood: 'vintage_sepia',
    reenactmentMode: 'early_streetcar',
    headline: '1880 Gilded Age Manhattan: Forest of Telegraph Poles & Horse Omnibuses',
    eraLabel: '1880 · Gilded Age Industrial Boom · Early Brush Arc-Lamp Illumination',
    historicalSummary:
      'In 1880, Lower Broadway was the nerve center of American telegraphy, finance, and Gilded Age commerce. Fifteen-Crossbar Western Union timber poles carried hundreds of overhead copper telegraph and early Bell telephone wires above Belgian granite cobblestones.\n\nBelow the cast-iron Italianate facades, horse-drawn omnibuses, early rail horsecars, and steam-era drays converged while Charles F. Brush’s carbon-arc streetlamps cast the first electric glow across Manhattan.',
    architecturalNotes:
      '5-to-7 story Soho/Tribeca cast-iron and brownstone Italianate commercial palaces with projecting cornices, canvas shop awnings, dense multi-crossarm telegraph poles, and granite block roadways.',
    reenactmentHighlights: [
      'Dense 1880s overhead telegraph wire corridors & cast-iron commercial facades',
      'Early rail streetcars, horse-drawn carriages, and Gilded Age pedestrians in top hats',
      'Street-corner newspaper hawkers reporting on Brooklyn Bridge cable spinning',
      'Warm sepia gaslight and early carbon-arc streetlamp illumination',
    ],
    streetSignText: 'BROADWAY & FULTON ST • 1880',
    bannerText: 'WESTERN UNION TELEGRAPH & CABLE OFFICE',
    secondaryBannerText: 'BROOKLYN BRIDGE CONSTRUCTION • NEW YORK 1880',
    hotspots: [
      {
        id: 'ny1880-telegraph',
        title: 'Western Union Multi-Crossarm Telegraph Corridor',
        category: '1880s Technology',
        yearBadge: '1880',
        description:
          'Prior to the Blizzard of 1888 that forced utilities underground, Lower Broadway poles carried up to 200 individual telegraph and stock-ticker wires.',
        citation: 'New-York Historical Society • Gilded Age Street Collection',
        position: [-8, 3.2, -5.8],
        cameraOffset: [-2, 4.5, 7],
      },
      {
        id: 'ny1880-castiron',
        title: 'Cast-Iron Commercial Emporium & Arcade',
        category: 'Gilded Age Architecture',
        yearBadge: '1880',
        description:
          'Prefabricated cast-iron columns and Renaissance Revival window arches allowed sweeping plate-glass mercantile displays.',
        citation: 'NYC Landmarks Preservation Commission • Historic Cast-Iron District',
        position: [6, 3.8, -8.5],
        cameraOffset: [12, 5.0, 6],
      },
    ],
    groundingSources: [
      {
        title: 'Library of Congress — New York in the 1880s',
        uri: 'https://www.loc.gov/collections/',
        sourceType: 'web',
      },
    ],
  },
  {
    id: 'chaco-bonito-1050',
    address: 'Pueblo Bonito Great House, Chaco Culture National Historical Park, NM',
    city: 'Chaco Canyon',
    country: 'Ancestral Puebloan Homeland (USA)',
    lat: 36.0605,
    lng: -107.9616,
    year: 1050,
    streetAzimuth: 90,
    regionStyle: 'west_coast',
    weatherMood: 'clear_golden',
    reenactmentMode: 'ancient_classical',
    headline: 'AD 1050 High Chacoan Florescence: Pueblo Bonito Great House & Great Kivas',
    eraLabel: 'AD 1050 · Ancestral Puebloan Golden Age · Core-and-Veneer Sandstone Masonry',
    historicalSummary:
      'At the height of the Chacoan phenomenon around AD 1050, Pueblo Bonito stood four to five stories high along the north wall of Chaco Canyon, containing over 650 rooms and 35 kivas arranged in a monumental D-shaped amphitheater aligned to the cardinal directions and solar solstices.\n\nMaster masons quarried tabular Cliff House Sandstone and hauled over 200,000 ponderosa pine and fir roof beams (vigas) from mountain ranges 80 kilometers away.',
    architecturalNotes:
      'Multi-story tiered sandstone masonry roomblocks, subterranean circular Great Kivas with timber roof cribbing, cardinal East-West plaza dividing walls, and glowing hearth fires.',
    reenactmentHighlights: [
      'Monumental tiered sandstone masonry structures & ceremonial plaza colonnades',
      'Glowing plaza hearths, solstice alignments & ceremonial processions',
      'Regional connection roads radiating across the San Juan Basin',
      'Full zoom-out to inspect both Ancient/Medieval centers and Global Cities',
    ],
    streetSignText: 'PUEBLO BONITO • GREAT PLAZA • AD 1050',
    bannerText: 'CHACO CANYON GREAT HOUSE • SOLAR MERIDIAN',
    secondaryBannerText: 'CORE-AND-VENEER SANDSTONE ARCHITECTURE',
    hotspots: [
      {
        id: 'chaco-great-kiva',
        title: 'Great Kiva A & Subterranean Solstice Sanctuary',
        category: 'Ceremonial Architecture',
        yearBadge: 'AD 1050',
        description:
          'Measuring over 16 meters in diameter, Great Kiva A anchored the East Plaza with four massive masonry-seated timber roof-support columns and a raised central firebox.',
        citation: 'Chaco Research Archive & National Park Service HABS Survey',
        position: [-6, 2.0, -5],
        cameraOffset: [2, 4.8, 9],
      },
      {
        id: 'chaco-room33',
        title: 'Northern Arc Four-Story Terraced Roomblock',
        category: 'Monumental Masonry',
        yearBadge: 'AD 850–1130',
        description:
          'Constructed with Type II–IV banded sandstone veneer over rubble cores, the stepped northern roomblocks sheltered ritual crypts, turquoise workshops, and astronomical viewing portals.',
        citation: 'Smithsonian Institution — Neil Judd Pueblo Bonito Expeditions',
        position: [8, 3.6, -8],
        cameraOffset: [12, 5.2, 6],
      },
    ],
    groundingSources: [
      {
        title: 'Chaco Research Archive — Pueblo Bonito Architectural Survey',
        uri: 'https://www.chacoarchive.org/',
        sourceType: 'web',
      },
    ],
  },
  {
    id: 'rome-colosseum-80',
    address: 'Piazza del Colosseo & Via Sacra, 00184 Rome, Italy',
    city: 'Rome',
    country: 'Roman Empire (Italy)',
    lat: 41.8902,
    lng: 12.4922,
    year: 80,
    streetAzimuth: 132,
    regionStyle: 'european_stone',
    weatherMood: 'clear_golden',
    reenactmentMode: 'ancient_classical',
    headline: 'AD 80 Imperial Rome: Inauguration of the Flavian Amphitheatre (Colosseum)',
    eraLabel: 'AD 80 · Reign of Emperor Titus · 100-Day Inaugural Games of the Colosseum',
    historicalSummary:
      'In AD 80, Emperor Titus inaugurated the monumental Flavian Amphitheatre (the Colosseum) at the eastern end of the Roman Forum along the Via Sacra. Constructed from 100,000 cubic meters of travertine limestone held by 300 tons of iron clamps, the four-tiered marble-clad facade featured 80 arched entrance arcades (vomitoria) and a retractable canvas velarium.\n\nAlong the basalt paving stones of the Via Sacra, senators in togas, Praetorian guards, triumphal arches, and bronze braziers framed the heart of the Roman Empire.',
    architecturalNotes:
      'Travertine limestone classical arcades with Doric, Ionic, and Corinthian half-columns, marble-faced temples with triangular pediments, triumphal arches, basalt polygonal paving (via basolata), and bronze ceremonial tripods.',
    reenactmentHighlights: [
      'Monumental 80-arcade travertine stone amphitheater & classical temple colonnades',
      'Via Sacra basalt avenue with Roman citizens, Praetorian detachments & bronze fire braziers',
      'Triumphal Arch of Titus & Imperial Forum stone monuments',
      'Full 80 AD Mediterranean & Global World Theater visible when zooming out',
    ],
    streetSignText: 'VIA SACRA • AMPHITHEATRUM FLAVIUM • AD LXXX (80)',
    bannerText: 'IMP. TITUS CAESAR VESPASIANUS AUG. • AD 80',
    secondaryBannerText: 'INAUGURAL GAMES OF THE FLAVIAN AMPHITHEATRE',
    hotspots: [
      {
        id: 'rome80-arcades',
        title: 'The 80 Travertine Entrance Arcades & Imperial Box',
        category: 'Imperial Engineering',
        yearBadge: 'AD 80',
        description:
          'Seventy-six numbered ground-level travertine arches allowed 50,000 spectators to enter and exit within fifteen minutes, while four grand axial portals were reserved for the Emperor, Vestal Virgins, and Senate.',
        citation: 'Cassius Dio, Roman History LXVI.25 • Martial, De Spectaculis (AD 80)',
        position: [-7, 2.5, -6],
        cameraOffset: [-1, 4.5, 8],
      },
      {
        id: 'rome80-viasacra',
        title: 'Via Sacra Processional Way & Triumphal Colonnade',
        category: 'Sacred Way',
        yearBadge: 'AD 80',
        description:
          'Paved with fitted volcanic leucitite basalt slabs, the Via Sacra connected the Colosseum valley to the Capitoline Hill through marble porticos and bronze shrines.',
        citation: 'Soprintendenza Speciale Archeologia Belle Arti e Paesaggio di Roma',
        position: [6, 2.0, -5],
        cameraOffset: [12, 4.2, 7],
      },
      {
        id: 'rome80-braziers',
        title: 'Ceremonial Bronze Tripods & Sanctuary Hearths',
        category: 'Civic Ritual',
        yearBadge: 'AD 80',
        description:
          'Bronze fire braziers burned incense and pine resin along the sacred precinct during the 100 days of inaugural spectacles recorded by Suetonius and Cassius Dio.',
        citation: 'Suetonius, De Vita Caesarum — Divus Titus 7.3',
        position: [-3, 1.8, 6],
        cameraOffset: [-8, 3.5, 11],
      },
    ],
    groundingSources: [
      {
        title: 'Parco Archeologico del Colosseo — Flavian Amphitheatre History (AD 80)',
        uri: 'https://colosseo.it/en/area/the-colosseum/',
        sourceType: 'web',
      },
    ],
  },
];

/**
 * 17 Simultaneous Global City Nodes laid out in the Macro 3D World Theater
 * When the user zooms out, all 17 cities are visible in 3D space with skylines,
 * active era effects (searchlights, smoke, towers), and live historical telemetry for the active year!
 */
const BASE_WORLD_CITIES: Array<{
  id: string;
  city: string;
  country: string;
  defaultAddress: string;
  lat: number;
  lng: number;
  worldX: number;
  worldZ: number;
  streetAzimuth: number;
  regionStyle: RegionStyle;
}> = [
  {
    id: 'city-nyc',
    city: 'New York',
    country: 'USA',
    defaultAddress: 'Times Square & W 42nd St, Manhattan, New York, NY',
    lat: 40.7580,
    lng: -73.9855,
    worldX: -210,
    worldZ: 85,
    streetAzimuth: 29,
    regionStyle: 'northeast_urban',
  },
  {
    id: 'city-dc',
    city: 'Washington, D.C.',
    country: 'USA',
    defaultAddress: 'Pennsylvania Ave NW & 15th St NW, Washington, DC',
    lat: 38.8977,
    lng: -77.0365,
    worldX: -245,
    worldZ: 145,
    streetAzimuth: 108,
    regionStyle: 'northeast_urban',
  },
  {
    id: 'city-chicago',
    city: 'Chicago',
    country: 'USA',
    defaultAddress: 'State St & Madison St (The Loop), Chicago, IL',
    lat: 41.8820,
    lng: -87.6278,
    worldX: -320,
    worldZ: 70,
    streetAzimuth: 0,
    regionStyle: 'midwest_main',
  },
  {
    id: 'city-detroit',
    city: 'Detroit',
    country: 'USA',
    defaultAddress: 'Woodward Ave & Campus Martius, Detroit, MI',
    lat: 42.3314,
    lng: -83.0458,
    worldX: -275,
    worldZ: 45,
    streetAzimuth: 335,
    regionStyle: 'midwest_main',
  },
  {
    id: 'city-chaco',
    city: 'Chaco Canyon',
    country: 'USA',
    defaultAddress: 'Pueblo Bonito Great House, Chaco Canyon, NM',
    lat: 36.0605,
    lng: -107.9616,
    worldX: -390,
    worldZ: 155,
    streetAzimuth: 90,
    regionStyle: 'west_coast',
  },
  {
    id: 'city-sf',
    city: 'San Francisco',
    country: 'USA',
    defaultAddress: 'Market St & Embarcadero, San Francisco, CA',
    lat: 37.7955,
    lng: -122.3937,
    worldX: -460,
    worldZ: 130,
    streetAzimuth: 52,
    regionStyle: 'west_coast',
  },
  {
    id: 'city-pearl-harbor',
    city: 'Honolulu (Pearl Harbor)',
    country: 'USA',
    defaultAddress: 'Battleship Row & Ford Island, Pearl Harbor, Honolulu, HI',
    lat: 21.3649,
    lng: -157.9501,
    worldX: -560,
    worldZ: 240,
    streetAzimuth: 45,
    regionStyle: 'west_coast',
  },
  {
    id: 'city-london',
    city: 'London',
    country: 'United Kingdom',
    defaultAddress: 'Whitehall & Parliament Square, Westminster, London',
    lat: 51.5014,
    lng: -0.1266,
    worldX: 90,
    worldZ: -65,
    streetAzimuth: 168,
    regionStyle: 'european_stone',
  },
  {
    id: 'city-paris',
    city: 'Paris',
    country: 'France',
    defaultAddress: 'Rue de Rivoli & Place de la Concorde, Paris, France',
    lat: 48.8656,
    lng: 2.3212,
    worldX: 135,
    worldZ: -10,
    streetAzimuth: 116,
    regionStyle: 'european_stone',
  },
  {
    id: 'city-normandy',
    city: 'Normandy (Omaha Sector)',
    country: 'France',
    defaultAddress: 'Rue de Grandcamp & Omaha Beach Sector, Colleville-sur-Mer, France',
    lat: 49.3697,
    lng: -0.8711,
    worldX: 75,
    worldZ: -5,
    streetAzimuth: 120,
    regionStyle: 'european_stone',
  },
  {
    id: 'city-berlin',
    city: 'Berlin',
    country: 'Germany',
    defaultAddress: 'Friedrichstraße 43–45 (Checkpoint Charlie), Berlin, Germany',
    lat: 52.5074,
    lng: 13.3904,
    worldX: 230,
    worldZ: -75,
    streetAzimuth: 175,
    regionStyle: 'european_stone',
  },
  {
    id: 'city-warsaw',
    city: 'Warsaw',
    country: 'Poland',
    defaultAddress: 'Krakowskie Przedmieście & Old Town Square, Warsaw, Poland',
    lat: 52.2497,
    lng: 21.0122,
    worldX: 305,
    worldZ: -80,
    streetAzimuth: 150,
    regionStyle: 'european_stone',
  },
  {
    id: 'city-rome',
    city: 'Rome',
    country: 'Italy',
    defaultAddress: 'Piazza del Colosseo & Via Sacra, Rome, Italy',
    lat: 41.8902,
    lng: 12.4922,
    worldX: 225,
    worldZ: 75,
    streetAzimuth: 132,
    regionStyle: 'european_stone',
  },
  {
    id: 'city-stalingrad',
    city: 'Volgograd (Stalingrad)',
    country: 'Russia',
    defaultAddress: 'Fallen Fighters Square & Volga Embankment, Volgograd',
    lat: 48.7080,
    lng: 44.5133,
    worldX: 410,
    worldZ: -35,
    streetAzimuth: 38,
    regionStyle: 'european_stone',
  },
  {
    id: 'city-cairo',
    city: 'Cairo',
    country: 'Egypt',
    defaultAddress: 'Tahrir Square & Qasr El Nil Bridge, Cairo, Egypt',
    lat: 30.0444,
    lng: 31.2357,
    worldX: 330,
    worldZ: 185,
    streetAzimuth: 75,
    regionStyle: 'european_stone',
  },
  {
    id: 'city-tokyo',
    city: 'Tokyo',
    country: 'Japan',
    defaultAddress: 'Ginza 4-Chome Crossing, Chuo City, Tokyo, Japan',
    lat: 35.6712,
    lng: 139.7665,
    worldX: 540,
    worldZ: 110,
    streetAzimuth: 42,
    regionStyle: 'modern_metropolis',
  },
];

export function getWorldCitiesForYear(year: number): WorldCityNode[] {
  return BASE_WORLD_CITIES.map((base) => {
    let yearHeadline = `${base.city} (${year})`;
    let yearStatus = 'Active Urban & Transit Corridor';
    let reenactmentMode: ReenactmentMode = 'modern_city';
    let weatherMood: WeatherMood = 'clear_golden';

    if (year < 1800) {
      reenactmentMode = 'ancient_classical';
      weatherMood = 'clear_golden';
      if (base.city === 'Rome') {
        yearHeadline =
          year <= 476
            ? `AD ${year} · Imperial Rome: Flavian Amphitheatre (Colosseum) & Forum`
            : `AD ${year} · Papal & Renaissance Rome: Classical Ruins & Basilicas`;
        yearStatus = year <= 476 ? '80-Arcade Colosseum & Via Sacra Processions' : 'Monumental Stone Architecture';
      } else if (base.city === 'Chaco Canyon') {
        yearHeadline = `AD ${year} · Ancestral Puebloan Chaco Canyon & Pueblo Bonito`;
        yearStatus = 'Great Kivas, Solar Meridian & Sandstone Masonry';
      } else if (base.city === 'London' || base.city === 'Paris') {
        yearHeadline =
          year <= 450
            ? `AD ${year} · Roman Londinium & Lutetia Garrison Towns`
            : `AD ${year} · Walled Medieval & Early Modern Capital`;
        yearStatus = 'Stone Fortifications, River Trade & Timber Guildhalls';
      } else if (base.city === 'Cairo') {
        yearHeadline = `AD ${year} · Nile Delta Citadel, Bazaar & Ancient Monuments`;
        yearStatus = 'Caravan Trade & Monumental Limestone Architecture';
      } else {
        yearHeadline = `AD ${year} · Pre-Industrial Indigenous & Historic Settlement`;
        yearStatus = 'Traditional Vernacular Architecture & Trade Routes';
      }
    } else if (year <= 1919) {
      reenactmentMode = 'early_streetcar';
      weatherMood = 'vintage_sepia';
      if (base.city === 'San Francisco') {
        yearHeadline = `${year} · ${year < 1906 ? 'Gold Coast Cable Cars & Victorian Harbor' : 'Post-1906 Reconstruction & Muni Tramways'}`;
        yearStatus = 'Electric Streetcar & Beaux-Arts Boom';
      } else if (base.city === 'New York') {
        yearHeadline = `${year} · Gilded Age & Lower Manhattan Immigrant Tenements`;
        yearStatus = 'Elevated Rail, Telegraph Poles & Steamship Port';
      } else if (base.city === 'London' || base.city === 'Paris') {
        yearHeadline = `${year} · Victorian / Belle Époque & WWI Mobilization`;
        yearStatus = year >= 1914 ? 'WWI Wartime Garrison & Blackout' : 'Gaslit Imperial Metropolis';
      } else {
        yearHeadline = `${year} · Steam & Electric Streetcar Industrialization`;
        yearStatus = 'Turn-of-the-Century Streetcar Grid';
      }
    } else if (year >= 1920 && year <= 1928) {
      reenactmentMode = 'roaring_twenties';
      weatherMood = 'clear_golden';
      yearHeadline = `${year} · Roaring Twenties Skyscraper & Jazz Era`;
      yearStatus = 'Art Deco Construction & Automotive Boom';
    } else if (year >= 1929 && year <= 1938) {
      reenactmentMode = 'depression_breadline';
      weatherMood = 'depression_overcast';
      if (base.city === 'New York') {
        yearHeadline = `${year} · Times Square Breadlines & Central Park Hooverville`;
        yearStatus = '24.9% Unemployment · Soup Kitchens Active';
      } else if (base.city === 'Washington, D.C.') {
        yearHeadline = `${year} · Bonus Army Encampment & New Deal Legislation`;
        yearStatus = 'Federal Relief & WPA Mobilization';
      } else if (base.city === 'Chicago' || base.city === 'Detroit') {
        yearHeadline = `${year} · Industrial Rust, Labor Marches & Soup Kitchens`;
        yearStatus = 'Factory Shutdowns & Relief Queues';
      } else if (base.city === 'Berlin') {
        yearHeadline = `${year} · Weimar Hyperinflation Aftermath & Political Turmoil`;
        yearStatus = 'Economic Crisis & Street Mobilization';
      } else {
        yearHeadline = `${year} · Global Great Depression & Trade Collapse`;
        yearStatus = 'Municipal Relief & Shuttered Commerce';
      }
    } else if (year >= 1939 && year <= 1945) {
      if (base.city === 'London') {
        reenactmentMode = 'wwii_blitz';
        weatherMood = 'wwii_night_blitz';
        yearHeadline = `${year} · The Blitz: Night Air Raids & Searchlight Batteries`;
        yearStatus = 'Anti-Aircraft Command & Underground Shelters';
      } else if (base.city === 'Paris' || base.city.includes('Normandy')) {
        reenactmentMode = 'wwii_liberation';
        weatherMood = 'clear_golden';
        yearHeadline =
          year >= 1944
            ? `${year} · Allied D-Day & Liberation Armored Advance`
            : `${year} · Occupied Zone & Underground Resistance Network`;
        yearStatus = year >= 1944 ? 'M4 Sherman Convoys & FFI Barricades' : 'Blackout & Resistance Cells';
      } else if (base.city === 'Berlin' || base.city === 'Warsaw' || base.city.includes('Stalingrad')) {
        reenactmentMode = 'wwii_blitz';
        weatherMood = 'wwii_night_blitz';
        yearHeadline = `${year} · Eastern & European Theater Urban Frontline`;
        yearStatus = 'Heavy Fortifications, Searchlights & Armor';
      } else if (base.city.includes('Pearl Harbor') || base.city === 'Tokyo') {
        reenactmentMode = 'wwii_blitz';
        weatherMood = 'wwii_night_blitz';
        yearHeadline = `${year} · Pacific Theater Naval & Aerial Operations`;
        yearStatus = 'Air Raid Defense & Fleet Mobilization';
      } else {
        reenactmentMode = 'wwii_liberation';
        weatherMood = 'clear_golden';
        yearHeadline = `${year} · Arsenal of Democracy: Wartime Production & War Bonds`;
        yearStatus = '24-Hour Defense Factories & Troop Trains';
      }
    } else if (year >= 1946 && year <= 1989) {
      reenactmentMode = 'cold_war';
      weatherMood = base.city === 'Berlin' ? 'rain_noir' : 'clear_golden';
      if (base.city === 'Berlin') {
        yearHeadline = `${year} · Divided Berlin: Checkpoint Charlie & Sector Wall`;
        yearStatus = 'Allied Watchtowers & Cold War Standoff';
      } else if (base.city === 'Washington, D.C.') {
        yearHeadline = `${year} · Civil Rights Marches & Cold War Diplomacy`;
        yearStatus = 'National Mall Gatherings & Federal Expansion';
      } else if (base.city === 'Tokyo') {
        yearHeadline = `${year} · Post-War Economic Miracle & Shinkansen Era`;
        yearStatus = 'Neon Metropolis & High-Speed Transit';
      } else {
        yearHeadline = `${year} · ${year >= 1980 ? '1980s Financial & Neon Metropolis Boom' : 'Mid-Century Highway Boom & Cold War Metropolis'}`;
        yearStatus = 'Modernist Towers & Urban Transit';
      }
    } else {
      reenactmentMode = 'modern_city';
      weatherMood = 'modern_daylight';
      yearHeadline = `${year} · Contemporary High-Density Digital Twin`;
      yearStatus = 'Modern Glass Skyline & Smart Transit';
    }

    return {
      ...base,
      yearHeadline,
      yearStatus,
      reenactmentMode,
      weatherMood,
    };
  });
}

export function inferReenactmentModeFromYearAndPrompt(
  year: number,
  customPrompt: string,
  address: string
): { reenactmentMode: ReenactmentMode; weatherMood: WeatherMood; eraLabel: string } {
  const lower = `${customPrompt} ${address}`.toLowerCase();

  if (
    year < 1800 ||
    lower.includes('colosseum') ||
    lower.includes('chaco') ||
    lower.includes('pueblo bonito') ||
    lower.includes('roman') ||
    lower.includes('ancient')
  ) {
    return {
      reenactmentMode: 'ancient_classical',
      weatherMood: 'clear_golden',
      eraLabel: `AD ${year} · Classical Antiquity & Monumental Masonry Era`,
    };
  }
  if (lower.includes('hooverville') || lower.includes('shanty')) {
    return {
      reenactmentMode: 'depression_hooverville',
      weatherMood: 'depression_overcast',
      eraLabel: `${year} · Great Depression Hooverville Encampment`,
    };
  }
  if (lower.includes('depression') || lower.includes('breadline') || lower.includes('soup kitchen')) {
    return {
      reenactmentMode: 'depression_breadline',
      weatherMood: 'depression_overcast',
      eraLabel: `${year} · Great Depression Relief & Street Life`,
    };
  }
  if (lower.includes('blitz') || lower.includes('air raid') || lower.includes('searchlight') || lower.includes('blackout') || lower.includes('pearl harbor')) {
    return {
      reenactmentMode: 'wwii_blitz',
      weatherMood: 'wwii_night_blitz',
      eraLabel: `${year} · World War II Air Defense & Blackout`,
    };
  }
  if (lower.includes('wwii') || lower.includes('world war') || lower.includes('tank') || lower.includes('liberation') || lower.includes('convoy') || lower.includes('normandy')) {
    return {
      reenactmentMode: 'wwii_liberation',
      weatherMood: 'clear_golden',
      eraLabel: `${year} · World War II Tactical & Homefront Reenactment`,
    };
  }

  if (year <= 1919) {
    return {
      reenactmentMode: 'early_streetcar',
      weatherMood: 'vintage_sepia',
      eraLabel: `${year} · ${year < 1900 ? '19th-Century Gilded Age & Horse/Steam Transit' : 'Turn-of-the-Century & Electric Streetcar Era'}`,
    };
  }
  if (year >= 1920 && year <= 1928) {
    return {
      reenactmentMode: 'roaring_twenties',
      weatherMood: 'clear_golden',
      eraLabel: `${year} · Roaring Twenties & Art Deco Boom`,
    };
  }
  if (year >= 1929 && year <= 1938) {
    return {
      reenactmentMode: 'depression_breadline',
      weatherMood: 'depression_overcast',
      eraLabel: `${year} · The Great Depression & New Deal Era`,
    };
  }
  if (year >= 1939 && year <= 1945) {
    const isEuroNight =
      lower.includes('london') ||
      lower.includes('berlin') ||
      lower.includes('warsaw') ||
      lower.includes('stalingrad') ||
      lower.includes('tokyo') ||
      lower.includes('night');
    return {
      reenactmentMode: isEuroNight ? 'wwii_blitz' : 'wwii_liberation',
      weatherMood: isEuroNight ? 'wwii_night_blitz' : 'clear_golden',
      eraLabel: `${year} · World War II Global Conflict & Mobilization`,
    };
  }
  if (year >= 1946 && year <= 1989) {
    return {
      reenactmentMode: 'cold_war',
      weatherMood: year < 1965 ? 'rain_noir' : 'clear_golden',
      eraLabel: `${year} · ${year >= 1980 ? '1980s Cold War & Neon Metropolis Era' : 'Post-War Boom, Civil Rights & Cold War Era'}`,
    };
  }
  return {
    reenactmentMode: 'modern_city',
    weatherMood: 'modern_daylight',
    eraLabel: `${year} · Contemporary Urban Digital Twin`,
  };
}

export function buildDynamicBlueprint(params: {
  address: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  year: number;
  streetAzimuth: number;
  regionStyle: RegionStyle;
  customPrompt?: string;
  aiData?: Partial<HistoricalSceneBlueprint>;
}): HistoricalSceneBlueprint {
  const {
    address,
    city,
    country,
    lat,
    lng,
    year,
    streetAzimuth,
    regionStyle,
    customPrompt = '',
    aiData,
  } = params;

  const inferred = inferReenactmentModeFromYearAndPrompt(year, customPrompt, address);
  const reenactmentMode = (aiData?.reenactmentMode as ReenactmentMode) || inferred.reenactmentMode;
  const weatherMood = (aiData?.weatherMood as WeatherMood) || inferred.weatherMood;
  const shortStreet = address.split(',')[0].trim().toUpperCase();

  let defaultBanner = `${shortStreet} • ${year < 1000 ? `AD ${year}` : year}`;
  let secondaryBanner = `${city.toUpperCase()} HISTORICAL ARCHIVE`;

  if (reenactmentMode === 'ancient_classical') {
    defaultBanner = `${shortStreet} • MONUMENTAL PRECINCT • AD ${year}`;
    secondaryBanner = `${city.toUpperCase()} CLASSICAL / HERITAGE SURVEY`;
  } else if (reenactmentMode === 'depression_breadline') {
    defaultBanner = 'FREE SOUP • COFFEE & BREAD';
    secondaryBanner = `${city.toUpperCase()} EMERGENCY RELIEF • ${year}`;
  } else if (reenactmentMode === 'depression_hooverville') {
    defaultBanner = `HOOVERVILLE CAMP • ${city.toUpperCase()} ${year}`;
    secondaryBanner = 'UNEMPLOYED CITIZENS MUTUAL AID';
  } else if (reenactmentMode === 'wwii_blitz') {
    defaultBanner = 'PUBLIC AIR RAID SHELTER ➔';
    secondaryBanner = `CIVIL DEFENSE SECTOR • ${year}`;
  } else if (reenactmentMode === 'wwii_liberation') {
    defaultBanner = `VICTORY DRIVE & MOBILIZATION • ${year}`;
    secondaryBanner = `${city.toUpperCase()} WARTIME DEFENSE CORPS`;
  } else if (reenactmentMode === 'early_streetcar') {
    defaultBanner = `${city.toUpperCase()} ${year < 1895 ? 'HORSE & STEAM TRAMWAY' : 'ELECTRIC TRAMWAY'} • ${year}`;
    secondaryBanner = 'MAIN THOROUGHFARE & COMMERCE';
  }

  const defaultHotspots = [
    {
      id: `hs-${year}-1`,
      title: `${shortStreet} Primary Reenactment Focal Point (${year})`,
      category: inferred.eraLabel.split('·')[1]?.trim() || 'Historical Landmark',
      yearBadge: String(year),
      description:
        customPrompt
          ? `Custom historical reconstruction for "${customPrompt}" at ${address} in ${year}, grounded at ${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E.`
          : `Reconstructed street-level view of ${shortStreet} in ${city} during ${year}, featuring period-accurate facades, fire escapes, vehicles, and citizen formations.`,
      citation: `${city} Municipal & Geodesic Historical Survey (${year})`,
      position: [-6, 2.2, -4] as [number, number, number],
      cameraOffset: [2, 4.5, 9] as [number, number, number],
    },
    {
      id: `hs-${year}-2`,
      title:
        reenactmentMode.startsWith('depression')
          ? `${year} Municipal Relief Queue & Warming Station`
          : reenactmentMode.startsWith('wwii')
          ? `${year} Wartime Defense Post, AA Battery & Sandbags`
          : `${year} Streetlife & Period Transit Corridor`,
      category: 'Social & Urban History',
      yearBadge: String(year),
      description:
        reenactmentMode.startsWith('depression')
          ? `During ${year}, local relief organizations along ${shortStreet} distributed daily bread and soup rations while unemployed workers gathered around street-corner coal braziers and apple stands.`
          : reenactmentMode.startsWith('wwii')
          ? `During World War II (${year}), civil defense wardens, anti-aircraft emplacements, military convoys, and sandbagged facades transformed daily life across ${city}.`
          : `Pedestrian formations and period transit along ${shortStreet} reflect the architectural and economic character of ${city} in ${year}.`,
      citation: `National Historical Archives • ${city} Series (${year})`,
      position: [5, 2.0, -5] as [number, number, number],
      cameraOffset: [11, 4.0, 6] as [number, number, number],
    },
    {
      id: `hs-${year}-3`,
      title: `${year} Period Architecture, Fire Escapes & Storefront Row`,
      category: 'Architectural Survey',
      yearBadge: String(year),
      description: `Multi-story ${regionStyle.replace('_', ' ')} masonry, cornice profiles, wrought-iron fire escapes, rooftop water towers, and street-level awnings reconstructed for ${address} in ${year}.`,
      citation: `Historic Building Survey • Sector ${lat.toFixed(2)}, ${lng.toFixed(2)}`,
      position: [11, 4.0, -8] as [number, number, number],
      cameraOffset: [3, 5.5, 6] as [number, number, number],
    },
    {
      id: `hs-${year}-4`,
      title: `${year} Cross-Street Intersection & Period Newsstand`,
      category: 'Urban Infrastructure',
      yearBadge: String(year),
      description: `Period vehicles, overhead telegraph/catenary lines, and street-corner newspaper kiosk operating along ${shortStreet} at azimuth ${streetAzimuth}° during ${year}.`,
      citation: `Department of Streets & Transit Archival Record (${year})`,
      position: [0, 1.8, 3] as [number, number, number],
      cameraOffset: [-9, 4.0, 10] as [number, number, number],
    },
  ];

  const mappedHotspots =
    aiData?.hotspots && aiData.hotspots.length > 0
      ? aiData.hotspots.slice(0, 5).map((h: any, idx: number) => {
          const fallbackPos = defaultHotspots[idx % defaultHotspots.length];
          return {
            id: `ai-hs-${year}-${idx}`,
            title: h.title || fallbackPos.title,
            category: h.category || fallbackPos.category,
            yearBadge: h.yearBadge || String(year),
            description: h.description || fallbackPos.description,
            citation: h.citation || fallbackPos.citation,
            position: fallbackPos.position,
            cameraOffset: fallbackPos.cameraOffset,
          };
        })
      : defaultHotspots;

  return {
    id: `custom-${lat.toFixed(3)}-${lng.toFixed(3)}-${year}`,
    address,
    city,
    country,
    lat,
    lng,
    year,
    streetAzimuth,
    regionStyle,
    weatherMood,
    reenactmentMode,
    headline:
      aiData?.headline ||
      `${city} (${year}): ${shortStreet} Historical Reconstruction`,
    eraLabel: aiData?.eraLabel || inferred.eraLabel,
    historicalSummary:
      aiData?.historicalSummary ||
      `Historical 3D reconstruction of ${address} (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E) during the year ${year}. The scene synthesizes the local architectural morphology of ${city}, multi-block intersecting street grids, period vehicles, and documented social conditions of the ${inferred.eraLabel.split('·')[1]?.trim() || 'era'}.${
        customPrompt ? `\n\nSpecial Reenactment Directive active: "${customPrompt}".` : ''
      }`,
    architecturalNotes:
      aiData?.architecturalNotes ||
      `Reconstructed ${regionStyle.replace('_', ' ')} multi-block street grid oriented at ${streetAzimuth}° azimuth with ${year}-era masonry, recessed shopfronts, fire escapes, rooftop water tanks, streetlamps, and surrounding regional cities visible upon zooming out.`,
    reenactmentHighlights:
      aiData?.reenactmentHighlights && aiData.reenactmentHighlights.length > 0
        ? aiData.reenactmentHighlights
        : [
            `Hyper-detailed ${year} architectural facades, fire escapes, awnings & rooftop water towers`,
            `Active ${reenactmentMode.replace('_', ' ')} actors, vehicles, and street-corner newsstands`,
            `Continuous zoom-out to 15+ neighboring & global cities active simultaneously in ${year}`,
            `Interactive 3D historical hotspots with primary-source citations`,
          ],
    streetSignText: aiData?.streetSignText || `${shortStreet} • ${year}`,
    bannerText: defaultBanner,
    secondaryBannerText: secondaryBanner,
    hotspots: mappedHotspots,
    groundingSources: aiData?.groundingSources || [],
    spatialSummary: aiData?.spatialSummary,
    customPromptUsed: customPrompt,
    synthesizedByAi: Boolean(aiData?.synthesizedByAi),
  };
}
