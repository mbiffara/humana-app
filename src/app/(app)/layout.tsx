import { TopNav } from "@/components/TopNav";
import { BookingProvider } from "@/contexts/BookingContext";
import { WizardProvider } from "@/contexts/WizardContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookingProvider>
      <WizardProvider>
        <TopNav />
        <main className="flex-1">{children}</main>
      </WizardProvider>
    </BookingProvider>
  );
}
