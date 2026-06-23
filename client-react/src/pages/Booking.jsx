import { addRequest } from "../utils/requestStorage";

function Booking() {
  function handleSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const formData = new FormData(form);

  const requestData = {
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    vehicleYear: Number(formData.get("vehicleYear")),
    vehicleMake: formData.get("vehicleMake"),
    vehicleModel: formData.get("vehicleModel"),
    serviceType: formData.get("service"),
    zipCode: formData.get("zipCode"),
    urgency: formData.get("urgency"),
    description: formData.get("message"),
  };

  const savedRequest = addRequest(requestData);

  console.log("Saved request:", savedRequest);

  alert(
    "Your service request has been submitted. We will contact you soon."
  );

  form.reset();
}
  return (
    <main className="booking-page">
      <section className="booking-header">
        <h1>Request Mobile Mechanic Service</h1>

        <p>
          Fill out the form below and we will contact you about your vehicle
          issue.
        </p>
      </section>

      <section className="booking-form-section">
        <form
          id="bookingForm"
          className="booking-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>

            <input
              type="text"
              id="fullName"
              name="fullName"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>

            <input
              type="tel"
              id="phone"
              name="phone"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <input
              type="email"
              id="email"
              name="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicleYear">Vehicle Year</label>

            <input
              type="number"
              id="vehicleYear"
              name="vehicleYear"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicleMake">Vehicle Make</label>

            <input
              type="text"
              id="vehicleMake"
              name="vehicleMake"
              placeholder="Toyota, Honda, Ford..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicleModel">Vehicle Model</label>

            <input
              type="text"
              id="vehicleModel"
              name="vehicleModel"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="service">Service Needed</label>

            <select id="service" name="service" required>
              <option value="">Select a service</option>
              <option value="diagnostic">Diagnostic</option>
              <option value="brakes">Brake Repair</option>
              <option value="battery">Battery Replacement</option>
              <option value="oil-change">Oil Change</option>
              <option value="tune-up">Tune-Up</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="zipCode">ZIP Code</label>

            <input
              type="text"
              id="zipCode"
              name="zipCode"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="urgency">How urgent is it?</label>

            <select id="urgency" name="urgency" required>
              <option value="">Select urgency</option>
              <option value="emergency">Emergency</option>
              <option value="same-day">Same Day</option>
              <option value="this-week">This Week</option>
              <option value="not-urgent">Not Urgent</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label htmlFor="message">Describe the problem</label>

            <textarea
              id="message"
              name="message"
              rows="5"
              required
            ></textarea>
          </div>

          <button type="submit" className="btn primary-btn">
            Submit Request
          </button>
        </form>
      </section>
    </main>
  );
}

export default Booking;