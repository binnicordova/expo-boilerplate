import type {AssessmentQuestion} from "@/models/assessment";

export const AUTHORED_ASSESSMENTS: AssessmentQuestion[] = [
    {
        id: "rn-stale-closure-interval",
        topicId: "rn-stale-closure-interval",
        domain: "react-native",
        difficulty: 1,
        format: "code-analysis",
        prompt: "The counter freezes at 1. What is the defect?",
        snippet: {
            language: "tsx",
            source: `function Ticker() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1)
    }, 1000)

    return () => clearInterval(id)
  }, [])

  return <Text>{count}</Text>
}`,
        },
        alternatives: [
            {
                id: "rn-stale-closure-interval-a1",
                text: "The interval callback closes over the initial count, so every tick sets the same value.",
                is_correct: true,
            },
            {
                id: "rn-stale-closure-interval-a2",
                text: "setInterval is not supported inside useEffect in React Native.",
                is_correct: false,
            },
            {
                id: "rn-stale-closure-interval-a3",
                text: "The cleanup function runs on every render and cancels the timer.",
                is_correct: false,
            },
            {
                id: "rn-stale-closure-interval-a4",
                text: "State updates are batched, so only the first one is applied.",
                is_correct: false,
            },
        ],
        digest: {
            headline: "Stale closures capture the render they were created in",
            body: "The effect runs once with an empty dependency array, so the callback permanently captures count as 0 and writes 1 forever. Use the updater form setCount(previous => previous + 1) to read the latest value without re-subscribing, or add count to the dependencies and accept the timer being recreated each tick.",
            reference: "React — Removing Effect Dependencies",
        },
    },
    {
        id: "rn-list-inline-render-item",
        topicId: "rn-list-inline-render-item",
        domain: "react-native",
        difficulty: 2,
        format: "code-analysis",
        prompt: "This list drops frames while scrolling. Which change removes the bottleneck?",
        snippet: {
            language: "tsx",
            source: `function Feed({posts, onOpen}) {
  return (
    <FlatList
      data={posts}
      extraData={posts}
      renderItem={({item}) => (
        <Row post={item} onPress={() => onOpen(item.id)} />
      )}
    />
  )
}`,
        },
        alternatives: [
            {
                id: "rn-list-inline-render-item-a1",
                text: "Hoist renderItem and the press handler with useCallback, memoize Row, and supply a stable keyExtractor.",
                is_correct: true,
            },
            {
                id: "rn-list-inline-render-item-a2",
                text: "Replace FlatList with ScrollView so every row mounts once.",
                is_correct: false,
            },
            {
                id: "rn-list-inline-render-item-a3",
                text: "Wrap the whole list in useMemo keyed on posts.length.",
                is_correct: false,
            },
            {
                id: "rn-list-inline-render-item-a4",
                text: "Move posts into component state and mutate it in place.",
                is_correct: false,
            },
        ],
        digest: {
            headline: "Inline props defeat list virtualization",
            body: "A new renderItem identity plus a new onPress closure per render forces every visible row to reconcile, and extraData={posts} invalidates the cache on each pass. Stable function identities, React.memo on the row, and a keyExtractor let the virtualized list skip untouched cells.",
            reference: "React Native — Optimizing FlatList Configuration",
        },
    },
    {
        id: "ts-generic-constraint",
        topicId: "ts-generic-constraint",
        domain: "typescript",
        difficulty: 1,
        format: "code-analysis",
        prompt: "pluck loses its return type and resolves to any. What fixes the signature?",
        snippet: {
            language: "ts",
            source: `function pluck(items: any[], key: string) {
  return items.map((item) => item[key])
}

const names = pluck(users, "name")`,
        },
        alternatives: [
            {
                id: "ts-generic-constraint-a1",
                text: "Constrain the key to the element type: <T, K extends keyof T>(items: T[], key: K): T[K][].",
                is_correct: true,
            },
            {
                id: "ts-generic-constraint-a2",
                text: "Annotate the result as string[] at the call site.",
                is_correct: false,
            },
            {
                id: "ts-generic-constraint-a3",
                text: "Replace any[] with unknown[] and cast inside the map.",
                is_correct: false,
            },
            {
                id: "ts-generic-constraint-a4",
                text: "Enable strict mode, which infers the element type automatically.",
                is_correct: false,
            },
        ],
        digest: {
            headline:
                "keyof constraints preserve the link between input and output",
            body: "Typing the parameter as any[] erases the element type, so indexing yields any. A generic pair where K extends keyof T ties the key to the element and lets the compiler infer T[K][] as the return type — the call site then knows names is string[] without a cast.",
            reference: "TypeScript Handbook — Generic Constraints",
        },
    },
    {
        id: "node-async-foreach",
        topicId: "node-async-foreach",
        domain: "node",
        difficulty: 1,
        format: "code-analysis",
        prompt: "processAll resolves before any record is written and swallows failures. Why?",
        snippet: {
            language: "js",
            source: `async function processAll(records) {
  records.forEach(async (record) => {
    await save(record)
  })

  return "done"
}`,
        },
        alternatives: [
            {
                id: "node-async-foreach-a1",
                text: "forEach ignores the returned promises, so nothing is awaited and rejections become unhandled.",
                is_correct: true,
            },
            {
                id: "node-async-foreach-a2",
                text: "save must be wrapped in a try/catch for await to take effect.",
                is_correct: false,
            },
            {
                id: "node-async-foreach-a3",
                text: "The outer function needs to be marked async twice for nested awaits.",
                is_correct: false,
            },
            {
                id: "node-async-foreach-a4",
                text: "Array methods cannot be used with promises in Node.js.",
                is_correct: false,
            },
        ],
        digest: {
            headline: "forEach is not promise-aware",
            body: "Each async callback returns a promise that forEach discards, so processAll returns immediately and any rejection surfaces as an unhandled rejection. Use a for...of loop with await for sequential work, or await Promise.all(records.map(save)) when the writes can run concurrently.",
            reference: "MDN — Array.prototype.forEach",
        },
    },
    {
        id: "node-event-loop-order",
        topicId: "node-event-loop-order",
        domain: "node",
        difficulty: 2,
        format: "ordering",
        prompt: "Order the phases of a single Node.js event loop iteration.",
        steps: [
            {
                id: "node-event-loop-order-s1",
                text: "Timers — expired setTimeout and setInterval callbacks",
                position: 0,
            },
            {
                id: "node-event-loop-order-s2",
                text: "Pending callbacks — deferred system operations",
                position: 1,
            },
            {
                id: "node-event-loop-order-s3",
                text: "Poll — retrieve new I/O events and run their callbacks",
                position: 2,
            },
            {
                id: "node-event-loop-order-s4",
                text: "Check — setImmediate callbacks",
                position: 3,
            },
            {
                id: "node-event-loop-order-s5",
                text: "Close callbacks — socket and handle teardown",
                position: 4,
            },
        ],
        digest: {
            headline:
                "setImmediate always runs after poll, setTimeout before it",
            body: "The loop walks timers, pending callbacks, poll, check, then close callbacks. That ordering is why setImmediate fires ahead of a zero-delay setTimeout when both are scheduled from inside an I/O callback. Microtasks such as process.nextTick and promise continuations drain between every phase, not at a fixed point.",
            reference: "Node.js — The Event Loop",
        },
    },
    {
        id: "react-commit-phases",
        topicId: "react-commit-phases",
        domain: "react",
        difficulty: 2,
        format: "ordering",
        prompt: "Order what React does when a state update produces a new tree.",
        steps: [
            {
                id: "react-commit-phases-s1",
                text: "Render — call components and reconcile against the current tree",
                position: 0,
            },
            {
                id: "react-commit-phases-s2",
                text: "Mutation — apply the computed changes to the host tree",
                position: 1,
            },
            {
                id: "react-commit-phases-s3",
                text: "Layout effects — run useLayoutEffect synchronously",
                position: 2,
            },
            {
                id: "react-commit-phases-s4",
                text: "Paint — the host platform draws the updated frame",
                position: 3,
            },
            {
                id: "react-commit-phases-s5",
                text: "Passive effects — run useEffect callbacks",
                position: 4,
            },
        ],
        digest: {
            headline: "useLayoutEffect blocks paint, useEffect does not",
            body: "Rendering is interruptible and side-effect free; the commit phase is synchronous. Layout effects run after mutation but before the frame is drawn, which is why measuring and repositioning there avoids a visible flicker — and why heavy work there delays paint. Passive effects are deferred until after the frame lands.",
            reference: "React — Render and Commit",
        },
    },
    {
        id: "react-rerender-causes",
        topicId: "react-rerender-causes",
        domain: "react",
        difficulty: 1,
        format: "multiple-select",
        prompt: "Select every situation that causes a function component to re-render.",
        alternatives: [
            {
                id: "react-rerender-causes-a1",
                text: "Its own state is set to a value that fails Object.is comparison.",
                is_correct: true,
            },
            {
                id: "react-rerender-causes-a2",
                text: "Its parent re-renders and it is not memoized.",
                is_correct: true,
            },
            {
                id: "react-rerender-causes-a3",
                text: "A context it consumes publishes a new value.",
                is_correct: true,
            },
            {
                id: "react-rerender-causes-a4",
                text: "A ref created with useRef has its current property reassigned.",
                is_correct: false,
            },
            {
                id: "react-rerender-causes-a5",
                text: "A plain module-scope variable it reads is mutated.",
                is_correct: false,
            },
        ],
        digest: {
            headline: "Only state, props, and context drive re-renders",
            body: "React re-renders on a state change that fails Object.is, on a parent re-render, or on a new context value. Mutating a ref or a module-level variable changes data React never subscribed to, so nothing schedules an update — that is exactly why refs are the right place for values the UI should not react to.",
            reference: "React — State as a Snapshot",
        },
    },
    {
        id: "ts-strict-flags",
        topicId: "ts-strict-flags",
        domain: "typescript",
        difficulty: 2,
        format: "multiple-select",
        prompt: "Which compiler options catch bugs that plain strict: true leaves open?",
        alternatives: [
            {
                id: "ts-strict-flags-a1",
                text: "noUncheckedIndexedAccess — indexing an array yields T | undefined.",
                is_correct: true,
            },
            {
                id: "ts-strict-flags-a2",
                text: "exactOptionalPropertyTypes — distinguishes a missing key from an explicit undefined.",
                is_correct: true,
            },
            {
                id: "ts-strict-flags-a3",
                text: "noImplicitOverride — requires override on members that replace a base member.",
                is_correct: true,
            },
            {
                id: "ts-strict-flags-a4",
                text: "skipLibCheck — validates the types shipped by every dependency.",
                is_correct: false,
            },
            {
                id: "ts-strict-flags-a5",
                text: "removeComments — strips comments so dead code cannot mislead the checker.",
                is_correct: false,
            },
        ],
        digest: {
            headline: "strict is a preset, not the ceiling",
            body: "strict enables a fixed family of checks, but several high-value flags sit outside it. noUncheckedIndexedAccess is the highest impact of the three — it surfaces the out-of-bounds reads that strict happily types as T. skipLibCheck does the opposite of what its name suggests here: it skips declaration checking to speed up builds.",
            reference: "TypeScript — tsconfig Reference",
        },
    },
    {
        id: "arch-offline-sync",
        topicId: "arch-offline-sync",
        domain: "architecture",
        difficulty: 2,
        format: "architecture-tradeoff",
        prompt: "Which synchronization design best fits the constraints?",
        scenario:
            "A field-inspection app runs for hours without connectivity. Inspectors edit the same records from several devices, and the server must end up with a defensible audit trail of every change.",
        alternatives: [
            {
                id: "arch-offline-sync-a1",
                text: "Append operations to a local outbox with logical timestamps, replay them on reconnect, and resolve conflicts server-side against a versioned record.",
                is_correct: true,
            },
            {
                id: "arch-offline-sync-a2",
                text: "Cache the last server response and overwrite the record with whichever device syncs last.",
                is_correct: false,
            },
            {
                id: "arch-offline-sync-a3",
                text: "Block editing until the device regains connectivity and write straight through to the API.",
                is_correct: false,
            },
            {
                id: "arch-offline-sync-a4",
                text: "Keep edits in memory and prompt the inspector to re-enter anything lost when the app restarts.",
                is_correct: false,
            },
        ],
        digest: {
            headline: "Sync the intent, not the final state",
            body: "An operation log preserves what each inspector actually did, which is what an audit trail requires and what last-write-wins destroys. Logical timestamps order concurrent edits without trusting device clocks, and server-side resolution against a record version keeps the merge rules in one auditable place. Blocking edits offline fails the core requirement outright.",
            reference: "Designing Data-Intensive Applications — Ch. 5",
        },
    },
    {
        id: "arch-token-storage",
        topicId: "arch-token-storage",
        domain: "architecture",
        difficulty: 1,
        format: "architecture-tradeoff",
        prompt: "Where should the mobile client keep its session credentials?",
        scenario:
            "A banking client holds a short-lived access token and a long-lived refresh token. The security review requires that a stolen device backup must not yield a usable session.",
        alternatives: [
            {
                id: "arch-token-storage-a1",
                text: "Keep the refresh token in the platform keychain flagged as non-exportable, hold the access token in memory only.",
                is_correct: true,
            },
            {
                id: "arch-token-storage-a2",
                text: "Persist both tokens in AsyncStorage encrypted with a key bundled in the app.",
                is_correct: false,
            },
            {
                id: "arch-token-storage-a3",
                text: "Store both tokens in Redux and rehydrate them from disk on launch.",
                is_correct: false,
            },
            {
                id: "arch-token-storage-a4",
                text: "Write both tokens to a file in the app sandbox with restrictive permissions.",
                is_correct: false,
            },
        ],
        digest: {
            headline:
                "Hardware-backed storage is the only thing a backup cannot carry",
            body: "The keychain and keystore can mark an item as excluded from backups and bound to the device, which is precisely the stated requirement. A key shipped inside the binary is recoverable by anyone who unpacks the app, so that encryption is decorative. Keeping the short-lived access token in memory limits the blast radius to a single session.",
            reference: "OWASP MASVS — Data Storage",
        },
    },
    {
        id: "rn-bridge-batching",
        topicId: "rn-bridge-batching",
        domain: "react-native",
        difficulty: 2,
        format: "multiple-choice",
        prompt: "A gesture handler drives an animation that stutters on low-end Android. Which approach keeps it at 60fps?",
        alternatives: [
            {
                id: "rn-bridge-batching-a1",
                text: "Drive the animation on the UI thread with a native driver or worklet so no per-frame round trip to JavaScript is needed.",
                is_correct: true,
            },
            {
                id: "rn-bridge-batching-a2",
                text: "Throttle the gesture handler to 30fps and interpolate the intermediate frames in JavaScript.",
                is_correct: false,
            },
            {
                id: "rn-bridge-batching-a3",
                text: "Move the animated component into its own screen so fewer siblings re-render.",
                is_correct: false,
            },
            {
                id: "rn-bridge-batching-a4",
                text: "Increase the JavaScript thread priority through a native module.",
                is_correct: false,
            },
        ],
        digest: {
            headline: "Per-frame work belongs off the JavaScript thread",
            body: "Any animation that asks JavaScript for a value every frame competes with rendering, and on a slow device it loses. Declaring the animation to the native side once — via useNativeDriver or a Reanimated worklet — lets the UI thread evaluate it without a round trip, so the animation stays smooth even while JavaScript is busy.",
            reference: "React Native — Animations",
        },
    },
    {
        id: "ts-discriminated-union",
        topicId: "ts-discriminated-union",
        domain: "typescript",
        difficulty: 0,
        format: "multiple-choice",
        prompt: "What makes a union discriminated?",
        alternatives: [
            {
                id: "ts-discriminated-union-a1",
                text: "Every member shares a common property whose type is a distinct literal.",
                is_correct: true,
            },
            {
                id: "ts-discriminated-union-a2",
                text: "Every member is declared with an interface rather than a type alias.",
                is_correct: false,
            },
            {
                id: "ts-discriminated-union-a3",
                text: "The union is annotated with the satisfies operator.",
                is_correct: false,
            },
            {
                id: "ts-discriminated-union-a4",
                text: "Every member has exactly the same set of property names.",
                is_correct: false,
            },
        ],
        digest: {
            headline: "A literal tag is what lets the compiler narrow",
            body: "When each member carries a distinct literal on a shared property, checking that property in a conditional narrows the union to a single member and the compiler can prove a switch is exhaustive. Without the tag it can only fall back to structural checks, which is why an in operator or a custom type guard is needed instead.",
            reference: "TypeScript Handbook — Discriminated Unions",
        },
    },
];
