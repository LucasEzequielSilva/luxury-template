export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QualityGallery from "@/components/QualityGallery";
import Featured from "@/components/Featured";
import Inventory from "@/components/Inventory";
import Warranty from "@/components/Warranty";
import Reviews from "@/components/Reviews";
import TradeInBanner from "@/components/TradeInBanner";
import Footer from "@/components/Footer";
import HomeClient from "@/components/HomeClient";

export default function Home() {
  return (
    <HomeClient>
      <Navbar />
      <Hero />
      <QualityGallery />
      <Featured />
      <Inventory />
      <Warranty />
      <Reviews />
      <TradeInBanner />
      <Footer />
    </HomeClient>
  );
}
