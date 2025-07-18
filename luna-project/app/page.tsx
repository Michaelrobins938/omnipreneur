import Header from '../components/Header'
import Hero from '../components/Hero'
import Products from '../components/Products'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 transition-colors duration-300">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Products />
        <Contact />
      </main>
      <Footer />
    </div>
  )
} 