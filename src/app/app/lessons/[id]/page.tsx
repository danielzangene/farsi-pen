import { notFound } from "next/navigation";
import { LESSONS, LESSON_BY_ID } from "@/content/lessons";
import { LessonSession } from "@/components/LessonSession";

export const dynamicParams = false;

export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `${LESSON_BY_ID[id]?.title ?? "Lesson"}` };
}

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = LESSON_BY_ID[id];
  if (!lesson) notFound();
  return <LessonSession lesson={lesson} />;
}
