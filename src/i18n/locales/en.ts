export const en = {
    common: {
        appName: "Expo Boilerplate by @BinniCordova",
        loading: "Loading...",
        error: "Unable to fetch items,\nplease try again",
        empty: "No items found",
        tryAgain: "Try again",
        back: "Back",
        next: "Next",
        invalidUrl: "Invalid URL",
    },
    onboarding: {
        title: "Expo Boilerplate",
        subtitle: "by @BinniCordova",
        message: "Select your favorite categories",
        conditions:
            "By using this app, you agree to our terms and conditions.\n",
        action: "Let's get started",
    },
    language: {
        title: "Language",
        hint: "The app follows your device language whenever it ships one you can read.",
        system: "System",
    },
    domain: {
        react: "React",
        "react-native": "React Native",
        typescript: "TypeScript",
        architecture: "System Architecture",
        node: "Node.js",
    },
    difficulty: {
        "0": "Foundation",
        "1": "Professional",
        "2": "Expert",
    },
    badge: {
        label: "$t(domain.{{domain}}) $t(badge.tier.{{tier}})",
        tier: {
            bronze: "Bronze",
            silver: "Silver",
            gold: "Gold",
        },
    },
    practice: {
        title: "Practice",
        preparing: "Preparing your session...",
        checkAnswer: "Check answer",
        nextQuestion: "Next question",
        noQuestion: "No question available.",
        reloadQuestion: "Reload question",
        sessionFailed: "Could not load the session",
        questionFailed: "Could not load question",
    },
    checkpoint: {
        title: "Checkpoint",
        answered: "{{answered}} answered",
        accuracy: "Accuracy",
        correct: "Correct",
        xp: "XP",
        keepGoing: "Keep going · {{remaining}} more",
        pause: "Save progress and pause",
        encouragement: {
            high: "Exceptional run. Ready to push into harder material?",
            medium: "Solid pace. A few more and the next tier opens up.",
            low: "The misses are queued for review. Keep going while it is fresh.",
        },
    },
    progress: {
        level: "Level {{level}} · {{xp}} XP",
        streak: "{{days}}d",
        dailyGoal: "Daily goal",
        dailyGoalComplete: "Complete",
        dailyGoalProgress: "{{correct}} / {{target}}",
    },
    question: {
        hint: {
            "multiple-choice": "Choose the best answer.",
            "multiple-select": "Select every answer that applies.",
            "code-analysis": "Read the snippet, then choose the best answer.",
            "architecture-tradeoff":
                "Weigh the trade-offs, then choose one design.",
            ordering: "Tap the steps in order. Tap again to remove.",
        },
    },
    digest: {
        correct: "Correct",
        incorrect: "Not quite",
        xpAwarded: "+{{xp}} XP",
    },
    readiness: {
        title: "Certification exam",
        ready: "{{percentage}}% ready",
        start: "Start certification exam",
        locked: "Keep practising to unlock",
        cooldown: "Next attempt available in {{remaining}}.",
        progress: "{{current}} / {{target}}",
        requirement: {
            answered: "Practice questions answered",
            expert: "Expert-level questions attempted",
            domains: "Domains above {{percentage}}% mastery",
            streak: "Consecutive practice days",
        },
    },
    cooldown: {
        days: "{{days}}d",
        hours: "{{hours}}h {{minutes}}m",
        minutes: "{{minutes}}m",
    },
    exam: {
        title: "Certification",
        heading: "Certification exam",
        blurb: "{{questions}} questions · {{minutes}} minutes · {{passMark}}% to pass. Explanations stay hidden until you submit.",
        preparing: "Preparing the exam...",
        position: "Question {{current}} of {{total}}",
        answered: "{{answered}} of {{total}} answered",
        submit: "Submit exam",
        resultTitle: "Exam result",
        passed: "Certified",
        failed: "Not this time",
        score: "{{score}} / {{total}} · {{percentage}}%",
        domainScore: "{{correct}}/{{answered}}",
        timedOut: "The time limit was reached before you submitted.",
        viewCertificate: "View certificate",
        backToPractice: "Back to practice",
        startFailed: "Could not start the exam",
        failure: {
            overall:
                "Overall score {{percentage}}% is below the {{passMark}}% pass mark",
            expert: "Expert section {{percentage}}% is below the required {{passMark}}%",
            domain: "$t(domain.{{domain}}) scored {{percentage}}%, below the {{passMark}}% floor",
        },
    },
    challenge: {
        title: "Proof of Skill",
        blurb: "Limited-time sprints. Answer fast and keep your accuracy above the pass mark.",
        summary:
            "{{questions}} questions · {{seconds}}s · pass at {{passingStreak}}",
        start: "Start",
        submit: "Submit",
        loading: "Loading challenge...",
        passed: "Challenge passed",
        failed: "Time is up",
        score: "{{correct}} correct of {{total}}",
        reset: "Back to challenges",
        remaining: "{{seconds}}s",
        answered: "{{answered}} of {{total}} answered",
        definition: {
            "rapid-debug-60": "60s Rapid Debugging",
            "typescript-sprint-90": "90s TypeScript Sprint",
            "architecture-drill-120": "120s Architecture Drill",
        },
    },
    skills: {
        title: "Skill Tree",
        blurb: "Nodes unlock as the domains they depend on reach their mastery threshold.",
        mastered: "Mastered",
        requirement: "Requires {{percentage}}% mastery",
        node: {
            "react-fundamentals": "React Fundamentals",
            "react-hooks": "Hooks & Effects",
            "typescript-generics": "TypeScript Generics",
            "state-machines": "State Machines",
            "rendering-performance": "Rendering Performance",
            "native-modules": "Native Modules",
            "streaming-ssr": "Streaming SSR",
        },
    },
    certificate: {
        title: "Certification",
        id: "ID: {{id}}",
        idMissing: "Not provided",
        missing: "No certification issued for this ID.",
        missingHint:
            "The credential is earned by passing the certification exam at {{passMark}}% or above.",
        valid: "CERTIFIED",
        expired: "EXPIRED",
        score: "{{score}} / {{total}} · {{percentage}}%",
        expert: "Expert section: {{percentage}}%",
        issued: "Issued {{date}}",
        validUntil: "Valid until {{date}}",
        backToPractice: "Back to practice",
        practiceNow: "Practice now",
    },
    notificationOptIn: {
        title: "Get reminded when it matters",
        titleWithStreak: "Protect your {{days}}-day streak",
        body: "Reminders land {{times}} times a day at the moments that matter — reviews due, streak at risk, exam unlocked. Never overnight.",
        enable: "Turn on reminders",
        dismiss: "Not now",
    },
    notificationPermission: {
        title: "Push Notification Permission",
        message: "Please enable push notifications in your device settings.",
        confirm: "OK",
    },
    notifications: {
        streakSave: {
            title_one: "{{count}}-day streak on the line",
            title_other: "{{count}}-day streak on the line",
            body: "One correct answer keeps it alive. You are level {{level}}.",
        },
        examRetry: {
            title: "Your retake is unlocked",
            body: "The cooldown is over. Take the certification exam again.",
        },
        examUnlocked: {
            title: "Certification exam unlocked",
            body: "You cleared every requirement. {{answered}}+ questions of practice say you are ready.",
        },
        certificationExpiring: {
            title_one: "Certification expires in {{count}} day",
            title_other: "Certification expires in {{count}} days",
            body: "Re-certify to keep your credential valid.",
        },
        reviewsDue: {
            title_one: "{{count}} question due for review",
            title_other: "{{count}} questions due for review",
            body: "These are the ones you missed. Now is when they stick.",
        },
        dailyGoal: {
            title_one: "{{count}} from your daily goal",
            title_other: "{{count}} from your daily goal",
            body: "You are almost there. Finish the set.",
        },
        skillUnlock: {
            title: "$t(skills.node.{{node}}) is nearly unlocked",
            body: "You are {{percentage}}% away from mastering it.",
        },
        winBack: {
            title_one: "{{count}} day since your last session",
            title_other: "{{count}} days since your last session",
            titleLapsed: "Your progress is still here",
            body: "Five questions is all it takes to restart the habit.",
            bodyWeakest:
                "Pick up where you left off — $t(domain.{{domain}}) is your weakest domain.",
        },
        fallback: {
            newcomer: {
                quickStart: {
                    title: "Two questions, two minutes",
                    body: "The fastest way to find out what you already know.",
                },
                habit: {
                    title: "Build the habit early",
                    body: "A short daily set beats one long session a week.",
                },
                resume: {
                    title: "Pick up where you left off",
                    body: "Every answer teaches you why, not just what.",
                },
            },
            learner: {
                mastery: {
                    title: "Keep your mastery climbing",
                    body: "A short set now keeps your weakest domain moving.",
                },
                weakest: {
                    title: "Level up your weakest domain",
                    body: "The adaptive engine will meet you where you are.",
                },
                harder: {
                    title: "Ready for something harder?",
                    body: "Clear a few Professional questions to unlock Expert.",
                },
            },
            candidate: {
                withinReach: {
                    title: "The exam is within reach",
                    body: "A focused set today moves you closer to eligibility.",
                },
                sharpen: {
                    title: "Sharpen before you certify",
                    body: "Expert questions are what the exam weighs the most.",
                },
                rehearsal: {
                    title: "Dress rehearsal",
                    body: "Try a timed challenge to practise under pressure.",
                },
            },
            certified: {
                edge: {
                    title: "Keep your edge",
                    body: "Certified developers lose ground fastest when they stop.",
                },
                interviewReady: {
                    title: "Stay interview ready",
                    body: "A few Expert questions keep the hard material fresh.",
                },
                defend: {
                    title: "Defend your credential",
                    body: "Re-certification is easier when you never stopped.",
                },
            },
        },
    },
};

export type Translation = typeof en;
