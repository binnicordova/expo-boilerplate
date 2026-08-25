# expofs — developer certification platform

Anonymous, offline-first mobile app where developers practise, build mastery, and earn a
time-boxed certification. Expo SDK 57 · React Native 0.86 · Expo Router · Jotai · TypeScript.

## The one idea that shapes everything

**Practice and certification are separate products.** Practice is endless, forgiving, and
teaches. The exam is gated, hard, timed, and measures. Collapsing them was the original design
flaw: a 5-question quiz that both taught and certified did neither credibly.

## Architecture

Layered, one direction only — `app/` → `stores/` → `services/` → `utils/` + `models/`.

- `src/models/` types only. `src/constants/` all tuning values, no logic.
- `src/utils/` **pure functions, no I/O** — grading, SRS, streaks, XP, skill tree, exam rules,
  notification planning. This is where the product logic lives and where the tests are.
- `src/stores/` Jotai atoms orchestrating utils + services. Persisted via `atomWithStorage`.
- `src/services/` mock/remote data access (`api`, `assessment`, `notifications`).
- `src/app/` Expo Router screens. Presentation only.

**Rules.** Every screen wraps in `<Screen>` (handles safe-area insets; `SafeAreaProvider` lives
in `_layout.tsx`). Persisted atoms are async — read derived values through `unwrap`, never
`await` in a component. Pure logic takes an injected `now: Date` so it is testable. No inline
comments.

## Content

- 137 articles + 438 questions imported from `midudev/preguntas-entrevista-react` (Spanish).
- 12 authored multi-format questions (`services/mocks/assessments.ts`) in English.
- Five formats: multiple-choice, multiple-select, code-analysis, architecture-tradeoff, ordering.
- Domains: react, react-native, typescript, architecture, node. Difficulty 0/1/2.
- Legacy questions are adapted lazily; their article becomes the micro-learning digest.

## Practice loop (`stores/quiz.ts`)

Never ends. The queue refills when within 3 of the end, deduped against everything served.
Every 10 answers a **checkpoint** appears — *after* the explanation is read, never before —
with "Keep going" as the primary action. Daily goal: 15 correct.

Each answer: grade → XP (difficulty × accuracy × streak multiplier) → domain mastery →
SRS reschedule → digest reveal. Difficulty adapts on a rolling 4-answer window (≥75% promotes,
≤40% demotes).

## Certification (`stores/certification.ts`, `utils/certification.ts`)

Earned, not stumbled into. **Eligibility gate** (this is the retention engine — it converts
"I want the badge" into repeat sessions): 60 questions answered, 12 Expert attempted, 3 domains
≥60% mastery, **3-day streak** (cramming can't buy it).

Exam: 25 questions (5 Foundation / 12 Professional / 8 Expert), ≥3 domains, 25 min, explanations
hidden until submit, practice answers cleared. **Pass = ≥80% overall AND ≥60% Expert AND ≥50%
in every domain** — you cannot pass by farming easy questions. Fail → 24h/72h/7d cooldown.
Valid 6 months.

## Engagement mechanisms

1. **Spaced repetition** — SM-2 variant; misses return tomorrow, hits stretch 1/3/7/16/35 days.
2. **Skill tree** — dependency graph, nodes unlock on domain mastery.
3. **Timed challenges** — 60–120s sprints.
4. **XP, levels, badges** — bronze/silver/gold per domain at 60/75/90% (min 5 answers).
5. **Micro-learning digests** — the *why* after every answer, sourced from the articles.
6. **Local notifications** (`utils/engagement.ts`) — a **pure planner**: state + time → schedule.
   Eight state-driven triggers (streak-save > exam-retry > exam-unlocked > cert-expiring >
   reviews-due > daily-goal > skill-unlock > win-back), copy adapted to learner tier
   (newcomer/learner/candidate/certified) and naming real data. Slots at 09/13/19 for 7 days
   are scheduled ahead so delivery does not depend on the background task; level-appropriate
   fallbacks fill empty slots. Quiet hours 22–08. Capped at 60 pending (iOS limit is 64).

## Testing

`npx jest` — 139 tests. Pure utils are exhaustively tested; stores are tested through `createStore()`
with AsyncStorage and `expo-application` mocked. **When product rules change, the tests are the
spec — update them deliberately, they encode the tuning decisions.**

Verify with: `npx tsc --noEmit --skipLibCheck`, `npx biome check src/`, `npx jest`.

## Known gaps

- `models/article.ts` is missing the `Article` export that `utils/matcher.ts` and `NewsListItem`
  import — pre-existing, still broken.
- `@react-native-async-storage/async-storage` is in devDependencies but is a runtime dependency.
- Notification opens are inferred (app opened via tap), not true delivery receipts.
- Background task cadence is throttled by the OS; reliable win-back needs server-side push.
- Tuning values in `constants/` are informed guesses, not validated against real cohorts.
