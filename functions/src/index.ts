import {initializeApp} from "firebase-admin/app";
import {getStorage} from "firebase-admin/storage";
import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/https";
import * as logger from "firebase-functions/logger";

type CertificationPayload = {
	userId: string;
	name: string;
	score: number;
	total: number;
	percentage: number;
	passed: boolean;
	issuedAt: string;
	validUntil: string | null;
};

const isNonEmptyString = (value: unknown): value is string =>
	typeof value === "string" && value.trim().length > 0;

const isNumber = (value: unknown): value is number =>
	typeof value === "number" && Number.isFinite(value);

const isCertificationPayload = (
	payload: unknown,
): payload is CertificationPayload => {
	if (!payload || typeof payload !== "object") {
		return false;
	}

	const candidate = payload as Record<string, unknown>;

	return (
		isNonEmptyString(candidate.userId) &&
		isNonEmptyString(candidate.name) &&
		isNumber(candidate.score) &&
		isNumber(candidate.total) &&
		isNumber(candidate.percentage) &&
		typeof candidate.passed === "boolean" &&
		isNonEmptyString(candidate.issuedAt) &&
		(candidate.validUntil === null || isNonEmptyString(candidate.validUntil))
	);
};

initializeApp();

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

export const persistCertification = onRequest({cors: true}, async (req, res) => {
	if (req.method !== "POST") {
		res.status(405).json({error: "Method not allowed"});
		return;
	}

	let requestBody: unknown = req.body;
	if (typeof req.body === "string") {
		try {
			requestBody = JSON.parse(req.body);
		} catch (_error) {
			res.status(400).json({error: "Malformed JSON body"});
			return;
		}
	}

	if (!isCertificationPayload(requestBody)) {
		res.status(400).json({error: "Invalid certification payload"});
		return;
	}

	try {
		const filePath = `certifies/${requestBody.userId}.json`;
		const content = JSON.stringify(requestBody, null, 2);

		await getStorage().bucket().file(filePath).save(content, {
			contentType: "application/json; charset=utf-8",
			resumable: false,
			metadata: {
				cacheControl: "no-store",
			},
		});

		logger.info("Certification persisted", {
			userId: requestBody.userId,
			filePath,
		});

		res.status(200).json({
			ok: true,
			userId: requestBody.userId,
			path: filePath,
		});
	} catch (error) {
		logger.error("Error persisting certification", error as Error);
		res.status(500).json({error: "Internal server error"});
	}
});
