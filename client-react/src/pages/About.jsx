import { Link } from "react-router-dom";

function About() {
  return (
    <main>
      <section>
        <h1 className="section-title">About Mobile Mechanic</h1>

        <div className="card-container">
          <article className="card">
            <h3>Convenient Service</h3>
            <p>
              The mechanic travels to the customer's home, workplace, or
              roadside location.
            </p>
          </article>

          <article className="card">
            <h3>Simple Requests</h3>
            <p>
              Customers can provide their vehicle information and explain the
              problem through the online request form.
            </p>
          </article>

          <article className="card">
            <h3>Direct Communication</h3>
            <p>
              After reviewing the request, the mechanic contacts the customer
              about availability and the next steps.
            </p>
          </article>
        </div>
      </section>

      <section className="cta">
        <h2>Need Help With Your Vehicle?</h2>

        <p>Submit a service request and describe the problem.</p>

        <Link to="/booking" className="btn primary-btn">
          Book Service
        </Link>
      </section>
    </main>
  );
}

export default About;