import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import TrustBanner from "./components/TrustBanner";
import FeaturesGrid from "./components/FeaturesGrid";
import HowItWorksSection from "./components/HowItWorksSection";
import DeveloperNoteSection from "./components/DeveloperNoteSection";
import FAQSection from "./components/FAQSection";
import Footer from "./components/Footer";

export default function Landing() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session && !loading) {
      navigate("/expenses", { replace: true });
    }
  }, [session, loading, navigate]);

  // While we're checking the session, render a neutral full-screen loader.
  // This prevents the landing page from flashing before the redirect fires.
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-6 h-6 border-2 border-outline-variant border-t-on-surface rounded-full animate-spin" />
      </div>
    );
  }

  // If a session is already confirmed, render nothing — the useEffect will redirect.
  if (session) return null;

  return (
    <div className="min-h-screen bg-background text-on-surface overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <TrustBanner />
      <FeaturesGrid />
      <HowItWorksSection />
      <DeveloperNoteSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
