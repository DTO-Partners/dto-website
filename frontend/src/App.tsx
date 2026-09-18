// components
import Navbar from "@components/NavBar"

// sections
import Hero from "@sections/Hero"
import About from "@sections/About";
import Values from "./sections/Values";
import Testimonials from "./sections/Testimonials";
import OurPeople from "./sections/OurPeople";

//i18next
import "@/lib/i18n";
import Markets from "./sections/Markets";
import GDPRModal from "./components/GDPRModal";
import ApplyForm from "./sections/Apply";
import Footer from "./sections/Footer";

function App() {

  return (
    <div className="scroll-smooth">
      <Navbar/>
      <Hero/>
      <About/>
      <Values/>
      <Testimonials/>
      <OurPeople/>
      <Markets/>
      <GDPRModal/>
      <ApplyForm/>
      <Footer/>
    </div>
  )
}

export default App
