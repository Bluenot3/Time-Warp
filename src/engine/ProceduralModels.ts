import * as THREE from 'three';
import {
  GranularEntityRecord,
  HistoricalSceneBlueprint,
  WorldCityNode,
} from '../types/history';
import { getWorldCitiesForYear } from '../data/presets';
import {
  createBannerSignTexture,
  createFacadeBumpTexture,
  createFacadeTexture,
  createRoadBumpTexture,
  createRoadTexture,
  createWorldTheaterMapTexture,
} from './ProceduralTextures';

export interface AnimatedSceneHandles {
  rootGroup: THREE.Group;
  clickableHotspots: THREE.Object3D[];
  clickableWorldCities: THREE.Object3D[];
  clickableEntities: THREE.Object3D[];
  cutawayMaterials: THREE.MeshStandardMaterial[];
  skyDomeUniforms: {
    uTime: { value: number };
    uSolarElevation: { value: number };
    uTopColor: { value: THREE.Color };
    uHorizonColor: { value: THREE.Color };
  } | null;
  worldCityAnchors: Array<{
    cityNode: WorldCityNode;
    worldPos: THREE.Vector3;
    beaconMesh: THREE.Object3D;
  }>;
  vehicles: Array<{
    group: THREE.Group;
    speed: number;
    axis: 'x' | 'z';
    laneCoord: number;
    direction: 1 | -1;
    minBound: number;
    maxBound: number;
    turret?: THREE.Object3D;
  }>;
  aircraft: Array<{
    group: THREE.Group;
    propellers: THREE.Object3D[];
    speed: number;
    baseY: number;
    baseZ: number;
    phase: number;
  }>;
  searchlights: Array<{
    pivot: THREE.Object3D;
    phase: number;
    speed: number;
  }>;
  fireLights: Array<{
    light: THREE.PointLight;
    flameMesh: THREE.Mesh;
    baseIntensity: number;
    phase: number;
  }>;
  smokePuffs: Array<{
    mesh: THREE.Mesh;
    baseX: number;
    baseY: number;
    baseZ: number;
    speedY: number;
    phase: number;
    maxRise: number;
  }>;
  crowdActors: Array<{
    group: THREE.Group;
    leftLeg?: THREE.Object3D;
    rightLeg?: THREE.Object3D;
    leftArm?: THREE.Object3D;
    rightArm?: THREE.Object3D;
    baseX: number;
    baseZ: number;
    walkSpeed: number;
    axis: 'x' | 'z';
    phase: number;
    isStaticQueue: boolean;
  }>;
  weatherParticles: THREE.Points | null;
}

/**
 * Builds a Rooftop Cedar Water Tower on a 4-Legged Steel Trestle (Classic NYC / Chicago / Urban Roof Detail)
 */
function buildRooftopWaterTower(): THREE.Group {
  const tower = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x6e4e32,
    roughness: 0.85,
    metalness: 0.08,
  });
  const ironHoopsMat = new THREE.MeshStandardMaterial({
    color: 0x1e2226,
    roughness: 0.5,
    metalness: 0.75,
  });
  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x2d3238,
    roughness: 0.7,
    metalness: 0.3,
  });

  // 4 Steel Trestle Legs + Cross Bracing
  for (const lx of [-0.65, 0.65]) {
    for (const lz of [-0.65, 0.65]) {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.06, 2.2, 6),
        ironHoopsMat
      );
      leg.position.set(lx, 1.1, lz);
      tower.add(leg);
    }
  }
  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.15, 0.14, 16),
    ironHoopsMat
  );
  platform.position.y = 2.2;
  tower.add(platform);

  // Cedar Stave Tank Drum
  const drum = new THREE.Mesh(
    new THREE.CylinderGeometry(1.02, 1.08, 2.3, 18),
    woodMat
  );
  drum.position.y = 3.4;
  drum.castShadow = true;
  tower.add(drum);

  // Steel Tension Hoops around Barrel
  for (const hy of [2.5, 3.1, 3.7, 4.3]) {
    const hoop = new THREE.Mesh(
      new THREE.TorusGeometry(1.06, 0.025, 6, 24),
      ironHoopsMat
    );
    hoop.rotation.x = Math.PI / 2;
    hoop.position.y = hy;
    tower.add(hoop);
  }

  // Conical Shingle Cap & Finial
  const coneRoof = new THREE.Mesh(
    new THREE.ConeGeometry(1.18, 0.85, 18),
    roofMat
  );
  coneRoof.position.y = 4.95;
  coneRoof.castShadow = true;
  tower.add(coneRoof);

  return tower;
}

/**
 * Builds a Multi-Story Cast-Iron Tenement Fire Escape (Balcony Grates, Railings & Diagonal Ladders)
 */
function buildCastIronFireEscape(stories: number): THREE.Group {
  const escapeGroup = new THREE.Group();
  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x181b1e,
    roughness: 0.48,
    metalness: 0.82,
  });

  const maxFloors = Math.min(stories - 1, 6);
  for (let s = 1; s <= maxFloors; s++) {
    const y = s * 1.65;
    // Balcony grate platform
    const platform = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.08, 0.85),
      ironMat
    );
    platform.position.set(0, y, 0.42);
    escapeGroup.add(platform);

    // Front & side iron railings
    const frontRail = new THREE.Mesh(
      new THREE.BoxGeometry(2.6, 0.55, 0.04),
      ironMat
    );
    frontRail.position.set(0, y + 0.3, 0.82);
    escapeGroup.add(frontRail);

    // Diagonal iron stair flight connecting to floor below
    const stair = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 1.95, 0.32),
      ironMat
    );
    stair.position.set((s % 2 === 0 ? 1 : -1) * 0.45, y - 0.82, 0.48);
    stair.rotation.z = (s % 2 === 0 ? 1 : -1) * 0.68;
    escapeGroup.add(stair);
  }

  return escapeGroup;
}

/**
 * Builds a Period Sidewalk Newspaper Kiosk & Headline Stand
 */
function buildPeriodNewsstand(renderer: THREE.WebGLRenderer, year: number): THREE.Group {
  const stand = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({
    color: 0x3f2e21,
    roughness: 0.82,
  });
  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.6,
    metalness: 0.35,
  });
  const paperMat = new THREE.MeshStandardMaterial({
    color: 0xe7dec8,
    roughness: 0.9,
  });

  // Counter base
  const counter = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.05, 1.15), woodMat);
  counter.position.y = 0.52;
  counter.castShadow = true;
  stand.add(counter);

  // Back wall & canopy posts
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 0.12), woodMat);
  backWall.position.set(0, 1.1, -0.52);
  stand.add(backWall);

  const canopy = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.18, 1.55), roofMat);
  canopy.position.set(0, 2.28, 0);
  canopy.rotation.x = 0.08;
  canopy.castShadow = true;
  stand.add(canopy);

  // Stacked newspaper bundles on counter
  for (const px of [-0.65, 0, 0.65]) {
    const stack = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.24, 0.36), paperMat);
    stack.position.set(px, 1.16, 0.12);
    stand.add(stack);
  }

  // Headline placard sign on fascia
  const signTex = createBannerSignTexture(
    renderer,
    `DAILY EXTRA • ${year} EDITION • 2¢`,
    '#f4ead5',
    '#111315',
    '#b91c1c'
  );
  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, 0.38, 0.06),
    new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.5 })
  );
  signBoard.position.set(0, 2.52, 0.72);
  stand.add(signBoard);

  return stand;
}

/**
 * Builds a 1930s Great Depression Unemployed Apple Vendor Crate Stand
 */
function buildDepressionAppleStand(renderer: THREE.WebGLRenderer): THREE.Group {
  const group = new THREE.Group();
  const crateMat = new THREE.MeshStandardMaterial({
    color: 0x7c5836,
    roughness: 0.88,
  });
  const appleMat = new THREE.MeshStandardMaterial({
    color: 0x991b1b,
    roughness: 0.35,
    metalness: 0.05,
  });

  // Two stacked wooden crates
  const lowerCrate = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.55, 0.75), crateMat);
  lowerCrate.position.y = 0.28;
  lowerCrate.castShadow = true;
  group.add(lowerCrate);

  const upperCrate = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.45, 0.65), crateMat);
  upperCrate.position.set(0, 0.78, 0);
  upperCrate.rotation.y = 0.06;
  upperCrate.castShadow = true;
  group.add(upperCrate);

  // Pyramid of red apples on top of crate
  for (let ax = -0.3; ax <= 0.3; ax += 0.15) {
    for (let az = -0.18; az <= 0.18; az += 0.18) {
      const apple = new THREE.Mesh(new THREE.SphereGeometry(0.065, 8, 8), appleMat);
      apple.position.set(ax, 1.06, az);
      group.add(apple);
    }
  }

  // Placard: "UNEMPLOYED • BUY APPLES 5¢"
  const signTex = createBannerSignTexture(
    renderer,
    'UNEMPLOYED • BUY APPLES 5¢',
    '#e7dec8',
    '#18130e',
    '#991b1b'
  );
  const placard = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.32, 0.04),
    new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.7 })
  );
  placard.position.set(0, 1.42, -0.25);
  group.add(placard);

  return group;
}

/**
 * Builds a WWII 40mm Bofors Anti-Aircraft Gun Pit surrounded by stacked sandbags
 */
function buildWW2AntiAircraftBattery(): THREE.Group {
  const battery = new THREE.Group();
  const sandbagMat = new THREE.MeshStandardMaterial({
    color: 0x8c7b60,
    roughness: 0.92,
  });
  const gunMetal = new THREE.MeshStandardMaterial({
    color: 0x2f362d,
    roughness: 0.42,
    metalness: 0.72,
  });

  // Circular sandbagged emplacement ring (16 segments x 3 courses high)
  const radius = 2.15;
  for (let row = 0; row < 3; row++) {
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2 + row * 0.18;
      // Leave small entry gap at back
      if (Math.abs(angle - Math.PI) < 0.35) continue;
      const bag = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.28, 0.42), sandbagMat);
      bag.position.set(
        Math.cos(angle) * radius,
        0.18 + row * 0.26,
        Math.sin(angle) * radius
      );
      bag.rotation.y = -angle + Math.PI / 2;
      bag.castShadow = true;
      battery.add(bag);
    }
  }

  // Central Bofors AA Turntable & Twin Elevated Barrels
  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.65, 0.75, 12),
    gunMetal
  );
  pedestal.position.y = 0.38;
  battery.add(pedestal);

  const carriage = new THREE.Group();
  carriage.position.y = 0.85;
  carriage.rotation.y = 0.45;

  const breech = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.48, 0.65), gunMetal);
  carriage.add(breech);

  const shield = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.95, 1.25), gunMetal);
  shield.position.set(0.35, 0.22, 0);
  shield.rotation.z = -0.25;
  carriage.add(shield);

  for (const zSign of [-0.16, 0.16]) {
    const barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.07, 2.4, 10),
      gunMetal
    );
    barrel.rotation.z = -Math.PI / 4;
    barrel.position.set(0.95, 0.85, zSign);
    carriage.add(barrel);
  }

  battery.add(carriage);
  return battery;
}

/**
 * Builds a composite 11-part 1930s Great Depression Sedan (Ford Model A / Coupe)
 */
function buildVintage1930sCar(colorHex: number): THREE.Group {
  const car = new THREE.Group();

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: colorHex,
    roughness: 0.3,
    metalness: 0.55,
    clearcoat: 0.75,
    clearcoatRoughness: 0.18,
  });
  const fenderMat = new THREE.MeshStandardMaterial({
    color: 0x111315,
    roughness: 0.42,
    metalness: 0.45,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.14,
    metalness: 0.94,
  });
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x161616,
    roughness: 0.86,
    metalness: 0.05,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xdbeafe,
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.75,
    transparent: true,
    opacity: 0.7,
  });
  const lampMat = new THREE.MeshStandardMaterial({
    color: 0xfff3c4,
    emissive: 0xffd166,
    emissiveIntensity: 1.9,
    roughness: 0.2,
  });

  // Chassis & running boards
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(3.85, 0.22, 1.68), fenderMat);
  chassis.position.y = 0.42;
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  car.add(chassis);

  // Front & rear bumpers
  for (const xSign of [-1.98, 1.98]) {
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 1.72), chromeMat);
    bumper.position.set(xSign, 0.42, 0);
    car.add(bumper);
  }

  // Engine hood
  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.66, 1.15), bodyMat);
  hood.position.set(1.05, 0.84, 0);
  hood.castShadow = true;
  car.add(hood);

  // Passenger cabin
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.98, 1.34), bodyMat);
  cabin.position.set(-0.35, 1.02, 0);
  cabin.castShadow = true;
  car.add(cabin);

  // Sun visor & roof molding
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.06, 1.36), fenderMat);
  visor.position.set(0.62, 1.46, 0);
  visor.rotation.z = -0.22;
  car.add(visor);

  // Windshield & side windows
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.42, 1.38), glassMat);
  windshield.position.set(-0.32, 1.18, 0);
  car.add(windshield);

  // Chrome radiator grille & ornament
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.68, 0.92), chromeMat);
  grille.position.set(1.75, 0.85, 0);
  car.add(grille);

  // Dual headlamps
  for (const zSign of [-1, 1]) {
    const lamp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.14, 0.15, 12),
      lampMat
    );
    lamp.rotation.z = Math.PI / 2;
    lamp.position.set(1.8, 0.92, zSign * 0.56);
    car.add(lamp);
  }

  // 4 Spoked wheels with chrome hubcaps + rear spare tire
  const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.22, 16);
  wheelGeo.rotateX(Math.PI / 2);
  const hubGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.25, 12);
  hubGeo.rotateX(Math.PI / 2);

  const wheelPositions: Array<[number, number, number]> = [
    [1.22, 0.38, 0.78],
    [1.22, 0.38, -0.78],
    [-1.18, 0.38, 0.78],
    [-1.18, 0.38, -0.78],
  ];
  for (const [wx, wy, wz] of wheelPositions) {
    const w = new THREE.Mesh(wheelGeo, tireMat);
    w.position.set(wx, wy, wz);
    w.castShadow = true;
    car.add(w);

    const hub = new THREE.Mesh(hubGeo, chromeMat);
    hub.position.set(wx, wy, wz);
    car.add(hub);
  }

  const spare = new THREE.Mesh(wheelGeo, tireMat);
  spare.rotation.y = Math.PI / 2;
  spare.position.set(-1.82, 0.78, 0);
  car.add(spare);

  return car;
}

/**
 * Builds a composite 10-part WWII M4 Sherman Tank with bogie road wheels & rotating turret
 */
function buildWW2ShermanTank(): { group: THREE.Group; turret: THREE.Object3D } {
  const tank = new THREE.Group();

  const oliveDrab = new THREE.MeshStandardMaterial({
    color: 0x3b442b,
    roughness: 0.72,
    metalness: 0.28,
  });
  const trackMat = new THREE.MeshStandardMaterial({
    color: 0x1c1d1a,
    roughness: 0.88,
    metalness: 0.45,
  });
  const gunSteel = new THREE.MeshStandardMaterial({
    color: 0x2b3024,
    roughness: 0.42,
    metalness: 0.68,
  });
  const starDecalMat = new THREE.MeshStandardMaterial({
    color: 0xf4f1ea,
    roughness: 0.6,
    metalness: 0.1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  });

  // Left & Right Caterpillar Track Pods + 3 VVSS Bogie Wheel Assemblies per side
  for (const zSign of [-1, 1]) {
    const track = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.78, 0.56), trackMat);
    track.position.set(0, 0.39, zSign * 1.15);
    track.castShadow = true;
    track.receiveShadow = true;
    tank.add(track);

    for (const bx of [-1.35, 0, 1.35]) {
      const bogie = new THREE.Mesh(
        new THREE.CylinderGeometry(0.28, 0.28, 0.62, 12),
        gunSteel
      );
      bogie.rotation.x = Math.PI / 2;
      bogie.position.set(bx, 0.32, zSign * 1.15);
      tank.add(bogie);
    }
  }

  const lowerHull = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.68, 1.95), oliveDrab);
  lowerHull.position.set(0, 0.68, 0);
  lowerHull.castShadow = true;
  tank.add(lowerHull);

  const upperHull = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.62, 2.15), oliveDrab);
  upperHull.position.set(-0.15, 1.22, 0);
  upperHull.castShadow = true;
  tank.add(upperHull);

  const sideStar = new THREE.Mesh(new THREE.CircleGeometry(0.28, 5), starDecalMat);
  sideStar.position.set(0, 1.24, 1.09);
  tank.add(sideStar);

  const turret = new THREE.Group();
  turret.position.set(-0.1, 1.65, 0);

  const turretDome = new THREE.Mesh(
    new THREE.CylinderGeometry(0.88, 1.02, 0.68, 16),
    oliveDrab
  );
  turretDome.castShadow = true;
  turret.add(turretDome);

  const mantlet = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.44, 0.72), gunSteel);
  mantlet.position.set(0.92, 0.02, 0);
  turret.add(mantlet);

  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.11, 2.45, 12),
    gunSteel
  );
  barrel.rotation.z = Math.PI / 2;
  barrel.position.set(1.98, 0.04, 0);
  barrel.castShadow = true;
  turret.add(barrel);

  const cupola = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.34, 0.24, 12),
    oliveDrab
  );
  cupola.position.set(-0.25, 0.42, 0.22);
  turret.add(cupola);

  // Whip radio antenna on turret rear
  const antenna = new THREE.Mesh(
    new THREE.CylinderGeometry(0.01, 0.015, 1.6, 6),
    gunSteel
  );
  antenna.position.set(-0.65, 1.1, -0.35);
  turret.add(antenna);

  tank.add(turret);
  return { group: tank, turret };
}

/**
 * Builds a composite 9-part 1912 Electric Streetcar / Tram
 */
function buildElectricStreetcar(): THREE.Group {
  const tram = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x7c2d12,
    roughness: 0.42,
    metalness: 0.25,
  });
  const creamTrim = new THREE.MeshStandardMaterial({
    color: 0xf3e8d2,
    roughness: 0.5,
    metalness: 0.1,
  });
  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x292524,
    roughness: 0.75,
    metalness: 0.2,
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xe5a93c,
    roughness: 0.2,
    metalness: 0.88,
  });
  const windowLit = new THREE.MeshStandardMaterial({
    color: 0xffe4a0,
    emissive: 0xf59e0b,
    emissiveIntensity: 0.9,
    roughness: 0.2,
  });

  const bogie = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.45, 1.9), roofMat);
  bogie.position.y = 0.38;
  bogie.castShadow = true;
  tram.add(bogie);

  const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(6.8, 1.15, 2.2), bodyMat);
  lowerBody.position.y = 1.15;
  lowerBody.castShadow = true;
  tram.add(lowerBody);

  const windowBand = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.95, 2.16), creamTrim);
  windowBand.position.y = 2.15;
  tram.add(windowBand);

  const glassStrip = new THREE.Mesh(new THREE.BoxGeometry(5.8, 0.68, 2.22), windowLit);
  glassStrip.position.y = 2.18;
  tram.add(glassStrip);

  const mainRoof = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.22, 2.3), roofMat);
  mainRoof.position.y = 2.72;
  tram.add(mainRoof);

  const clerestory = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.28, 1.35), roofMat);
  clerestory.position.y = 2.95;
  tram.add(clerestory);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, 2.6, 8), brassMat);
  pole.rotation.z = 0.55;
  pole.position.set(-0.6, 3.85, 0);
  tram.add(pole);

  for (const xSign of [-1, 1]) {
    const lamp = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.16, 12),
      brassMat
    );
    lamp.rotation.z = Math.PI / 2;
    lamp.position.set(xSign * 3.45, 1.05, 0);
    tram.add(lamp);
  }

  return tram;
}

/**
 * Builds a composite WWII Twin-Engine Aircraft with spinning propellers
 */
function buildWW2Aircraft(): { group: THREE.Group; propellers: THREE.Object3D[] } {
  const plane = new THREE.Group();
  const fuselageMat = new THREE.MeshStandardMaterial({
    color: 0x2d3748,
    roughness: 0.5,
    metalness: 0.6,
  });
  const propMat = new THREE.MeshBasicMaterial({
    color: 0xe2e8f0,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
  });

  const fuselage = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.55, 5.2, 8, 16),
    fuselageMat
  );
  fuselage.rotation.z = Math.PI / 2;
  plane.add(fuselage);

  const wing = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.14, 9.4), fuselageMat);
  wing.position.set(0.3, 0, 0);
  plane.add(wing);

  const hStab = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 3.2), fuselageMat);
  hStab.position.set(-2.6, 0.1, 0);
  plane.add(hStab);

  const vFin = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.3, 0.12), fuselageMat);
  vFin.position.set(-2.6, 0.65, 0);
  plane.add(vFin);

  const propellers: THREE.Object3D[] = [];
  for (const zSign of [-1, 1]) {
    const nacelle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.28, 1.4, 12),
      fuselageMat
    );
    nacelle.rotation.z = Math.PI / 2;
    nacelle.position.set(0.85, -0.05, zSign * 2.2);
    plane.add(nacelle);

    const propBlade = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.45, 0.16), propMat);
    propBlade.position.set(1.58, -0.05, zSign * 2.2);
    plane.add(propBlade);
    propellers.push(propBlade);
  }

  return { group: plane, propellers };
}

/**
 * Builds an articulated multi-part human figure (independent left/right legs, shoes, overcoat torso, collar, swinging left/right arms, head, fedora/helmet)
 */
function buildPeriodActor(
  coatColor: number,
  hatColor: number,
  hasHelmet: boolean
): {
  group: THREE.Group;
  leftLeg: THREE.Object3D;
  rightLeg: THREE.Object3D;
  leftArm: THREE.Object3D;
  rightArm: THREE.Object3D;
} {
  const actor = new THREE.Group();

  const coatMat = new THREE.MeshStandardMaterial({
    color: coatColor,
    roughness: 0.82,
    metalness: 0.08,
  });
  const trouserMat = new THREE.MeshStandardMaterial({
    color: 0x1a1c20,
    roughness: 0.88,
  });
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xd6b496,
    roughness: 0.65,
    metalness: 0.05,
  });
  const hatMat = new THREE.MeshStandardMaterial({
    color: hatColor,
    roughness: hasHelmet ? 0.42 : 0.78,
    metalness: hasHelmet ? 0.58 : 0.1,
  });

  // Articulated Left & Right Legs (pivoted at hip y = 0.72)
  const leftLeg = new THREE.Group();
  leftLeg.position.set(0, 0.72, -0.09);
  const leftLegMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.72, 0.14),
    trouserMat
  );
  leftLegMesh.position.y = -0.36;
  leftLegMesh.castShadow = true;
  leftLeg.add(leftLegMesh);
  actor.add(leftLeg);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0, 0.72, 0.09);
  const rightLegMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 0.72, 0.14),
    trouserMat
  );
  rightLegMesh.position.y = -0.36;
  rightLegMesh.castShadow = true;
  rightLeg.add(rightLegMesh);
  actor.add(rightLeg);

  // Overcoat Torso + Lapel Collar
  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.78, 0.36),
    coatMat
  );
  torso.position.y = 1.06;
  torso.castShadow = true;
  actor.add(torso);

  // Articulated Left & Right Arms (pivoted at shoulder y = 1.36)
  const leftArm = new THREE.Group();
  leftArm.position.set(0, 1.36, -0.23);
  const leftArmMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.62, 0.13),
    coatMat
  );
  leftArmMesh.position.y = -0.28;
  leftArm.add(leftArmMesh);
  actor.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(0, 1.36, 0.23);
  const rightArmMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.62, 0.13),
    coatMat
  );
  rightArmMesh.position.y = -0.28;
  rightArm.add(rightArmMesh);
  actor.add(rightArm);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), skinMat);
  head.position.y = 1.56;
  actor.add(head);

  if (hasHelmet) {
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.175, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55),
      hatMat
    );
    dome.position.y = 1.60;
    actor.add(dome);
  } else {
    const brim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.03, 14),
      hatMat
    );
    brim.position.y = 1.66;
    actor.add(brim);
    const crown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.15, 0.14, 14),
      hatMat
    );
    crown.position.y = 1.73;
    actor.add(crown);
  }

  return { group: actor, leftLeg, rightLeg, leftArm, rightArm };
}

/**
 * Builds a Riveted Steel Elevated Railway Viaduct ("The El") + 3-Car Illuminated Passenger Train
 */
function buildElevatedRailwayAndTrain(): {
  viaductGroup: THREE.Group;
  trainGroup: THREE.Group;
} {
  const viaductGroup = new THREE.Group();
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x22272e,
    roughness: 0.52,
    metalness: 0.78,
  });
  const tieMat = new THREE.MeshStandardMaterial({
    color: 0x3d2e22,
    roughness: 0.88,
  });

  // Main elevated steel deck girder spanning x = -68 to +68 at y = 6.2m, z = -25m
  const deckGirder = new THREE.Mesh(
    new THREE.BoxGeometry(136, 0.65, 5.2),
    steelMat
  );
  deckGirder.position.set(0, 6.2, -25);
  deckGirder.castShadow = true;
  deckGirder.receiveShadow = true;
  viaductGroup.add(deckGirder);

  // Support lattice columns every 16m
  for (let px = -56; px <= 56; px += 16) {
    for (const pz of [-27.1, -22.9]) {
      const col = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 6.2, 0.55),
        steelMat
      );
      col.position.set(px, 3.1, pz);
      col.castShadow = true;
      viaductGroup.add(col);
    }
  }

  // Timber crossties along deck
  for (let tx = -64; tx <= 64; tx += 1.6) {
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 4.6), tieMat);
    tie.position.set(tx, 6.58, -25);
    viaductGroup.add(tie);
  }

  // 3-Car Illuminated Period Passenger Train on the Elevated Deck
  const trainGroup = new THREE.Group();
  const carBodyMat = new THREE.MeshStandardMaterial({
    color: 0x451a14,
    roughness: 0.45,
    metalness: 0.35,
  });
  const carRoofMat = new THREE.MeshStandardMaterial({
    color: 0x1c1917,
    roughness: 0.7,
  });
  const litWinMat = new THREE.MeshBasicMaterial({
    color: 0xffe49e,
  });

  for (let c = -1; c <= 1; c++) {
    const carX = c * 10.2;
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(9.4, 2.3, 2.65),
      carBodyMat
    );
    body.position.set(carX, 7.9, 0);
    body.castShadow = true;
    trainGroup.add(body);

    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(9.6, 0.32, 2.75),
      carRoofMat
    );
    roof.position.set(carX, 9.15, 0);
    trainGroup.add(roof);

    // Glowing passenger windows along both sides of each railcar
    for (let wx = -3.6; wx <= 3.6; wx += 1.2) {
      const winPane = new THREE.Mesh(
        new THREE.BoxGeometry(0.82, 0.78, 2.72),
        litWinMat
      );
      winPane.position.set(carX + wx, 8.1, 0);
      trainGroup.add(winPane);
    }
  }
  trainGroup.position.set(-20, 0, -25);

  return { viaductGroup, trainGroup };
}

/**
 * Builds an Ornate Cast-Iron Subway / Underground Shelter Entrance Kiosk with Illuminated Globes
 */
function buildSubwayEntranceKiosk(renderer: THREE.WebGLRenderer, isBlitz: boolean): THREE.Group {
  const kiosk = new THREE.Group();
  const ironMat = new THREE.MeshStandardMaterial({
    color: 0x16261c,
    roughness: 0.45,
    metalness: 0.78,
  });
  const globeMat = new THREE.MeshBasicMaterial({
    color: isBlitz ? 0x38bdf8 : 0xffe599,
  });

  // Stairwell parapet walls
  for (const zOff of [-0.95, 0.95]) {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 1.05, 0.12),
      ironMat
    );
    rail.position.set(0, 0.52, zOff);
    rail.castShadow = true;
    kiosk.add(rail);
  }
  const backRail = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 1.05, 2.02),
    ironMat
  );
  backRail.position.set(-1.85, 0.52, 0);
  kiosk.add(backRail);

  // Overhead arch portal & sign
  for (const zOff of [-0.95, 0.95]) {
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 2.5, 8),
      ironMat
    );
    post.position.set(1.8, 1.25, zOff);
    kiosk.add(post);

    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), globeMat);
    globe.position.set(1.8, 2.58, zOff);
    kiosk.add(globe);
  }

  const signTex = createBannerSignTexture(
    renderer,
    isBlitz ? 'UNDERGROUND SHELTER' : 'SUBWAY • UPTOWN & DOWNTOWN',
    '#0f1c14',
    '#f5f2eb',
    '#e5a93c'
  );
  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.48, 2.1),
    new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.4 })
  );
  signBoard.position.set(1.8, 2.25, 0);
  kiosk.add(signBoard);

  return kiosk;
}

/**
 * Constructs the Macro 3D World Theater containing 15+ simultaneous global cities
 * Visible when the user zooms out to inspect other cities and regions!
 */
function buildMacroWorldCitiesTheater(
  renderer: THREE.WebGLRenderer,
  activeBlueprint: HistoricalSceneBlueprint,
  clickableWorldCities: THREE.Object3D[],
  worldCityAnchors: AnimatedSceneHandles['worldCityAnchors'],
  searchlights: AnimatedSceneHandles['searchlights']
): THREE.Group {
  const macroGroup = new THREE.Group();

  // 1. Massive 2,400m x 2,400m Cartographic Ground Plane below the street plane
  const worldMapTex = createWorldTheaterMapTexture(renderer);
  const worldPlaneMat = new THREE.MeshStandardMaterial({
    map: worldMapTex,
    roughness: 0.88,
    metalness: 0.12,
  });
  const worldPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2200, 1600),
    worldPlaneMat
  );
  worldPlane.rotation.x = -Math.PI / 2;
  worldPlane.position.y = -0.35;
  macroGroup.add(worldPlane);

  // 2. Render all 15 Global City Clusters around the Macro Map
  const worldCities = getWorldCitiesForYear(activeBlueprint.year);
  const activeCityNode =
    worldCities.find(
      (c) => c.city.toLowerCase() === activeBlueprint.city.toLowerCase()
    ) || worldCities[0];

  // Center the macro coordinate system so the currently active city sits at (0,0)
  const originOffsetX = activeCityNode ? activeCityNode.worldX : 0;
  const originOffsetZ = activeCityNode ? activeCityNode.worldZ : 0;

  const skylineMat = new THREE.MeshStandardMaterial({
    color: 0x262e3d,
    roughness: 0.55,
    metalness: 0.45,
  });
  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0xe5a93c,
    emissive: 0xd97706,
    emissiveIntensity: 1.4,
    roughness: 0.2,
    metalness: 0.85,
  });
  const activeBeaconMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 1.8,
    roughness: 0.2,
    metalness: 0.85,
  });
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xe5a93c,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.65,
  });

  // Geodesic transit lines connecting major world hubs
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xe5a93c,
    transparent: true,
    opacity: 0.22,
  });

  worldCities.forEach((cityNode, idx) => {
    const isCurrentCity =
      cityNode.city.toLowerCase() === activeBlueprint.city.toLowerCase();

    // Place distant cities outside the 85m local street grid so they never clip the street
    let cx = cityNode.worldX - originOffsetX;
    let cz = cityNode.worldZ - originOffsetZ;
    if (!isCurrentCity && Math.hypot(cx, cz) < 105) {
      const angle = (idx / worldCities.length) * Math.PI * 2;
      cx = Math.cos(angle) * 145;
      cz = Math.sin(angle) * 145;
    }

    const cityGroup = new THREE.Group();
    cityGroup.position.set(cx, 0, cz);

    if (!isCurrentCity) {
      // Build a 14-building 3D Miniature Metropolitan Skyline Cluster for this distant city!
      for (let b = 0; b < 14; b++) {
        const angle = (b / 14) * Math.PI * 2;
        const dist = 4 + (b % 3) * 5.5;
        const bw = 3.2 + (b % 3) * 1.4;
        const bd = 3.2 + ((b + 1) % 3) * 1.4;
        const bh = 6 + ((b * 7 + idx * 3) % 18);

        const bldg = new THREE.Mesh(
          new THREE.BoxGeometry(bw, bh, bd),
          skylineMat
        );
        bldg.position.set(Math.cos(angle) * dist, bh / 2, Math.sin(angle) * dist);
        bldg.castShadow = true;
        cityGroup.add(bldg);
      }

      // Era-specific live activity at distant city (WWII Searchlight Beam or Depression Amber Beacon)
      if (cityNode.reenactmentMode === 'wwii_blitz') {
        const coneGeo = new THREE.ConeGeometry(4.5, 55, 14, 1, true);
        coneGeo.translate(0, 27.5, 0);
        const coneMat = new THREE.MeshBasicMaterial({
          color: 0xfff3c4,
          transparent: true,
          opacity: 0.18,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const pivot = new THREE.Group();
        pivot.position.set(0, 2, 0);
        pivot.add(new THREE.Mesh(coneGeo, coneMat));
        cityGroup.add(pivot);
        searchlights.push({ pivot, phase: idx * 1.3, speed: 0.7 });
      }

      // Connect geodesic line back toward active theater center
      const points = [
        new THREE.Vector3(0, 0.2, 0),
        new THREE.Vector3(-cx * 0.5, 8.0, -cz * 0.5),
        new THREE.Vector3(-cx, 0.2, -cz),
      ];
      const curve = new THREE.QuadraticBezierCurve3(points[0], points[1], points[2]);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(24));
      cityGroup.add(new THREE.Line(lineGeo, lineMaterial));
    }

    // Elevated Clickable 3D City Beacon & Ground Radar Ring (Layer 1)
    const beaconHeight = isCurrentCity ? 28 : 26;
    const beaconMesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(isCurrentCity ? 2.2 : 3.2, 0),
      isCurrentCity ? activeBeaconMat : beaconMat
    );
    beaconMesh.position.y = beaconHeight;
    beaconMesh.layers.enable(1);
    beaconMesh.userData = { worldCityNode: cityNode };
    cityGroup.add(beaconMesh);

    const groundRing = new THREE.Mesh(
      new THREE.RingGeometry(15, 17.5, 32),
      ringMat
    );
    groundRing.rotation.x = -Math.PI / 2;
    groundRing.position.y = 0.08;
    cityGroup.add(groundRing);

    // Invisible click target sphere on Layer 1 so clicking distant cities is effortless
    const hitSphere = new THREE.Mesh(
      new THREE.SphereGeometry(12, 10, 10),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitSphere.position.y = 14;
    hitSphere.layers.enable(1);
    hitSphere.userData = { worldCityNode: cityNode };
    cityGroup.add(hitSphere);

    macroGroup.add(cityGroup);
    clickableWorldCities.push(hitSphere, beaconMesh);
    worldCityAnchors.push({
      cityNode,
      worldPos: new THREE.Vector3(cx, beaconHeight + 4, cz),
      beaconMesh,
    });
  });

  return macroGroup;
}

/**
 * Constructs the complete Multi-Scale 3D Historical Scene (Street Level + District + 15-City World Theater)
 */
export function buildHistoricalScene(
  renderer: THREE.WebGLRenderer,
  blueprint: HistoricalSceneBlueprint
): AnimatedSceneHandles {
  const rootGroup = new THREE.Group();
  const clickableHotspots: THREE.Object3D[] = [];
  const clickableWorldCities: THREE.Object3D[] = [];
  const clickableEntities: THREE.Object3D[] = [];
  const cutawayMaterials: THREE.MeshStandardMaterial[] = [];
  const worldCityAnchors: AnimatedSceneHandles['worldCityAnchors'] = [];
  const vehicles: AnimatedSceneHandles['vehicles'] = [];
  const aircraft: AnimatedSceneHandles['aircraft'] = [];
  const searchlights: AnimatedSceneHandles['searchlights'] = [];
  const fireLights: AnimatedSceneHandles['fireLights'] = [];
  const smokePuffs: AnimatedSceneHandles['smokePuffs'] = [];
  const crowdActors: AnimatedSceneHandles['crowdActors'] = [];

  const isAncient = blueprint.reenactmentMode === 'ancient_classical';
  const isHooverville = blueprint.reenactmentMode === 'depression_hooverville';
  const isBreadline = blueprint.reenactmentMode === 'depression_breadline';
  const isWwiiBlitz = blueprint.reenactmentMode === 'wwii_blitz';
  const isWwiiLib = blueprint.reenactmentMode === 'wwii_liberation';
  const isStreetcar = blueprint.reenactmentMode === 'early_streetcar';
  const isColdWar = blueprint.reenactmentMode === 'cold_war';

  // Helper to register any 3D mesh/group as a granular clickable entity on Raycaster Layer 1
  const registerGranularEntity = (
    targetGroup: THREE.Object3D,
    hitRadius: number,
    hitHeight: number,
    record: GranularEntityRecord
  ) => {
    const proxy = new THREE.Mesh(
      new THREE.BoxGeometry(hitRadius * 2, hitHeight, hitRadius * 2),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    proxy.position.y = hitHeight / 2;
    proxy.layers.enable(1);
    proxy.userData = {
      granularEntity: record,
      entityRootGroup: targetGroup,
    };
    targetGroup.add(proxy);
    clickableEntities.push(proxy);
  };

  // Helper to spawn volumetric rising smoke / steam puffs
  const smokeMat = new THREE.MeshStandardMaterial({
    color: isWwiiBlitz ? 0x475569 : 0xd6d3d1,
    roughness: 1.0,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
  });
  const addSmokeColumn = (sx: number, sy: number, sz: number, count = 4, maxRise = 5.5) => {
    for (let p = 0; p < count; p++) {
      const puff = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.32 + p * 0.12, 1),
        smokeMat
      );
      puff.position.set(sx, sy + (p / count) * maxRise, sz);
      rootGroup.add(puff);
      smokePuffs.push({
        mesh: puff,
        baseX: sx,
        baseY: sy,
        baseZ: sz,
        speedY: 0.75 + (p % 2) * 0.25,
        phase: p * 1.57 + sx * 0.3,
        maxRise,
      });
    }
  };

  // 0A. Custom GLSL Atmospheric Sky Dome with Horizon Glow & Moving Clouds
  const skyDomeUniforms = {
    uTime: { value: 0 },
    uSolarElevation: { value: isWwiiBlitz ? -0.25 : 0.45 },
    uTopColor: {
      value: new THREE.Color(
        isWwiiBlitz ? 0x050811 : isBreadline ? 0x1b1e24 : 0x162032
      ),
    },
    uHorizonColor: {
      value: new THREE.Color(
        isWwiiBlitz ? 0x172542 : isBreadline ? 0x4b4843 : 0x7c5836
      ),
    },
  };
  const skyDomeMat = new THREE.ShaderMaterial({
    uniforms: skyDomeUniforms,
    side: THREE.BackSide,
    depthWrite: false,
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vWorldPos = wp.xyz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uSolarElevation;
      uniform vec3 uTopColor;
      uniform vec3 uHorizonColor;
      varying vec3 vWorldPos;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      void main() {
        vec3 dir = normalize(vWorldPos);
        float h = clamp(dir.y, 0.0, 1.0);
        vec3 col = mix(uHorizonColor, uTopColor, pow(h, 0.55));

        // Subtle drifting atmospheric cloud layer
        if (dir.y > 0.04) {
          vec2 uv = dir.xz / (dir.y + 0.18) * 1.8 + vec2(uTime * 0.012, uTime * 0.006);
          float c = noise(uv) * 0.6 + noise(uv * 2.3) * 0.4;
          float cloudMask = smoothstep(0.48, 0.78, c) * smoothstep(0.04, 0.25, dir.y);
          vec3 cloudCol = mix(uHorizonColor * 1.15, vec3(0.85, 0.82, 0.76), clamp(uSolarElevation + 0.3, 0.15, 0.85));
          col = mix(col, cloudCol, cloudMask * 0.28);
        }
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const skyDome = new THREE.Mesh(
    new THREE.SphereGeometry(1850, 32, 20),
    skyDomeMat
  );
  rootGroup.add(skyDome);

  // 0B. Build the Macro Multi-City World Theater (visible when zooming out!)
  const macroTheater = buildMacroWorldCitiesTheater(
    renderer,
    blueprint,
    clickableWorldCities,
    worldCityAnchors,
    searchlights
  );
  rootGroup.add(macroTheater);

  // 1. Local District Ground & Intersecting Multi-Block Street Grid with PBR Bump Maps
  const districtGroundMat = new THREE.MeshStandardMaterial({
    color: isAncient ? 0x3b2f23 : isHooverville ? 0x261f18 : 0x13161b,
    roughness: 0.92,
    metalness: 0.05,
  });
  const districtGround = new THREE.Mesh(
    new THREE.PlaneGeometry(160, 160),
    districtGroundMat
  );
  districtGround.rotation.x = -Math.PI / 2;
  districtGround.position.y = -0.04;
  districtGround.receiveShadow = true;
  rootGroup.add(districtGround);

  const isCobbleEra = !isAncient && (isStreetcar || isBreadline || blueprint.year <= 1950);
  const roadTex = createRoadTexture(
    renderer,
    blueprint.year,
    isCobbleEra,
    isHooverville || isAncient
  );
  const roadBump = createRoadBumpTexture(renderer, isCobbleEra);
  const roadMat = new THREE.MeshStandardMaterial({
    map: roadTex,
    bumpMap: roadBump,
    bumpScale: 0.035,
    roughness: isWwiiBlitz || isBreadline ? 0.32 : 0.72,
    metalness: isWwiiBlitz || isBreadline ? 0.28 : 0.08,
  });

  // Main East-West Avenue (140m long x 12m wide)
  const mainRoad = new THREE.Mesh(new THREE.PlaneGeometry(140, 12), roadMat);
  mainRoad.rotation.x = -Math.PI / 2;
  mainRoad.position.y = 0.0;
  mainRoad.receiveShadow = true;
  rootGroup.add(mainRoad);

  // Two Intersecting North-South Cross Streets at x = -23 and x = +23
  if (!isHooverville) {
    for (const crossX of [-23, 23]) {
      const crossRoad = new THREE.Mesh(new THREE.PlaneGeometry(10, 110), roadMat);
      crossRoad.rotation.x = -Math.PI / 2;
      crossRoad.position.set(crossX, 0.01, 0);
      crossRoad.receiveShadow = true;
      rootGroup.add(crossRoad);
    }

    // Raised Granite / Travertine Sidewalk Blocks & Curbs across the 6 City Blocks
    const sidewalkMat = new THREE.MeshStandardMaterial({
      color: isAncient ? 0x8c785c : 0x3f3d38,
      bumpMap: roadBump,
      bumpScale: 0.015,
      roughness: 0.78,
      metalness: 0.08,
    });
    const blockXCenters = [-46, 0, 46];
    const blockWidths = [34, 34, 34];
    for (const zSide of [-8.8, 8.8]) {
      blockXCenters.forEach((bx, i) => {
        const sw = new THREE.Mesh(
          new THREE.BoxGeometry(blockWidths[i], 0.22, 5.6),
          sidewalkMat
        );
        sw.position.set(bx, 0.11, zSide);
        sw.receiveShadow = true;
        rootGroup.add(sw);
      });
    }

    // Overhead Electric Streetcar Catenary & Telegraph Wires along Main Avenue (1870–1965)
    if (blueprint.year >= 1870 && blueprint.year <= 1965 && !isAncient) {
      const wireMat = new THREE.LineBasicMaterial({
        color: 0x475569,
        transparent: true,
        opacity: 0.55,
      });
      for (const wz of [-1.8, 1.8, -6.1]) {
        const pts: THREE.Vector3[] = [];
        for (let wx = -56; wx <= 56; wx += 4) {
          const sag = Math.cos(((wx % 14) / 14) * Math.PI) * 0.18;
          pts.push(new THREE.Vector3(wx, 4.35 - sag, wz));
        }
        const wireGeo = new THREE.BufferGeometry().setFromPoints(pts);
        rootGroup.add(new THREE.Line(wireGeo, wireMat));
      }
    }

    // Riveted Steel Elevated Railway Viaduct ("The El") & Animated 3-Car Passenger Train (1878–Present)
    if (!isAncient && blueprint.year >= 1878) {
      const { viaductGroup, trainGroup } = buildElevatedRailwayAndTrain();
      rootGroup.add(viaductGroup);
      rootGroup.add(trainGroup);

      registerGranularEntity(trainGroup, 14, 3.5, {
        id: `entity-el-train-${blueprint.year}`,
        entityType: 'vehicle',
        name: `${blueprint.city} Elevated Rapid Transit ("The El") — 3-Car Consist`,
        roleOrClass: 'Municipal Elevated Electric / Steam Railway',
        yearBadge: String(blueprint.year),
        microBiography: `Operating on riveted Pratt-truss steel viaducts 6.2 meters above street grade, this 3-car rapid transit train connects the central commercial district of ${blueprint.city} with outer working-class residential wards.`,
        granularSpecs: [
          { label: 'Structure', value: 'Riveted Plate-Girder Steel Viaduct' },
          { label: 'Clearance', value: '6.20m Above Street Grade' },
          { label: 'Rolling Stock', value: '3× Heavy Clerestory Steel Passenger Cars' },
          { label: 'Propulsion', value: blueprint.year < 1898 ? 'Forney 0-4-4T Steam Locomotive' : '600V DC Third-RailShoe Traction' },
        ],
        archivalSource: `${blueprint.city} Rapid Transit Commission Engineering Drawings (${blueprint.year})`,
        worldPosition: [0, 8.0, -25],
        isMoving: true,
      });

      vehicles.push({
        group: trainGroup,
        speed: 8.5,
        axis: 'x',
        laneCoord: -25,
        direction: 1,
        minBound: -68,
        maxBound: 68,
      });
    }
  }

  // 2. Hyper-Detailed Multi-Block Architecture (With 3D Interior Cutaway Rooms & PBR Bump Maps!)
  const facadeBumpTex = createFacadeBumpTexture(renderer);

  if (isAncient) {
    // Monumental Classical / Chacoan Stone Architecture (AD 80 Flavian Amphitheatre / AD 1050 Pueblo Bonito)
    const travertineMat = new THREE.MeshStandardMaterial({
      color: blueprint.city.includes('Chaco') ? 0xb5895a : 0xd6c7b2,
      bumpMap: facadeBumpTex,
      bumpScale: 0.04,
      roughness: 0.82,
      metalness: 0.06,
    });
    cutawayMaterials.push(travertineMat);

    const darkStoneMat = new THREE.MeshStandardMaterial({
      color: blueprint.city.includes('Chaco') ? 0x6e4e32 : 0x8c7d6b,
      roughness: 0.88,
      metalness: 0.05,
    });
    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0xece4d8,
      roughness: 0.55,
      metalness: 0.1,
    });

    const monumentGroup = new THREE.Group();
    const tiers = 4;
    for (let t = 0; t < tiers; t++) {
      const radiusOuter = 16 + t * 1.2;
      const radiusInner = 11.5;
      const tierHeight = 3.2;
      const yPos = t * tierHeight + tierHeight / 2;

      const ringWall = new THREE.Mesh(
        new THREE.CylinderGeometry(
          radiusOuter,
          radiusOuter,
          tierHeight - 0.25,
          36,
          1,
          true,
          blueprint.city.includes('Chaco') ? Math.PI : 0,
          blueprint.city.includes('Chaco') ? Math.PI : Math.PI * 2
        ),
        travertineMat
      );
      ringWall.position.y = yPos;
      ringWall.castShadow = true;
      monumentGroup.add(ringWall);

      const corniceRing = new THREE.Mesh(
        new THREE.TorusGeometry(radiusOuter, 0.28, 8, 36),
        darkStoneMat
      );
      corniceRing.rotation.x = Math.PI / 2;
      corniceRing.position.y = (t + 1) * tierHeight;
      monumentGroup.add(corniceRing);

      const colCount = 24;
      for (let c = 0; c < colCount; c++) {
        const angle = (c / colCount) * Math.PI * 2;
        if (blueprint.city.includes('Chaco') && Math.sin(angle) > 0) continue;
        const col = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.28, tierHeight, 10),
          marbleMat
        );
        col.position.set(
          Math.cos(angle) * (radiusOuter + 0.22),
          yPos,
          Math.sin(angle) * (radiusOuter + 0.22)
        );
        col.castShadow = true;
        monumentGroup.add(col);
      }

      if (t === 0) {
        const kivaFloor = new THREE.Mesh(
          new THREE.CylinderGeometry(radiusInner, radiusInner, 0.4, 32),
          darkStoneMat
        );
        kivaFloor.position.y = 0.2;
        monumentGroup.add(kivaFloor);
      }
    }
    monumentGroup.position.set(-4, 0, -24);
    rootGroup.add(monumentGroup);

    registerGranularEntity(monumentGroup, 16, 13, {
      id: 'entity-ancient-monument',
      entityType: 'building',
      name: blueprint.city.includes('Chaco')
        ? 'Pueblo Bonito 4-Story Terraced Roomblock & Great Kiva'
        : 'Amphitheatrum Flavium (The Colosseum) — 80-Arcade Travertine Facade',
      roleOrClass: 'Monumental Civic & Ceremonial Edifice',
      yearBadge: `AD ${blueprint.year}`,
      microBiography: blueprint.city.includes('Chaco')
        ? 'Constructed from tabular Cliff House Sandstone and 200,000 Chuska/San Mateo mountain timber beams, aligned to the cardinal solar meridian and lunar standstills.'
        : 'Commissioned by Emperor Vespasian in AD 72 and inaugurated by Emperor Titus in AD 80 with 80 numbered travertine entrance arches, seating 50,000 spectators.',
      granularSpecs: [
        { label: 'Primary Material', value: blueprint.city.includes('Chaco') ? 'Type II–IV Core-and-Veneer Sandstone' : 'Tivoli Travertine Limestone & Iron Clamps' },
        { label: 'Elevation Tiers', value: '4 Monumental Stories (14.5m Scaled Stage)' },
        { label: 'Capacity / Rooms', value: blueprint.city.includes('Chaco') ? '650+ Rooms & 35 Ceremonial Kivas' : '80 Vomitoria Arcades · 50,000 Spectators' },
      ],
      archivalSource: blueprint.city.includes('Chaco')
        ? 'Chaco Research Archive / HABS Survey'
        : 'Parco Archeologico del Colosseo / Cassius Dio LXVI.25',
      worldPosition: [-4, 6, -24],
    });

    for (const bx of [-36, 16, 36]) {
      for (const zSide of [-15, 15]) {
        const temple = new THREE.Group();
        const podium = new THREE.Mesh(new THREE.BoxGeometry(11, 1.2, 8.5), darkStoneMat);
        podium.position.y = 0.6;
        temple.add(podium);

        const cella = new THREE.Mesh(new THREE.BoxGeometry(8.2, 5.2, 6.2), travertineMat);
        cella.position.y = 3.8;
        cella.castShadow = true;
        temple.add(cella);

        for (let cx = -4.2; cx <= 4.2; cx += 2.1) {
          const col = new THREE.Mesh(
            new THREE.CylinderGeometry(0.28, 0.34, 5.2, 12),
            marbleMat
          );
          col.position.set(cx, 3.8, zSide < 0 ? 3.8 : -3.8);
          col.castShadow = true;
          temple.add(col);
        }

        const pediment = new THREE.Mesh(
          new THREE.ConeGeometry(6.5, 2.2, 4),
          travertineMat
        );
        pediment.position.y = 7.4;
        pediment.rotation.y = Math.PI / 4;
        temple.add(pediment);

        temple.position.set(bx, 0, zSide);
        rootGroup.add(temple);
      }
    }

    const tripodMat = new THREE.MeshStandardMaterial({
      color: 0x92400e,
      roughness: 0.35,
      metalness: 0.85,
    });
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xff9f1c });
    for (const [fx, fz] of [
      [-12, -6.2],
      [0, -6.2],
      [12, -6.2],
      [-6, 6.2],
      [6, 6.2],
    ] as Array<[number, number]>) {
      const bowl = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.25, 1.1, 12),
        tripodMat
      );
      bowl.position.set(fx, 0.65, fz);
      rootGroup.add(bowl);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.75, 8), flameMat);
      flame.position.set(fx, 1.4, fz);
      rootGroup.add(flame);

      const fireLight = new THREE.PointLight(0xff7b00, 3.2, 16, 1.8);
      fireLight.position.set(fx, 1.8, fz);
      rootGroup.add(fireLight);

      fireLights.push({
        light: fireLight,
        flameMesh: flame,
        baseIntensity: 3.2,
        phase: fx * 0.5,
      });
      addSmokeColumn(fx, 1.9, fz, 3, 4.5);
    }
  } else if (isHooverville) {
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c432d, roughness: 0.9 });
    const tinMat = new THREE.MeshStandardMaterial({
      color: 0x646b70,
      roughness: 0.55,
      metalness: 0.65,
    });
    const brickMat = new THREE.MeshStandardMaterial({ color: 0x6e3225, roughness: 0.85 });

    const shantyCoords: Array<[number, number, number]> = [
      [-18, -7, 0.1],
      [-11, -6.5, -0.15],
      [-4, -7.2, 0.08],
      [4, -6.8, -0.12],
      [11, -7.5, 0.2],
      [18, -6.4, -0.1],
      [-15, 7.5, -0.1],
      [-7, 6.8, 0.15],
      [2, 7.2, -0.05],
      [10, 6.9, 0.12],
      [17, 7.4, -0.08],
    ];

    shantyCoords.forEach(([sx, sz, rot], idx) => {
      const shack = new THREE.Group();
      const w = 3.4 + (idx % 3) * 0.6;
      const h = 2.4 + (idx % 2) * 0.4;
      const d = 3.2;

      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        idx % 3 === 0 ? brickMat : woodMat
      );
      cabin.position.y = h / 2;
      cabin.castShadow = true;
      cabin.receiveShadow = true;
      shack.add(cabin);

      const tinRoof = new THREE.Mesh(
        new THREE.BoxGeometry(w + 0.5, 0.12, d + 0.5),
        tinMat
      );
      tinRoof.position.y = h + 0.1;
      tinRoof.rotation.z = 0.08;
      tinRoof.castShadow = true;
      shack.add(tinRoof);

      const stovepipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.09, 0.09, 1.4, 8),
        tinMat
      );
      stovepipe.position.set(w * 0.28, h + 0.6, -d * 0.2);
      shack.add(stovepipe);

      shack.position.set(sx, 0, sz);
      shack.rotation.y = rot;
      rootGroup.add(shack);
      addSmokeColumn(sx + w * 0.25, h + 1.3, sz, 3, 4.2);

      registerGranularEntity(shack, 2.0, h + 0.6, {
        id: `entity-shanty-${idx}`,
        entityType: 'building',
        name: `Hooverville Dwelling #${idx + 1} ("Hoover Valley" Sector)`,
        roleOrClass: idx % 3 === 0 ? 'Salvaged Brick & Mortar Shanty' : 'Packing-Crate & Corrugated Tin Shelter',
        yearBadge: String(blueprint.year),
        microBiography: `Constructed by unemployed construction tradesmen during the ${blueprint.year} eviction crisis. Built from piano shipping crates, galvanized sheet metal, and salvaged brick with a coal-burning stovepipe.`,
        granularSpecs: [
          { label: 'Floor Footprint', value: `${w.toFixed(1)}m × ${d.toFixed(1)}m` },
          { label: 'Wall Envelope', value: idx % 3 === 0 ? 'Scavenged Red Brick' : 'Pine Packing Crates & Tar Paper' },
          { label: 'Heating', value: 'Drum Stove & Galvanized Flue Pipe' },
        ],
        archivalSource: 'Museum of the City of New York • Gottscho Reservoir Survey (1933)',
        worldPosition: [sx, h / 2, sz],
      });
    });

    for (let i = -4; i <= 4; i++) {
      const towerTex = createFacadeTexture(renderer, {
        eraYear: 1931,
        regionStyle: 'northeast_urban',
        seed: i + 10,
      });
      const towerMat = new THREE.MeshStandardMaterial({
        map: towerTex,
        bumpMap: facadeBumpTex,
        bumpScale: 0.03,
        roughness: 0.7,
      });
      const h = 22 + (Math.abs(i) % 3) * 8;
      const tower = new THREE.Mesh(new THREE.BoxGeometry(9.5, h, 8.5), towerMat);
      tower.position.set(i * 12, h / 2, -26);
      rootGroup.add(tower);
    }
  } else {
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x26231f,
      roughness: 0.78,
      metalness: 0.15,
    });
    const interiorFloorMat = new THREE.MeshStandardMaterial({
      color: 0x3b2d22,
      roughness: 0.85,
    });
    const interiorWallMat = new THREE.MeshStandardMaterial({
      color: 0x9c8c74,
      roughness: 0.9,
    });
    const interiorLampMat = new THREE.MeshBasicMaterial({
      color: 0xffe49e,
    });
    const awningColors = [0x7f1d1d, 0x14532d, 0x1e3a8a, 0x78350f];
    const buildingNames = [
      'Merchants Exchange & Tenement Block',
      'Continental Press & Telegraph Building',
      'Union Savings Bank & Chambers',
      'Grand Automat & Residential Lofts',
      'Metropolitan Dry Goods & Tailoring',
      'Astor-Style Brownstone & Apothecary',
      'Excelsior Ironworks & Mercantile',
    ];

    const xBuildingSlots = [-52, -41, -13, -2, 9, 34, 45];
    const zRowCoords = [-16.2, 16.2, -34.0, 34.0];

    for (const zCoord of zRowCoords) {
      const isFrontRow = Math.abs(zCoord) < 20;
      const sideSign = zCoord < 0 ? -1 : 1;

      xBuildingSlots.forEach((bx, idx) => {
        const seed = Math.abs(idx * 11 + (sideSign > 0 ? 5 : 17) + (isFrontRow ? 0 : 23));
        const width = 9.6 + (seed % 2) * 1.2;
        const depth = 9.2;
        const baseStories =
          blueprint.year >= 1985
            ? 16 + (seed % 12)
            : blueprint.year >= 1920 && blueprint.regionStyle === 'northeast_urban'
            ? 9 + (seed % 7)
            : 6 + (seed % 5);
        const height = baseStories * 1.65;
        const isBoarded = isBreadline && isFrontRow && (idx === 2 || idx === 4);

        const facadeTex = createFacadeTexture(renderer, {
          eraYear: blueprint.year,
          regionStyle: blueprint.regionStyle,
          seed,
          boardedUp: isBoarded,
          blackoutTape: isWwiiBlitz,
        });

        const bldgGroup = new THREE.Group();
        const bldgMat = new THREE.MeshStandardMaterial({
          map: facadeTex,
          bumpMap: facadeBumpTex,
          bumpScale: 0.038,
          roughness: blueprint.year >= 1990 ? 0.25 : 0.72,
          metalness: blueprint.year >= 1990 ? 0.65 : 0.12,
        });
        if (isFrontRow) {
          cutawayMaterials.push(bldgMat);
        }

        // 1. Main Architectural Shaft
        const mainBox = new THREE.Mesh(
          new THREE.BoxGeometry(width, height, depth),
          bldgMat
        );
        mainBox.position.y = height / 2;
        mainBox.castShadow = true;
        mainBox.receiveShadow = true;
        bldgGroup.add(mainBox);

        // 1B. Granular 3D Interior Floors, Partition Walls, Tables & Warm Ceiling Lamps (Revealed in X-Ray Cutaway Mode!)
        if (isFrontRow) {
          const maxInteriorFloors = Math.min(baseStories, 8);
          for (let f = 0; f < maxInteriorFloors; f++) {
            const floorY = f * 1.65 + 0.15;
            const slab = new THREE.Mesh(
              new THREE.BoxGeometry(width - 0.5, 0.14, depth - 0.5),
              interiorFloorMat
            );
            slab.position.y = floorY;
            bldgGroup.add(slab);

            // Interior room partition wall
            const partition = new THREE.Mesh(
              new THREE.BoxGeometry(0.14, 1.5, depth - 1.2),
              interiorWallMat
            );
            partition.position.set((f % 2 === 0 ? 1 : -1) * 1.2, floorY + 0.75, 0);
            bldgGroup.add(partition);

            // Interior wooden counter / tenement table
            const table = new THREE.Mesh(
              new THREE.BoxGeometry(2.4, 0.55, 1.1),
              interiorFloorMat
            );
            table.position.set(-1.5, floorY + 0.35, -sideSign * 1.6);
            bldgGroup.add(table);

            // Glowing interior ceiling fixture
            if (!isWwiiBlitz && (f + idx) % 2 === 0) {
              const bulb = new THREE.Mesh(
                new THREE.SphereGeometry(0.16, 8, 8),
                interiorLampMat
              );
              bulb.position.set(0, floorY + 1.42, -sideSign * 1.5);
              bldgGroup.add(bulb);
            }
          }
        }

        // 2. Projecting Stone Cornice & Roof Parapet
        const cornice = new THREE.Mesh(
          new THREE.BoxGeometry(width + 0.5, 0.48, depth + 0.5),
          capMat
        );
        cornice.position.y = height + 0.24;
        bldgGroup.add(cornice);

        // 3. Stepped Art Deco Penthouse Setback & Spire
        if (height > 13.5) {
          const setback = new THREE.Mesh(
            new THREE.BoxGeometry(width * 0.66, 4.4, depth * 0.66),
            bldgMat
          );
          setback.position.y = height + 2.4;
          bldgGroup.add(setback);
        }

        // 4. Rooftop Cedar Water Tower & Smoking Brick Chimney on Front Row Roofs
        if (isFrontRow && blueprint.year <= 1975 && idx % 2 === 0) {
          const waterTower = buildRooftopWaterTower();
          waterTower.position.set(
            (idx % 4 === 0 ? -1 : 1) * (width * 0.22),
            height + 0.45,
            0
          );
          bldgGroup.add(waterTower);
        }
        if (isFrontRow && idx % 3 === 0) {
          addSmokeColumn(bx + 2.2, height + 0.8, zCoord, 3, 4.8);
        }

        // 5. Cast-Iron Tenement Fire Escape on Front Facade
        if (isFrontRow && blueprint.year <= 1975 && idx % 2 === 1) {
          const fireEscape = buildCastIronFireEscape(baseStories);
          fireEscape.position.set(
            0,
            0.5,
            -sideSign * (depth / 2 + 0.05)
          );
          if (sideSign > 0) fireEscape.rotation.y = Math.PI;
          bldgGroup.add(fireEscape);
        }

        // 6. Ground-Floor Projecting Shopfront Awning OR Illuminated Theater Marquee
        if (isFrontRow && idx === 3 && sideSign === 1 && !isWwiiBlitz) {
          // Grand Illuminated Theater / Cinema Marquee
          const marqueeTex = createBannerSignTexture(
            renderer,
            blueprint.year <= 1938
              ? 'NEWSREEL THEATRE • 10¢ ADMISSION'
              : 'GRAND METRO CINEMA • DAILY NEWSREEL',
            '#2b0909',
            '#fff3c4',
            '#f59e0b'
          );
          const marqueeBox = new THREE.Mesh(
            new THREE.BoxGeometry(width * 0.88, 0.95, 2.4),
            new THREE.MeshStandardMaterial({
              map: marqueeTex,
              emissive: 0xf59e0b,
              emissiveIntensity: 0.35,
              roughness: 0.3,
            })
          );
          marqueeBox.position.set(0, 3.1, -sideSign * (depth / 2 + 1.1));
          bldgGroup.add(marqueeBox);
        } else if (isFrontRow && !isWwiiBlitz) {
          const awningMat = new THREE.MeshStandardMaterial({
            color: awningColors[seed % awningColors.length],
            roughness: 0.78,
          });
          const awning = new THREE.Mesh(
            new THREE.BoxGeometry(width * 0.82, 0.14, 1.35),
            awningMat
          );
          awning.position.set(
            0,
            2.65,
            -sideSign * (depth / 2 + 0.55)
          );
          awning.rotation.x = -sideSign * 0.28;
          awning.castShadow = true;
          bldgGroup.add(awning);
        }

        bldgGroup.position.set(bx, 0, zCoord);
        rootGroup.add(bldgGroup);

        // Register Front-Row Buildings for Granular Click Inspection
        if (isFrontRow) {
          const lotNumber = `${Math.abs(bx) + idx * 12} ${blueprint.address.split(',')[0]}`;
          const bName = buildingNames[(idx + (sideSign > 0 ? 3 : 0)) % buildingNames.length];
          registerGranularEntity(bldgGroup, width * 0.48, height, {
            id: `entity-bldg-${bx}-${zCoord}`,
            entityType: 'building',
            name: `${lotNumber} — ${bName}`,
            roleOrClass: isBoarded
              ? `Foreclosed ${baseStories}-Story Commercial & Tenement Block`
              : `${baseStories}-Story ${blueprint.regionStyle.replace('_', ' ')} Masonry Structure`,
            yearBadge: String(blueprint.year),
            microBiography: isBoarded
              ? `Ground-floor bank and retail bays shuttered with timber planks during the ${blueprint.year} credit contraction, while upper residential tenement floors remain occupied by working-class families.`
              : `Multi-story load-bearing masonry and steel-frame structure featuring ${baseStories} interior levels, carved stone window lintels, and street-level mercantile bays. Toggle "X-Ray Cutaway" to inspect interior floors.`,
            granularSpecs: [
              { label: 'Lot Address', value: lotNumber },
              { label: 'Elevation', value: `${baseStories} Stories (${height.toFixed(1)}m)` },
              { label: 'Facade Envelope', value: 'Load-Bearing Brick, Limestone Lintels & Cornice' },
              { label: 'Ground Retail Status', value: isBoarded ? 'Boarded / Foreclosed' : isWwiiBlitz ? 'Sandbagged & Blackout Taped' : 'Active Streetfront Commerce' },
            ],
            archivalSource: `Sanborn Fire Insurance & Municipal Tax Map Survey (${blueprint.year})`,
            worldPosition: [bx, height * 0.4, zCoord],
          });
        }
      });
    }
  }

  // 3. Primary Historical Banner, Street Signpost, Subway Entrance Kiosk, Newsstand & Hydrants
  const bannerTex = createBannerSignTexture(
    renderer,
    blueprint.bannerText,
    isBreadline ? '#1f1610' : isWwiiBlitz ? '#111827' : '#181410',
    '#f5f2eb',
    '#e5a93c'
  );
  const bannerMesh = new THREE.Mesh(
    new THREE.BoxGeometry(8.8, 1.45, 0.22),
    new THREE.MeshStandardMaterial({ map: bannerTex, roughness: 0.4 })
  );
  bannerMesh.position.set(-8, 4.4, -11.2);
  rootGroup.add(bannerMesh);

  const secondBannerTex = createBannerSignTexture(
    renderer,
    blueprint.streetSignText,
    '#0f1318',
    '#e5a93c',
    '#f5f2eb'
  );
  const secondBannerMesh = new THREE.Mesh(
    new THREE.BoxGeometry(7.6, 1.15, 0.2),
    new THREE.MeshStandardMaterial({ map: secondBannerTex, roughness: 0.4 })
  );
  secondBannerMesh.position.set(9, 4.2, -11.2);
  rootGroup.add(secondBannerMesh);

  if (!isHooverville && !isAncient) {
    const newsstand = buildPeriodNewsstand(renderer, blueprint.year);
    newsstand.position.set(10.5, 0.22, 6.8);
    newsstand.rotation.y = Math.PI;
    rootGroup.add(newsstand);

    registerGranularEntity(newsstand, 1.6, 2.3, {
      id: `entity-newsstand-${blueprint.year}`,
      entityType: 'infrastructure',
      name: `${blueprint.city} Corner Press & Telegraph Kiosk`,
      roleOrClass: 'Daily Broadsheet & Wire Bulletin Stand',
      yearBadge: String(blueprint.year),
      microBiography: `Licensed sidewalk newsstand distributing morning and afternoon broadsheets, penny press extras, and telegraph dispatches for commuters along ${blueprint.address.split(',')[0]}.`,
      granularSpecs: [
        { label: 'Edition Price', value: blueprint.year <= 1938 ? '2 Cents Daily / 5 Cents Sunday' : '5 Cents Late Extra' },
        { label: 'Construction', value: 'Framed Oak Stall & Corrugated Weather Canopy' },
      ],
      archivalSource: `${blueprint.city} Municipal Street Vendor Registry (${blueprint.year})`,
      worldPosition: [10.5, 1.2, 6.8],
    });

    // Subway / Underground Shelter Entrance Kiosk at (-16.5, 0.22, 7.2)
    if (blueprint.year >= 1900) {
      const subwayKiosk = buildSubwayEntranceKiosk(renderer, isWwiiBlitz);
      subwayKiosk.position.set(-16.5, 0.22, 7.2);
      rootGroup.add(subwayKiosk);

      registerGranularEntity(subwayKiosk, 2.1, 2.6, {
        id: `entity-subway-${blueprint.year}`,
        entityType: 'infrastructure',
        name: isWwiiBlitz
          ? 'Deep-Level Underground Air Raid Shelter Portal'
          : 'Cast-Iron Subway & Underground Transit Kiosk',
        roleOrClass: isWwiiBlitz ? 'Civil Defense Deep Tube Shelter' : 'Subterranean Rapid Transit Access',
        yearBadge: String(blueprint.year),
        microBiography: isWwiiBlitz
          ? 'During night air raids, subterranean railway stations and deep tube platforms sheltered tens of thousands of citizens with bunk tiers, medical aid posts, and canteen trains.'
          : 'Heins & LaFarge / Guimard-era ornamental cast-iron stairwell kiosk leading to subterranean electric subway platforms.',
        granularSpecs: [
          { label: 'Depth Below Grade', value: isWwiiBlitz ? '18.5m Deep Tube Boring' : '7.4m Cut-and-Cover Vault' },
          { label: 'Beacon Globes', value: 'Dual Illuminated Frosted Glass Spheres' },
        ],
        archivalSource: `Municipal Rapid Transit & Civil Defense Archive (${blueprint.year})`,
        worldPosition: [-16.5, 1.4, 7.2],
      });
    }

    // Cast-Iron Fire Hydrants & Mailboxes along the curbs
    const hydrantMat = new THREE.MeshStandardMaterial({
      color: 0x7f1d1d,
      roughness: 0.45,
      metalness: 0.75,
    });
    const postboxMat = new THREE.MeshStandardMaterial({
      color: blueprint.regionStyle === 'european_stone' ? 0x991b1b : 0x1e3a2f,
      roughness: 0.5,
      metalness: 0.6,
    });
    for (const hx of [-32, -8, 16, 38]) {
      const hydrant = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.17, 0.78, 10),
        hydrantMat
      );
      hydrant.position.set(hx, 0.6, -6.3);
      rootGroup.add(hydrant);
    }
    for (const mx of [-19, 19]) {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 1.15, 0.48),
        postboxMat
      );
      box.position.set(mx, 0.78, 6.4);
      rootGroup.add(box);
    }
  }

  // 4. Era-Specific Reenactment Micro-Scenes
  if (isBreadline || isHooverville) {
    const stallGroup = new THREE.Group();
    const timberMat = new THREE.MeshStandardMaterial({ color: 0x4a3525, roughness: 0.85 });
    const counter = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.05, 1.25), timberMat);
    counter.position.set(-8, 0.65, -7.2);
    counter.castShadow = true;
    stallGroup.add(counter);

    for (const px of [-10.6, -5.4]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 2.6, 0.16), timberMat);
      post.position.set(px, 1.5, -7.2);
      stallGroup.add(post);
    }
    const stallRoof = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.14, 1.8), timberMat);
    stallRoof.position.set(-8, 2.85, -7.2);
    stallRoof.rotation.x = 0.12;
    stallGroup.add(stallRoof);

    const potMat = new THREE.MeshStandardMaterial({
      color: 0x22252a,
      roughness: 0.35,
      metalness: 0.8,
    });
    for (const px of [-9.4, -8.0, -6.6]) {
      const cauldron = new THREE.Mesh(
        new THREE.CylinderGeometry(0.36, 0.32, 0.62, 14),
        potMat
      );
      cauldron.position.set(px, 1.45, -7.2);
      stallGroup.add(cauldron);
      addSmokeColumn(px, 1.85, -7.2, 3, 3.2);
    }
    rootGroup.add(stallGroup);

    const appleStand = buildDepressionAppleStand(renderer);
    appleStand.position.set(-4.6, 0.22, 6.5);
    appleStand.rotation.y = Math.PI;
    rootGroup.add(appleStand);

    const barrelPositions: Array<[number, number]> = [
      [-3.2, 6.2],
      [6.5, -6.3],
      [-12.5, 6.0],
    ];
    const barrelMat = new THREE.MeshStandardMaterial({
      color: 0x2b2623,
      roughness: 0.7,
      metalness: 0.6,
    });
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xff9f1c });

    barrelPositions.forEach(([bx, bz], idx) => {
      const barrel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.36, 0.34, 0.95, 14),
        barrelMat
      );
      barrel.position.set(bx, 0.58, bz);
      barrel.castShadow = true;
      rootGroup.add(barrel);

      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.65, 8), flameMat);
      flame.position.set(bx, 1.25, bz);
      rootGroup.add(flame);

      const fireLight = new THREE.PointLight(0xff7b00, 3.4, 15, 1.8);
      fireLight.position.set(bx, 1.6, bz);
      rootGroup.add(fireLight);

      fireLights.push({
        light: fireLight,
        flameMesh: flame,
        baseIntensity: 3.4,
        phase: idx * 2.1,
      });
      addSmokeColumn(bx, 1.55, bz, 4, 4.5);
    });
  }

  if (isWwiiBlitz || isWwiiLib || isColdWar) {
    const aaBattery = buildWW2AntiAircraftBattery();
    aaBattery.position.set(8.0, 0.22, -7.4);
    rootGroup.add(aaBattery);

    registerGranularEntity(aaBattery, 2.2, 2.2, {
      id: `entity-bofors-${blueprint.year}`,
      entityType: 'infrastructure',
      name: '40mm Bofors L/60 Anti-Aircraft Emplacement & Sandbag Pit',
      roleOrClass: 'Air Defense Artillery Battery',
      yearBadge: String(blueprint.year),
      microBiography: `Sandbagged 40mm automatic anti-aircraft battery manned by a 4-person Civil Defense / Royal Artillery crew, firing 120 rounds per minute against high-altitude night raiders.`,
      granularSpecs: [
        { label: 'Ordnance', value: '40mm Bofors L/60 Autocannon' },
        { label: 'Effective Ceiling', value: '4,900 Meters (16,000 ft)' },
        { label: 'Revetment', value: 'Double-Walled Burlap Sandbag Parapet' },
      ],
      archivalSource: 'Imperial War Museum / War Office Air Defence Survey',
      worldPosition: [8.0, 1.2, -7.4],
    });

    const sandbagMat = new THREE.MeshStandardMaterial({
      color: 0x8c7b60,
      roughness: 0.92,
      metalness: 0.02,
    });
    const steelBeamMat = new THREE.MeshStandardMaterial({
      color: 0x2e3236,
      roughness: 0.5,
      metalness: 0.78,
    });

    const bunkerPositions: Array<[number, number]> = [
      [-11.0, 6.4],
      [-5.5, -7.2],
      [15.0, 6.4],
    ];
    for (const [sx, sz] of bunkerPositions) {
      const wall = new THREE.Group();
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 5; col++) {
          const bag = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.26, 0.38), sandbagMat);
          bag.position.set(
            (col - 2) * 0.66 + (row % 2) * 0.18,
            0.25 + row * 0.24,
            0
          );
          bag.castShadow = true;
          wall.add(bag);
        }
      }
      wall.position.set(sx, 0, sz);
      rootGroup.add(wall);
    }

    const hedgehogPositions: Array<[number, number]> = [
      [-13.5, 4.5],
      [12.5, 4.8],
      [-1.5, 6.2],
      [-21.0, -4.2],
    ];
    for (const [hx, hz] of hedgehogPositions) {
      const hh = new THREE.Group();
      const beamGeo = new THREE.BoxGeometry(0.16, 1.65, 0.16);
      const b1 = new THREE.Mesh(beamGeo, steelBeamMat);
      b1.rotation.set(0.6, 0, 0.6);
      const b2 = new THREE.Mesh(beamGeo, steelBeamMat);
      b2.rotation.set(-0.6, 0, 0.6);
      const b3 = new THREE.Mesh(beamGeo, steelBeamMat);
      b3.rotation.set(0, 0.6, -0.78);
      hh.add(b1, b2, b3);
      hh.position.set(hx, 0.65, hz);
      rootGroup.add(hh);
    }
  }

  if (isWwiiBlitz || isColdWar) {
    const searchlightCoords: Array<[number, number]> = [
      [-9.5, -4.8],
      [11.0, 5.2],
      [-18.0, -5.5],
      [26.0, -6.0],
    ];
    const coneGeo = new THREE.ConeGeometry(5.2, 68, 20, 1, true);
    coneGeo.translate(0, 34, 0);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0xfff3c4,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const housingMat = new THREE.MeshStandardMaterial({
      color: 0x2f362f,
      roughness: 0.4,
      metalness: 0.7,
    });

    searchlightCoords.forEach(([lx, lz], idx) => {
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.65, 0.8, 0.6, 12),
        housingMat
      );
      base.position.set(lx, 0.3, lz);
      rootGroup.add(base);

      const pivot = new THREE.Group();
      pivot.position.set(lx, 0.85, lz);

      const drum = new THREE.Mesh(
        new THREE.CylinderGeometry(0.48, 0.48, 0.75, 16),
        housingMat
      );
      drum.position.y = 0.2;
      pivot.add(drum);

      const beam = new THREE.Mesh(coneGeo, coneMat);
      pivot.add(beam);

      rootGroup.add(pivot);
      searchlights.push({
        pivot,
        phase: idx * 1.7,
        speed: 0.55 + idx * 0.15,
      });
    });
  }

  // 5. Animated Period Vehicles on Main Avenue AND Cross Streets (All Clickable!)
  if (isWwiiLib || isWwiiBlitz) {
    const tankNames = [
      'M4A3 Sherman "Cobra King II" (2nd Armored Div.)',
      'M4A1 Sherman "Liberation Spearhead" (French 2e DB)',
      'M4 Sherman Command Tank "Ironclad"',
    ];
    for (let i = 0; i < 3; i++) {
      const { group: tank, turret } = buildWW2ShermanTank();
      const xPos = -22 + i * 18;
      tank.position.set(xPos, 0, -2.1);
      rootGroup.add(tank);

      registerGranularEntity(tank, 2.3, 2.4, {
        id: `entity-tank-${i}`,
        entityType: 'vehicle',
        name: tankNames[i % tankNames.length],
        roleOrClass: '30-Ton Allied Medium Battle Tank',
        yearBadge: String(blueprint.year),
        microBiography: `Armed with a gyro-stabilized 75mm M3 main gun and driven by a 5-man crew. Click "Lock Camera & Follow" in the inspector to ride alongside this armored column down ${blueprint.address.split(',')[0]}.`,
        granularSpecs: [
          { label: 'Main Armament', value: '75mm Gun M3 + .50 Cal M2 Browning' },
          { label: 'Armor Thickness', value: '51mm Sloped Rolled Homogeneous Steel' },
          { label: 'Powerplant', value: 'Ford GAA V8 / Continental R975 Radial (450 HP)' },
          { label: 'Crew', value: '5 (Commander, Gunner, Loader, Driver, Co-Driver)' },
        ],
        archivalSource: 'U.S. Army Center of Military History / National Archives WWII Armor Log',
        worldPosition: [xPos, 1.2, -2.1],
        isMoving: true,
      });

      vehicles.push({
        group: tank,
        turret,
        speed: 2.4,
        axis: 'x',
        laneCoord: -2.1,
        direction: 1,
        minBound: -55,
        maxBound: 55,
      });
    }

    for (let a = 0; a < 4; a++) {
      const { group: plane, propellers } = buildWW2Aircraft();
      plane.position.set(-38 + a * 18, 22 + a * 2.5, -14 + a * 5);
      rootGroup.add(plane);
      aircraft.push({
        group: plane,
        propellers,
        speed: 9.8 + a * 1.2,
        baseY: 22 + a * 2.5,
        baseZ: -14 + a * 5,
        phase: a * 1.5,
      });
    }
  } else if (isStreetcar && !isAncient) {
    for (let i = 0; i < 2; i++) {
      const tram = buildElectricStreetcar();
      const dir: 1 | -1 = i === 0 ? 1 : -1;
      const laneZ = dir === 1 ? -1.8 : 1.8;
      tram.position.set(i === 0 ? -16 : 16, 0, laneZ);
      if (dir === -1) tram.rotation.y = Math.PI;
      rootGroup.add(tram);

      registerGranularEntity(tram, 3.2, 3.0, {
        id: `entity-tram-${i}`,
        entityType: 'vehicle',
        name: `${blueprint.city} Municipal Railway Electric Streetcar #${104 + i * 18}`,
        roleOrClass: 'Dual-Truck Overhead Trolley Coach',
        yearBadge: String(blueprint.year),
        microBiography: `Double-ended wooden and steel clerestory streetcar drawing 550V DC from overhead catenary wire via a sprung roof trolley pole. Carries 48 seated and 35 standing passengers.`,
        granularSpecs: [
          { label: 'Track Gauge', value: '4 ft 8½ in Standard Street Railway Gauge' },
          { label: 'Motors', value: '4× General Electric GE-80 Traction Motors' },
          { label: 'Fare', value: '5 Cents Cash / Free Transfer Ticket' },
        ],
        archivalSource: `${blueprint.city} Street Railway Historical Collection (${blueprint.year})`,
        worldPosition: [i === 0 ? -16 : 16, 1.5, laneZ],
        isMoving: true,
      });

      vehicles.push({
        group: tram,
        speed: 3.6,
        axis: 'x',
        laneCoord: laneZ,
        direction: dir,
        minBound: -55,
        maxBound: 55,
      });
    }
  }

  if (!isHooverville && !isAncient && blueprint.year >= 1900) {
    const carColors = [0x1f2937, 0x3f2e21, 0x1e3a2f, 0x4a1d1d, 0x27272a, 0x312e81];
    const carModels = [
      'Ford Model A Tudor Sedan (201 cu in L-Head Four)',
      'Packard Eight Standard Club Sedan',
      'Chevrolet Independence Landau Phaeton',
      'Buick Series 60 Master Six Coupe',
      'Dodge Brothers Merchant Delivery Sedan',
    ];
    for (let c = 0; c < 5; c++) {
      const dir: 1 | -1 = c % 2 === 0 ? 1 : -1;
      const laneZ = dir === 1 ? 2.7 : -2.7;
      const car = buildVintage1930sCar(carColors[c % carColors.length]);
      car.position.set(-36 + c * 18, 0, laneZ);
      if (dir === -1) car.rotation.y = Math.PI;
      rootGroup.add(car);

      registerGranularEntity(car, 1.8, 1.8, {
        id: `entity-car-${c}`,
        entityType: 'vehicle',
        name: `${Math.min(blueprint.year, 1938)} ${carModels[c % carModels.length]}`,
        roleOrClass: 'Period Motor Vehicle',
        yearBadge: String(blueprint.year),
        microBiography: `Period automobile navigating ${blueprint.address.split(',')[0]}. Click "Lock Camera & Follow" to track this vehicle in real time along the thoroughfare.`,
        granularSpecs: [
          { label: 'Wheelbase', value: '103.5 Inches · Steel Spoke Wheels' },
          { label: 'Engine', value: '40 HP Water-Cooled Inline Engine' },
          { label: 'Transmission', value: '3-Speed Sliding Gear Manual' },
        ],
        archivalSource: 'Bureau of Motor Vehicles Historical Registration Ledger',
        worldPosition: [-36 + c * 18, 1.0, laneZ],
        isMoving: true,
      });

      vehicles.push({
        group: car,
        speed: 4.0 + (c % 2) * 0.9,
        axis: 'x',
        laneCoord: laneZ,
        direction: dir,
        minBound: -58,
        maxBound: 58,
      });
    }

    for (let cs = 0; cs < 2; cs++) {
      const crossX = cs === 0 ? -23 : 23;
      const dir: 1 | -1 = cs === 0 ? 1 : -1;
      const car = buildVintage1930sCar(carColors[(cs + 2) % carColors.length]);
      car.position.set(crossX, 0, -24 + cs * 18);
      car.rotation.y = dir === 1 ? -Math.PI / 2 : Math.PI / 2;
      rootGroup.add(car);
      vehicles.push({
        group: car,
        speed: 3.5,
        axis: 'z',
        laneCoord: crossX,
        direction: dir,
        minBound: -48,
        maxBound: 48,
      });
    }
  }

  // 6. Period Streetlamps Along Main Avenue & Cross-Street Corners
  if (!isHooverville && !isAncient) {
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0x1f2326,
      roughness: 0.45,
      metalness: 0.8,
    });
    const bulbMat = new THREE.MeshBasicMaterial({
      color: isWwiiBlitz ? 0x38bdf8 : 0xffe099,
    });
    for (let lx = -42; lx <= 42; lx += 14) {
      if (Math.abs(Math.abs(lx) - 23) < 4) continue;
      for (const lz of [-6.2, 6.2]) {
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.07, 0.11, 3.8, 8),
          poleMat
        );
        post.position.set(lx, 1.9, lz);
        rootGroup.add(post);

        const globe = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), bulbMat);
        globe.position.set(lx, 3.9, lz);
        rootGroup.add(globe);
      }
    }
  }

  // 7. Crowd Formations (36-Person Breadline Queue + Articulated Sidewalk Walkers — All Clickable!)
  const coatPalette =
    isWwiiBlitz || isWwiiLib
      ? [0x3b442b, 0x2d3748, 0x4a3b2c, 0x1f2937]
      : [0x272522, 0x38322c, 0x1e2229, 0x42382f];

  const citizenRoster = [
    { name: 'Arthur Pendelton (Age 41)', role: 'Unemployed Master Machinist', bio: 'Former tool-and-die maker laid off after the 1930 industrial contraction; waiting in the municipal relief queue with Emergency Ration Card #4082.' },
    { name: 'Walter Kowalski (Age 34)', role: 'Structural Ironworker', bio: 'Worked on high-rise riveted steel framing until construction credit froze; wears his pre-Crash wool overcoat and fedora.' },
    { name: 'Thomas Callahan (Age 48)', role: 'Former Freight Clerk & WWI Veteran', bio: 'Served in the 77th Division in 1918; registered with the Municipal Emergency Unemployment Relief Committee.' },
    { name: 'Samuel Goldstein (Age 29)', role: 'Garment District Bookkeeper', bio: 'Displaced after commercial bank suspension closed his employer’s loft; carries morning classified pages.' },
    { name: 'Edward Lindqvist (Age 52)', role: 'Cabinetmaker & Joiner', bio: 'Skilled woodworker seeking Work Bureau placement to support a family of five in the lower tenement ward.' },
    { name: 'Frank DeLuca (Age 37)', role: 'Stonemason & Bricklayer', bio: 'Member of the Unemployed Citizens League; helps tend the street-corner coal brazier during freezing mornings.' },
  ];

  if (isBreadline) {
    for (let i = 0; i < 36; i++) {
      const row = Math.floor(i / 2);
      const col = i % 2;
      const built = buildPeriodActor(
        coatPalette[i % coatPalette.length],
        0x181615,
        false
      );
      const ax = -7.0 + row * 1.05;
      const az = -7.0 - col * 0.68;
      built.group.position.set(ax, 0.22, az);
      built.group.rotation.y = -Math.PI / 2;
      rootGroup.add(built.group);

      const profile = citizenRoster[i % citizenRoster.length];
      registerGranularEntity(built.group, 0.42, 1.85, {
        id: `entity-breadline-citizen-${i}`,
        entityType: 'citizen',
        name: `${profile.name} — Queue Position #${i + 1}`,
        roleOrClass: profile.role,
        yearBadge: String(blueprint.year),
        microBiography: profile.bio,
        granularSpecs: [
          { label: 'Queue Position', value: `#${i + 1} of 36 in Double-File Commissary Line` },
          { label: 'Attire', value: 'Heavy Wool Overcoat, Felt Fedora & Leather Brogues' },
          { label: 'Daily Ration', value: '16 oz Vegetable Stew, Half-Loaf Bread & Coffee' },
        ],
        archivalSource: 'Federal Writers’ Project & Municipal Relief Case File (1932)',
        worldPosition: [ax, 1.1, az],
      });

      crowdActors.push({
        group: built.group,
        leftLeg: built.leftLeg,
        rightLeg: built.rightLeg,
        leftArm: built.leftArm,
        rightArm: built.rightArm,
        baseX: ax,
        baseZ: az,
        walkSpeed: 0,
        axis: 'x',
        phase: i * 0.7,
        isStaticQueue: true,
      });
    }
  }

  const walkerCount = isHooverville ? 24 : 32;
  for (let w = 0; w < walkerCount; w++) {
    const hasHelmet = (isWwiiBlitz || isWwiiLib) && w % 2 === 0;
    const built = buildPeriodActor(
      coatPalette[w % coatPalette.length],
      hasHelmet ? 0x3b442b : 0x1c1917,
      hasHelmet
    );
    const sideZ = isHooverville
      ? (w % 2 === 0 ? -3.5 : 3.5) + (w % 3) * 0.8
      : w % 2 === 0
      ? 7.8 + (w % 3) * 0.45
      : -9.2 - (w % 3) * 0.45;
    const startX = -38 + w * 2.4;
    const yBase = isHooverville ? 0 : 0.22;
    built.group.position.set(startX, yBase, sideZ);
    built.group.rotation.y = w % 2 === 0 ? Math.PI / 2 : -Math.PI / 2;
    rootGroup.add(built.group);

    registerGranularEntity(built.group, 0.45, 1.85, {
      id: `entity-walker-${w}`,
      entityType: 'citizen',
      name: hasHelmet
        ? `Civil Defense Warden / Allied Trooper #${w + 1}`
        : isAncient
        ? `Civic Citizen of ${blueprint.city} #${w + 1}`
        : `Pedestrian Citizen #${w + 1} (${blueprint.city})`,
      roleOrClass: hasHelmet
        ? 'Wartime Civil Defense & Sector Patrol'
        : isAncient
        ? 'Processional Citizen & Artisan'
        : 'Urban Commuter & Resident',
      yearBadge: String(blueprint.year),
      microBiography: hasHelmet
        ? `Equipped with steel Brodie/M1 helmet and sector patrol armband, enforcing blackout discipline and guiding residents toward shelter entrances.`
        : `Resident traversing ${blueprint.address.split(',')[0]} during ${blueprint.year}. Click "Lock Camera & Follow" to walk alongside this citizen.`,
      granularSpecs: [
        { label: 'Sector Route', value: `${blueprint.address.split(',')[0]} Sidewalk Promenade` },
        { label: 'Movement Speed', value: '1.15 m/s Articulated Stride' },
      ],
      archivalSource: `${blueprint.city} Social & Demographic Survey (${blueprint.year})`,
      worldPosition: [startX, 1.1, sideZ],
      isMoving: true,
    });

    crowdActors.push({
      group: built.group,
      leftLeg: built.leftLeg,
      rightLeg: built.rightLeg,
      leftArm: built.leftArm,
      rightArm: built.rightArm,
      baseX: startX,
      baseZ: sideZ,
      walkSpeed: (w % 2 === 0 ? 1 : -1) * (0.85 + (w % 3) * 0.25),
      axis: 'x',
      phase: w * 1.1,
      isStaticQueue: false,
    });
  }

  // 8. Atmospheric Weather Particle System (Rain / Winter Ash / Golden Motes)
  const particleCount = 900;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 95;
    positions[i * 3 + 1] = Math.random() * 28;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 55;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color:
      blueprint.weatherMood === 'wwii_night_blitz' ||
      blueprint.weatherMood === 'rain_noir'
        ? 0x93c5fd
        : blueprint.weatherMood === 'depression_overcast'
        ? 0xd6d3d1
        : 0xfde68a,
    size:
      blueprint.weatherMood === 'wwii_night_blitz' ||
      blueprint.weatherMood === 'rain_noir'
        ? 0.16
        : 0.12,
    transparent: true,
    opacity: 0.48,
    depthWrite: false,
  });
  const weatherParticles = new THREE.Points(particleGeo, particleMat);
  rootGroup.add(weatherParticles);

  // 9. Interactive 3D Historical Hotspot Beacons (Raycaster Layer 1)
  const beaconMat = new THREE.MeshStandardMaterial({
    color: 0xe5a93c,
    emissive: 0xd97706,
    emissiveIntensity: 1.1,
    roughness: 0.2,
    metalness: 0.85,
  });
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xe5a93c,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75,
  });

  blueprint.hotspots.forEach((hs, idx) => {
    const markerGroup = new THREE.Group();
    markerGroup.position.set(hs.position[0], hs.position[1], hs.position[2]);
    markerGroup.userData = { hotspotId: hs.id, hotspotIndex: idx, hotspot: hs };

    const diamond = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.48, 0),
      beaconMat.clone()
    );
    diamond.layers.enable(1);
    diamond.userData = { hotspotId: hs.id, hotspotIndex: idx, hotspot: hs };
    markerGroup.add(diamond);

    const ring = new THREE.Mesh(new THREE.RingGeometry(0.58, 0.72, 24), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.55;
    markerGroup.add(ring);

    const hitProxy = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitProxy.layers.enable(1);
    hitProxy.userData = { hotspotId: hs.id, hotspotIndex: idx, hotspot: hs };
    markerGroup.add(hitProxy);

    rootGroup.add(markerGroup);
    clickableHotspots.push(hitProxy, diamond);
  });

  return {
    rootGroup,
    clickableHotspots,
    clickableWorldCities,
    clickableEntities,
    cutawayMaterials,
    skyDomeUniforms,
    worldCityAnchors,
    vehicles,
    aircraft,
    searchlights,
    fireLights,
    smokePuffs,
    crowdActors,
    weatherParticles,
  };
}
