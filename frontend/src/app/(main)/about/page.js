import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutStory from "@/components/about/AboutStory";

export default function AboutPage() {
  return (
    <>
      <main className="pt-[104px] lg:pt-[80px]">
        <AboutStory />
      </main>
    </>
  );
}