export interface SpeciesWiki {
  id?: string;
  common_name: string;
  scientific_name: string;
  ideal_temp_min: number;
  ideal_temp_max: number;
  ideal_humid_min: number;
  ideal_humid_max: number;
  care_instruction: string;
  image_url?: string | null;
  author_id?: string;
}

export interface PlantingZone {
  id: string;
  user_id?: string;
  name: string;
  exposure?: string;
  location_city?: string;
  image_url?: string | null;
  created_at?: string;
}

export interface Plant {
  id: string;
  user_id?: string;
  nickname: string;
  species_id?: string;
  species_wiki: SpeciesWiki;
  image_url: string | null;
  zone_id: string | null;
  planted_at: string;
  health_status: string;
  created_at?: string;
  planting_zones?: PlantingZone;
}

export interface DeviceConfig {
  relays: {
    relay_1: string;
    relay_2: string;
    relay_3: string;
    relay_4: string;
  };
  sensors: {
    light: boolean;
    humidity: boolean;
    temperature: boolean;
    soil_moisture: boolean;
  };
}

export interface Device {
  id: string;
  serial_number: string;
  status: string;
  hardware_config: DeviceConfig;
  zone_id: string | null;
}
