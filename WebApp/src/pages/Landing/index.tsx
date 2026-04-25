import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TrustBanner from "./components/TrustBanner";
import FeaturesGrid from "./components/FeaturesGrid";
import PricingSection from "./components/PricingSection";
import Footer from "./components/Footer";

export default function Landing() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session && !loading) {
      navigate("/home", { replace: true });
    }
  }, [session, loading, navigate]);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <TrustBanner />
      <FeaturesGrid />
      <PricingSection />
      <Footer />
    </div>
  );
}
