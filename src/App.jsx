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
import AdminDashboard from "./components/AdminDashboard";


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
  <Routes>
    {/* ADMIN (NO NAV / FOOTER) */}
    <Route path="/admin" element={<AdminDashboard />} />

    {/* PUBLIC SITE */}
    <Route
      path="/*"
      element={
        <>
          <Navbar onNavigate={navigate} />

          <Routes>
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

            <Route path="/custom" element={<CustomTripForm />} />
            <Route path="/ai-planner" element={<AiPlanner />} />
          </Routes>

          <Footer onNavigate={navigate} />
        </>
      }
    />
  </Routes>
);
}
