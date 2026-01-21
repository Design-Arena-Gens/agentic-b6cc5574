import { NextResponse } from "next/server";

type FAQEntry = {
  question: string;
  answer: string;
  keywords: string[];
};

const faqs: FAQEntry[] = [
  {
    question: "How do I find a traveler for my shipment?",
    answer:
      "Browse available travelers on OrbisLinks and choose someone whose route and schedule match your shipment. You can filter by origin, destination, and travel dates to find the best fit.",
    keywords: ["find", "traveler", "shipment", "choose", "route", "availability"],
  },
  {
    question: "How can I send a package through OrbisLinks?",
    answer:
      "Pick a traveler whose origin and destination align with your package, message them through OrbisLinks, agree on the details, then hand off the package for delivery.",
    keywords: ["send", "package", "orbislinks", "delivery", "connect", "traveller"],
  },
  {
    question: "What items are prohibited from being sent?",
    answer:
      "Restricted items include illegal substances, hazardous materials, and perishable goods. Check the full prohibited items list in your OrbisLinks account before shipping.",
    keywords: ["prohibited", "items", "restricted", "illegal", "hazardous", "perishable"],
  },
  {
    question: "Is there any insurance provided by the company?",
    answer:
      "OrbisLinks does not currently provide insurance on shipments. The team is working on coverage options, and updates will be shared once available.",
    keywords: ["insurance", "insured", "coverage", "company", "provided"],
  },
];

function normalize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function findBestAnswer(prompt: string): FAQEntry | null {
  const tokens = normalize(prompt);
  if (!tokens.length) return null;

  let topScore = 0;
  let topEntry: FAQEntry | null = null;

  for (const entry of faqs) {
    const keywordSet = new Set(entry.keywords);
    let score = 0;

    for (const token of tokens) {
      if (keywordSet.has(token)) score += 3;
    }

    if (!score) {
      const questionTokens = normalize(entry.question);
      for (const token of tokens) {
        if (questionTokens.includes(token)) score += 1;
      }
    }

    if (score > topScore) {
      topScore = score;
      topEntry = entry;
    }
  }

  return topScore > 0 ? topEntry : null;
}

export async function POST(request: Request) {
  const { prompt } = (await request.json()) as { prompt?: string };

  if (!prompt || typeof prompt !== "string") {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const match = findBestAnswer(prompt);
  const answer = match
    ? match.answer
    : "I couldn't find that in the FAQ yet. Try asking about finding travelers, sending packages, prohibited items, or insurance.";

  return NextResponse.json({ answer });
}
