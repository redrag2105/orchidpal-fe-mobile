import { Plant, Device } from '@/types/garden.types';

export const ZONE_FILTERS = ['All', 'Need plants', 'Need device', 'Fully Linked'];

export const MOCK_PLANTS: any[] = [
  { id: 'p1', nickname: 'Luna', species_wiki: { common_name: 'Phalaenopsis amabilis', scientific_name: 'Sci Phalaenopsis amabilis', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1587223075055-82e9a937ddff?auto=format&fit=crop&q=80&w=300', zone_id: 'z1', planted_at: '2025-01-15', health_status: 'GOOD' },
  { id: 'p2', nickname: 'Sunny', species_wiki: { common_name: 'Dendrobium nobile', scientific_name: 'Sci Dendrobium nobile', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1599388102462-8e7c1a84fbe3?auto=format&fit=crop&q=80&w=300', zone_id: 'z3', planted_at: '2025-02-20', health_status: 'WARNING' },
  { id: 'p3', nickname: 'Ghost', species_wiki: { common_name: 'Vanda coerulea', scientific_name: 'Sci Vanda coerulea', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1621460309191-53697ebbb5c2?auto=format&fit=crop&q=80&w=300', zone_id: null, planted_at: '2026-03-01', health_status: 'GOOD' },
  { id: 'p4', nickname: 'Spikey', species_wiki: { common_name: 'Phalaenopsis amabilis', scientific_name: 'Sci Phalaenopsis amabilis', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1588626572714-bd108c9dd20b?auto=format&fit=crop&q=80&w=300', zone_id: 'z4', planted_at: '2025-05-10', health_status: 'GOOD' },
  { id: 'p5', nickname: 'Pinky', species_wiki: { common_name: 'Dendrobium nobile', scientific_name: 'Sci Dendrobium nobile', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?auto=format&fit=crop&q=80&w=300', zone_id: 'z6', planted_at: '2025-08-12', health_status: 'GOOD' },
  { id: 'p6', nickname: 'Sky', species_wiki: { common_name: 'Vanda coerulea', scientific_name: 'Sci Vanda coerulea', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1416879572624-9b2ee37f1911?auto=format&fit=crop&q=80&w=300', zone_id: 'z7', planted_at: '2025-09-01', health_status: 'WARNING' },
  { id: 'p7', nickname: 'Ruby', species_wiki: { common_name: 'Phalaenopsis amabilis', scientific_name: 'Sci Phalaenopsis amabilis', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1587223075055-82e9a937ddff?auto=format&fit=crop&q=80&w=300', zone_id: 'z9', planted_at: '2025-10-15', health_status: 'GOOD' },
  { id: 'p8', nickname: 'Jade', species_wiki: { common_name: 'Dendrobium nobile', scientific_name: 'Sci Dendrobium nobile', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1599388102462-8e7c1a84fbe3?auto=format&fit=crop&q=80&w=300', zone_id: 'z5', planted_at: '2025-11-20', health_status: 'GOOD' },
  { id: 'p9', nickname: 'Pearl', species_wiki: { common_name: 'Vanda coerulea', scientific_name: 'Sci Vanda coerulea', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1621460309191-53697ebbb5c2?auto=format&fit=crop&q=80&w=300', zone_id: 'z10', planted_at: '2026-01-05', health_status: 'WARNING' },
  { id: 'p10', nickname: 'Onyx', species_wiki: { common_name: 'Phalaenopsis amabilis', scientific_name: 'Sci Phalaenopsis amabilis', ideal_temp_min: 15, ideal_temp_max: 35, ideal_humid_min: 60, ideal_humid_max: 80, care_instruction: 'care' }, image_url: 'https://images.unsplash.com/photo-1588626572714-bd108c9dd20b?auto=format&fit=crop&q=80&w=300', zone_id: null, planted_at: '2026-02-14', health_status: 'GOOD' },
]

export const MOCK_DEVICES: Device[] = [
  { id: 'd1', serial_number: 'ESP-1001', status: 'ONLINE', hardware_config: { relays: { relay_1: 'pump', relay_2: 'fan', relay_3: 'null', relay_4: 'null' }, sensors: { light: true, humidity: true, temperature: true, soil_moisture: true } }, zone_id: 'z1' },
  { id: 'd2', serial_number: 'ESP-1002', status: 'OFFLINE', hardware_config: { relays: { relay_1: 'pump', relay_2: 'fan', relay_3: 'null', relay_4: 'null' }, sensors: { light: true, humidity: true, temperature: true, soil_moisture: true } }, zone_id: 'z3' },
  { id: 'd3', serial_number: 'ESP-1003', status: 'ONLINE', hardware_config: { relays: { relay_1: 'pump', relay_2: 'fan', relay_3: 'null', relay_4: 'null' }, sensors: { light: true, humidity: true, temperature: true, soil_moisture: true } }, zone_id: null },
]

export const WIKI_DATA = {
  'Phalaenopsis amabilis': { sci_name: 'Phalaenopsis amabilis', min_temp: 18, max_temp: 28, min_hum: 50, max_hum: 70, care: 'Thrives in indirect light. Keep moderately moist but not soggy.' },
  'Dendrobium nobile': { sci_name: 'Dendrobium nobile', min_temp: 15, max_temp: 30, min_hum: 40, max_hum: 60, care: 'Requires distinct dry winter rest period to induce blooming.' },
  'Vanda coerulea': { sci_name: 'Vanda coerulea', min_temp: 20, max_temp: 35, min_hum: 60, max_hum: 80, care: 'Needs bright light and high humidity. Roots must dry quickly.' }
}

export const MOCK_RULES = [
    { id: 'r1', name: 'Auto rule - Phalaenopsis (Spring)', is_active: true, logic_config: [{ if: { op: '<', value: 60, metric: 'humidity' }, then: { action: 'pump', duration_ms: 10000 } }] },
    { id: 'r2', name: 'Heat protection', is_active: true, logic_config: [{ if: { op: '>', value: 35, metric: 'temperature' }, then: { action: 'fan', duration_ms: 20000 } }] },
    { id: 'r3', name: 'Night light', is_active: true, logic_config: [{ if: { op: '<', value: 20, metric: 'light' }, then: { action: 'light', duration_ms: 3600000 } }] }
]