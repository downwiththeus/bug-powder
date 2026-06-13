import { useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useInterzone } from "@/lib/store";
import { startDrone, stopDrone } from "@/lib/audio";
import { Volume2, VolumeX, Skull } from "lucide-react";

export function InterzoneLayout() {
  const { descent, mutations, audioEnabled, setAudio, withdrawal, checkWithdrawal, streak, paranoia } = useInterzone();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    void useInterzone.persist.rehydrate();
  }, []);

  // Apply descent + mutation classes to <body>
  useEffect(() => {
    document.documentElement.style.setProperty("--descent", String(descent));
    document.body.classList.toggle("iz-descent-deep", descent >= 5);
    const mutClasses = ["mut-centipede-cursor", "mut-mugwump-eyes", "mut-melted-nav", "mut-flesh-bg", "mut-typewriter-keys"];
    mutClasses.forEach(c => document.body.classList.remove(c));
    mutations.forEach(m => document.body.classList.add(`mut-${m}`));
  }, [descent, mutations]);

  // Withdrawal check on mount + every 60s
  useEffect(() => {
    checkWithdrawal();
    const id = setInterval(checkWithdrawal, 60000);
    return () => clearInterval(id);
  }, [checkWithdrawal]);

  // Force withdrawal redirect
  useEffect(() => {
    if (withdrawal && location.pathname !== "/withdrawal" && location.pathname !== "/") {
      navigate({ to: "/withdrawal" });
    }
  }, [withdrawal, location.pathname, navigate]);

  // Audio control
  useEffect(() => {
    if (audioEnabled) startDrone();
    else stopDrone();
    return () => stopDrone();
  }, [audioEnabled]);

  const navItems = [
    { to: "/feed", label: "Feed" },
    { to: "/fix", label: "Fix" },
    { to: "/interzone", label: "Interzone" },
    { to: "/mutations", label: "Mutations" },
  ];

  return (
    <div className="iz-scanlines iz-noise min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-iz-ink/85 border-b border-iz-vein">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/feed" className="flex items-center gap-2 group">
            <Skull className="w-5 h-5 text-iz-blood group-hover:text-iz-pus transition-colors iz-flicker" />
            <span className="font-display text-lg text-iz-bone iz-glitch-text tracking-wider">
              INTERZONE_FEED
            </span>
            <span className="text-[10px] text-iz-vein font-mono ml-1">v3.26</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-iz-pus transition-colors border border-transparent hover:border-iz-vein"
                activeProps={{ className: "px-3 py-1 text-xs uppercase tracking-widest text-iz-bone border border-iz-blood bg-iz-vein/40" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 text-[10px] font-mono">
            <span className="hidden sm:inline text-muted-foreground">DESCENT <span className="text-iz-pus">{descent}</span></span>
            <span className="hidden sm:inline text-muted-foreground">STREAK <span className="text-iz-blood">{streak}</span></span>
            <span className="hidden md:inline text-muted-foreground">PARANOIA <span className="text-iz-pus">{paranoia}</span></span>
            <button
              onClick={() => setAudio(!audioEnabled)}
              className="p-1.5 border border-iz-vein hover:border-iz-blood hover:bg-iz-vein/30 transition-colors"
              aria-label="Toggle ambient drone"
            >
              {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-iz-pus" /> : <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />}
            </button>
          </div>
        </div>
        {/* mobile nav */}
        <nav className="md:hidden border-t border-iz-vein flex">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="flex-1 text-center py-2 text-[10px] uppercase tracking-widest text-muted-foreground"
              activeProps={{ className: "flex-1 text-center py-2 text-[10px] uppercase tracking-widest text-iz-pus bg-iz-vein/30" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-4 py-6 w-full">
        <Outlet />
      </main>

      <footer className="border-t border-iz-vein bg-iz-ink/60">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            <span className="text-iz-vein">Interzone Bureau </span>— No records without consent
          </p>
          <a
            href="https://www.themeansofproduction.press"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono text-iz-pus hover:text-iz-bone transition-colors uppercase tracking-widest"
          >
            The Means of Production
          </a>
        </div>
      </footer>
    </div>
  );
}
