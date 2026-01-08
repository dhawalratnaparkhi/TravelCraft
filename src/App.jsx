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
import { useState, useEffect } from "react";
import "./styles/base.css";
import AdminDashboard from "./components/AdminDashboard";


export default function App() {
  const navigate = useNavigate();
  const [activeCat, setActiveCat] = useState("Trending");
const [tours, setTours] = useState([]);

useEffect(() => {
  fetch("/api/group-tours")
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setTours(data.tours);
      }
    })
    .catch(err => {
      console.error("Failed to load group tours", err);
    });
}, []);

const filteredTours = tours.filter(t => t.cat === activeCat);


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
