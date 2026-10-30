import { AppNav } from "@/components/AppNav";

export const metadata = { title: { absolute: "Dashboard · Farsi Pen", template: "%s · Farsi Pen" } };

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    // Sessions set body[data-focus], which hides the nav; drop the sidebar offset and tab-bar clearance with it.
    <div className="lg:pl-64 [body[data-focus]_&]:pl-0">
      <AppNav />
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 lg:pb-12 [body[data-focus]_&]:pb-6">{children}</main>
    </div>
  );
}
