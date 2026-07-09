/** Minimal public layout for the invitation acceptance flow — no TopNav. */
export default function AcceptInviteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-humana-stone">
      {children}
    </div>
  );
}
