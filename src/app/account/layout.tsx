import { getCurrentCustomer } from "@/lib/customerAuth";
import { SignedOutPrompt } from "@/components/account/AccountControls";
import AccountSidebar from "@/components/account/AccountSidebar";

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customer = await getCurrentCustomer();
  if (!customer) return <SignedOutPrompt />;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <AccountSidebar />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
