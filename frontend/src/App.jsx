import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Header from "./components/commons/Header"
import Footer from "./components/commons/Footer"
import Banner from "./components/commons/Banner"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ContactUs from "./pages/ContactUs"
import TermsOfService from "./pages/TermsOfService"


import Checkout from "./pages/Checkout"
import TrackOrder from "./pages/TrackOrder"
import InstagramConnect from "./pages/InstagramConnect"
import InstagramCallback from "./components/Instagram/InstagramCallback"
import Instagram from "./pages/Instagram"
import Tiktok from "./pages/Tiktok"
import FAQ from "./pages/FAQ"
import AboutPage from "./pages/about-page"
import AdminPanel from "./pages/AdminPanel"
import AdminLogin from "./pages/AdminLogin"

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  // const bannerTitle = (
  //   <p className="font-light">
  //     Use coupon code <span className="font-medium border border-dotted p-1">DEMO</span> to get{" "}
  //     <span className="font-medium">5% OFF</span> on orders above $10.
  //   </p>
  // )

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        <Banner/>
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* <Route path="/insta-likes" element={<BuyInstaLikes />} />
            <Route path="/insta-followers" element={<BuyInstaFollowers />} />
            <Route path="/insta-views" element={<BuyInstaViews />} />
            <Route path="/insta-comments" element={<BuyInstaComments />} /> */}
            <Route path="/instagram" element={<Instagram />} />
            {/* <Route path="/tiktok-likes" element={<BuyTikTokLikes />} />
            <Route path="/tiktok-followers" element={<BuyTikTokFollowers />} />
            <Route path="/tiktok-views" element={<BuyTikTokViews />} /> */}
            <Route path="/tiktok" element={<Tiktok />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/track/:orderNumber" element={<TrackOrder />} />
            <Route path="/instagram-connect" element={<InstagramConnect />} />
            <Route path="/auth/instagram/callback" element={<InstagramCallback />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminPanel />} />
      

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
