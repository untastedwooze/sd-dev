# Build Spec: Multi-Armed Bandit Demo — B2B Toaster Marketing

**Deliverable:** a single self-contained `.html` file (vanilla JS + Chart.js via CDN, no build step, no framework, no backend). Runs entirely client-side. Designed to drop into an existing portfolio site as a static page or embeddable component.

---

## 1. Context: This Is a Portfolio Page

This page lives within a personal professional portfolio and will be seen by recruiters, hiring managers, and potential clients. Treat it accordingly:

- **Audience may land here cold**, without context from the rest of the portfolio. Include a brief intro (1–3 sentences) at the top explaining what they're looking at and why, before any controls appear. Assume the visitor does not know what a multi-armed bandit is — explain in plain business language (e.g., "a way to automatically shift marketing spend toward what's working, instead of waiting for a quarterly report").
- **No meta-commentary about design choices.** Do not include any "design rationale," "why I scoped it this way," or behind-the-scenes explanation of engineering decisions on the page itself. It should read as a clean, confident demo — not a case study annotating itself.
- **Minimal personal branding only.** A small byline — name + link back to the portfolio (placeholders: `[Your Name]`, `[portfolio URL]`) — in the header or footer. Understated: not a nav bar, not a bio block, just a discreet line.
- **Polish bar is higher than a personal demo:**
  - Responsive — usable on mobile; sliders and charts must not break on a narrow viewport.
  - Loads fast, feels snappy — no janky animation, no layout shift on load.
  - Proper `<title>` and meta description (page may be shared as a standalone link, e.g. pasted into a recruiter Slack channel). Title should make sense out of context, e.g. "Multi-Armed Bandit Demo — Marketing Optimization Simulator."

---

## 2. Goal

Teach the explore/exploit tradeoff in multi-armed bandits using a B2B toaster marketing scenario as the storytelling wrapper. Audience is a mix of non-technical business stakeholders and technical reviewers (recruiters/engineers evaluating this as a work sample) — so the UI should feel like a polished marketing dashboard, not a stats textbook, while remaining technically correct under the hood.

---

## 3. Scenario / Narrative

We sell a commercial toaster to B2B buyers (restaurants, hotels, cafes). We're running 4 marketing campaigns simultaneously and want to learn which one converts leads into booked demos most efficiently, without wasting budget on losers.

### The 4 arms (fixed, not user-editable)

| Campaign | Pitch | Hidden true conversion rate |
|---|---|---|
| LinkedIn Ad | "Cut kitchen prep time by 30%" | 0.12 |
| Cold Email | "Try it free for 30 days" | 0.08 |
| Trade Show Follow-up | "Bulk discount for fleet orders" | 0.18 |
| Newsletter Ad | "See your ROI in 6 months" | 0.05 |

True rates are hidden from the algorithm and from the UI by default (see reveal toggle, §6). They drive a random Bernoulli outcome each time an arm is shown to a lead.

### Reward definition

Binary outcome per lead: demo booked (1) or not (0). No multi-stage funnel, no delay — one lead = one immediate reward signal.

---

## 4. Core Concepts to Make Visible

1. **Explore vs. exploit tradeoff** — user should see the algorithm trying weaker arms early, converging over time.
2. **Regret** — the cost of not always picking the best arm. Shown as a number/chart so the value of bandits is legible.
3. **Bandit vs. static A/B testing** — static baseline splits traffic evenly across all 4 arms forever, never adapts. This comparison is the "why bandits" sell.
4. **Algorithm behavior differences** — epsilon-greedy explores randomly at a fixed rate; Thompson Sampling explores probabilistically based on uncertainty and converges faster/smarter.

---

## 5. Algorithms (implement exactly these three)

1. **Epsilon-Greedy**
   - With probability ε: pick a random arm (explore).
   - With probability 1−ε: pick the arm with the current highest estimated conversion rate (exploit).
   - Estimated rate = running average of observed rewards per arm.

2. **Thompson Sampling**
   - Maintain a Beta(α, β) per arm, starting at Beta(1,1).
   - Each round: sample a value from each arm's Beta distribution, pick the arm with the highest sample.
   - Update α (successes) / β (failures) after observing the reward.

3. **Static A/B/n Test (baseline)**
   - Split incoming leads evenly across all 4 arms (round-robin or uniform random), forever.
   - No adaptation — this is "what we'd do without a bandit."

---

## 6. User-Controllable Levers (exactly 3 — do not add more)

1. **Epsilon value** — slider, 0.0–1.0, default 0.1. Only affects Epsilon-Greedy; grayed out / inactive when Thompson Sampling or A/B is selected.
2. **Leads per day** — slider or input, range ~10–500, default 50. Controls simulation volume per tick.
3. **Algorithm selector** — toggle/dropdown: Epsilon-Greedy | Thompson Sampling | Static A/B Test.

Two additional levers were added after the initial scope (see §13): **conversion delay** (how long after contact a lead resolves) and **starting budget** (the budget/ROI model). No segments or non-stationarity. Keep the surface area small beyond these.

---

## 7. Simulation Mechanics

- A "tick" = one simulated day. Each tick generates `leads_per_day` leads.
- Per lead: active algorithm selects an arm → sample Bernoulli(true_rate_of_that_arm) → record reward → update algorithm's internal state (running averages for epsilon-greedy, α/β for Thompson Sampling, even split for A/B).
- Continuous run via play/pause, plus a manual "step forward one day" button.
- "Reset simulation" button zeroes all state.
- Speed control (ticks per second) for the auto-play loop.
- Cap history at a reasonable number of days (e.g. 200) for chart performance, or use a rolling window.

---

## 8. Required Visualizations (exactly 2 charts + 1 summary table)

### Chart 1: Cumulative Conversions Over Time
- X-axis: day number. Y-axis: cumulative total conversions.
- Two lines: currently selected bandit algorithm vs. static A/B baseline, run **in parallel on the same random lead stream** so the comparison is fair — simulate both simultaneously regardless of which is "selected" for display focus, so the comparison line is always live.

### Chart 2: Arm Selection % Over Time
- Stacked area chart or line chart: % of leads each arm received per day, for the currently selected algorithm.
- Should visibly show convergence toward the best arm (Trade Show Follow-up, true rate 0.18) over time.

### Summary Table (below charts, updates live)
Columns: Campaign | Times Shown | Conversions | Estimated Conversion Rate | True Conversion Rate (hidden unless toggle on).

**"Reveal true rates" toggle** — off by default, so the user experiences the not-knowing, then can flip it to check the algorithm's learning against ground truth.

Also display prominently near the top:
- **Cumulative Regret** (running total): `(best_true_rate * total_leads_so_far) - (actual_cumulative_reward)`
- One-line plain-English explanation, e.g. "Regret = leads we lost by not always picking the best campaign."

---

## 9. UI / Tone Notes

- Frame as a marketing dashboard for a toaster company — light, slightly playful copy welcome (campaign names, a toaster icon/emoji in the header), but charts and numbers stay clean and legible, not jokey.
- Top of page: short 1–3 sentence plain-language intro before any controls. No headings like "About This Project" — just a brief framing paragraph, then straight into the demo.
- Byline: single understated line with `[Your Name]` + link to `[portfolio URL]`, in header (small, top corner) or footer. No bio, no "About Me," no project writeup.
- Default view on load: simulation paused at day 0, Thompson Sampling selected, epsilon slider visible but inactive, "reveal true rates" off.
- Changing algorithm or epsilon should obviously and immediately restart the bandit's learning state (A/B baseline's independent run can keep going, or both can reset — your call, just be consistent and label it clearly).
- No login, no backend, no persistence — single-session demo.
- Responsive — verify charts and sliders work on a narrow (mobile) viewport, not just desktop.
- `<title>` tag (e.g. "Multi-Armed Bandit Demo — Marketing Optimization Simulator") and one-line meta description.

---

## 10. Design System — Vintage Poster / Comic Cell

This page should look like a vintage poster board or comic cell applied to a marketing dashboard — retro propaganda-poster styling layered over a playful B2B SaaS demo.

### Color Palette

```css
:root {
  --color-bg: #1C2E2A;       /* Deep Vintage Teal — primary background */
  --color-accent: #9E2A2B;   /* Rust/Crimson — accent */
  --color-text: #FFF3D1;     /* Aged Cream/Parchment — base text/fill */
  --color-charcoal: #212529; /* Off-Black/Charcoal — contrast */
  --border-width: 3px;
  --shadow-offset: 6px;
}
```

### Layout
- Centered, symmetric, structured like a vintage poster board or comic cell.
- Thick, double-lined borders with notched or rounded corners on hero header and CTA-style sections (e.g. the control panel, the regret callout).
- Shadows: strict 2D — hard, solid, offset drop-shadows. No soft blurs, no `filter: blur()` shadow tricks.

### Typography
- Hero headers: bold, condensed serif or sans-serif display font, high vertical contrast.
- Subheadings: script-style, italicized, slight upward angle — used for the playful campaign taglines.
- Numeric data (regret value, conversion rates, table headers) stays in the clean condensed sans/serif — not script — so it reads as data, not flavor text.
- Decorative accents: four-point geometric stars or compass bursts as section dividers — e.g. between the intro paragraph and controls, flanking the Cumulative Regret callout. Keep these off the chart/table area itself so they aren't mistaken for chart annotations.
- Texture: faint paper/noise overlay via CSS only (no image asset), low opacity, applied to the page background — not behind or inside the charts.

### Design-vs-data tension points (resolve in favor of legibility)
- **Chart colors** must stay on-palette but distinguishable: pick a small fixed chart-safe set (cream, rust, a muted gold, a muted sage) rather than literally restricting to the 4 core hex codes — the arm-selection chart needs 4 distinguishable series, the cumulative chart needs 2 more.
- **Borders/shadows**: fine on header and control-panel cards; apply sparingly on chart containers themselves so decoration doesn't compete with live data.
- **Texture**: page background only, never behind charts/tables.
- **Dividers (stars/bursts)**: chrome only — header, between sections, around callouts — never inside chart or table regions.

The poster aesthetic should own the chrome (header, panel borders, dividers, background); data surfaces (charts, table, regret number) stay slightly more restrained for legibility.

---

## 11. Code Structure (within the single file)

Even as one file, separate simulation logic from rendering for correctness review and portability:

```
<script>
  // 1. SIMULATION CORE (pure functions, no DOM access)
  //    - createArm(), bernoulliSample(trueRate)
  //    - epsilonGreedySelect(state, epsilon), thompsonSelect(state), abSelect(state, tick)
  //    - updateEpsilonGreedy(state, arm, reward), updateThompson(state, arm, reward)
  //    - runOneDay(banditState, abState, leadsPerDay) -> { banditState, abState, dayResult }
  //    - computeRegret(history, bestTrueRate)

  // 2. STATE (single object)
  //    - simState = { day, banditAlgo, banditArms[], abArms[], history[], isPlaying, speed, epsilon, leadsPerDay }

  // 3. RENDERING (reads state, touches DOM/Chart.js, never mutates simulation state)
  //    - renderCharts(history), renderTable(simState), renderRegret(simState)

  // 4. CONTROLLER (event listeners, tick loop)
  //    - play/pause/step/reset/speed/algorithm-change/epsilon-change handlers
  //    - setInterval-driven tick loop calling runOneDay() then render*()
</script>
```

This keeps simulation logic unit-testable in isolation (verify the math before wiring up UI) and makes a future React port straightforward (section 1 → hook, section 3 → JSX).

All visual decisions live in CSS custom properties (§10) at the top of the `<style>` block, so re-skinning is a find-and-replace, not a markup hunt.

---

## 12. Build Sequence

1. **Simulation core only** — pure functions, no UI. Console-verify: does Thompson Sampling converge toward arm 3 (0.18) over ~500 simulated days? Does regret grow sub-linearly for bandits vs. linearly for A/B? Catch math bugs before they're hidden behind a UI.
2. **Static layout + full CSS variable system** — palette, borders, shadows, texture, fonts, decorative dividers; header/byline, intro paragraph, controls, empty chart containers, table skeleton. Check responsive behavior at 375px width at this stage, before charts are live.
3. **Wire controller + tick loop** — play/pause/step/reset/speed, hooked to the core from step 1, rendering to the skeleton from step 2.
4. **Charts + table render functions** — Chart.js setup using the chart-safe palette (§10), live updates per tick.
5. **Polish pass** — meta tags, title, reveal-toggle, epsilon slider disable/enable logic, "changing algorithm resets bandit state" behavior, final mobile pass.

---

## 13. Explicitly Out of Scope (do not build)

- UCB or any algorithm beyond the 3 listed.
- Multi-stage funnels.
- ~~Cost-per-arm, budget constraints, or ROI/dollar modeling.~~ **Now in scope:** each campaign has a known cost-per-lead, conversions return a constant profit, and the run starts from a finite budget. Arms are ranked by expected profit-per-lead (`rate × profit − cost`), so the highest-converting campaign isn't necessarily the most profitable. The bandit can go bankrupt; the static A/B baseline drains its budget faster.
- ~~Delayed rewards.~~ Now in scope: a conversion-delay lever.
- Non-stationary/drifting conversion rates.
- Customer segments.
- Any backend, database, or persistence layer.
- Any "design rationale," "why I built it this way," case-study writeup, or behind-the-scenes commentary on the page itself.
- A full bio, nav bar, or "About Me" section — byline only.

Keep this small and focused: a clean, professional-grade demo, not a production bandit framework or a self-annotating case study.
