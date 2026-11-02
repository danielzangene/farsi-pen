import { notFound } from "next/navigation";
import { MISSION_BY_ID, MISSIONS } from "@/content/missions";
import { MissionScreen } from "@/components/mission/MissionScreen";

export const dynamicParams = false;

export function generateStaticParams() {
  return MISSIONS.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: MISSION_BY_ID[id]?.title ?? "Mission" };
}

export default async function MissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mission = MISSION_BY_ID[id];
  if (!mission) notFound();
  return <MissionScreen mission={mission} />;
}
