import { useState, useEffect, useRef } from "react";
import { Menu, X, Compass } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Navbar({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const location = useLocation();

  const navRef = useRef(null);
  const [underlineStyle, setUnderlineStyle] = useState({
    width: 0,
    left: 0
  });

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Resize detection */
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const links = [
  { label: "Home", path: "/" },
  { label: "Group Tours", path: "/group-tours" },
  { label: "AI Planner", path: "/ai-planner" },
  { label: "Plan Trip", path: "/custom" }
];

  /* Set underline on route change */
  useEffect(() => {
    if (!isDesktop || !navRef.current) return;

    const index = links.findIndex(
      l => l.path === location.pathname
    );

    if (index === -1) return;

    const btn = navRef.current.children[index];
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const parentRect = navRef.current.getBoundingClientRect();

    setUnderlineStyle({
      width: rect.width,
      left: rect.left - parentRect.left
    });
  }, [location.pathname, isDesktop]);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 50,
          padding: "16px 24px",
          background: scrolled ? "white" : "transparent",
          boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,0.1)" : "none",
          transition: "all 0.3s"
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          {/* LOGO */}
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => onNavigate("/")}
          >
            <Compass color={scrolled ? "#0F4C81" : "white"} />
            <strong
              style={{
                marginLeft: 8,
                fontSize: 22,
                color: scrolled ? "#0F4C81" : "white"
              }}
            >
              Travel<span style={{ color: "#FF8C00" }}>Craft</span>
            </strong>
          </div>

          {/* DESKTOP NAV */}
          {isDesktop && (
            <div
              ref={navRef}
              style={{
                position: "relative",
                display: "flex",
                gap: 32,
                alignItems: "center"
              }}
            >
              {links.map(link => {
                const active = location.pathname === link.path;

                return (
                  <button
                    key={link.path}
                    onClick={() => onNavigate(link.path)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: 800,
                      fontSize: 14,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      paddingBottom: 10,
                      color: active
                        ? "#FF8C00"
                        : scrolled
                        ? "#0F4C81"
                        : "white"
                    }}
                  >
                    {link.label}
                  </button>
                );
              })}

              {/* SLIDING UNDERLINE */}
              <span
                style={{
                  position: "absolute",
                  bottom: 0,
                  height: 3,
                  background: "#FF8C00",
                  borderRadius: 999,
                  transition: "all 0.3s ease",
                  width: underlineStyle.width,
                  left: underlineStyle.left
                }}
              />
            </div>
          )}

          {/* MOBILE MENU BUTTON */}
          {!isDesktop && (
            <button
              onClick={() => setOpen(true)}
              style={{ background: "none", border: "none" }}
            >
              <Menu color={scrolled ? "#0F4C81" : "white"} />
            </button>
          )}
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      {open && !isDesktop && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "white",
            zIndex: 100,
            padding: 32
          }}
        >
          <button onClick={() => setOpen(false)}>
            <X />
          </button>

          <div
            style={{
              marginTop: 48,
              display: "grid",
              gap: 28,
              textAlign: "center"
            }}
          >
            {links.map(link => (
              <button
                key={link.path}
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#0F4C81",
                  background: "none",
                  border: "none"
                }}
                onClick={() => {
                  onNavigate(link.path);
                  setOpen(false);
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
