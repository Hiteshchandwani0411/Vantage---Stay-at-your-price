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
const wishlistButtons = document.querySelectorAll(".add-remove-wishlist");
const wishlistPageButtons = document.querySelectorAll(".remove-wishlist");

// Helper function ko upar ya bahar rakhna better hai
function showFlashMessage(message, type) {
  const flashContainer =
    document.getElementById("flash-container") || document.body;
  const alertHtml = `<div class="alert alert-${type} alert-dismissible fade show fixed-top mx-auto mt-3" style="max-width: 500px; z-index: 9999;" role="alert">
                      ${message}
                      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;
  flashContainer.insertAdjacentHTML("beforeend", alertHtml);

  setTimeout(() => {
    const alertElement = document.querySelector('.alert');
    if (alertElement) {
        alertElement.classList.remove('show');
        alertElement.remove();
    }
  }, 3000);
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
        showFlashMessage("Added to your Wishlist!", "success");
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

wishlistPageButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();

    const listingId = button.getAttribute("data-id");
    const url = `/user/wishlist/remove/${listingId}`;

    // Double click protection
    button.style.pointerEvents = "none";

    try {
      // Backend par DELETE request bhejenge
      const response = await fetch(url, { method: "DELETE" });
      const result = await response.json();

      if (response.ok) {
        // 1. Screen par se us listing ka pura card dhoondho
        const cardToRemove = document.getElementById(`card-${listingId}`);

        if (cardToRemove) {
          // Professional Touch: Pehle card ko fade-out karo fir remove karo
          cardToRemove.style.transition = "all 0.4s ease";
          cardToRemove.style.opacity = "0";
          cardToRemove.style.transform = "scale(0.9)";

          setTimeout(() => {
            cardToRemove.remove(); // 0.4s baad complete DOM se delete

            // 2. Check agar saare cards khatam ho gaye toh "Wishlist khali hai" ka message dikhao
            const remainingCards = document.querySelectorAll(
              ".wishlist-item",
            );
            if (remainingCards.length === 0) {
              const grid = document.querySelector(".wishlist-grid");
              if (grid) grid.innerHTML = "<p>Your wishlist is Empty.</p>";
            }
          }, 400);
        }

        // 3. Success Flash Message dikhao
        showFlashMessage("Item removed from wishlist successfully!", "success");
      } else {
        showFlashMessage(result.error || "Could not remove item", "warning");
        button.style.pointerEvents = "auto"; // Error aane par button fir se clickable ho jaye
      }
    } catch (err) {
      console.error("Wishlist Page Error:", err);
      button.style.pointerEvents = "auto";
    }
  });
});
