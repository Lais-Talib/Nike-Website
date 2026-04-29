import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../utils/api';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = React.useState([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProducts();
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <Hero />
      
      {/* Trending Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-2 dark:text-white">Trending Now</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium">The most sought-after styles this season.</p>
          </div>
          <Link to="/category/all" className="hidden md:flex items-center space-x-2 font-bold uppercase tracking-tight dark:text-white hover:opacity-70 transition-opacity">
            <span>Shop All</span>
            <ArrowRight size={20} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-12 flex justify-center md:hidden">
          <Link to="/category/all" className="flex items-center space-x-2 font-bold bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full uppercase tracking-tight">
            <span>Shop All</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative h-[70vh] w-full rounded-3xl overflow-hidden flex items-center group">
          <img 
            src="https://images.unsplash.com/photo-1552346154-21d32810baa3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Running" 
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500"></div>
          <div className="relative z-10 p-8 md:p-20 text-white max-w-2xl">
            <h2 className="text-5xl md:text-7xl font-black uppercase mb-6 leading-none tracking-tighter">Step into<br/>Greatness</h2>
            <p className="text-lg md:text-xl mb-10 text-white/90 font-medium leading-relaxed">
              Experience the latest innovation in running technology with the all-new ZoomX series. Engineered for speed and comfort.
            </p>
            <Link to="/category/men?subcategory=Running" className="inline-block bg-white text-black font-black uppercase tracking-tight py-4 px-10 rounded-full hover:bg-gray-100 transition-all transform active:scale-95 shadow-2xl">
              Explore Now
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Sport Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        <div className="flex justify-between items-end mb-10 px-2">
          <div>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter dark:text-white">Shop by Sport</h2>
          </div>
        </div>

        <div className="flex overflow-x-auto space-x-6 pb-10 no-scrollbar snap-x snap-mandatory">
          {[
            { name: "Running", image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80" },
            { name: "Basketball", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80" },
            { name: "Football", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80" },
            { name: "Training & Gym", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" },
            { name: "Tennis", image: "https://images.unsplash.com/flagged/photo-1576972405668-2d020a01cbfa?w=800" },
            { name: "Skateboarding", image: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?auto=format&fit=crop&w=800&q=80" }
          ].map((sport, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 0.98 }}
              className="flex-none w-[300px] md:w-[440px] aspect-[4/5] relative rounded-[2rem] overflow-hidden group snap-start cursor-pointer"
            >
              <img 
                src={sport.image} 
                alt={sport.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{sport.name}</h3>
                <Link 
                  to={`/category/all?subcategory=${sport.name}`}
                  className="bg-white text-black px-6 py-2 rounded-full text-sm font-black uppercase tracking-tight hover:bg-gray-100 transition-colors"
                >
                  Shop
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Spotlight Section */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter dark:text-white mb-4 italic">Spotlight</h2>
          <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs md:text-sm max-w-2xl mx-auto">
            Classic silhouettes and cutting-edge innovation to build your game from the ground up.
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-x-2 gap-y-10 max-w-5xl mx-auto">
          {[
            { name: "Air Jordan 1", image: "/spotlight/jordan.png", sub: "Jordan" },
            { name: "Air Force 1", image: "/spotlight/af1.png", sub: "Lifestyle" },
            { name: "Dunk Low", image: "/spotlight/dunk.png", sub: "Lifestyle" },
            { name: "Air Max", image: "/spotlight/max.png", sub: "Lifestyle" },
            { name: "Pegasus", image: "/spotlight/pegasus.png", sub: "Running" },
            { name: "Jackets", image: "/spotlight/jacket.png", sub: "Clothing" },
            { name: "Tees", image: "/spotlight/tee.png", sub: "Clothing" },
            { name: "Caps", image: "/spotlight/cap.png", sub: "Accessories" }
          ].map((item, idx) => (
            <Link 
              to={`/category/all?subcategory=${item.sub}`} 
              key={idx}
              className="flex flex-col items-center group"
            >
              <div className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center mb-3 overflow-hidden rounded-full shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-none bg-[#f6f6f6]">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-[85%] h-[85%] object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] md:text-[12px] font-black uppercase tracking-tight text-center dark:text-white group-hover:underline underline-offset-4">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
