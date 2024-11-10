import CardContainer from "./Components/CardContainer";
import HeroSection from "./Components/HeroSection";

export default function Home() {
  return (
    <>
      <div className="flex items-center justify-center">
        <div className="w-[1200px] max-w-[1200px]">
          <HeroSection />
          <CardContainer />
        </div>
      </div>
    </>
  );
}
