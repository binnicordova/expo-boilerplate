import {atom} from "jotai";
import {atomWithStorage, unwrap} from "jotai/utils";
import {EXAM_DURATION_SECONDS, EXAM_LENGTH} from "@/constants/certification";
import {STORAGE_ID} from "@/constants/storage";
import type {AssessmentQuestion} from "@/models/assessment";
import type {ExamAttempt, ExamStatus} from "@/models/certification";
import {api} from "@/services/api";
import {buildExam} from "@/services/assessment";
import {progressionValueAtom} from "@/stores/progression";
import {responseByQuestionAtom} from "@/stores/question";
import {activeStreakAtom} from "@/stores/retention";
import {ensureUserAtom, issueCertificationAtom, userAtom} from "@/stores/user";
import {getCooldown, getReadiness, gradeExam} from "@/utils/certification";
import {createRandomId} from "@/utils/device";
import {storage} from "@/utils/storage";

export const examAttemptsAtom = atomWithStorage<ExamAttempt[]>(
    STORAGE_ID.examAttempts,
    [],
    storage
);

export const examAttemptsValueAtom = unwrap(
    examAttemptsAtom,
    (previous) => previous ?? []
);

export const examStatusAtom = atom<ExamStatus>("idle");
export const examErrorAtom = atom<string | null>(null);
export const examQuestionIdsAtom = atom<string[]>([]);
export const examIndexAtom = atom(0);
export const examStartedAtAtom = atom<string | null>(null);
export const examDeadlineAtom = atom<number | null>(null);
export const lastAttemptAtom = atom<ExamAttempt | null>(null);

export const readinessAtom = atom((get) =>
    getReadiness(get(progressionValueAtom), get(activeStreakAtom))
);

export const cooldownAtom = atom((get) =>
    getCooldown(get(examAttemptsValueAtom))
);

export const canStartExamAtom = atom(
    (get) => get(readinessAtom).eligible && !get(cooldownAtom).blocked
);

export const startExamAtom = atom(null, async (get, set) => {
    if (!get(canStartExamAtom)) {
        return false;
    }

    set(examStatusAtom, "loading");
    set(examErrorAtom, null);
    set(lastAttemptAtom, null);

    try {
        await set(ensureUserAtom);

        const ids = buildExam();

        for (const id of ids) {
            set(responseByQuestionAtom, (previous) => {
                const {[id]: _removed, ...rest} = previous;
                return rest;
            });
        }

        set(examQuestionIdsAtom, ids);
        set(examIndexAtom, 0);
        set(examStartedAtAtom, new Date().toISOString());
        set(examDeadlineAtom, Date.now() + EXAM_DURATION_SECONDS * 1000);
        set(examStatusAtom, "running");

        return true;
    } catch (error) {
        set(examStatusAtom, "error");
        set(
            examErrorAtom,
            error instanceof Error ? error.message : "Could not start the exam"
        );
        return false;
    }
});

export const goToNextExamQuestionAtom = atom(null, (get, set) => {
    const index = get(examIndexAtom);

    if (index < get(examQuestionIdsAtom).length - 1) {
        set(examIndexAtom, index + 1);
    }
});

export const goToPreviousExamQuestionAtom = atom(null, (get, set) => {
    const index = get(examIndexAtom);

    if (index > 0) {
        set(examIndexAtom, index - 1);
    }
});

export const submitExamAtom = atom(
    null,
    async (get, set, options: {timedOut?: boolean} = {}) => {
        if (get(examStatusAtom) !== "running") {
            return null;
        }

        set(examStatusAtom, "grading");

        const user = await get(userAtom);
        const ids = get(examQuestionIdsAtom);
        const startedAt = get(examStartedAtAtom) ?? new Date().toISOString();
        const responses = get(responseByQuestionAtom);

        const questions: AssessmentQuestion[] = [];

        for (const id of ids) {
            try {
                questions.push(await api.getAssessment(id));
            } catch (_error) {}
        }

        const grade = gradeExam(questions, responses);
        const submittedAt = new Date();

        const attempt: ExamAttempt = {
            ...grade,
            attemptId: createRandomId(),
            userId: user.id,
            startedAt,
            submittedAt: submittedAt.toISOString(),
            durationSeconds: Math.round(
                (submittedAt.getTime() - new Date(startedAt).getTime()) / 1000
            ),
            timedOut: Boolean(options.timedOut),
        };

        set(examAttemptsAtom, [...(await get(examAttemptsAtom)), attempt]);
        set(lastAttemptAtom, attempt);
        set(examDeadlineAtom, null);
        set(examStatusAtom, "complete");

        if (attempt.passed) {
            await set(issueCertificationAtom, {
                attemptId: attempt.attemptId,
                score: attempt.score,
                total: attempt.total,
                percentage: attempt.percentage,
                expertScore: attempt.expertScore,
                issuedAt: attempt.submittedAt,
            });
        }

        return attempt;
    }
);

export const resetExamAtom = atom(null, (_get, set) => {
    set(examStatusAtom, "idle");
    set(examQuestionIdsAtom, []);
    set(examIndexAtom, 0);
    set(examStartedAtAtom, null);
    set(examDeadlineAtom, null);
    set(examErrorAtom, null);
});

export const EXAM_TOTAL_QUESTIONS = EXAM_LENGTH;
