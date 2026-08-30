import HomeIntro from "@/components/HomeIntro";
import HomePhotoCarousel from "@/components/HomePhotoCarousel";
import HomeSections from "@/components/HomeSections";
import NavBar from "@/components/NavBar";
import { homeMedia } from "@/data/home-media";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[#FAFAF8] pt-14">
        <HomePhotoCarousel items={homeMedia} />
        <HomeIntro />
        <HomeSections />
      </main>
    </>
  );
}
