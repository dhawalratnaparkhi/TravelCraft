import { Compass } from "lucide-react";
import "./footer.css";

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Brand */}
        <div className="footer-brand">
          <div className="brand" onClick={() => onNavigate("home")}>
            <Compass />
            <span>
              Travel<span>Craft</span>
            </span>
          </div>
          <p>
            Crafting hyper-personalized journeys for modern explorers.
          </p>
        </div>

        {/* Links */}
        <div className="footer-links">
          {["About", "Group Tours", "Custom Trip", "Contact"].map((item) => (
            <button
              key={item}
              onClick={() =>
                onNavigate(
                  item === "Group Tours"
                    ? "group-tours"
                    : item === "Custom Trip"
                    ? "custom"
                    : item.toLowerCase()
                )
              }
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} TravelCraft. All rights reserved.
      </div>
    </footer>
  );
}

