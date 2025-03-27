'use client';

import { useEffect, useRef, useState } from 'react';

interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry?: google.maps.places.PlaceGeometry;
}

interface GooglePlacesSearchProps {
  onPlaceSelect: (place: Place) => void;
}

export default function GooglePlacesSearch({ onPlaceSelect }: GooglePlacesSearchProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [infowindow, setInfowindow] = useState<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    const initMap = async () => {
      if (typeof window !== 'undefined' && window.google && mapRef.current) {
        // Inicjalizacja mapy
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 52.2297, lng: 21.0122 }, // Centrum Polski
          zoom: 6,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });
        setMap(map);

        // Inicjalizacja okna informacyjnego
        const infowindow = new google.maps.InfoWindow();
        setInfowindow(infowindow);

        // Inicjalizacja markera
        const marker = new google.maps.Marker({
          map: map,
          draggable: false,
        });
        setMarker(marker);

        // Inicjalizacja autouzupełniania
        if (inputRef.current) {
          const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            fields: ['place_id', 'geometry', 'formatted_address', 'name'],
          });

          autocomplete.bindTo('bounds', map);

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            
            if (!place.geometry || !place.geometry.location) {
              console.log('Nie można znaleźć szczegółów dla wybranego miejsca.');
              return;
            }

            // Dostosuj mapę
            if (place.geometry.viewport) {
              map.fitBounds(place.geometry.viewport);
            } else {
              map.setCenter(place.geometry.location);
              map.setZoom(17);
            }

            // Ustaw marker
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            // Aktualizuj okno informacyjne
            const content = `
              <div>
                <h3>${place.name || ''}</h3>
                <p>${place.formatted_address || ''}</p>
                <p>Place ID: ${place.place_id || ''}</p>
              </div>
            `;
            infowindow.setContent(content);
            infowindow.open(map, marker);

            // Wywołaj callback tylko jeśli mamy wszystkie wymagane dane
            if (place.place_id && place.name && place.formatted_address) {
              onPlaceSelect({
                place_id: place.place_id,
                name: place.name,
                formatted_address: place.formatted_address,
                geometry: place.geometry
              });
            }
          });
        }
      }
    };

    initMap();
  }, [onPlaceSelect]);

  return (
    <div className="w-full h-full min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Wpisz nazwę swojej firmy..."
            className="w-full p-3 pl-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div 
          ref={mapRef} 
          className="w-full h-[600px] rounded-lg shadow-lg"
          style={{ position: 'relative' }}
        />
      </div>
    </div>
  );
} 