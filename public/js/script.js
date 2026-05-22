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

var map = L.map("map", { dragging: false }).setView([20.5937, 78.9629], 9); // India coordinates

// 2. TILE LAYER ADD KARO (Ye sabse important hai!)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var marker = L.marker([20.5937, 78.9629]).addTo(map);
marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("You clicked the map at " + e.latlng.toString())
    .openOn(map);
}

map.on("click", onMapClick);
