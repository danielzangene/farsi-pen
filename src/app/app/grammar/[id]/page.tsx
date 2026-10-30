import { notFound } from "next/navigation";
import { GRAMMAR, GRAMMAR_BY_ID } from "@/content/grammar";
import { GrammarLesson } from "@/components/GrammarLesson";

export const dynamicParams = false;

export function generateStaticParams() {
  return GRAMMAR.map((g) => ({ id: g.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `${GRAMMAR_BY_ID[id]?.title ?? "Grammar"}` };
}

export default async function GrammarConceptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const concept = GRAMMAR_BY_ID[id];
  if (!concept) notFound();
  return <GrammarLesson concept={concept} />;
}
