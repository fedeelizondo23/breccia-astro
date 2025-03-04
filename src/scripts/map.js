import L from "leaflet";

document.addEventListener("DOMContentLoaded", function () {
  const latitude = 25.6866; // Latitud de la empresa
  const longitude = -100.3161; // Longitud de la empresa

  const mapContainer = document.getElementById("map");

  if (!mapContainer) {
    console.error("No se encontró el contenedor del mapa.");
    return;
  }

  // Inicializar Leaflet
  const map = L.map("map").setView([latitude, longitude], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a>',
  }).addTo(map);

  L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup("📍 Breccia Mármol - Visítanos aquí")
    .openPopup();

  // Forzar a Leaflet a redibujar el mapa después de 500ms
  setTimeout(() => {
    map.invalidateSize();
  }, 500);
});
