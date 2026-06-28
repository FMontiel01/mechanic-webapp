import { useState } from "react";
import { addRequest } from "../utils/requestStorage";

function Booking() {
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [submissionType, setSubmissionType] = useState("");

  const today = new Date();

  // Prevents the preferred date from being set before today
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const minimumDate = today.toISOString().split("T")[0];

  // Allows vehicles from the next model year
  const maximumVehicleYear = new Date().getFullYear() + 1;

  function showMessage(message, type) {
    setSubmissionMessage(message);
    setSubmissionType(type);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const phone = String(formData.get("phone")).trim();
    const zipCode = String(formData.get("zipCode")).trim();
    const vehicleYear = Number(formData.get("vehicleYear"));

    const phonePattern = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    const zipPattern = /^\d{5}(-\d{4})?$/;

    if (!phonePattern.test(phone)) {
      showMessage(
        "Please enter a valid 10-digit phone number, such as 630-555-1234.",
        "error"
      );

      form.elements.phone.focus();
      return;
    }

    if (!zipPattern.test(zipCode)) {
      showMessage("Please enter a valid 5-digit ZIP code.", "error");

      form.elements.zipCode.focus();
      return;
    }

    if (vehicleYear < 1980 || vehicleYear > maximumVehicleYear) {
      showMessage(
        `Please enter a vehicle year between 1980 and ${maximumVehicleYear}.`,
        "error"
      );

      form.elements.vehicleYear.focus();
      return;
    }

    const requestData = {
      fullName: String(formData.get("fullName")).trim(),
      phone: phone,
      email: String(formData.get("email")).trim(),
      preferredContact: formData.get("preferredContact"),
      vehicleYear: vehicleYear,
      vehicleMake: String(formData.get("vehicleMake")).trim(),
      vehicleModel: String(formData.get("vehicleModel")).trim(),
      vehicleStarts: formData.get("vehicleStarts"),
      serviceType: formData.get("service"),
      zipCode: zipCode,
      urgency: formData.get("urgency"),
      preferredDate: formData.get("preferredDate"),
      description: String(formData.get("message")).trim(),
    };

    try {
      const savedRequest = addRequest(requestData);

      console.log("Saved request:", savedRequest);

      showMessage(
        "Your service request was submitted successfully. We will contact you soon.",
        "success"
      );

      form.reset();
    } catch (error) {
      console.error("Unable to save request:", error);

      showMessage(
        "We could not save your request. Please try again.",
        "error"
      );
    }
  }

  return (
    <main className="booking-page">
      <section className="booking-header">
        <p className="booking-tagline">Mobile Mechanic Service</p>

        <h1>Request Mobile Mechanic Service</h1>

        <p>
          Tell us about your vehicle and the repair you need. We will review
          your request and contact you to confirm the service details.
        </p>
      </section>

      <section className="booking-form-section">
        <form
          id="bookingForm"
          className="booking-form"
          onSubmit={handleSubmit}
        >
          <div className="form-section-heading full-width">
            <h2>Contact Information</h2>
            <p>Let us know the best way to reach you.</p>
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>

            <input
              type="text"
              id="fullName"
              name="fullName"
              autoComplete="name"
              placeholder="Enter your full name"
              minLength="2"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>

            <input
              type="tel"
              id="phone"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              placeholder="630-555-1234"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              placeholder="name@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="preferredContact">
              Preferred Contact Method
            </label>

            <select
              id="preferredContact"
              name="preferredContact"
              required
            >
              <option value="">Select a contact method</option>
              <option value="phone-call">Phone Call</option>
              <option value="text-message">Text Message</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div className="form-section-heading full-width">
            <h2>Vehicle Information</h2>
            <p>Provide basic information about the vehicle.</p>
          </div>

          <div className="form-group">
            <label htmlFor="vehicleYear">Vehicle Year</label>

            <input
              type="number"
              id="vehicleYear"
              name="vehicleYear"
              min="1980"
              max={maximumVehicleYear}
              placeholder="2018"
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
              minLength="2"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicleModel">Vehicle Model</label>

            <input
              type="text"
              id="vehicleModel"
              name="vehicleModel"
              placeholder="Camry, Civic, F-150..."
              minLength="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicleStarts">
              Does the vehicle start?
            </label>

            <select
              id="vehicleStarts"
              name="vehicleStarts"
              required
            >
              <option value="">Select an answer</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="sometimes">Sometimes</option>
              <option value="unknown">Not Sure</option>
            </select>
          </div>

          <div className="form-section-heading full-width">
            <h2>Service Details</h2>
            <p>Describe the repair and when you need assistance.</p>
          </div>

          <div className="form-group">
            <label htmlFor="service">Service Needed</label>

            <select id="service" name="service" required>
              <option value="">Select a service</option>
              <option value="diagnostic">Vehicle Diagnostic</option>
              <option value="brakes">Brake Repair</option>
              <option value="battery">Battery Replacement</option>
              <option value="alternator">Alternator Service</option>
              <option value="starter">Starter Service</option>
              <option value="oil-change">Oil Change</option>
              <option value="tune-up">Tune-Up</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="zipCode">Service ZIP Code</label>

            <input
              type="text"
              id="zipCode"
              name="zipCode"
              autoComplete="postal-code"
              inputMode="numeric"
              maxLength="10"
              placeholder="60517"
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

          <div className="form-group">
            <label htmlFor="preferredDate">
              Preferred Service Date
            </label>

            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              min={minimumDate}
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="message">Describe the Problem</label>

            <textarea
              id="message"
              name="message"
              rows="5"
              minLength="10"
              maxLength="1000"
              placeholder="Explain what is happening with the vehicle, including any warning lights, sounds, or recent repairs."
              required
            ></textarea>

            <small>Please include at least 10 characters.</small>
          </div>

          {submissionMessage && (
            <div
              className={`form-message ${submissionType}`}
              role={submissionType === "error" ? "alert" : "status"}
              aria-live="polite"
            >
              {submissionMessage}
            </div>
          )}

          <button
            type="submit"
            className="btn primary-btn submit-request-btn"
          >
            Submit Service Request
          </button>
        </form>
      </section>
    </main>
  );
}

export default Booking;