import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <p className="tagline">Mobile Mechanic Services</p>

          <h1>Auto Repair That Comes To You</h1>

          <p>
            Get reliable mechanic services at your home, workplace, or roadside.
            Fast, convenient, and professional service without needing to visit
            a shop.
          </p>

          <div className="hero-buttons">
            <Link to="/booking" className="btn primary-btn">
              Request Service
            </Link>

            <a href="tel:1234567890" className="btn secondary-btn">
              Call Now
            </a>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>

        <div className="steps">
          <div className="step-card">
            <h3>1. Request Service</h3>
            <p>
              Fill out the form with your vehicle information and repair issue.
            </p>
          </div>

          <div className="step-card">
            <h3>2. Get a Response</h3>
            <p>
              We review your request and contact you with availability.
            </p>
          </div>

          <div className="step-card">
            <h3>3. We Come To You</h3>
            <p>
              The mechanic arrives at your location and works on your vehicle.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;