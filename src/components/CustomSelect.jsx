import { useState, useRef, useEffect } from "react";
import "./custom-select.css";

export default function CustomSelect({ value, onChange, placeholder, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div className="custom-select" ref={ref}>
      {/* 🔴 DIV, NOT BUTTON */}
      <div
        className={`custom-select-trigger ${!value ? "placeholder" : ""}`}
        onClick={() => setOpen(prev => !prev)}
        role="button"
        tabIndex={0}
      >
        <span>{selectedLabel}</span>
        <span className={`arrow ${open ? "open" : ""}`}>▾</span>
      </div>

      {open && (
        <ul className="custom-select-menu">
          {options.map(opt => (
            <li
              key={opt.value}
              className={opt.value === value ? "active" : ""}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
