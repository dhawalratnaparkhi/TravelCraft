import AiPlanner from "./components/AiPlanner";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ServiceCards from "./components/ServiceCards";
import HowItWorks from "./components/HowItWorks";
import GroupTours from "./components/GroupTours";
import Testimonials from "./components/Testimonials";
import HomeCTA from "./components/HomeCTA";
import CustomTripForm from "./components/CustomTripForm";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";

import { Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./styles/base.css";

/* DATA */
const TOURS = [
  { id: "1", cat: "Trending", name: "Serene Bali Escape", price: 899, days: "6D/5N" },
  { id: "2", cat: "International", name: "Swiss Alpine Luxury", price: 2450, days: "7D/6N" },
  { id: "3", cat: "Weekend", name: "Dubai Desert Mirage", price: 1150, days: "5D/4N" },
  { id: "4", cat: "Domestic", name: "Kerala Backwaters", price: 450, days: "4D/3N" },
  { id: "5", cat: "International", name: "Iceland Lights", price: 3200, days: "8D/7N" },
];

export default function App() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState("Trending");

  const filteredTours = TOURS.filter((t) => t.cat === activeCat);

  return (
    <>
      {/* GLOBAL NAV */}
      <Navbar onNavigate={navigate} />

      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <>
              <Hero
                onCustom={() => navigate("/custom")}
                onGroup={() => navigate("/group-tours")}
              />

              <ServiceCards
                onCustom={() => navigate("/custom")}
                onGroup={() => navigate("/group-tours")}
              />

              <HowItWorks />
              <Testimonials />
              <FAQ />
              <HomeCTA onCustom={() => navigate("/custom")} />
            </>
          }
        />

        {/* GROUP TOURS */}
        <Route
          path="/group-tours"
          element={
            <GroupTours
              activeCat={activeCat}
              setActiveCat={setActiveCat}
              tours={filteredTours}
            />
          }
        />

        {/* CUSTOM TRIP */}
        <Route path="/custom" element={<CustomTripForm />} />
        <Route path="/ai-planner" element={<AiPlanner />} />

      </Routes>

      {/* GLOBAL FOOTER */}
      <Footer onNavigate={navigate} />
    </>
  );
}
