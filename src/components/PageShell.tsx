import NavBar from "./NavBar";

export default function PageShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      <NavBar />
      <main className={`min-h-screen pt-14 ${className}`}>{children}</main>
    </>
  );
}
