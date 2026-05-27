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

wishlistButtons.forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const listingId = button.getAttribute("data-id");
    const icon = button.querySelector("i");

    // 1. Loading State: Disable click temporary
    button.style.pointerEvents = "none";

    // Check ki current state kya hai (add karna hai ya remove)
    const isCurrentlyActive = button.classList.contains("active");
    const url = isCurrentlyActive
      ? `/user/wishlist/remove/${listingId}`
      : `/user/wishlist/add/${listingId}`;
    const method = isCurrentlyActive ? "DELETE" : "POST";

    try {
      // 2. Backend API Call
      const response = await fetch(url, { method: method });
      const result = await response.json();

      if (response.ok) {
        // 3. UI Update (Bina page reload kiye)
        if (isCurrentlyActive) {
          button.classList.remove("active");
          icon.className = "fa-regular fa-heart"; // Empty Heart
        } else {
          button.classList.add("active");
          icon.className = "fa-solid fa-heart text-danger"; // Red Heart
        }
      } else {
        alert(result.error || "Something went wrong!");
      }
      console.log(response);
    } catch (err) {
      console.error("Wishlist Error:", err);
    } finally {
      // 4. Reset Loading State
      button.style.pointerEvents = "auto";
    }
  });
});
