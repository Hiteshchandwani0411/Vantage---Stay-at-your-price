(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false,
    );
  });
})();

// document.getElementById("image").onchange = function (evt) {
//   const [file] = this.files;
//   if (file) {
//     // Preview wali image ki src change kar dega
//     document.querySelector(".preview-img").src = URL.createObjectURL(file);
//   }
// };

// frontend-script.js
const wishlistButtons = document.querySelectorAll(".wishlist-btn");

// Helper function ko upar ya bahar rakhna better hai
function showFlashMessage(message, type) {
  const flashContainer = document.getElementById("flash-container") || document.body;
  const alertHtml = `<div class="alert alert-${type} alert-dismissible fade show fixed-top mx-auto mt-3" style="max-width: 500px; z-index: 9999;" role="alert">
                      ${message}
                      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
  flashContainer.insertAdjacentHTML("beforeend", alertHtml);
}

wishlistButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const listingId = button.getAttribute("data-id");
    const icon = button.querySelector("i");

    // 1. Loading State: Disable click temporary
    button.style.pointerEvents = "none";

    const isCurrentlyActive = button.classList.contains("active");
    const url = isCurrentlyActive
      ? `/user/wishlist/remove/${listingId}`
      : `/user/wishlist/add/${listingId}`;
    const method = isCurrentlyActive ? "DELETE" : "POST";

    try {
      // 2. Backend API Call
      const response = await fetch(url, { method: method });
      
      // Response ko sirf EK baar json mein convert karenge
      const result = await response.json();

      // 3. Check for unauthorized error (Not Logged In)
      if (response.status === 401) {
        // Yahan se dobara response.json() hata diya, 'result.error' direct use hoga
        showFlashMessage(result.error || "Please login first!", "danger");

        // 1.5 seconds ka wait karenge taaki user message padh le
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        return; 
      }

      // 4. Check if Request was Successful
      if (response.ok) {
        if (isCurrentlyActive) {
          button.classList.remove("active");
          icon.className = "fa-regular fa-heart"; // Empty Heart
        } else {
          button.classList.add("active");
          icon.className = "fa-solid fa-heart text-danger"; // Red Heart
        }
      } else {
        // Kisi aur error ke liye (jaise limit full hona)
        showFlashMessage(result.error || "Something went wrong!", "warning");
      }
    } catch (err) {
      console.error("Wishlist Error:", err);
    } finally {
      // 5. Reset Loading State
      button.style.pointerEvents = "auto";
    }
  });
});
