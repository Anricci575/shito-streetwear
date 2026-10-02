import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Minus, Plus } from "lucide-react";

const caps = [
  {
    id: 1,
    name: "PUMA x FERRARI",
    price: "$25",
    desc: "Colaboración oficial Puma Motorsport. Estructura de seis paneles con escudo clásico frontal y acentos en rojo corsa.",
    img: "/photo_2026-09-28_14-49-19.jpg"
  },
  {
    id: 2,
    name: "COACH MONOGRAM",
    price: "$25",
    desc: "Patrón monograma clásico en lona jacquard. Ribete de cuero negro y herraje metálico oscuro.",
    img: "/photo_2026-09-28_14-49-22.jpg"
  },
  {
    id: 3,
    name: "BASS PRO SHOPS",
    price: "$25",
    desc: "Silueta trucker clásica con malla transpirable. Icónico parche bordado frontal y camuflaje oscuro.",
    img: "/photo_2026-09-28_13-25-21.jpg"
  }
];

function App() {
  const { scrollY } = useScroll();
  
  const langs = ["es", "en", "jp"];
  const [langIndex, setLangIndex] = useState(0);

  // --- CART STATE ---
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (cap) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === cap.id);
      if (existing) {
        return prev.map((item) => item.id === cap.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...cap, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart((prev) => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));

  const cartTotal = cart.reduce((total, item) => total + (item.qty * 25), 0); // Todas valen 25
  const totalItems = cart.reduce((total, item) => total + item.qty, 0);

  const handleCheckout = () => {
    let msg = "¡Hola Richi! 🌱 Quiero hacer este pedido de SHi-TO:\n\n";
    cart.forEach(item => {
      msg += `- ${item.qty}x ${item.name} ($25 c/u)\n`;
    });
    msg += `\n*Total estimado: $${cartTotal}*\n`;
    window.open(`https://wa.me/584161437190?text=${encodeURIComponent(msg)}`, "_blank");
  };
  // --- END CART STATE ---

  useEffect(() => {
    const interval = setInterval(() => {
      setLangIndex((prev) => (prev + 1) % langs.length);
    }, 3600); // 3.6s para que respire con calma
    return () => clearInterval(interval);
  }, []);

  const currentLang = langs[langIndex];

  const titles = {
    es: <>Headwear seleccionado.<br/><span className="italic opacity-80">Piezas únicas.</span></>,
    en: <>Curated headwear.<br/><span className="italic opacity-80">Unique pieces.</span></>,
    jp: <>厳選されたヘッドウェア。<br/><span className="italic opacity-80">一点物のピース。</span></>
  };
  
  // Física de inercia optimizada para móvil y desktop (60fps)
  const smoothScrollY = useSpring(scrollY, { stiffness: 90, damping: 28, restDelta: 0.001 });
  const sharpOpacity = useTransform(smoothScrollY, [0, 850], [1, 0]);

  const handleBuy = (capName) => {
    const msg = `¡Hola Richi! 🌱 Quiero apartar la gorra ${capName} de la colección SHi-TO.`;
    window.open(`https://wa.me/584161437190?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // Variantes de animación aceleradas por GPU nativa (sin filtros pesados en móvil)
  const fadeUpSmooth = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className="min-h-screen font-sans text-white bg-[#0a0f0d] relative overflow-x-hidden">
      
      {/* --- BACKGROUND: OPTIMIZED DYNAMIC SCROLL BLUR --- */}
      <div className="fixed inset-0 z-0 pointer-events-none transform-gpu">
        {/* Capa 2: Versión difuminada ligera con aceleración por hardware */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ 
            backgroundImage: `url("/duy-thanh-nguyen-j59gWjERqZg-unsplash333.jpg?v=2")`, 
            filter: "blur(14px)",
            transform: "translateZ(0)"
          }}
        ></div>

        {/* Capa 1: Imagen nítida con opacidad reactiva acelerada por GPU */}
        <motion.div 
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ 
            backgroundImage: `url("/duy-thanh-nguyen-j59gWjERqZg-unsplash333.jpg?v=2")`, 
            opacity: sharpOpacity,
            willChange: "opacity",
            transform: "translateZ(0)"
          }}
        ></motion.div>
        
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Grano de película solo en Desktop para no ralentizar procesadores móviles */}
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="hidden md:block absolute inset-0 w-full h-full opacity-[0.12] mix-blend-overlay pointer-events-none">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
        </svg>

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/90"></div>
      </div>

      {/* --- CONTENT --- */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Navbar */}
        <nav className="w-full p-8 flex justify-between items-center drop-shadow-2xl fixed top-0 z-40 mix-blend-difference">
          <div className="w-10"></div> {/* Spacer */}
          
          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
            <path fillRule="evenodd" clipRule="evenodd" d="M50 0C77.6142 0 100 22.3858 100 50C100 77.6142 77.6142 100 50 100C22.3858 100 0 77.6142 0 50C0 22.3858 22.3858 0 50 0ZM50 18C32.3269 18 18 32.3269 18 50C18 67.6731 32.3269 81.6731 50 81.6731C50 71.6731 58 63.6731 68 63.6731C78 63.6731 82 50 82 50C82 32.3269 67.6731 18 50 18Z" fill="currentColor"/>
          </svg>

          <button onClick={() => setIsCartOpen(true)} className="relative hover:scale-110 transition-transform flex items-center justify-center w-10 h-10">
            <ShoppingBag size={20} className="text-white" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-0 bg-white text-black text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </nav>

        {/* Hero Portada (Abarca toda la pantalla) */}
        <section className="h-[100vh] w-full flex flex-col justify-center items-center text-center px-6">
        </section>

        {/* Brand Description Section */}
        <section className="min-h-[70vh] flex items-center justify-center px-6 py-20 relative">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpSmooth}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="h-[90px] md:h-[110px] mb-8 flex items-center justify-center relative w-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h2 
                  key={currentLang}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-3xl md:text-5xl tracking-wide font-normal text-center absolute w-full px-4"
                >
                  {titles[currentLang]}
                </motion.h2>
              </AnimatePresence>
            </div>
            
            <div className="w-px h-16 bg-white/20 mx-auto mb-8"></div>
            
            <p className="font-sans text-xs md:text-base font-light tracking-widest leading-loose opacity-70 uppercase px-4">
              Nos pasamos el tiempo cazando e importando gorras de alta calidad para que tú no tengas que hacerlo. Nos enfocamos en traer piezas clásicas y diseños difíciles de conseguir para quienes realmente saben de estilo.
              <br/><br/>
              Bajo la filosofía "Grow More. Waste Less.", no seguimos modas rápidas ni acumulamos inventario innecesario. Una selección estricta para quienes valoran los detalles y construyen en silencio.
            </p>
          </motion.div>
        </section>

        {/* Catalog Carousel */}
        <section className="pb-32 w-full pt-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUpSmooth}
            className="flex flex-col"
          >
            <div className="px-6 md:px-12 mb-10 flex justify-between items-end">
              <h2 className="font-serif text-2xl md:text-3xl tracking-wider">Cápsula Uno</h2>
              <span className="font-sans text-[10px] md:text-xs tracking-[0.2em] opacity-50 uppercase">Desliza para ver</span>
            </div>

            {/* Contenedor del Carrusel (Touch Nativo a 60fps con inercia) */}
            <div 
              className="flex overflow-x-auto snap-x snap-mandatory gap-6 px-6 md:px-12 pb-12 hide-scrollbar overscroll-x-contain"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
            >
              {caps.map((cap) => (
                <div 
                  key={cap.id} 
                  className="snap-center shrink-0 w-[85vw] md:w-[400px] flex flex-col group"
                >
                  {/* Image Container */}
                  <div className="aspect-[4/5] w-full rounded-sm overflow-hidden relative mb-6 bg-[#0a0f0d] border border-white/10 cursor-pointer transition-transform duration-700 hover:scale-[1.02]">
                    <img src={cap.img} alt={cap.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover z-0 opacity-90 hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                    
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500">
                      <button 
                        onClick={() => addToCart(cap)}
                        className="bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-sans text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-black hover:text-white transition-colors duration-300 flex items-center gap-2 md:transform md:translate-y-4 md:group-hover:translate-y-0"
                      >
                        <ShoppingBag size={14} /> Agregar
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col text-left px-2 text-white">
                    <h3 className="font-serif text-2xl tracking-wide mb-1 font-normal">{cap.name}</h3>
                    <span className="font-sans text-[11px] tracking-widest opacity-80 mb-3 font-medium">{cap.price}</span>
                    <p className="font-sans font-light text-[10px] opacity-60 leading-relaxed uppercase tracking-widest max-w-[90%]">{cap.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="w-full py-16 flex flex-col items-center justify-center text-center font-sans text-[10px] tracking-widest uppercase border-t border-white/5 mt-10 z-20 relative bg-black/10">
          
          {/* Social Links */}
          <div className="flex gap-10 mb-8 opacity-60">
            <a href="https://www.instagram.com/richi__r.90/" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity relative group">
              Instagram
              <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </a>
            <a href="https://wa.me/584161437190" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity relative group">
              WhatsApp
              <span className="absolute -bottom-2 left-0 w-full h-[1px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
            </a>
          </div>

          {/* Copyright */}
          <div className="opacity-40 flex flex-col items-center gap-2">
            <p>© 2026 SHi-TO. Grow More. Waste Less.</p>
            <a href="https://richi.club" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">
              Engineered by <span className="font-bold">richi.club</span>
            </a>
          </div>
        </footer>

      </div>

      {/* Ocultar barra de scroll en Chrome/Safari */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    
      {/* --- CART SLIDE-OVER --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 h-full w-[90vw] md:w-[400px] bg-[#0a0f0d] border-l border-white/10 z-50 flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Aesthetic Background inside Cart */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <img src="/eugene-golovesov-gcaN9zlPRcY-unsplash.jpg" alt="bg" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0d]/90 via-[#0a0f0d]/40 to-[#0a0f0d]/90"></div>
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="hidden md:block absolute inset-0 w-full h-full opacity-10 mix-blend-overlay pointer-events-none">
                  <filter id="noiseFilterCart"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter>
                  <rect width="100%" height="100%" filter="url(#noiseFilterCart)"/>
                </svg>
              </div>

              <div className="p-6 border-b border-white/10 flex justify-between items-center relative z-10">
                <h3 className="font-serif text-2xl tracking-wide">Archivo</h3>
                <button onClick={() => setIsCartOpen(false)} className="opacity-50 hover:opacity-100 hover:rotate-90 transition-all">
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 hide-scrollbar relative z-10">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-40 text-center">
                    <ShoppingBag size={48} className="mb-4 opacity-50" />
                    <p className="font-sans text-[10px] tracking-widest uppercase">Tu archivo está vacío.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-20 h-24 bg-black/40 rounded-sm overflow-hidden flex-shrink-0 border border-white/5">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover opacity-90" />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <h4 className="font-sans text-[11px] tracking-widest font-bold uppercase mb-1">{item.name}</h4>
                        <span className="font-sans text-[10px] opacity-60 mb-3">{item.price}</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => updateQty(item.id, -1)} className="p-1 opacity-50 hover:opacity-100 border border-white/20 rounded-sm bg-black/20"><Minus size={12} /></button>
                          <span className="font-sans text-[12px] w-4 text-center">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="p-1 opacity-50 hover:opacity-100 border border-white/20 rounded-sm bg-black/20"><Plus size={12} /></button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="opacity-30 hover:opacity-100 hover:text-red-400 p-2 transition-colors"><X size={16} /></button>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 relative z-10 bg-[#0a0f0d]/40 backdrop-blur-md">
                  <div className="flex justify-between items-end mb-6">
                    <span className="font-sans text-[10px] tracking-widest uppercase opacity-60">Total Estimado</span>
                    <span className="font-serif text-3xl">${cartTotal}</span>
                  </div>
                  <button onClick={handleCheckout} className="w-full bg-white text-black py-5 rounded-sm font-sans text-[10px] tracking-[0.2em] font-bold uppercase hover:bg-gray-200 transition-colors">Confirmar por WhatsApp</button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
export default App;