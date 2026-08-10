"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import Matter from "matter-js";
import { motion } from "framer-motion";

// Each item's `top`/`left` are only the INITIAL spawn position (% of the jar
// container) — once the physics sim takes over, real gravity/collision decide
// where it actually rests. `size` is the tile's fixed px *width*; height is
// derived everywhere below via ITEM_RATIO to match ProjectMedia.tsx's own
// 662:510 rectangle (object-cover crops each item's media to that rectangle,
// see the render loop below).
//
// One entry per real project (see lib/projects.ts) rather than padded back up
// to a dozen by repeating — sparse is the deliberate choice here, not a
// placeholder state. placeholder-4 (currently just a duplicate of Cybersea's
// video) deliberately has no jar item — it'd visually duplicate the Cybersea
// tile; revisit once a real 4th project exists.
//
// Physics values are uniform across all three, unlike the old personal-items
// array (which hand-tuned density/friction/restitution per item because each
// was a real physical object with a distinct shape/weight — a plush jostles
// differently than a water bottle). That reasoning doesn't apply to flat
// rectangular media tiles, so uniform values are correct here, not a shortcut.
//
// Array order is the back-to-front stacking order (DOM order = z-index, so
// later entries render in front of earlier ones). `fallOrder` is a separate,
// independent sequence — the order items drop into the jar during the entrance
// animation.
//
// Rotation is intentionally left unlocked (unlike the old square-tile pass,
// which locked it on all three because collisions spun the square tiles a
// full 30-70°+ off their initial angle and that looked messy on tiles with
// on-screen text/UI). Amy wants organic tumbling now — visual busyness is
// explicitly not a concern — so collisions are free to torque these. Initial
// `rotate` values are spread wide (rather than the old near-upright -8/5/-4)
// so there's visible variety even before physics adds more.
const ITEMS = [
  {
    id: "cybersea",
    src: "/images/projects/cybersea.mp4",
    mediaType: "video",
    alt: "Cybersea project thumbnail",
    top: 74, left: 30, size: 160, rotate: -25,
    density: 0.0008, friction: 0.5, restitution: 0.2, frictionAir: 0.02,
    fallOrder: 0,
  },
  {
    id: "skinsprout",
    src: "/images/projects/skinsprout.mp4",
    mediaType: "video",
    alt: "SkinSprout project thumbnail",
    top: 70, left: 48, size: 160, rotate: 35,
    density: 0.0008, friction: 0.5, restitution: 0.2, frictionAir: 0.02,
    fallOrder: 1,
  },
  {
    id: "spotify",
    src: "/images/projects/spotify.png",
    mediaType: "image",
    alt: "Spotify project thumbnail",
    top: 80, left: 66, size: 160, rotate: -15,
    density: 0.0008, friction: 0.5, restitution: 0.2, frictionAir: 0.02,
    fallOrder: 2,
  },
];

// Matches ProjectMedia.tsx's own 662:510 media ratio — item.size is treated
// as width everywhere, height is always item.size * ITEM_RATIO.
const ITEM_RATIO = 510 / 662;

// Fraction of the jar container's own box (0-1). Approximates the lower body
// of the hand-drawn glass outline as a few straight wall segments — jar.png is
// a raster illustration with no exposed path data, so this is a deliberate
// simplification, not a pixel-traced match to the drawn curve. Re-measured
// against the current jar.png (its neck/shoulder sits much higher in the
// frame than the previous artwork did, so topY in particular is not a small
// tweak away from the old value).
const WALLS = {
  // Nudged out slightly past the drawn outline on purpose — items are
  // allowed to rest a little over the lines rather than staying strictly
  // inside them, which reads nicer than a perfectly clean containment.
  leftX: 0.08,
  rightX: 0.92,
  topY: 0.25,
  floorY: 0.94,
};

const MAX_SPEED = 18; // px/tick — keeps items from tunneling through walls or flinging out
const RUSTLE_RADIUS = 110; // px
const RUSTLE_STRENGTH = 0.009;
const RUSTLE_FOLLOW = 0.00018; // how much the pointer's own velocity gets imparted
const MAX_POINTER_SPEED = 25; // px/tick — caps sudden fast-mouse-move spikes so a quick swipe doesn't fling items out
const BODY_SCALE = 0.36; // fraction of item.size used as the collision hitbox — much smaller than the rendered image so the pile packs down tightly enough to fit under the jar's rim

// item.size values (160px) are tuned against the container's own max-w-[380px]
// design reference. Below that width the container itself shrinks (w-full),
// but a raw item.size wouldn't — items would keep rendering at full size and
// visually spill past the (now smaller) jar outline. Scaling every item.size
// use by measured-width/REFERENCE_WIDTH keeps items proportional to the jar
// at any container size, so the whole scene stays fully visible.
const REFERENCE_WIDTH = 380;

export default function Jar() {
  const containerRef = useRef(null);
  const itemElRefs = useRef([]);
  const bodiesRef = useRef([]);
  const wallsRef = useRef([]);
  const pointerRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0, active: false });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const engine = Matter.Engine.create();
    engine.gravity.y = 2.6;
    engine.positionIterations = 10;
    engine.velocityIterations = 8;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Capped at 1 since the container never exceeds REFERENCE_WIDTH (its own
    // max-w-[380px]) — this only ever scales items down, never up.
    const scale = Math.min(width / REFERENCE_WIDTH, 1);

    const wallThickness = 40;
    const makeWalls = (w, h) => [
      // left
      Matter.Bodies.rectangle(w * WALLS.leftX - wallThickness / 2, h * ((WALLS.topY + WALLS.floorY) / 2), wallThickness, h * (WALLS.floorY - WALLS.topY), { isStatic: true }),
      // right
      Matter.Bodies.rectangle(w * WALLS.rightX + wallThickness / 2, h * ((WALLS.topY + WALLS.floorY) / 2), wallThickness, h * (WALLS.floorY - WALLS.topY), { isStatic: true }),
      // floor — flagged so `markLanded` can identify it by property instead of
      // by reference, since resize recreates these bodies from scratch.
      Object.assign(Matter.Bodies.rectangle(w * ((WALLS.leftX + WALLS.rightX) / 2), h * WALLS.floorY + wallThickness / 2, w * (WALLS.rightX - WALLS.leftX) + wallThickness * 2, wallThickness, { isStatic: true }), { isFloor: true }),
    ];

    const walls = makeWalls(width, height);
    wallsRef.current = walls;
    Matter.World.add(engine.world, walls);

    // Spawn items stacked above the jar with guaranteed vertical gaps between
    // them (no two overlap at t=0) — dropping them in lets gravity/collision
    // compact them into a pile naturally, instead of creating bodies already
    // deeply interpenetrating (which made Matter's overlap-resolution launch
    // them clean through the walls on the very first simulation steps).
    // Spawn height is assigned by `fallOrder`, not array position, so drop
    // sequence and back-to-front stacking can be set independently.
    const spawnY = new Array(ITEMS.length);
    let spawnCursor = 40 * scale;
    [...ITEMS.keys()].sort((a, b) => ITEMS[a].fallOrder - ITEMS[b].fallOrder).forEach((i) => {
      const height = ITEMS[i].size * scale * ITEM_RATIO;
      spawnY[i] = -(spawnCursor + height / 2);
      spawnCursor += height + 30 * scale;
    });
    const targetX = ITEMS.map((item) => (item.left / 100) * width);
    // These "half" values are constant for the component's lifetime —
    // precomputed once here instead of recomputed every tick. collisionHalfW/H
    // are the physics hitbox half-width/height; visualHalfW/H are half the
    // rendered, on-screen tile width/height, always item.size*scale/2 (and
    // its height equivalent) regardless of bodyScale.
    const collisionHalfW = ITEMS.map((item) => item.size * scale * ((item.bodyScale ?? BODY_SCALE) / 2));
    const collisionHalfH = ITEMS.map((item) => item.size * scale * ITEM_RATIO * ((item.bodyScale ?? BODY_SCALE) / 2));
    const visualHalfW = ITEMS.map((item) => (item.size * scale) / 2);
    const visualHalfH = ITEMS.map((item) => (item.size * scale * ITEM_RATIO) / 2);
    const bodies = ITEMS.map((item, i) => {
      const bodyScale = item.bodyScale ?? BODY_SCALE;
      const hitboxW = item.size * scale * bodyScale;
      const hitboxH = item.size * scale * ITEM_RATIO * bodyScale;
      const body = Matter.Bodies.rectangle(targetX[i], spawnY[i], hitboxW, hitboxH, {
        density: item.density,
        friction: item.friction,
        restitution: item.restitution,
        frictionAir: item.frictionAir,
        angle: (item.rotate * Math.PI) / 180,
        chamfer: { radius: Math.min(hitboxW, hitboxH) * 0.4 },
      });
      body.itemIndex = i;
      return body;
    });
    bodiesRef.current = bodies;
    Matter.World.add(engine.world, bodies);

    // The DOM elements themselves were rendered at item.size (unscaled) in
    // JSX, since scale isn't known until this effect measures the real
    // container — correct them to the scaled size now, before the first
    // paint of the physics-driven transform below.
    itemElRefs.current.forEach((el, i) => {
      if (!el) return;
      el.style.width = `${ITEMS[i].size * scale}px`;
      el.style.height = `${ITEMS[i].size * scale * ITEM_RATIO}px`;
    });

    // Every item drops straight down its assigned column (x pinned, see the
    // "landed" clamp in tick) until it actually touches the floor or another
    // already-landed item. Without this, items still mid-air can graze each
    // other and get knocked sideways — usually toward the center — instead of
    // filling left-to-right/right-to-left in a clean sweep per row.
    const landed = new Array(ITEMS.length).fill(false);
    const markLanded = (body, otherBody) => {
      const i = body.itemIndex;
      if (i === undefined || landed[i]) return;
      const isFloor = otherBody.isFloor === true;
      const isLandedItem = otherBody.itemIndex !== undefined && landed[otherBody.itemIndex];
      if (isFloor || isLandedItem) {
        landed[i] = true;
      }
    };
    const onCollisionStart = (event) => {
      for (const pair of event.pairs) {
        markLanded(pair.bodyA, pair.bodyB);
        markLanded(pair.bodyB, pair.bodyA);
      }
    };
    Matter.Events.on(engine, "collisionStart", onCollisionStart);

    let rafId;
    let lastTime = performance.now();

    const tick = (now) => {
      const delta = Math.min(now - lastTime, 33);
      lastTime = now;

      // A thrown error here would otherwise kill the rAF chain for good,
      // silently freezing every item exactly where it was that frame —
      // whichever items hadn't landed yet (usually whichever fall last) would
      // look like they never dropped in. Recover and keep animating instead.
      try {
        Matter.Engine.update(engine, delta);

        for (const body of bodies) {
          const speed = Matter.Vector.magnitude(body.velocity);
          if (speed > MAX_SPEED) {
            const scale = MAX_SPEED / speed;
            Matter.Body.setVelocity(body, { x: body.velocity.x * scale, y: body.velocity.y * scale });
          }
        }

        // Pin still-falling items to their assigned column so the drop reads as
        // a clean left-to-right (then right-to-left) sweep per row instead of
        // items drifting sideways from mid-air contact before they've landed.
        bodies.forEach((body, i) => {
          if (!landed[i]) {
            Matter.Body.setPosition(body, { x: targetX[i], y: body.position.y });
            Matter.Body.setVelocity(body, { x: 0, y: body.velocity.y });
          }
        });

        // Hard containment: whatever the solver does (fast impacts between big
        // bodies can still push one through a wall on rare frames), no item is
        // ever allowed to render outside the jar's walls. This is a deliberate
        // belt-and-suspenders clamp, not a substitute for the wall bodies above.
        const currentWalls = wallsRef.current;
        const leftBound = currentWalls[0].bounds.max.x;
        const rightBound = currentWalls[1].bounds.min.x;
        const floorBound = currentWalls[2].bounds.min.y;
        bodies.forEach((body, i) => {
          const halfW = collisionHalfW[i];
          const halfH = collisionHalfH[i];
          let { x, y } = body.position;
          let vx = body.velocity.x;
          let vy = body.velocity.y;
          let clamped = false;
          if (x - halfW < leftBound) { x = leftBound + halfW; vx = Math.max(vx, 0); clamped = true; }
          if (x + halfW > rightBound) { x = rightBound - halfW; vx = Math.min(vx, 0); clamped = true; }
          if (y + halfH > floorBound) { y = floorBound - halfH; vy = Math.min(vy, 0); clamped = true; }
          if (clamped) {
            Matter.Body.setPosition(body, { x, y });
            Matter.Body.setVelocity(body, { x: vx, y: vy });
          }
        });

        if (pointerRef.current.active) {
          const { x: px, y: py, prevX, prevY } = pointerRef.current;
          let vx = px - prevX;
          let vy = py - prevY;
          const pointerSpeed = Math.sqrt(vx * vx + vy * vy);
          if (pointerSpeed > MAX_POINTER_SPEED) {
            const scale = MAX_POINTER_SPEED / pointerSpeed;
            vx *= scale;
            vy *= scale;
          }
          for (const body of bodies) {
            const dx = body.position.x - px;
            const dy = body.position.y - py;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < RUSTLE_RADIUS) {
              const falloff = 1 - dist / RUSTLE_RADIUS;
              const mass = body.mass;
              Matter.Body.applyForce(body, body.position, {
                x: ((dx / dist) * falloff * RUSTLE_STRENGTH + vx * RUSTLE_FOLLOW) * mass,
                y: ((dy / dist) * falloff * RUSTLE_STRENGTH + vy * RUSTLE_FOLLOW) * mass,
              });
            }
          }
          pointerRef.current.prevX = px;
          pointerRef.current.prevY = py;
        }

        bodies.forEach((body, i) => {
          const el = itemElRefs.current[i];
          if (!el) return;
          const halfW = visualHalfW[i];
          const halfH = visualHalfH[i];
          el.style.transform = `translate(${body.position.x - halfW}px, ${body.position.y - halfH}px) rotate(${body.angle}rad)`;
          // Live z-index (not the array's fixed DOM order) so whichever tile
          // is physically lower/further-forward in the pile also paints on
          // top — recomputed every frame, cheap enough at only 3 bodies.
          el.style.zIndex = Math.round(body.position.y);
        });
      } catch (err) {
        console.error("Jar animation frame failed, recovering:", err);
      }

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const updatePointer = (clientX, clientY, active) => {
      const r = container.getBoundingClientRect();
      pointerRef.current.x = clientX - r.left;
      pointerRef.current.y = clientY - r.top;
      if (!pointerRef.current.active) {
        pointerRef.current.prevX = pointerRef.current.x;
        pointerRef.current.prevY = pointerRef.current.y;
      }
      pointerRef.current.active = active;
    };

    const onMouseMove = (e) => updatePointer(e.clientX, e.clientY, true);
    const onMouseLeave = () => { pointerRef.current.active = false; };
    const onTouchMove = (e) => {
      if (e.touches.length === 0) return;
      e.preventDefault();
      updatePointer(e.touches[0].clientX, e.touches[0].clientY, true);
    };
    const onTouchEnd = () => { pointerRef.current.active = false; };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd);
    container.addEventListener("touchcancel", onTouchEnd);

    const onResize = () => {
      const r = container.getBoundingClientRect();
      Matter.World.remove(engine.world, wallsRef.current);
      const newWalls = makeWalls(r.width, r.height);
      wallsRef.current = newWalls;
      Matter.World.add(engine.world, newWalls);

      // Keeps the rendered image sizes proportional after an orientation
      // change or window resize. Bodies/hitboxes intentionally aren't
      // rescaled here — a live mid-simulation rescale would need every body
      // repositioned proportionally too, which is a lot of physics risk for
      // an interaction (resizing an already-loaded page) far rarer than just
      // loading the page at a given size. The existing hard-containment
      // clamp above already snaps any now-out-of-bounds body back inside the
      // new walls, so nothing escapes visibly — worst case is a small snap.
      const newScale = Math.min(r.width / REFERENCE_WIDTH, 1);
      itemElRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.width = `${ITEMS[i].size * newScale}px`;
        el.style.height = `${ITEMS[i].size * newScale * ITEM_RATIO}px`;
      });
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("touchcancel", onTouchEnd);
      resizeObserver.disconnect();
      Matter.Events.off(engine, "collisionStart", onCollisionStart);
      Matter.World.clear(engine.world);
      Matter.Engine.clear(engine);
    };
  }, []);

  return (
    <section
      className="flex flex-col items-center justify-center px-4 text-center"
      style={{
        // --taskbar-height is measured live from the actual header (see
        // Taskbar.js) instead of a hardcoded rem guess, so this always
        // equals exactly "one viewport minus however tall the sticky header
        // really is right now" — on both the desktop and mobile nav rows,
        // and even while the mobile menu is open. 4.375rem (70px) is only
        // the pre-hydration fallback, matching the desktop row's measured
        // height (the mobile row measures ~1px shorter, an imperceptible
        // difference for that brief pre-JS moment). dvh rather than vh so
        // mobile browsers' address-bar show/hide doesn't leave a sliver of
        // WhatsInside peeking in or a gap of empty space below the fold.
        "--available-height": "calc(100dvh - var(--taskbar-height, 4.375rem))",
        minHeight: "var(--available-height)",
      }}
    >
      <div
        ref={containerRef}
        className="relative w-full touch-none overflow-visible"
        style={{
          // Matches jar.png's own real pixel ratio (5356x7556, simplified) —
          // must match exactly, or object-contain below letterboxes the
          // image inside this box, throwing off WALLS (fractions of *this
          // container*, not the visibly-rendered image) from where the drawn
          // jar's outline actually is. Re-measure this alongside WALLS if
          // jar.png is ever swapped for new artwork.
          aspectRatio: "1339 / 1889",
          // Width is computed directly, as a single formula, instead of
          // being capped separately from height (previously: a max-w-[380px]
          // class for width, a maxHeight for height). Those two caps could
          // disagree — on a short-but-wide viewport, the height cap would
          // win while width stayed at its own fixed value, leaving a box
          // whose ratio no longer matched jar.png. object-contain then drew
          // the actual jar picture smaller and centered inside that
          // mismatched box, but WALLS (fractions of the box) didn't move
          // with it — so the invisible physics walls no longer lined up
          // with the visible drawn jar, and items could rest outside it.
          // This formula picks the largest width that's simultaneously:
          // ≤380px (the original design reference), ≤100% of the available
          // horizontal space, and small enough that height (= width *
          // 1889/1339) still fits within 60% of the available viewport
          // height — so the box's ratio always matches jar.png exactly, at
          // every screen size, and WALLS always lines up with what's drawn.
          width: "min(380px, 100%, calc(var(--available-height) * 0.6 * 1339 / 1889))",
        }}
      >
        <Image
          src="/images/drawings/jar.png"
          alt="Outline illustration of a jar"
          fill
          priority
          // Turbopack's dev-mode image-optimization cache doesn't bust when
          // this file is replaced at the same path (it keeps serving the
          // first-ever encode indefinitely) — this artwork gets swapped
          // often during design iteration, so skip the optimizer in dev to
          // always show the current file. Production still gets normal
          // next/image optimization.
          unoptimized={process.env.NODE_ENV !== "production"}
          className="pointer-events-none object-contain"
        />
        {ITEMS.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => { itemElRefs.current[i] = el; }}
            className="absolute left-0 top-0 will-change-transform"
            style={{ width: `${item.size}px`, height: `${item.size * ITEM_RATIO}px` }}
          >
            {item.mediaType === "video" ? (
              <video
                src={item.src}
                muted
                loop
                playsInline
                autoPlay
                className="pointer-events-none h-full w-full select-none rounded-md object-cover"
              />
            ) : (
              <Image
                src={item.src}
                alt={item.alt}
                width={1200}
                height={1280}
                draggable={false}
                className="pointer-events-none h-full w-full select-none rounded-md object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {/* Delayed so the jar drawing reads as the first beat (it's already on
          screen the instant this component mounts) before the text slides up
          — by this point the items are well into their physics-driven fall,
          so the two motions read as concurrent rather than the whole hero
          animating in as one simultaneous blob. */}
      {/* mt-10/mt-2 previously assumed a tall viewport; clamp()'s max bound
          (2.5rem/0.5rem) matches those exact original values, so nothing
          changes until the viewport actually gets short — same for the
          heading's own min(9vw,9dvh): on a normal tall viewport 9dvh always
          exceeds the clamp's 5rem ceiling so 9vw (the original behavior)
          keeps winning; on a short-but-wide window (a common laptop size)
          9dvh becomes the smaller term and the heading shrinks with the
          available height instead of insisting on its full width-based
          size. */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        className="mt-[clamp(1rem,5dvh,2.5rem)] font-singsong text-[clamp(2rem,min(9vw,9dvh),5rem)] leading-none text-[#2460A4]"
      >
        AMY WANG&apos;S JAR
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.6 }}
        className="mt-[clamp(0.25rem,1dvh,0.5rem)] font-roboto text-xl font-light text-gray-500"
      >
        Filled with tasteful design.
      </motion.p>
    </section>
  );
}
