# expofs — developer certification platform

Anonymous, offline-first mobile app where developers practise, build mastery, and earn a
time-boxed certification. Expo SDK 57 · React Native 0.86 · Expo Router · Jotai · TypeScript.
The entire UI renders through **Expo UI** (`@expo/ui`) — SwiftUI on iOS, Jetpack Compose on
Android, React Native on web.

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
- `src/i18n/` the translation catalogues and the typed translator. Cross-cutting like
  `theme/`, so every layer may import it.

**Rules.** Every screen wraps in `<Screen>` (owns the single `<Host>` bridge and content
padding). `<Screen>` takes two props that exist purely to keep the practice loop cheap:
`footer` pins the primary action outside the scroll view so it is always one thumb-tap away,
and `resetKey` (the current question id) remounts the scroll view so each question starts at
the top instead of stranding the reader mid-card. Its wrapper `Column` is always rendered, even
with no footer — changing the tree shape between the two remounts the scroll view and throws
away scroll position. The SwiftUI host neither honours React Native padding nor receives real safe-area
insets, so the **app shell in `_layout.tsx` is a `SafeAreaView`** — that is what keeps scrolled
content from sliding under the status bar. Do not reintroduce insets inside `Screen`. Persisted atoms are async — read derived
values through `unwrap`, never `await` in a component. Pure logic takes an injected `now: Date`
so it is testable. No inline comments.

## Component layers (atomic design)

`src/components/` is ordered by composition level, and a layer may only import from layers
below it.

- `atoms/` — `Text`, `Button`, `Icon`, `IconButton`, `ProgressBar`, `Pill`, `Surface`.
- `molecules/` — `Card`, `AppBar`, `AnswerOption`, `CodeBlock`, `ChallengeTimer`.
- `organisms/` — `QuestionCard`, `ProgressHeader`, `CheckpointCard`, `ReadinessCard`,
  `MicroLearningCard`, `NotificationOptIn`, `SkillTree`, `NewsListItem`, `LanguagePicker`.
- `templates/` — `Screen`.

**`Surface` is the only place chrome is drawn.** Padding, fill, radius, background, border,
elevation and opacity go through its `SurfaceSpec`; `theme/surface.{ios,android,ts}` compiles
that spec into the right native modifiers per platform. Never hand-roll container styling — the
ordering rules below are why.

Three sizing flags, because each platform expresses them differently:

| flag | iOS | Android | web |
| --- | --- | --- | --- |
| `fill` (span the cross axis) | `frame({maxWidth})` | `fillMaxWidth()` | `width: "100%"` |
| `grow` (take the leftover main axis) | native stacks already expand | `weight(1)` | `flex: 1 1 0` |
| `fillHeight` (fill the host) | native stacks already expand | `fillMaxSize()` | `flex: 1 1 0` |

A flex child needs a bounded parent on web: the `Screen` wrapper takes `fillHeight` so the
scroll view's `grow` has something to divide, otherwise it collapses to zero height.

## Expo UI

All presentation comes from the universal `@expo/ui` root import — never `react-native`
primitives. `Host` bridges into the native toolkit, so exactly one lives per screen, inside
`<Screen>`; nesting more is wasteful.

- **Layout** is `Column` / `Row` / `Spacer`, not flexbox. Gaps come from `spacing`, cross-axis
  from `alignment`, and `<Spacer flexible />` pushes siblings apart in place of
  `justifyContent`. `width: "100%"` is the idiom for a full-bleed child.
- **`style` is `UniversalStyle`** — only padding, background, border, radius, opacity, width and
  height. Everything else must go through the platform `modifiers` escape hatch.
- **`Text` takes a single string child.** Interpolation must be a template literal. Font and
  colour live in `textStyle`, not `style`.
- **Numbers only for sizes.** iOS maps `width`/`height` onto a SwiftUI `frame`, so
  `width: "100%"` is silently dropped and children shrink to their content. Use `Surface`'s
  `fill` instead — it emits `frame({maxWidth})` on iOS and `fillMaxWidth()` on Compose.
  `ProgressBar` splits per platform (SwiftUI `ProgressView`, Compose `LinearProgressIndicator`,
  RN fallback) rather than faking a bar with widths.
- **Modifier order is the layout.** SwiftUI applies modifiers inside-out, and `transformToModifiers`
  emits style-derived ones in a fixed order with user `modifiers` appended *last* — so a `frame`
  passed as an escape hatch lands outside the background and the fill reads as transparent space.
  When order matters, pass the whole chain through `modifiers` and omit `style`, keeping
  padding → frame → background → border → clip.
- **`border()` is a rectangle.** Combined with `clipShape` it loses its corners and renders as
  four disjoint strokes. Use `strokeBorder({shape, cornerRadius})`, which follows the shape.
- **A huge `borderRadius` is not a capsule** — it degenerates into side arcs. Use
  `Surface`'s `radius: "capsule"`.
- **`disabled` dims content on iOS.** For read-only states that must stay legible (a revealed
  answer), render a `Surface` rather than a disabled `Button`.
- **Anything tappable is a `Button`.** `onPress` on a `Text` becomes an `onTapGesture` modifier
  that `fireEvent.press` cannot reach. Withhold the handler entirely when disabled — passing
  `undefined` down is what makes the lock real.
- **Icons** are a fixed registry (`components/Icon/icons.ts`) resolved per platform: SF Symbols
  on iOS, `@expo/material-symbols` XML vectors on Android, Ionicons on web.
- **`RNHostView`** embeds a React Native view (the QR code) inside the native tree.
- `metro.config.js` must keep `unstable_enablePackageExports = true` — `@expo/ui` has no `main`
  field and resolves purely through its `exports` map.
- Expo UI is a native module: **the app needs a development build**, and cannot run in Expo Go.

## Design tokens

`theme/typography.ts` holds the type ramp (`title` 28 / `subtitle` 20 / `default` 17 / `label` 15
/ `caption` 13) and `ICON_SIZE`. The `FONT_SIZE` array is a legacy spacing-style scale with only
16 and 24 in the usable range — do not size text from it, or the screen flattens out.

**Colour comes from `useTheme()`, never from a literal.** The hook resolves the palette against
the system appearance, so light and dark stay in step with the device; `theme(scheme)` remains a
pure getter for the handful of module-scope reads (`useNotification`, stories). Hard-coded hexes
are what broke dark mode before — the verdict greens were literals and stayed dark-on-dark.

Palette roles, drawn from the app icon's magenta → violet → orange gradient over indigo:
`background` (page), `surface` (raised cards), `lightness` (subtle fills), `accent` (every
interactive affordance), `onAccent` (copy on an accent fill), `muted` (secondary copy, inactive
glyphs), `darkness` (headings), `success`/`successSurface`, `error`/`errorSurface`.

Cards are `surface` over `background` with a hairline `lightness` border and a small elevation;
options are `lightness` fills with **no** border until they resolve. Borders inside a bordered
card read as noise — prefer fill contrast.

## Reach and hit targets

Roughly half of sessions are one-handed, so placement follows the thumb arc: the comfortable
band is the bottom third, the top is a stretch.

- `<Screen>` has three regions — `header` pinned top, scrolling body, `footer` pinned bottom.
  `bottomAligned` sinks short content toward the footer so the options land in the comfort band
  instead of floating mid-screen.
- Frequency decides placement, not importance. Options are tapped ~15 times a session and live
  low; the nav icons are tapped once or twice and stay in the top bar where iOS expects them.
- **The surface must be the button's label, never a wrapper around the button.** The native
  view renders `SwiftUI.Button { Children() }` and applies `modifiers` *outside* it, so padding
  and background passed to the button paint a box larger than the tap target — with a `.plain`
  style SwiftUI hit-tests the label alone. Put `surfaceModifiers` on the inner `Row` (the label)
  and give the button only `surfaceStyle`, which is web-only sizing that neutralises the web
  fallback's fixed 40px inline-flex box. `SurfaceSpec.interactive` then adds `contentShape` so
  transparent regions of the label stay tappable. `AnswerOption` has a regression test pinning
  this: the button must carry no `padding`/`background` modifier, and the node holding
  `contentShape` must not be the button.
- Answer rows carry `SPACING[4]` vertical padding, keeping them well past the 44pt minimum.

## Content

- 137 articles + 438 questions imported from `midudev/preguntas-entrevista-react` (Spanish).
- 12 authored multi-format questions (`services/mocks/assessments.ts`) in English.
- Five formats: multiple-choice, multiple-select, code-analysis, architecture-tradeoff, ordering.
- Domains: react, react-native, typescript, architecture, node. Difficulty 0/1/2.
- Legacy questions are adapted lazily; their article becomes the micro-learning digest.

## Practice loop friction budget

The loop is the product, so a question costs **3 taps and no scrolling**: pick, check,
advance — all from the same thumb position.

- `<Screen footer>` pins the action; `resetKey` returns each new question to the top.
- Practice shows a **3-option shortlist** (`PRACTICE_MAX_OPTIONS`) via `utils/options.ts`, so
  the card fits one screen. `narrowAlternatives` always keeps **every** correct alternative —
  dropping one would make a multiple-select question unanswerable — and always keeps at least
  one distractor, so the cap is a target rather than a guarantee. Grading is untouched: it
  still derives correct ids from the full question.
- **The exam is deliberately uncapped.** Three options put the guess rate at 33% against 17%
  for six, and the ≥80% pass mark was tuned against full option sets; capping there would
  weaken the credential. This is the practice/certification split in miniature — pass
  `maxOptions` only on the practice surfaces.
- The digest is a **bottom sheet** on reveal, not a card appended below the options, so the
  explanation and "Next question" arrive without scrolling. Dismissing the sheet leaves the
  graded question with the footer CTA as the fallback path.

## Motion

`SurfaceSpec.animateOn` springs a surface between visual states whenever the value changes —
a snappy, lightly damped spring on iOS (`response 0.32 / damping 0.82`), an animated colour and
content-size spec on Compose, nothing on web. Springs are interruptible, so a fast tapper never
fights the animation. `AnswerOption` passes its state index; `ProgressBar` passes its progress.

SF Symbol effects (`symbolEffect`) need Expo UI's `useNativeState` worklet plumbing rather than
a plain value, so they are not wired up.

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

## Internationalisation

English and Spanish ship today; adding a language is a new file under `i18n/locales/` plus one
entry in `constants/locales.ts`. **`en.ts` is the source of truth** — `es.ts` is typed as
`Translation` (the shape of `en`), so a missing or misspelled key is a compile error, and
`i18n/i18n.test.ts` additionally pins key coverage, interpolation-placeholder parity, and that
no Spanish string was left as its English original.

**Nothing below `app/` renders copy.** The layering rule extends to language: pure utils and
stores emit a `TranslationRef` (`{key, params}`) or a bare `TranslationKey`, and the copy is
resolved at the edge. That is what lets a notification planned this morning be *delivered*
tonight in whatever language the phone is set to, and it keeps `utils/engagement.ts` and
`utils/certification.ts` testable against keys rather than prose. `ExamGrade.failureReasons`,
`ReadinessRequirement.label`, `PlannedNotification.title`/`body` and the `quiz`/`question`/`exam`
error atoms all carry refs, not sentences.

- **`useTranslation()` in components** (re-renders on a language change), **`translate` /
  `translateRef` outside React** (`services/notifications.ts`, `hooks/useNotification.ts`).
  Both take a `TranslationKey` — the union is derived from `en.ts`, so autocompletion works and
  a typo does not compile.
- **Plurals go through `count`.** i18next stores them as `key_one` / `key_other`; the key type
  strips the suffix so callers still pass the base key. Spanish plural rules come from
  `Intl.PluralRules`, which Hermes provides on both platforms.
- **A label that needs another label nests**: `"$t(domain.{{domain}}) scored {{percentage}}%"`.
  Interpolation runs before nesting, so the inner key can itself be dynamic — this is how
  `badge.label`, `exam.failure.domain` and `notifications.skillUnlock.title` stay one string
  for a translator instead of three fragments concatenated in TypeScript.
- **Labels are never persisted.** `Badge` stores `domain` + `tier`, not a rendered string;
  `SkillNode` and `ChallengeDefinition` store a `labelKey`. A badge earned in Spanish reads
  correctly in English.
- **Locale resolution is a pure function** (`utils/locale.ts`). The device list is walked in
  preference order and regional variants collapse onto their base (`es-419` -> `es`); anything
  unshipped falls back to English. i18next boots on the device language synchronously so the
  first frame is already translated, and `useLocaleSync` (a bridge in `_layout.tsx`, next to
  `useEngagementSync`) pushes the persisted override in once AsyncStorage hydrates. The
  preference is `"system" | Locale` — `system` keeps following the phone.
- **Dates take the locale explicitly**: `formatDate(value, locale)`, never a bare
  `toLocaleDateString()`.

## Testing

`npx jest` — 188 tests. Pure utils are exhaustively tested; stores are tested through `createStore()`
with AsyncStorage and `expo-application` mocked. **When product rules change, the tests are the
spec — update them deliberately, they encode the tuning decisions.**

Jest resolves the **iOS** build of `@expo/ui`, so components render as native host views: text
arrives in a `text` prop and buttons in a `label` prop, which `getByText` cannot see. Query them
through `src/test-utils/expoUi.ts` (`getByUIText`, `getByUILabel`, `getByUIProp`) — it matches
host nodes only, so composite wrappers are not counted twice. `fireEvent.press` works on a
`Button` (it maps to `onButtonPress`) but not on a `Text`. Beware that `fireEvent` walks up to
composite parents, so a component that still receives an `onPress` prop looks pressable even when
its native node is disabled — assert on `onButtonPress`/modifiers when testing the disabled path.

Verify with: `npx tsc --noEmit --skipLibCheck`, `npx biome check src/`, `npx jest`.

## Known gaps

- `@react-native-async-storage/async-storage` is in devDependencies but is a runtime dependency.
- Expo UI drops `testID` on iOS icons, so icons are asserted through their `systemName`.
- The web fallback `Button` is `display: inline-flex` with a fixed height, so it ignores a
  full-width child — the width has to go on the button's own `style`. Its label also needs
  `<Spacer flexible />` on both sides to centre, since `Row` has no main-axis justification.
- Expo UI buttons expose no accessible name on web when given children instead of `label`;
  screen-reader labelling is unaddressed.
- The web `BottomSheet` renders in a portal **outside** the `Host`, so the CSS variables the
  web `Button` fallback reads for its fill are out of scope there and the CTA renders
  unpainted. `Button` sets its own accent background to survive the portal.
- Storybook renders Expo UI natively on device and through the RN fallback on web; stories must
  wrap in `<Host matchContents>`.
- Notification opens are inferred (app opened via tap), not true delivery receipts.
- Background task cadence is throttled by the OS; reliable win-back needs server-side push.
- Tuning values in `constants/` are informed guesses, not validated against real cohorts.
- Question and article **content** is not translated — the 137 imported articles and 438
  questions stay Spanish, the 12 authored ones stay English. Only the app chrome is localised.
- `expo-localization` exposes no locale-change listener, so a device language switch is picked
  up on the next cold start rather than live.
- The app's store name and icon label are not localised (`app.config.ts` has one `name`).
