export interface Location {
  id: string;
  name: string;
  nameEn: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image: string;
  video: string;
  specs: {
    size: string;
    gateHeight: string;
    electricity: string;
    heated: boolean;
  };
}

export const locations: Location[] = [
  {
    id: 'riga',
    name: 'Rīga',
    nameEn: 'Riga',
    address: 'Krustpils 31, Pļavnieki, Rīga',
    coordinates: {
      lat: 56.9253,
      lng: 24.1821,
    },
    image: '/locations/riga-image.jpg',
    video: '/locations/riga-video.mp4',
    specs: {
      size: '3m × 6m (18 m²)',
      gateHeight: '2 meters',
      electricity: '3A available',
      heated: true,
    },
  },
  {
    id: 'rigas-rajons',
    name: 'Rīgas Rajons',
    nameEn: 'Riga Region',
    address: 'Salaspils, Rīgas Rajons',
    coordinates: {
      lat: 56.8608,
      lng: 24.3485,
    },
    image: '/locations/rigas-rajons-image.png',
    video: '/locations/rigas-rajons-video.mp4',
    specs: {
      size: '4m × 7m (28 m²)',
      gateHeight: '2.2 meters',
      electricity: '5A available',
      heated: true,
    },
  },
  {
    id: 'pinki',
    name: 'Piņķi',
    nameEn: 'Pinki',
    address: 'Piņķi, Babītes novads',
    coordinates: {
      lat: 56.9479,
      lng: 23.9115,
    },
    image: '/locations/pinki-image.png',
    video: '/locations/pinki-video.mp4',
    specs: {
      size: '3.5m × 6.5m (23 m²)',
      gateHeight: '2.1 meters',
      electricity: '4A available',
      heated: true,
    },
  },
];

export const getLocationById = (id: string): Location | undefined => {
  return locations.find((loc) => loc.id === id);
};
