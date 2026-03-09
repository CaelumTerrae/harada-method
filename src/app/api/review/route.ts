import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const HARADA_SYSTEM_PROMPT = `You are an expert on the Harada Method (also known as the Open Window 64 chart). The Harada Method, created by Takashi Harada, is a goal-achievement framework where:

1. A single ambitious MAIN GOAL sits at the center.
2. 8 SUBGOALS surround it — each representing a distinct area of development needed to achieve the main goal. Good subgoals are:
   - Distinct from each other (no overlap)
   - Directly supportive of the main goal
   - Concrete enough to act on
   - Covering diverse dimensions (physical, mental, technical, social, etc.)
3. Each subgoal has 8 BEHAVIORS — specific, repeatable daily actions or habits. Good behaviors are:
   - Concrete and actionable (not vague aspirations)
   - Repeatable (can be done daily or weekly)
   - Directly contributing to their parent subgoal
   - Measurable or observable

You provide constructive, encouraging feedback grounded in these principles.`;

type SubgoalReviewRequest = {
  type: "subgoal";
  mainGoal: string;
  subgoalText: string;
};

type BehaviorReviewRequest = {
  type: "behaviors";
  mainGoal: string;
  subgoalText: string;
  behaviors: string[];
};

type GenerateBehaviorsRequest = {
  type: "generate-behaviors";
  mainGoal: string;
  subgoalText: string;
};

type ReviewRequest = SubgoalReviewRequest | BehaviorReviewRequest | GenerateBehaviorsRequest;

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const body = (await req.json()) as ReviewRequest;

  if (body.type === "subgoal") {
    return handleSubgoalReview(body);
  } else if (body.type === "behaviors") {
    return handleBehaviorReview(body);
  } else if (body.type === "generate-behaviors") {
    return handleGenerateBehaviors(body);
  }

  return NextResponse.json({ error: "Invalid review type" }, { status: 400 });
}

async function handleSubgoalReview(body: SubgoalReviewRequest) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: HARADA_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Rate this subgoal's compatibility with the main goal according to the Harada Method.

Main Goal: "${body.mainGoal}"
Subgoal: "${body.subgoalText}"

Respond with JSON: { "rating": "low" | "medium" | "high", "feedback": "..." }

- "high": The subgoal is distinct, directly supports the main goal, and is concrete. Give a brief encouraging sentence.
- "medium": The subgoal is somewhat relevant but could be more specific, distinct, or directly tied to the main goal. Explain what's missing and suggest how to improve it in 1-2 sentences.
- "low": The subgoal is vague, overlapping with others, or not clearly connected to the main goal. Explain what's wrong and how to fix it in 1-2 sentences.

Keep feedback concise and actionable.`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    return NextResponse.json(
      { error: "No response from AI" },
      { status: 500 }
    );
  }

  const parsed = JSON.parse(content);
  return NextResponse.json({
    rating: parsed.rating,
    feedback: parsed.feedback,
  });
}

async function handleBehaviorReview(body: BehaviorReviewRequest) {
  const filledBehaviors = body.behaviors
    .map((b, i) => ({ text: b.trim(), index: i }))
    .filter((b) => b.text.length > 0);

  if (filledBehaviors.length === 0) {
    return NextResponse.json({
      reviews: body.behaviors.map((_, i) => ({
        index: i,
        fit: true,
        feedback: "No behavior provided.",
      })),
    });
  }

  const behaviorList = filledBehaviors
    .map((b) => `${b.index + 1}. "${b.text}"`)
    .join("\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: HARADA_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Review each behavior for how well it fits the subgoal according to the Harada Method.

Main Goal: "${body.mainGoal}"
Subgoal: "${body.subgoalText}"

Behaviors:
${behaviorList}

Respond with JSON: { "reviews": [{ "index": <0-based index>, "fit": true|false, "feedback": "one sentence" }, ...] }

For each behavior:
- "fit": true if the behavior is concrete, repeatable, and directly supports the subgoal. false if it's vague, not actionable, or misaligned.
- "feedback": One brief sentence — encouraging if it fits, or explaining what's off and how to improve if it doesn't.

Only include reviews for the behaviors listed above (skip empty ones).`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    return NextResponse.json(
      { error: "No response from AI" },
      { status: 500 }
    );
  }

  const parsed = JSON.parse(content);

  const reviewMap = new Map<number, { fit: boolean; feedback: string }>();
  for (const r of parsed.reviews) {
    reviewMap.set(r.index, { fit: r.fit, feedback: r.feedback });
  }

  const reviews = body.behaviors.map((b, i) => {
    const existing = reviewMap.get(i);
    if (existing) return { index: i, ...existing };
    return { index: i, fit: true, feedback: b.trim() ? "No review available." : "" };
  });

  return NextResponse.json({ reviews });
}

async function handleGenerateBehaviors(body: GenerateBehaviorsRequest) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: HARADA_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Generate exactly 8 behaviors for the following subgoal according to the Harada Method.

Main Goal: "${body.mainGoal}"
Subgoal: "${body.subgoalText}"

Respond with JSON: { "behaviors": ["behavior1", "behavior2", ..., "behavior8"] }

Each behavior must be:
- A concrete, specific daily or weekly action (not a vague aspiration)
- Directly contributing to the subgoal
- Measurable or observable
- Short (under 10 words ideally, 15 max)

Return exactly 8 behaviors.`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    return NextResponse.json(
      { error: "No response from AI" },
      { status: 500 }
    );
  }

  const parsed = JSON.parse(content);
  const behaviors: string[] = Array.isArray(parsed.behaviors)
    ? parsed.behaviors.slice(0, 8).map((b: unknown) => String(b))
    : [];

  while (behaviors.length < 8) {
    behaviors.push("");
  }

  return NextResponse.json({ behaviors });
}
