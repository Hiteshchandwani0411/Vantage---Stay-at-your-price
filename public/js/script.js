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

document.getElementById("image").onchange = function (evt) {
  const [file] = this.files;
  if (file) {
    // Preview wali image ki src change kar dega
    document.querySelector(".preview-img").src = URL.createObjectURL(file);
  }
};
