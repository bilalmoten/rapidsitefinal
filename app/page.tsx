import DeployButton from "../components/DeployButton";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import ConnectSupabaseSteps from "@/components/tutorial/ConnectSupabaseSteps";
import SignUpUserSteps from "@/components/tutorial/SignUpUserSteps";
import Header from "@/components/Header";
import Navbar from "@/components/NavbarLanding";
import HeroSection1 from "@/components/HeroSection";
import Features1 from "@/components/Features/Feature";
import FAQ from "@/components/FAQ";
import About from "@/components/About"

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center landingPage">
      <Navbar />
      <HeroSection1 />
      <Features1 />
      <FAQ />
      <About />
    </div>
  );
}
