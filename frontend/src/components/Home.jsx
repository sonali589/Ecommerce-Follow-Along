import Product from "./auth/Product";
import Showcase from "./auth/Showcase";
import Navbar from "./Navbar";

const Home = () => {
  return (
    <div className="flex flex-col gap-0 bg-[#0b1739] text-white">
      <div>
        <Navbar />
      </div>
      <div className="mt-15">
        <Showcase />
      </div>
      <Product />
    </div>
  );
};

export default Home;