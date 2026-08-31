import type {Translation} from "./en";

export const es: Translation = {
    common: {
        appName: "Expo Boilerplate por @BinniCordova",
        loading: "Cargando...",
        error: "No se pudieron cargar los elementos,\ninténtalo de nuevo",
        empty: "No se encontraron elementos",
        tryAgain: "Reintentar",
        back: "Atrás",
        next: "Siguiente",
        invalidUrl: "URL no válida",
    },
    onboarding: {
        title: "Expo Boilerplate",
        subtitle: "por @BinniCordova",
        message: "Elige tus categorías favoritas",
        conditions:
            "Al usar esta aplicación aceptas nuestros términos y condiciones.\n",
        action: "Empecemos",
    },
    language: {
        title: "Idioma",
        hint: "La aplicación sigue el idioma de tu dispositivo siempre que incluya uno que puedas leer.",
        system: "Sistema",
    },
    domain: {
        react: "React",
        "react-native": "React Native",
        typescript: "TypeScript",
        architecture: "Arquitectura de sistemas",
        node: "Node.js",
    },
    difficulty: {
        "0": "Fundamentos",
        "1": "Profesional",
        "2": "Experto",
    },
    badge: {
        label: "$t(domain.{{domain}}) $t(badge.tier.{{tier}})",
        tier: {
            bronze: "bronce",
            silver: "plata",
            gold: "oro",
        },
    },
    practice: {
        title: "Práctica",
        preparing: "Preparando tu sesión...",
        checkAnswer: "Comprobar respuesta",
        nextQuestion: "Siguiente pregunta",
        noQuestion: "No hay ninguna pregunta disponible.",
        reloadQuestion: "Recargar pregunta",
        sessionFailed: "No se pudo cargar la sesión",
        questionFailed: "No se pudo cargar la pregunta",
    },
    checkpoint: {
        title: "Punto de control",
        answered: "{{answered}} respondidas",
        accuracy: "Acierto",
        correct: "Correctas",
        xp: "XP",
        keepGoing: "Seguir · {{remaining}} más",
        pause: "Guardar y hacer una pausa",
        encouragement: {
            high: "Racha excepcional. ¿Listo para material más difícil?",
            medium: "Buen ritmo. Unas cuantas más y se abre el siguiente nivel.",
            low: "Los fallos quedan en la cola de repaso. Sigue mientras lo tienes fresco.",
        },
    },
    progress: {
        level: "Nivel {{level}} · {{xp}} XP",
        streak: "{{days}} d",
        dailyGoal: "Meta diaria",
        dailyGoalComplete: "Completada",
        dailyGoalProgress: "{{correct}} / {{target}}",
    },
    question: {
        hint: {
            "multiple-choice": "Elige la mejor respuesta.",
            "multiple-select": "Selecciona todas las respuestas que apliquen.",
            "code-analysis": "Lee el fragmento y elige la mejor respuesta.",
            "architecture-tradeoff":
                "Sopesa las concesiones y elige un diseño.",
            ordering: "Toca los pasos en orden. Toca otra vez para quitarlos.",
        },
    },
    digest: {
        correct: "Correcto",
        incorrect: "Casi",
        xpAwarded: "+{{xp}} XP",
    },
    readiness: {
        title: "Examen de certificación",
        ready: "{{percentage}}% listo",
        start: "Empezar el examen de certificación",
        locked: "Sigue practicando para desbloquearlo",
        cooldown: "Próximo intento disponible en {{remaining}}.",
        progress: "{{current}} / {{target}}",
        requirement: {
            answered: "Preguntas de práctica respondidas",
            expert: "Preguntas de nivel experto intentadas",
            domains: "Dominios por encima del {{percentage}}% de maestría",
            streak: "Días consecutivos de práctica",
        },
    },
    cooldown: {
        days: "{{days}} d",
        hours: "{{hours}} h {{minutes}} min",
        minutes: "{{minutes}} min",
    },
    exam: {
        title: "Certificación",
        heading: "Examen de certificación",
        blurb: "{{questions}} preguntas · {{minutes}} minutos · {{passMark}}% para aprobar. Las explicaciones no aparecen hasta que envíes.",
        preparing: "Preparando el examen...",
        position: "Pregunta {{current}} de {{total}}",
        answered: "{{answered}} de {{total}} respondidas",
        submit: "Enviar examen",
        resultTitle: "Resultado del examen",
        passed: "Certificado",
        failed: "Esta vez no",
        score: "{{score}} / {{total}} · {{percentage}}%",
        domainScore: "{{correct}}/{{answered}}",
        timedOut: "Se acabó el tiempo antes de que enviaras el examen.",
        viewCertificate: "Ver certificado",
        backToPractice: "Volver a la práctica",
        startFailed: "No se pudo iniciar el examen",
        failure: {
            overall:
                "La puntuación global del {{percentage}}% está por debajo del {{passMark}}% necesario para aprobar",
            expert: "La sección de experto con {{percentage}}% está por debajo del {{passMark}}% exigido",
            domain: "$t(domain.{{domain}}) obtuvo {{percentage}}%, por debajo del mínimo del {{passMark}}%",
        },
    },
    challenge: {
        title: "Prueba de habilidad",
        blurb: "Retos a contrarreloj. Responde rápido y mantén tu acierto por encima del mínimo.",
        summary:
            "{{questions}} preguntas · {{seconds}} s · se aprueba con {{passingStreak}}",
        start: "Empezar",
        submit: "Enviar",
        loading: "Cargando el reto...",
        passed: "Reto superado",
        failed: "Se acabó el tiempo",
        score: "{{correct}} correctas de {{total}}",
        reset: "Volver a los retos",
        remaining: "{{seconds}} s",
        answered: "{{answered}} de {{total}} respondidas",
        definition: {
            "rapid-debug-60": "Depuración rápida en 60 s",
            "typescript-sprint-90": "Sprint de TypeScript en 90 s",
            "architecture-drill-120": "Ejercicio de arquitectura en 120 s",
        },
    },
    skills: {
        title: "Árbol de habilidades",
        blurb: "Los nodos se desbloquean cuando los dominios de los que dependen alcanzan su umbral de maestría.",
        mastered: "Dominado",
        requirement: "Requiere un {{percentage}}% de maestría",
        node: {
            "react-fundamentals": "Fundamentos de React",
            "react-hooks": "Hooks y efectos",
            "typescript-generics": "Genéricos de TypeScript",
            "state-machines": "Máquinas de estado",
            "rendering-performance": "Rendimiento del renderizado",
            "native-modules": "Módulos nativos",
            "streaming-ssr": "SSR en streaming",
        },
    },
    certificate: {
        title: "Certificación",
        id: "ID: {{id}}",
        idMissing: "No indicado",
        missing: "No hay ninguna certificación emitida para este ID.",
        missingHint:
            "La credencial se obtiene aprobando el examen de certificación con un {{passMark}}% o más.",
        valid: "CERTIFICADO",
        expired: "CADUCADO",
        score: "{{score}} / {{total}} · {{percentage}}%",
        expert: "Sección de experto: {{percentage}}%",
        issued: "Emitido el {{date}}",
        validUntil: "Válido hasta el {{date}}",
        backToPractice: "Volver a la práctica",
        practiceNow: "Practicar ahora",
    },
    notificationOptIn: {
        title: "Recibe avisos cuando de verdad importan",
        titleWithStreak: "Protege tu racha de {{days}} días",
        body: "Los recordatorios llegan {{times}} veces al día en los momentos que importan: repasos pendientes, racha en riesgo, examen desbloqueado. Nunca de madrugada.",
        enable: "Activar recordatorios",
        dismiss: "Ahora no",
    },
    notificationPermission: {
        title: "Permiso de notificaciones",
        message:
            "Activa las notificaciones push en los ajustes de tu dispositivo.",
        confirm: "Aceptar",
    },
    notifications: {
        streakSave: {
            title_one: "Tu racha de {{count}} día está en juego",
            title_other: "Tu racha de {{count}} días está en juego",
            body: "Una respuesta correcta la mantiene viva. Estás en el nivel {{level}}.",
        },
        examRetry: {
            title: "Ya puedes volver a intentarlo",
            body: "La espera terminó. Vuelve a hacer el examen de certificación.",
        },
        examUnlocked: {
            title: "Examen de certificación desbloqueado",
            body: "Cumpliste todos los requisitos. Con más de {{answered}} preguntas practicadas, estás listo.",
        },
        certificationExpiring: {
            title_one: "Tu certificación caduca en {{count}} día",
            title_other: "Tu certificación caduca en {{count}} días",
            body: "Vuelve a certificarte para mantener tu credencial vigente.",
        },
        reviewsDue: {
            title_one: "{{count}} pregunta pendiente de repaso",
            title_other: "{{count}} preguntas pendientes de repaso",
            body: "Son las que fallaste. Ahora es cuando se fijan.",
        },
        dailyGoal: {
            title_one: "Te falta {{count}} para tu meta diaria",
            title_other: "Te faltan {{count}} para tu meta diaria",
            body: "Ya casi está. Termina la serie.",
        },
        skillUnlock: {
            title: "$t(skills.node.{{node}}) está a punto de desbloquearse",
            body: "Te falta un {{percentage}}% para dominarlo.",
        },
        winBack: {
            title_one: "{{count}} día desde tu última sesión",
            title_other: "{{count}} días desde tu última sesión",
            titleLapsed: "Tu progreso sigue aquí",
            body: "Con cinco preguntas basta para retomar el hábito.",
            bodyWeakest:
                "Retoma donde lo dejaste: $t(domain.{{domain}}) es tu dominio más flojo.",
        },
        fallback: {
            newcomer: {
                quickStart: {
                    title: "Dos preguntas, dos minutos",
                    body: "La forma más rápida de descubrir lo que ya sabes.",
                },
                habit: {
                    title: "Crea el hábito desde el principio",
                    body: "Una serie corta a diario supera a una sesión larga a la semana.",
                },
                resume: {
                    title: "Retoma donde lo dejaste",
                    body: "Cada respuesta te enseña el porqué, no solo el qué.",
                },
            },
            learner: {
                mastery: {
                    title: "Mantén tu maestría subiendo",
                    body: "Una serie corta ahora mueve tu dominio más flojo.",
                },
                weakest: {
                    title: "Sube de nivel tu dominio más flojo",
                    body: "El motor adaptativo se ajusta a donde estás.",
                },
                harder: {
                    title: "¿Listo para algo más difícil?",
                    body: "Resuelve unas cuantas preguntas de nivel profesional para desbloquear experto.",
                },
            },
            candidate: {
                withinReach: {
                    title: "El examen está al alcance",
                    body: "Una serie enfocada hoy te acerca a cumplir los requisitos.",
                },
                sharpen: {
                    title: "Afina antes de certificarte",
                    body: "Las preguntas de experto son las que más pesan en el examen.",
                },
                rehearsal: {
                    title: "Ensayo general",
                    body: "Prueba un reto a contrarreloj para practicar bajo presión.",
                },
            },
            certified: {
                edge: {
                    title: "Mantén tu ventaja",
                    body: "Quien se certifica pierde terreno más rápido cuando lo deja.",
                },
                interviewReady: {
                    title: "Sigue listo para entrevistas",
                    body: "Unas cuantas preguntas de experto mantienen fresco lo difícil.",
                },
                defend: {
                    title: "Defiende tu credencial",
                    body: "Recertificarse es más fácil cuando nunca paraste.",
                },
            },
        },
    },
};
