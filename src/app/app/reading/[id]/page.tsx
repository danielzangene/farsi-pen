import { notFound } from "next/navigation";
import { READING_BY_ID, READINGS } from "@/content/readings";
import { ReadingLessonView } from "@/components/reading/ReadingLessonView";

export const dynamicParams = false;

export function generateStaticParams() {
  return READINGS.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: READING_BY_ID[id]?.topic ?? "Reading" };
}

export default async function ReadingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = READING_BY_ID[id];
  if (!lesson) notFound();
  return (
    <div className="mx-auto max-w-3xl">
      <ReadingLessonView lesson={lesson} />
    </div>
  );
}
