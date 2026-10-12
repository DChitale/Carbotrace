export const REGIONS = [
  {
    id: 'eu-north-1',
    name: 'Stockholm, Sweden',
    provider: 'AWS',
    intensity: 25,
    pue: 1.10,
    tier: 'clean',
    lat: 59.3293,
    lon: 18.0686,
    mix: { hydro: 45, nuclear: 40, wind: 12, solar: 3, fossil: 0 },
    recommendation: 'Top Tier Green Region. Recommended for zero-carbon workloads.'
  },
  {
    id: 'us-west-2',
    name: 'Oregon, USA',
    provider: 'AWS',
    intensity: 120,
    pue: 1.12,
    tier: 'clean',
    lat: 45.8399,
    lon: -119.7006,
    mix: { hydro: 60, wind: 20, gas: 15, solar: 5 },
    recommendation: 'Excellent low-carbon choice for North American deployments.'
  },
  {
    id: 'sa-east-1',
    name: 'São Paulo, Brazil',
    provider: 'AWS',
    intensity: 110,
    pue: 1.15,
    tier: 'clean',
    lat: -23.5505,
    lon: -46.6333,
    mix: { hydro: 70, wind: 15, biomass: 10, gas: 5 },
    recommendation: 'Cleanest South American cloud hub powered by hydro.'
  },
  {
    id: 'ca-central-1',
    name: 'Montreal, Canada',
    provider: 'AWS',
    intensity: 28,
    pue: 1.11,
    tier: 'clean',
    lat: 45.5017,
    lon: -73.5673,
    mix: { hydro: 94, wind: 5, solar: 1 },
    recommendation: 'Ultra-clean Canadian grid powered almost entirely by hydroelectric energy.'
  },
  {
    id: 'eu-west-1',
    name: 'Dublin, Ireland',
    provider: 'AWS',
    intensity: 290,
    pue: 1.16,
    tier: 'moderate',
    lat: 53.3498,
    lon: -6.2603,
    mix: { wind: 40, gas: 50, solar: 5, coal: 5 },
    recommendation: 'Moderate grid carbon intensity. High wind availability.'
  },
  {
    id: 'eu-central-1',
    name: 'Frankfurt, Germany',
    provider: 'AWS',
    intensity: 310,
    pue: 1.18,
    tier: 'moderate',
    lat: 50.1109,
    lon: 8.6821,
    mix: { solar: 25, wind: 25, coal: 25, gas: 25 },
    recommendation: 'Central European hub. Grid fluctuates with solar/wind.'
  },
  {
    id: 'us-east-1',
    name: 'N. Virginia, USA',
    provider: 'AWS',
    intensity: 380,
    pue: 1.15,
    tier: 'moderate',
    lat: 38.9072,
    lon: -77.0369,
    mix: { gas: 45, nuclear: 35, coal: 15, solar: 5 },
    recommendation: 'High capacity hub. Moderate carbon severity due to natural gas.'
  },
  {
    id: 'ap-southeast-1',
    name: 'Singapore',
    provider: 'AWS',
    intensity: 410,
    pue: 1.20,
    tier: 'high',
    lat: 1.3521,
    lon: 103.8198,
    mix: { gas: 95, solar: 5 },
    recommendation: 'High grid intensity. Heavily dependent on imported natural gas.'
  },
  {
    id: 'ap-northeast-1',
    name: 'Tokyo, Japan',
    provider: 'AWS',
    intensity: 450,
    pue: 1.22,
    tier: 'high',
    lat: 35.6762,
    lon: 139.6503,
    mix: { lng: 65, coal: 25, solar: 10 },
    recommendation: 'High carbon grid. Recommend scheduling off-peak batch jobs.'
  },
  {
    id: 'me-south-1',
    name: 'Bahrain',
    provider: 'AWS',
    intensity: 550,
    pue: 1.30,
    tier: 'high',
    lat: 26.0667,
    lon: 50.5577,
    mix: { gas: 98, solar: 2 },
    recommendation: 'High ambient heat requires additional cooling power (PUE 1.30).'
  },
  {
    id: 'ap-south-1',
    name: 'Mumbai, India',
    provider: 'AWS',
    intensity: 620,
    pue: 1.25,
    tier: 'high',
    lat: 19.0760,
    lon: 72.8777,
    mix: { coal: 70, hydro: 15, solar: 10, wind: 5 },
    recommendation: 'Highest carbon grid in region due to thermal coal dominance.'
  },
  {
    id: 'ap-southeast-2',
    name: 'Sydney, Australia',
    provider: 'AWS',
    intensity: 520,
    pue: 1.21,
    tier: 'high',
    lat: -33.8688,
    lon: 151.2093,
    mix: { coal: 65, gas: 15, solar: 12, wind: 8 },
    recommendation: 'High intensity grid undergoing renewable transition.'
  }
];

export function getTierBadge(tier, intensity) {
  if (tier === 'clean' || intensity < 150) {
    return {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      dot: '#10b981',
      label: 'Clean Grid (<150g)'
    };
  }
  if (tier === 'moderate' || intensity <= 400) {
    return {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      dot: '#f59e0b',
      label: 'Moderate (150-400g)'
    };
  }
  return {
    bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
    dot: '#f43f5e',
    label: 'High Carbon (>400g)'
  };
}
