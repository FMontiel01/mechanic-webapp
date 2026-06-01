const bookingForm = document.querySelector("#bookingForm");

if (bookingForm) {
  bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    alert("Your service request has been submitted. We will contact you soon.");

    bookingForm.reset();
  });
}