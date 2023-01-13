import { Logo } from "../components/icons";

export function Footer() {
  return (
    <footer className="text-secondary flex flex-col items-center justify-between gap-2 text-sm md:flex-row md:gap-4">
      <div className="inline-flex items-center gap-1 text-sm">
        <span>Share the Love...</span>
        <Logo className="h-4 w-4" />
        <span></span>
      </div>
    </footer>
  );
}
