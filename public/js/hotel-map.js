// hotel locations (latitude, longitude)
const hotelLocations = {
  "Wyndham Grand Manama": [26.2465253, 50.5769024],
  "Onyx Rotana": [26.24489, 50.5749948],
  "Raffles Al Areen Palace Bahrain": [26.0022717, 50.5188013],
  "The Mark Hotel": [26.2186187, 50.6102521],
  "ibis Seef Manama": [26.2296173, 50.5512079],
  "Tropicana Hotel": [26.2055562, 50.5857013],
};

const mapDiv = document.querySelector("#hotel-map");

if (mapDiv && window.L) {
  const hotelName = mapDiv.dataset.name;
  const location = hotelLocations[hotelName];

  if (location) {
    const map = L.map("hotel-map").setView(location, 15);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker(location).addTo(map).bindPopup(hotelName);
  } else {
    mapDiv.remove();
  }
}
