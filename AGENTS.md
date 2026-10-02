# AGENTS.md — context for AI coding assistants (Claude Code, Codex, Copilot…)

This file carries over the context of the design conversation that produced this prototype
(Claude / Cowork, Sept–Oct 2026). Read it before changing anything. Full design history, version log
and level table: `docs/prototype-notes.md`.

## Who / how to talk

- Owner: Kaguya (VNGGAMES). **Reply in Vietnamese**, keep answers short, explain what changed and why.
- Game UI text is **English** (all in-game strings, launcher, settings). Code comments are English.
- The owner tests by playing; always rebuild (`npm run build`) after changes and say what to look at.

## What the game is

Portrait (9:19.5) 3D low-poly puzzle, Three.js r128, single-file HTML builds.
Loop: candy **silo** (inclined glass board, one chute per column, extends past the top edge of the screen) →
closed **loop conveyor** under the silo lip → **4 queue lanes** (max 6 boxes visible per lane, the rest come up from
under the booster panel) → player taps the **front box of a lane** → lift tosses it onto the loop → while passing under
the chutes it collects candies of its colour from the **front row** (a different colour on the valve blocks that chute;
gravity refills) → full box (4 sockets) is picked by the **robot arm** onto the **packing line** (fold flaps → tape →
label → piston) → pushed into the **truck** — from level 3 each truck **orders specific colours**; boxes it did not order wait on a 3-spot staging belt; truck leaves when its order is complete. Loop holds 5 boxes (6 with Add Slot);
loop full and a whole lap without picking anything = lose.
Levels are generated so **one pass per box is enough** (`genLevel` + `onePassSeq`).

## Repo layout

| Path | What |
|---|---|
| `src/themes/factory.html` | **Factory theme (default)** — complete game (HTML+CSS+JS). `/*THREE*/` placeholder gets Three.js at build. |
| `src/themes/candy.html` | **Candy Workshop theme** — same gameplay, different visuals (candy jar, chocolate river, wafer belts, gift boxes, candy train). |
| `src/launcher.html` | Wrapper page: theme menu, loads the chosen theme into an iframe (`srcdoc`), injects `window.__START={level,play}`; the game opens the menu via `parent.postMessage({csf:'menu'})`. |
| `scripts/build.mjs` | `npm run build` → `dist/candy_sort_factory.html` (main, with theme menu), `dist/factory.html`, `dist/candy.html`. |
| `tests/smoke.mjs` | Optional Playwright test: solver bot plays all 10 levels in both themes. |
| `vendor/three.min.js` | Three.js r128 (MIT). Do not upgrade casually (geometry APIs used are r128). |
| `docs/prototype-notes.md` | Design notes + version history (v1…v38) + level table. Update it when behaviour changes. |

**Gameplay changes must be made in BOTH theme files** (they share identical game logic; only materials, textures,
props, CSS colours and some texts differ). Apply the same edit to both, then build and test both.

## Code map (inside each theme file, top → bottom)

- CONFIG: `COLORS`, `LEVELS` (10 levels: cols/rows/colors/pat), layout constants (`LL`, `RR`, `CX`, `CZ`, `SP`,
  `THETA`, `LIP_Y/LIP_Z`, `SHELF_Z`, `N_ROWS`, `TX` packing line x, `RX` truck x, `TRUCK_CAP`, `MAX_LOOP`).
- HELPERS: `tween(dur,fn,ease)` → Promise, `wait(s)`, easing `E.*`, `mat()`, `mesh()`, audio `sfx(name)`, `buzz()`.
- STATIC WORLD: floor, zones, lanes (`setLift`), lamps (`updateLamps`), hall/indoor props (factory) or river/decor (candy).
- Belts: `pathPos(s)` loop path, `track()`, slats. Speed field `vAt`/`tauOf`/`sOfTau` (slow under silo, fast on return).
- CANDY / BOX / TRUCK builders: `makeCandy`, `makeBox`, `makeTruck`.
- STATE / levels: `genLevel`, `onePassSeq`, `makeLevel`, `startLevel(data,play)`.
- Gameplay: `sendBox` → `launch` → `updateLoop` (calls `tryPick`, `armCanGrab/armGrab`) → `dropToBox`;
  lanes `advanceLane`, `rollTo`; exit line `updateExitLine`, `foldUpdate`, `tapeUpdate`, `labelUpdate`,
  `pushToTruck`, `truckLeave`; `win`/`lose`.
- Boosters (`useBoost`, `boosts={vac,shuf,slot,clr}`):
  **Grab** (`setGrab`, `cellFromRay`, `grabPlan`, `runVacuum` – claw crane picks matching candies in a player-chosen 3×3
  area and drops them into front-row boxes), **Shuffle** (`shuffleBoost` – lanes run backwards into the sorter under the
  panel, boxes return re-ordered; partially filled boxes keep their colour), **Add Slot** (`slotBoost` – crane installs
  a 6th capacity lamp), **Magnet** (`clearBox` – electromagnet lifts the chosen box, pulls its missing candies in,
  carries it to packing). Shared: `takeCandies`, `settleCol`, `seatCandy`, `pullFromLane`, `flyToPacking`,
  `dropResv` lock on the packing-line drop point (arm and boosters must not drop at the same time).
- **Truck orders (v39)**: `LEVELS[i].order` 0 = any colour (L1–2), 1 = orders follow solution order with 2 `?` (any-colour)
  slots, 2 = shuffled ±3 with 1 `?`, 3 = shuffled ±6, no `?`. `makeManifests`/`stagePeak` build orders from the solution
  sequence and verify they fit a **staging belt** of `STAGE_N=3` spots. Runtime: `addManifest` (placards on the truck bed,
  NEXT chip in HUD), `slotFor` (exact colour first, then `?`), `alignTruck` (truck drives so the slot faces the pusher),
  `pushToTruck(b,t,idx,pusher)`, staging `stageQ`/`updateStage`/`stagePushers`. Jam relief: `dockJammed` for 2.2 s →
  truck leaves half-loaded, `replanAfter` rebuilds the remaining orders, −1 ★ (`earlyLeaves`).
  `hintBox`/`orderScore` prefer colours the current / next truck needs.
- HUD: speed toggle top-left (`setSpeed`, x1/x2), LEVEL + ⚙️ Settings top-right (modal pauses the game: sound,
  vibration, slow motion, theme, restart). Tutorial toasts only on level 1.
- Camera: `fitCamera()` searches distance/target so the scene fits width; booster panel covers the bottom (`layoutPanel`).
- Main loop: `loop()` (render) and `step()` (headless turbo) — **keep both in sync** when adding per-frame updates.

## Test hooks (DevTools console, or Playwright)

`G.play(levelIndex)`, `G.info()`, `G.dbg()`, `G.send(lane)`, `G.auto()` (greedy bot), `G.autoSeq()` (follows the generated
solution), `G.turbo(seconds, true|'seq')` (fast headless simulation, returns `G.info()`).
Difficulty check used so far: solver bot must win 100 %; greedy-bot win rate per level is the difficulty proxy
(see table in `docs/prototype-notes.md`).

## Owner's design preferences (decided in conversation — keep them)

- Must read as a **real machine / simulation**: every action is done by visible mechanics (lifts, robot arm, claw, magnet,
  pistons), nothing just teleports. Animations fast and snappy.
- Factory theme = **indoors** factory hall (dark hall, ceiling lights, columns, gantry cranes) — not outdoors.
- **No yellow/black hazard stripes**; mechanical look with some colour blocks. Candy theme: pastel but not too bright.
- Boxes show **empty sockets** (4), not numbers. No hidden-box counters, no score/stat HUD, no reward popups.
- Boxes on screen: max 6 per lane; silo board continues above the screen top.
- Level 1: 4 boxes per lane (8×8 board, 2 colours). Difficulty ramps by board size, colours and pattern
  (`band` easy → `ring` → `split` → `diag` hardest).

## Ideas discussed but not done yet

- Stronger near-loss warning, waiting light on lifts, level progress bar, win screen confetti/star sequence,
  camera shake, background motion, mesh merging / pixel-ratio cap for FPS.
- New mechanics for later worlds: wrapped candy (2 passes), rainbow candy, mystery box, big 6–8 slot box,
  linked boxes, locked valve, frozen candy, belt speed/direction changes; pixel-art boards.
- Truck model per theme (candy train exists in candy theme).

## Workflow

1. Edit `src/themes/*.html` (both if gameplay) → `npm run build` (VS Code: Ctrl+Shift+B).
2. Play `dist/candy_sort_factory.html` (F5 → "Play (Edge, debug)").
3. Optional: `npm test`.
4. Update `docs/prototype-notes.md` (bump version, describe change) → commit with a clear message.
