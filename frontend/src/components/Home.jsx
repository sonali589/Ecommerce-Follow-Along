// import Product from "./auth/Product";
// import Navbar from "./Navbar";

// const Home = () => {
//   return (
//     <div className="bg-gray-800 min-h-screen">
//       {/* Navbar */}
//       <Navbar />

//       {/* Main Content */}
//       <div className="py-8 px-6 sm:px-12">
//         <h2 className="text-center text-4xl font-extrabold text-white mb-8">
//           Welcome to LocalBazar
//         </h2>
//         {/* Product Section */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//           <Product />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;


import Product from "./auth/Product";
import Showcase from "./auth/Showcase";
import Navbar from "./Navbar";
const Home = () => {
  // Example list of products
  return(
    <div className="flex flex-col gap-10 bg-gray-700">
      <div>
    <Navbar/>
    </div>
    <div className="mt-15">
    <Showcase/>
    </div>
    <Product />
    </div>
  )
}
export default Home;