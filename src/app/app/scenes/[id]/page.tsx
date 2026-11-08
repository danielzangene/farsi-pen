import { notFound } from "next/navigation";
import { SCENE_BY_ID, SCENES } from "@/content/scenes";
import { ScenePlayer } from "@/components/scene/ScenePlayer";

export const dynamicParams = false;

export function generateStaticParams() {
  return SCENES.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: SCENE_BY_ID[id]?.title ?? "Scene" };
}

export default async function ScenePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scene = SCENE_BY_ID[id];
  if (!scene) notFound();
  return (
    <div className="mx-auto max-w-3xl">
      <ScenePlayer scene={scene} />
    </div>
  );
}
