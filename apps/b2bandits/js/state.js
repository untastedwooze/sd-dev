/* =====================================================================
   STATE  (single object — shared, mutable, owned here)

   The whole app reads and replaces one simState instance. Routing it
   through getState()/setState() keeps that single-instance behavior
   across modules without import cycles.
   ===================================================================== */

import { createArmSet } from './simulation.js';

let simState;

export function getState() { return simState; }
export function setState(s) { simState = s; }

export function freshState(preserve) {
  return {
    day: 0,
    banditAlgo: preserve ? preserve.banditAlgo : "thompson",
    banditArms: createArmSet(),
    abArms: createArmSet(),
    history: [],
    isPlaying: false,
    speed: preserve ? preserve.speed : 5,
    epsilon: preserve ? preserve.epsilon : 0.1,
    leadsPerDay: preserve ? preserve.leadsPerDay : 50,
    convDelay: preserve ? preserve.convDelay : 0,
    banditConv: 0, banditLeads: 0, abConv: 0,
    banditCounter: 0, abCounter: 0,
    pending: new Map(),
  };
}
