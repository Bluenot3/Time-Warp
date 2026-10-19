import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import {
  CameraMode,
  GranularEntityRecord,
  HistoricalHotspot,
  HistoricalSceneBlueprint,
  WeatherMood,
  WorldCityNode,
  ZoomTier,
} from '../types/history';
import { getWorldCitiesForYear } from '../data/presets';
import {
  AnimatedSceneHandles,
  buildHistoricalScene,
} from '../engine/ProceduralModels';

interface HistoricalStage3DProps {
  blueprint: HistoricalSceneBlueprint;
  cameraMode: CameraMode;
  zoomTier: ZoomTier;
  solarHour: number;
  xrayCutaway: boolean;
  cinematicBloom: boolean;
  selectedHotspot: HistoricalHotspot | null;
  selectedEntity: GranularEntityRecord | null;
  followedEntityId: string | null;
  onSelectHotspot: (hotspot: HistoricalHotspot | null) => void;
  onSelectEntity: (entity: GranularEntityRecord | null) => void;
  onFollowEntity: (entityId: string | null) => void;
  onHoverHotspot: (
    hotspot: HistoricalHotspot | null,
    screenPos: { x: number; y: number } | null
  ) => void;
  onSelectWorldCity: (cityNode: WorldCityNode) => void;
  onZoomTierChange: (tier: ZoomTier) => void;
}

// Reusable module-scope math vectors to guarantee Zero GC inside the 60 FPS render loop
const _camGoalPos = new THREE.Vector3();
const _camGoalLook = new THREE.Vector3();
const _forwardVec = new THREE.Vector3();
const _rightVec = new THREE.Vector3();
const _projVec = new THREE.Vector3();
const _followWorldPos = new THREE.Vector3();

function getMoodColors(mood: WeatherMood): {
  skyHex: number;
  fogHex: number;
  fogDensity: number;
  sunHex: number;
  sunIntensity: number;
  hemiSkyHex: number;
  hemiGroundHex: number;
  hemiIntensity: number;
  exposure: number;
} {
  switch (mood) {
    case 'wwii_night_blitz':
      return {
        skyHex: 0x070b14,
        fogHex: 0x090e1a,
        fogDensity: 0.012,
        sunHex: 0x93c5fd,
        sunIntensity: 0.95,
        hemiSkyHex: 0x1e3a8a,
        hemiGroundHex: 0x0f172a,
        hemiIntensity: 0.72,
        exposure: 1.05,
      };
    case 'depression_overcast':
      return {
        skyHex: 0x24282e,
        fogHex: 0x24282e,
        fogDensity: 0.011,
        sunHex: 0xe2d5c1,
        sunIntensity: 1.65,
        hemiSkyHex: 0x64748b,
        hemiGroundHex: 0x292524,
        hemiIntensity: 0.9,
        exposure: 1.08,
      };
    case 'vintage_sepia':
      return {
        skyHex: 0x362b20,
        fogHex: 0x362b20,
        fogDensity: 0.01,
        sunHex: 0xffd89b,
        sunIntensity: 2.15,
        hemiSkyHex: 0xfde68a,
        hemiGroundHex: 0x451a03,
        hemiIntensity: 0.92,
        exposure: 1.12,
      };
    case 'rain_noir':
      return {
        skyHex: 0x151a22,
        fogHex: 0x151a22,
        fogDensity: 0.012,
        sunHex: 0xcbd5e1,
        sunIntensity: 1.35,
        hemiSkyHex: 0x475569,
        hemiGroundHex: 0x1e293b,
        hemiIntensity: 0.8,
        exposure: 1.04,
      };
    case 'modern_daylight':
      return {
        skyHex: 0x1b2536,
        fogHex: 0x1b2536,
        fogDensity: 0.0085,
        sunHex: 0xfffbeb,
        sunIntensity: 2.45,
        hemiSkyHex: 0x93c5fd,
        hemiGroundHex: 0x334155,
        hemiIntensity: 1.0,
        exposure: 1.15,
      };
    case 'clear_golden':
    default:
      return {
        skyHex: 0x26211b,
        fogHex: 0x26211b,
        fogDensity: 0.009,
        sunHex: 0xffe4b5,
        sunIntensity: 2.3,
        hemiSkyHex: 0x93c5fd,
        hemiGroundHex: 0x3e2723,
        hemiIntensity: 0.95,
        exposure: 1.14,
      };
  }
}

export const HistoricalStage3D: React.FC<HistoricalStage3DProps> = ({
  blueprint,
  cameraMode,
  zoomTier,
  solarHour,
  xrayCutaway,
  cinematicBloom,
  selectedHotspot,
  selectedEntity,
  followedEntityId,
  onSelectHotspot,
  onSelectEntity,
  onFollowEntity,
  onHoverHotspot,
  onSelectWorldCity,
  onZoomTierChange,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const worldLabelsContainerRef = useRef<HTMLDivElement | null>(null);
  const worldLabelElsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const handlesRef = useRef<AnimatedSceneHandles | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const baseFogDensityRef = useRef<number>(0.01);

  const cameraModeRef = useRef<CameraMode>(cameraMode);
  const zoomTierRef = useRef<ZoomTier>(zoomTier);
  const solarHourRef = useRef<number>(solarHour);
  const cinematicBloomRef = useRef<boolean>(cinematicBloom);
  const selectedHotspotRef = useRef<HistoricalHotspot | null>(selectedHotspot);
  const followedEntityIdRef = useRef<string | null>(followedEntityId);
  const flyTransitionFramesRef = useRef<number>(0);

  const [hoveredCityNode, setHoveredCityNode] = useState<{
    city: WorldCityNode;
    x: number;
    y: number;
  } | null>(null);

  const [hoveredEntityTag, setHoveredEntityTag] = useState<{
    entity: GranularEntityRecord;
    x: number;
    y: number;
  } | null>(null);

  const worldCitiesForCurrentYear = getWorldCitiesForYear(blueprint.year);

  useEffect(() => {
    cameraModeRef.current = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    solarHourRef.current = solarHour;
  }, [solarHour]);

  useEffect(() => {
    cinematicBloomRef.current = cinematicBloom;
    if (bloomPassRef.current) {
      bloomPassRef.current.enabled = cinematicBloom;
    }
  }, [cinematicBloom]);

  // Apply X-Ray Architectural Cutaway transparency on building exterior walls
  useEffect(() => {
    const handles = handlesRef.current;
    if (!handles) return;
    handles.cutawayMaterials.forEach((mat) => {
      mat.transparent = xrayCutaway;
      mat.opacity = xrayCutaway ? 0.22 : 1.0;
      mat.depthWrite = !xrayCutaway;
      mat.needsUpdate = true;
    });
  }, [xrayCutaway, blueprint]);

  useEffect(() => {
    followedEntityIdRef.current = followedEntityId;
  }, [followedEntityId]);

  useEffect(() => {
    zoomTierRef.current = zoomTier;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (zoomTier === 'street') {
      _camGoalPos.set(20, 9.5, 22);
      _camGoalLook.set(0, 2.4, 0);
      flyTransitionFramesRef.current = 65;
    } else if (zoomTier === 'district') {
      _camGoalPos.set(0, 68, 86);
      _camGoalLook.set(0, 0, 0);
      flyTransitionFramesRef.current = 75;
    } else if (zoomTier === 'world') {
      _camGoalPos.set(0, 255, 235);
      _camGoalLook.set(0, 0, -10);
      flyTransitionFramesRef.current = 85;
    }
  }, [zoomTier]);

  useEffect(() => {
    selectedHotspotRef.current = selectedHotspot;
    if (selectedHotspot && cameraRef.current && controlsRef.current) {
      _camGoalPos.set(
        selectedHotspot.cameraOffset[0],
        selectedHotspot.cameraOffset[1],
        selectedHotspot.cameraOffset[2]
      );
      _camGoalLook.set(
        selectedHotspot.position[0],
        selectedHotspot.position[1],
        selectedHotspot.position[2]
      );
      flyTransitionFramesRef.current = 75;
    }
  }, [selectedHotspot]);

  const keysRef = useRef<{ [key: string]: boolean }>({});

  // Initialize Three.js WebGL stage & Post-Processing Composer once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x18181b);
    scene.fog = new THREE.FogExp2(0x18181b, 0.01);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.25, 2600);
    camera.position.set(20, 9.5, 22);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Post-Processing Pipeline (RenderPass + UnrealBloomPass + OutputPass)
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.32, // subtle atmospheric bloom strength
      0.45, // radius
      0.78  // threshold so warm windows, beacons, braziers & searchlights glow
    );
    bloomPass.enabled = cinematicBloomRef.current;
    composer.addPass(bloomPass);
    bloomPassRef.current = bloomPass;

    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    composerRef.current = composer;

    // Studio IBL environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04
    ).texture;
    pmremGenerator.dispose();

    // Directional Sun / Moon light with 2048x2048 shadow map
    const sunLight = new THREE.DirectionalLight(0xffe4b5, 2.2);
    sunLight.position.set(28, 38, 22);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 160;
    const d = 54;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x3e2723, 0.9);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // OrbitControls — supports zooming from 1.5m street intimacy out to 580m World Theater
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.015;
    controls.minDistance = 1.8;
    controls.maxDistance = 580;
    controls.target.set(0, 2.2, 0);
    controlsRef.current = controls;

    // Raycaster for 3D Hotspots, World Cities, and Granular Entities (Layer 1)
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
      if (flyTransitionFramesRef.current > 0) {
        flyTransitionFramesRef.current = 0;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!handlesRef.current || !cameraRef.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, cameraRef.current);

      // Check hotspots first
      const hsIntersects = raycaster.intersectObjects(
        handlesRef.current.clickableHotspots,
        false
      );

      if (hsIntersects.length > 0) {
        const hit = hsIntersects[0].object;
        const hs = hit.userData?.hotspot as HistoricalHotspot | undefined;
        if (hs) {
          renderer.domElement.style.cursor = 'pointer';
          setHoveredCityNode(null);
          setHoveredEntityTag(null);
          onHoverHotspot(hs, { x: e.clientX, y: e.clientY });
          return;
        }
      }

      // Check world city beacons
      const cityIntersects = raycaster.intersectObjects(
        handlesRef.current.clickableWorldCities,
        false
      );

      if (cityIntersects.length > 0) {
        const cityHit = cityIntersects[0].object;
        const cityNode = cityHit.userData?.worldCity as WorldCityNode | undefined;
        if (cityNode) {
          renderer.domElement.style.cursor = 'pointer';
          onHoverHotspot(null, null);
          setHoveredEntityTag(null);
          setHoveredCityNode({ city: cityNode, x: e.clientX, y: e.clientY });
          return;
        }
      }

      // Check granular street entities (citizens, vehicles, buildings, infrastructure)
      const entityIntersects = raycaster.intersectObjects(
        handlesRef.current.clickableEntities,
        false
      );

      if (entityIntersects.length > 0) {
        const entityHit = entityIntersects[0].object;
        const entityRec = entityHit.userData?.granularEntity as
          | GranularEntityRecord
          | undefined;
        if (entityRec) {
          renderer.domElement.style.cursor = 'pointer';
          onHoverHotspot(null, null);
          setHoveredCityNode(null);
          setHoveredEntityTag({ entity: entityRec, x: e.clientX, y: e.clientY });
          return;
        }
      }

      renderer.domElement.style.cursor =
        cameraModeRef.current === 'walkthrough' ? 'crosshair' : 'grab';
      onHoverHotspot(null, null);
      setHoveredCityNode(null);
      setHoveredEntityTag(null);
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dx = e.clientX - pointerDownPos.x;
      const dy = e.clientY - pointerDownPos.y;
      if (Math.hypot(dx, dy) > 6) return;

      if (!handlesRef.current || !cameraRef.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, cameraRef.current);

      const hsIntersects = raycaster.intersectObjects(
        handlesRef.current.clickableHotspots,
        false
      );
      if (hsIntersects.length > 0) {
        const hs = hsIntersects[0].object.userData?.hotspot as
          | HistoricalHotspot
          | undefined;
        if (hs) {
          onSelectEntity(null);
          onSelectHotspot(hs);
          return;
        }
      }

      const cityIntersects = raycaster.intersectObjects(
        handlesRef.current.clickableWorldCities,
        false
      );
      if (cityIntersects.length > 0) {
        const cityNode = cityIntersects[0].object.userData?.worldCity as
          | WorldCityNode
          | undefined;
        if (cityNode) {
          onSelectWorldCity(cityNode);
          return;
        }
      }

      const entityIntersects = raycaster.intersectObjects(
        handlesRef.current.clickableEntities,
        false
      );
      if (entityIntersects.length > 0) {
        const hitObj = entityIntersects[0].object;
        const entityRec = hitObj.userData?.granularEntity as
          | GranularEntityRecord
          | undefined;
        if (entityRec) {
          // Update worldPosition snapshot from live parent group
          const targetGroup =
            (hitObj.userData?.targetGroup as THREE.Object3D) || hitObj;
          targetGroup.getWorldPosition(_followWorldPos);
          onSelectHotspot(null);
          onSelectEntity({
            ...entityRec,
            worldPosition: [
              _followWorldPos.x,
              _followWorldPos.y + 1.2,
              _followWorldPos.z,
            ],
          });

          // Smoothly focus camera toward clicked entity if not already following
          if (!followedEntityIdRef.current) {
            _camGoalPos.set(
              _followWorldPos.x + 6.5,
              Math.max(2.6, _followWorldPos.y + 3.2),
              _followWorldPos.z + 7.5
            );
            _camGoalLook.set(
              _followWorldPos.x,
              _followWorldPos.y + 1.1,
              _followWorldPos.z
            );
            flyTransitionFramesRef.current = 55;
          }
          return;
        }
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', handlePointerDown);
    domElem.addEventListener('pointermove', handlePointerMove);
    domElem.addEventListener('pointerup', handlePointerUp);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      keysRef.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (w > 0 && h > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = w / h;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(w, h);
          composerRef.current?.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // 60 FPS Animation Loop
    const clock = new THREE.Clock();
    let animId = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      const handles = handlesRef.current;

      // Dynamic Solar Time-of-Day Lighting & GLSL Atmospheric Sky Dome
      const hr = solarHourRef.current;
      // Solar angle: noon (12.0) = +1.0, midnight (0/24) = -1.0
      const sunAngle = ((hr - 6) / 24) * Math.PI * 2;
      const solarElev = Math.sin(sunAngle);
      const sunHoriz = Math.cos(sunAngle);

      if (sunLightRef.current) {
        sunLightRef.current.position.set(
          sunHoriz * 48,
          Math.max(4.5, solarElev * 44 + 6),
          22 + Math.sin(sunAngle * 0.5) * 14
        );
        const dayFactor = THREE.MathUtils.clamp((solarElev + 0.25) / 1.1, 0.12, 1.0);
        sunLightRef.current.intensity = (0.45 + dayFactor * 2.1);
      }

      if (handles?.skyDomeUniforms) {
        handles.skyDomeUniforms.uTime.value = elapsed;
        handles.skyDomeUniforms.uSolarElevation.value = solarElev;
      }

      if (handles) {
        // 1. Animate period vehicles along both X and Z axes
        for (const v of handles.vehicles) {
          if (v.axis === 'x') {
            v.group.position.x += v.speed * v.direction * dt;
            if (v.direction === 1 && v.group.position.x > v.maxBound) {
              v.group.position.x = v.minBound;
            } else if (v.direction === -1 && v.group.position.x < v.minBound) {
              v.group.position.x = v.maxBound;
            }
          } else {
            v.group.position.z += v.speed * v.direction * dt;
            if (v.direction === 1 && v.group.position.z > v.maxBound) {
              v.group.position.z = v.minBound;
            } else if (v.direction === -1 && v.group.position.z < v.minBound) {
              v.group.position.z = v.maxBound;
            }
          }
          if (v.turret) {
            v.turret.rotation.y = Math.sin(elapsed * 0.8) * 0.35;
          }
        }

        // 2. Animate aircraft flyovers & spinning propellers
        for (const air of handles.aircraft) {
          air.group.position.x += air.speed * dt;
          if (air.group.position.x > 85) {
            air.group.position.x = -85;
          }
          air.group.position.y =
            air.baseY + Math.sin(elapsed * 1.6 + air.phase) * 0.45;
          air.group.rotation.x = Math.sin(elapsed * 1.3 + air.phase) * 0.06;
          for (const prop of air.propellers) {
            prop.rotation.x += 28 * dt;
          }
        }

        // 3. Sweep anti-aircraft searchlight cones
        for (const sl of handles.searchlights) {
          sl.pivot.rotation.z = Math.sin(elapsed * sl.speed + sl.phase) * 0.52;
          sl.pivot.rotation.x =
            Math.cos(elapsed * (sl.speed * 0.75) + sl.phase) * 0.38;
        }

        // 4. Flicker hobo fire barrels & bronze tripods
        for (const fl of handles.fireLights) {
          const flicker =
            Math.sin(elapsed * 14 + fl.phase) * 0.45 +
            Math.cos(elapsed * 23 + fl.phase) * 0.25;
          fl.light.intensity = Math.max(1.2, fl.baseIntensity + flicker);
          const scale = 0.88 + Math.sin(elapsed * 16 + fl.phase) * 0.16;
          fl.flameMesh.scale.set(scale, scale * 1.15, scale);
        }

        // 5. Animate rising volumetric smoke & steam plumes
        for (const sp of handles.smokePuffs) {
          const cycle = (elapsed * sp.speedY + sp.phase) % sp.maxRise;
          const norm = cycle / sp.maxRise; // 0..1
          sp.mesh.position.y = sp.baseY + cycle;
          sp.mesh.position.x =
            sp.baseX + Math.sin(elapsed * 1.4 + sp.phase) * (0.35 * norm);
          sp.mesh.position.z =
            sp.baseZ + Math.cos(elapsed * 1.1 + sp.phase) * (0.25 * norm);
          const s = 0.65 + norm * 1.75;
          sp.mesh.scale.set(s, s * 0.85, s);
          const mat = sp.mesh.material as THREE.MeshStandardMaterial;
          mat.opacity = Math.sin(norm * Math.PI) * 0.34;
        }

        // 6. Animate crowd actors with articulated walking legs & swinging arms
        for (const actor of handles.crowdActors) {
          if (actor.isStaticQueue) {
            actor.group.position.y =
              0.22 + Math.abs(Math.sin(elapsed * 1.5 + actor.phase)) * 0.015;
            actor.group.rotation.z =
              Math.sin(elapsed * 1.1 + actor.phase) * 0.025;
            if (actor.leftArm && actor.rightArm) {
              actor.leftArm.rotation.x =
                Math.sin(elapsed * 1.2 + actor.phase) * 0.06;
              actor.rightArm.rotation.x =
                -Math.sin(elapsed * 1.2 + actor.phase) * 0.06;
            }
          } else {
            actor.group.position.x += actor.walkSpeed * dt;
            if (actor.walkSpeed > 0 && actor.group.position.x > 42) {
              actor.group.position.x = -42;
            } else if (actor.walkSpeed < 0 && actor.group.position.x < -42) {
              actor.group.position.x = 42;
            }
            const stridePhase = elapsed * 5.8 + actor.phase;
            actor.group.position.y =
              (actor.group.position.y > 0.1 ? 0.22 : 0) +
              Math.abs(Math.sin(stridePhase)) * 0.035;

            if (actor.leftLeg && actor.rightLeg) {
              actor.leftLeg.rotation.x = Math.sin(stridePhase) * 0.42;
              actor.rightLeg.rotation.x = -Math.sin(stridePhase) * 0.42;
            }
            if (actor.leftArm && actor.rightArm) {
              actor.leftArm.rotation.x = -Math.sin(stridePhase) * 0.32;
              actor.rightArm.rotation.x = Math.sin(stridePhase) * 0.32;
            }
          }
        }

        // 7. Animate weather particles
        if (handles.weatherParticles) {
          const posAttr = handles.weatherParticles.geometry.getAttribute(
            'position'
          ) as THREE.BufferAttribute;
          for (let i = 0; i < posAttr.count; i++) {
            let py = posAttr.getY(i) - 3.6 * dt;
            if (py < 0) py = 26;
            posAttr.setY(i, py);
          }
          posAttr.needsUpdate = true;
        }

        // 8. Gently bob 3D hotspot diamonds
        for (const obj of handles.clickableHotspots) {
          if (obj instanceof THREE.Mesh && obj.geometry.type === 'OctahedronGeometry') {
            obj.rotation.y = elapsed * 1.4;
            obj.position.y = Math.sin(elapsed * 2.4) * 0.12;
          }
        }

        // 9. Rotate World City 3D Beacons
        for (const anchor of handles.worldCityAnchors) {
          anchor.beaconMesh.rotation.y = elapsed * 1.6;
        }
      }

      // Camera Mode & Multi-Scale Zoom Controller
      if (cameraRef.current && controlsRef.current) {
        const cam = cameraRef.current;
        const ctrl = controlsRef.current;
        const mode = cameraModeRef.current;

        const camDist = cam.position.distanceTo(ctrl.target);

        // Dynamic fog scaling so zooming out to World Theater is crystal-clear
        if (scene.fog instanceof THREE.FogExp2) {
          const baseFog = baseFogDensityRef.current;
          const distAttenuation = THREE.MathUtils.clamp(
            1 - (camDist - 40) / 140,
            0.04,
            1.0
          );
          scene.fog.density = baseFog * distAttenuation;
        }

        // Follow Mode: Lock camera onto moving vehicle, train, or citizen!
        const followId = followedEntityIdRef.current;
        if (followId && handles) {
          const matchHit = handles.clickableEntities.find(
            (obj) =>
              (obj.userData?.granularEntity as GranularEntityRecord | undefined)
                ?.id === followId
          );
          if (matchHit) {
            const targetGroup =
              (matchHit.userData?.targetGroup as THREE.Object3D) || matchHit;
            targetGroup.getWorldPosition(_followWorldPos);
            _camGoalLook.set(
              _followWorldPos.x,
              _followWorldPos.y + 1.25,
              _followWorldPos.z
            );
            _camGoalPos.set(
              _followWorldPos.x - 6.5,
              Math.max(2.6, _followWorldPos.y + 3.0),
              _followWorldPos.z + 6.5
            );
            cam.position.lerp(_camGoalPos, 0.08);
            ctrl.target.lerp(_camGoalLook, 0.12);
          }
        } else if (flyTransitionFramesRef.current > 0) {
          cam.position.lerp(_camGoalPos, 0.08);
          ctrl.target.lerp(_camGoalLook, 0.08);
          flyTransitionFramesRef.current--;
        } else if (mode === 'cinematic') {
          const orbitRadius = zoomTierRef.current === 'world' ? 240 : 24;
          const orbitHeight =
            zoomTierRef.current === 'world'
              ? 195
              : 6.5 + Math.sin(elapsed * 0.25) * 2.5;
          _camGoalPos.set(
            Math.cos(elapsed * 0.18) * orbitRadius,
            orbitHeight,
            Math.sin(elapsed * 0.18) * (orbitRadius * 0.8)
          );
          _camGoalLook.set(Math.sin(elapsed * 0.3) * 4, 2.2, 0);
          cam.position.lerp(_camGoalPos, 0.03);
          ctrl.target.lerp(_camGoalLook, 0.04);
        } else if (mode === 'walkthrough') {
          const moveSpeed = 9.0 * dt;
          cam.getWorldDirection(_forwardVec);
          _forwardVec.y = 0;
          _forwardVec.normalize();
          _rightVec.crossVectors(_forwardVec, cam.up).normalize();

          if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) {
            cam.position.addScaledVector(_forwardVec, moveSpeed);
            ctrl.target.addScaledVector(_forwardVec, moveSpeed);
          }
          if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) {
            cam.position.addScaledVector(_forwardVec, -moveSpeed);
            ctrl.target.addScaledVector(_forwardVec, -moveSpeed);
          }
          if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) {
            cam.position.addScaledVector(_rightVec, -moveSpeed);
            ctrl.target.addScaledVector(_rightVec, -moveSpeed);
          }
          if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) {
            cam.position.addScaledVector(_rightVec, moveSpeed);
            ctrl.target.addScaledVector(_rightVec, moveSpeed);
          }

          cam.position.y = THREE.MathUtils.lerp(cam.position.y, 1.95, 0.12);
          ctrl.target.y = THREE.MathUtils.lerp(ctrl.target.y, 1.9, 0.12);
        } else {
          const panSpeed = Math.max(14, camDist * 0.45) * dt;
          cam.getWorldDirection(_forwardVec);
          _forwardVec.y = 0;
          _forwardVec.normalize();
          _rightVec.crossVectors(_forwardVec, cam.up).normalize();

          if (keysRef.current['KeyW'] || keysRef.current['ArrowUp']) {
            cam.position.addScaledVector(_forwardVec, panSpeed);
            ctrl.target.addScaledVector(_forwardVec, panSpeed);
          }
          if (keysRef.current['KeyS'] || keysRef.current['ArrowDown']) {
            cam.position.addScaledVector(_forwardVec, -panSpeed);
            ctrl.target.addScaledVector(_forwardVec, -panSpeed);
          }
          if (keysRef.current['KeyA'] || keysRef.current['ArrowLeft']) {
            cam.position.addScaledVector(_rightVec, -panSpeed);
            ctrl.target.addScaledVector(_rightVec, -panSpeed);
          }
          if (keysRef.current['KeyD'] || keysRef.current['ArrowRight']) {
            cam.position.addScaledVector(_rightVec, panSpeed);
            ctrl.target.addScaledVector(_rightVec, panSpeed);
          }
        }

        ctrl.update();

        // Update 3D-projected World City Live Event Badges when zoomed out
        if (handles && worldLabelsContainerRef.current) {
          const showWorldBadges = camDist > 68 || zoomTierRef.current === 'world';
          worldLabelsContainerRef.current.style.opacity = showWorldBadges ? '1' : '0';
          worldLabelsContainerRef.current.style.pointerEvents = showWorldBadges
            ? 'auto'
            : 'none';

          if (showWorldBadges) {
            const w = renderer.domElement.clientWidth;
            const h = renderer.domElement.clientHeight;

            for (const anchor of handles.worldCityAnchors) {
              const el = worldLabelElsRef.current.get(anchor.cityNode.id);
              if (!el) continue;

              _projVec.copy(anchor.worldPos);
              _projVec.y += 12;
              _projVec.project(cam);

              if (_projVec.z > 1 || _projVec.z < -1) {
                el.style.display = 'none';
                continue;
              }

              const sx = (_projVec.x * 0.5 + 0.5) * w;
              const sy = (-_projVec.y * 0.5 + 0.5) * h;

              if (sx < -100 || sx > w + 100 || sy < -60 || sy > h + 60) {
                el.style.display = 'none';
                continue;
              }

              el.style.display = 'flex';
              el.style.transform = `translate3d(${sx}px, ${sy}px, 0) translate(-50%, -100%)`;
            }
          }
        }
      }

      if (composerRef.current) {
        composerRef.current.render();
      } else {
        renderer.render(scene, camera);
      }
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      domElem.removeEventListener('pointerdown', handlePointerDown);
      domElem.removeEventListener('pointermove', handlePointerMove);
      domElem.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Rebuild 3D procedural architecture & reenactment actors when blueprint changes
  useEffect(() => {
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    if (!scene || !renderer) return;

    if (handlesRef.current) {
      scene.remove(handlesRef.current.rootGroup);
      handlesRef.current.rootGroup.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
        }
      });
      handlesRef.current = null;
    }

    const mood = getMoodColors(blueprint.weatherMood);
    scene.background = new THREE.Color(mood.skyHex);
    baseFogDensityRef.current = mood.fogDensity;
    scene.fog = new THREE.FogExp2(mood.fogHex, mood.fogDensity);
    renderer.toneMappingExposure = mood.exposure;

    if (sunLightRef.current) {
      sunLightRef.current.color.setHex(mood.sunHex);
      sunLightRef.current.intensity = mood.sunIntensity;
    }
    if (hemiLightRef.current) {
      hemiLightRef.current.color.setHex(mood.hemiSkyHex);
      hemiLightRef.current.groundColor.setHex(mood.hemiGroundHex);
      hemiLightRef.current.intensity = mood.hemiIntensity;
    }

    const handles = buildHistoricalScene(blueprint, renderer);
    // Apply current X-Ray state immediately if active
    if (xrayCutaway) {
      handles.cutawayMaterials.forEach((mat) => {
        mat.transparent = true;
        mat.opacity = 0.22;
        mat.depthWrite = false;
      });
    }
    scene.add(handles.rootGroup);
    handlesRef.current = handles;

    if (cameraRef.current && controlsRef.current) {
      if (zoomTierRef.current === 'world') {
        _camGoalPos.set(0, 255, 235);
        _camGoalLook.set(0, 0, -10);
      } else if (zoomTierRef.current === 'district') {
        _camGoalPos.set(0, 68, 86);
        _camGoalLook.set(0, 0, 0);
      } else if (cameraModeRef.current === 'walkthrough') {
        _camGoalPos.set(-14, 1.95, 6.2);
        _camGoalLook.set(10, 1.9, 2.0);
      } else {
        _camGoalPos.set(20, 9.5, 22);
        _camGoalLook.set(0, 2.4, 0);
      }
      flyTransitionFramesRef.current = 70;
    }
  }, [blueprint]);

  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    if (cameraMode === 'walkthrough') {
      onZoomTierChange('street');
      _camGoalPos.set(-14, 1.95, 6.2);
      _camGoalLook.set(10, 1.9, 2.0);
      flyTransitionFramesRef.current = 60;
    } else if (cameraMode === 'orbit' && zoomTierRef.current === 'street') {
      _camGoalPos.set(20, 9.5, 22);
      _camGoalLook.set(0, 2.4, 0);
      flyTransitionFramesRef.current = 60;
    }
  }, [cameraMode]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Three.js WebGL Stage */}
      <div
        ref={mountRef}
        className="w-full h-full"
        aria-label="Interactive 3D Historical Reenactment Stage"
      />

      {/* Floating 3D-Projected Live World City Event Cards (Visible when zoomed out) */}
      <div
        ref={worldLabelsContainerRef}
        className="fixed inset-0 z-10 pointer-events-none transition-opacity duration-300"
        style={{ opacity: 0 }}
      >
        {worldCitiesForCurrentYear.map((cityNode) => {
          const isCurrentCity =
            blueprint.city.toLowerCase() === cityNode.city.toLowerCase();
          return (
            <button
              key={cityNode.id}
              ref={(el) => {
                if (el) {
                  worldLabelElsRef.current.set(cityNode.id, el);
                } else {
                  worldLabelElsRef.current.delete(cityNode.id);
                }
              }}
              type="button"
              onClick={() => onSelectWorldCity(cityNode)}
              className={`pointer-events-auto absolute top-0 left-0 flex flex-col items-start px-2.5 py-1.5 rounded border backdrop-blur-md transition-colors text-left shadow-lg ${
                isCurrentCity
                  ? 'bg-[#e5a93c]/25 border-[#e5a93c] text-[#f5f2eb]'
                  : 'bg-[#0b0d11]/85 border-white/20 hover:border-[#e5a93c] text-[#f5f2eb]'
              }`}
              style={{ display: 'none', willChange: 'transform' }}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isCurrentCity ? 'bg-[#38bdf8] animate-ping' : 'bg-[#e5a93c]'
                  }`}
                />
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#f5f2eb]">
                  {cityNode.city}
                </span>
                <span className="font-mono text-[9px] text-[#e5a93c]">
                  {blueprint.year < 1000
                    ? `${blueprint.year} AD`
                    : blueprint.year}
                </span>
              </div>
              <div className="text-[10px] text-[#a39e93] max-w-[165px] truncate mt-0.5">
                {cityNode.activeHeadline}
              </div>
            </button>
          );
        })}
      </div>

      {/* Hover Tooltip for 3D World City Beacons */}
      {hoveredCityNode && (
        <div
          className="fixed z-30 pointer-events-none px-3.5 py-2.5 rounded border border-[#38bdf8]/60 bg-[#0b0d11]/95 backdrop-blur-md shadow-2xl max-w-xs"
          style={{
            left: Math.min(hoveredCityNode.x + 16, window.innerWidth - 290),
            top: Math.max(hoveredCityNode.y - 76, 16),
          }}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#38bdf8]">
            Click to Fly to City · {hoveredCityNode.city.country}
          </div>
          <div className="font-serif text-sm font-semibold text-[#f5f2eb] mt-0.5">
            {hoveredCityNode.city.city} ({blueprint.year})
          </div>
          <div className="text-xs text-[#e5a93c] mt-0.5">
            {hoveredCityNode.city.activeHeadline}
          </div>
          <div className="text-[11px] text-[#a39e93] mt-1">
            {hoveredCityNode.city.summary}
          </div>
        </div>
      )}

      {/* Hover Tooltip for Granular Street Entities (Citizens, Vehicles, Buildings, Infrastructure) */}
      {hoveredEntityTag && (
        <div
          className="fixed z-30 pointer-events-none px-3 py-2 rounded border border-[#e5a93c]/60 bg-[#0b0d11]/95 backdrop-blur-md shadow-2xl max-w-xs"
          style={{
            left: Math.min(hoveredEntityTag.x + 16, window.innerWidth - 280),
            top: Math.max(hoveredEntityTag.y - 68, 16),
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#e5a93c]">
              {hoveredEntityTag.entity.entityType} · Click to Inspect
            </span>
            <span className="font-mono text-[9px] text-[#38bdf8]">
              {hoveredEntityTag.entity.yearBadge}
            </span>
          </div>
          <div className="font-serif text-xs font-semibold text-[#f5f2eb] mt-0.5">
            {hoveredEntityTag.entity.name}
          </div>
          <div className="text-[11px] text-[#a39e93]">
            {hoveredEntityTag.entity.roleOrClass}
          </div>
        </div>
      )}
    </div>
  );
};
