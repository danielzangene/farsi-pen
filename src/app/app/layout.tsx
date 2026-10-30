import { AppNav } from "@/components/AppNav";

export const metadata = { title: { absolute: "Dashboard · Farsi Pen", template: "%s · Farsi Pen" } };

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppNav />
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 sm:pb-12">{children}</main>
    </>
  );
}
