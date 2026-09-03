import { useValues } from "@/hooks/useValues";
import { ValuesHeader } from "@/components/values/ValuesHeader";
import { ValuesBackground } from "@/components/values/ValuesBackground";
import { ValuesGrid } from "@/components/values/ValuesGrid";

const Values = () => {
  const { values, activeIndex, toggleValue } = useValues();

  return (
    <section
      id="Values"
      className="flex justify-center items-center relative w-full bg-gradient-to-br from-[#1a1a2e] via-[#15162c] to-[#243046] py-32 px-8 text-white overflow-hidden min-h-screen"
    >
      {/* Enhanced Background Elements */}
      <ValuesBackground />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-8xl mx-auto w-full">
        {/* Header Section */}
        <ValuesHeader />
        
        {/* Values Grid */}
        <div className="opacity-100">
          <ValuesGrid
            values={values}
            activeIndex={activeIndex}
            onToggleCard={toggleValue}
          />
        </div>
      </div>
    </section>
  );
};

export default Values;
