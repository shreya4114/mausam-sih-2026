import React, { useState, useEffect, useMemo } from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  Activity,
  Plane,
  Users,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Bell,
  User,
  Zap,
  Info,
  Compass,
  Layers,
  Heart,
  Sprout,
  Car,
  Waves,
  ArrowRight,
  Filter,
  Check,
  Umbrella,
  Shirt,
  Luggage,
  Tent,
  Smile,
  Shield,
  Eye,
  Sliders,
  Sparkles,
  ExternalLink,
  ChevronUp,
  X,
  HelpCircle,
  Gauge,
  SlidersHorizontal,
  Share2,
  RotateCcw
} from 'lucide-react';

// Persona configurations tailored for SIH evaluation context
const PERSONAS = {
  fitness: {
    id: 'fitness',
    name: 'Fitness',
    role: 'Runners, Cyclists & Athletes',
    icon: Activity,
    emoji: '🏃',
    color: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    activeTabColor: 'bg-amber-500 text-slate-950 font-bold',
    description: 'Prioritizes heat index, wet-bulb temp, AQI, and UV radiation for workout timing.',
    implemented: true,
  },
  traveler: {
    id: 'traveler',
    name: 'Traveler',
    role: 'Commuters, Tourists & Drivers',
    icon: Plane,
    emoji: '✈️',
    color: 'from-blue-500 to-cyan-600',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    activeTabColor: 'bg-blue-500 text-slate-950 font-bold',
    description: 'Prioritizes flight delays, road visibility, flash rain probability, and transit packing.',
    implemented: true,
  },
  family: {
    id: 'family',
    name: 'Family',
    role: 'Parents, Children & Seniors',
    icon: Users,
    emoji: '👨‍👩‍👧',
    color: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    activeTabColor: 'bg-emerald-500 text-slate-950 font-bold',
    description: 'Prioritizes school drop-off safety, kids play windows, extreme heat, and respiratory AQI.',
    implemented: true,
  },
  event: {
    id: 'event',
    name: 'Event Planner',
    role: 'Weddings, Outdoor Expo & Stage Ops',
    icon: Calendar,
    emoji: '🎉',
    color: 'from-purple-500 to-pink-600',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    activeTabColor: 'bg-purple-500 text-slate-950 font-bold',
    description: 'Prioritizes wind gust thresholds for tents, precipitation windows, and guest heat index.',
    implemented: true,
  },
  health: { id: 'health', name: 'Health', emoji: '❤️', implemented: false },
  agriculture: { id: 'agriculture', name: 'Agriculture', emoji: '🌱', implemented: false },
  commuter: { id: 'commuter', name: 'Commuter', emoji: '🚗', implemented: false },
  marine: { id: 'marine', name: 'Coastal/Marine', emoji: '🌊', implemented: false },
};

// Official IMD alert standard color helper
const ALERT_COLORS = {
  Green: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', tag: 'bg-emerald-500 text-slate-950' },
  Yellow: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', tag: 'bg-amber-500 text-slate-950' },
  Orange: { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/40', tag: 'bg-orange-500 text-slate-950' },
  Red: { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/50', tag: 'bg-rose-600 text-white animate-pulse' },
};

// Realistic mock locations with live IMD weather parameters
const MOCK_LOCATIONS = {
  Delhi: {
    name: 'Delhi NCR',
    state: 'National Capital Territory',
    temp: 34,
    feelsLike: 39,
    condition: 'Thunderstorm Warning',
    conditionType: 'thunderstorm',
    humidity: 76,
    windSpeed: 22,
    windDirection: 'NE',
    rainProbability: 70,
    uvIndex: 8,
    aqi: 182,
    aqiStatus: 'Unhealthy (Sensitive Groups)',
    sunrise: '06:04 AM',
    sunset: '06:46 PM',
    alertLevel: 'Orange',
    alertMessage: 'Prototype Alert: Severe evening squall risk with strong winds & localized rain.',
    hourly: [
      { time: '06:00 AM', temp: 27, rain: 10, uv: 1, aqi: 150, wind: 8 },
      { time: '09:00 AM', temp: 30, rain: 15, uv: 5, aqi: 165, wind: 10 },
      { time: '12:00 PM', temp: 34, rain: 25, uv: 9, aqi: 180, wind: 14 },
      { time: '03:00 PM', temp: 35, rain: 45, uv: 7, aqi: 185, wind: 18 },
      { time: '06:00 PM', temp: 31, rain: 80, uv: 2, aqi: 170, wind: 32 },
      { time: '09:00 PM', temp: 28, rain: 60, uv: 0, aqi: 155, wind: 22 },
    ],
    forecast7Days: [
      { day: 'Today', max: 35, min: 27, condition: 'Thunderstorm', rain: 70 },
      { day: 'Thu', max: 33, min: 26, condition: 'Moderate Rain', rain: 75 },
      { day: 'Fri', max: 32, min: 25, condition: 'Partly Cloudy', rain: 30 },
      { day: 'Sat', max: 34, min: 26, condition: 'Sunny Spells', rain: 10 },
      { day: 'Sun', max: 36, min: 27, condition: 'Clear & Hot', rain: 5 },
      { day: 'Mon', max: 35, min: 27, condition: 'Passing Showers', rain: 40 },
      { day: 'Tue', max: 33, min: 26, condition: 'Cloudy', rain: 20 },
    ]
  },
  Mumbai: {
    name: 'Mumbai',
    state: 'Maharashtra',
    temp: 31,
    feelsLike: 38,
    condition: 'Heavy Monsoon Rain',
    conditionType: 'rain',
    humidity: 88,
    windSpeed: 28,
    windDirection: 'SW',
    rainProbability: 90,
    uvIndex: 5,
    aqi: 48,
    aqiStatus: 'Good Air Quality',
    sunrise: '06:22 AM',
    sunset: '07:01 PM',
    alertLevel: 'Orange',
    alertMessage: 'Prototype Alert: High tide and persistent heavy rain may disrupt outdoor plans.',
    hourly: [
      { time: '06:00 AM', temp: 28, rain: 75, uv: 1, aqi: 40, wind: 22 },
      { time: '09:00 AM', temp: 29, rain: 85, uv: 3, aqi: 45, wind: 26 },
      { time: '12:00 PM', temp: 31, rain: 90, uv: 5, aqi: 52, wind: 30 },
      { time: '03:00 PM', temp: 30, rain: 95, uv: 3, aqi: 50, wind: 34 },
      { time: '06:00 PM', temp: 29, rain: 80, uv: 0, aqi: 48, wind: 28 },
      { time: '09:00 PM', temp: 28, rain: 70, uv: 0, aqi: 42, wind: 24 },
    ],
    forecast7Days: [
      { day: 'Today', max: 31, min: 27, condition: 'Heavy Rain', rain: 90 },
      { day: 'Thu', max: 30, min: 26, condition: 'Torrential Rain', rain: 95 },
      { day: 'Fri', max: 30, min: 26, condition: 'Continuous Rain', rain: 85 },
      { day: 'Sat', max: 31, min: 27, condition: 'Moderate Showers', rain: 60 },
      { day: 'Sun', max: 32, min: 27, condition: 'Passing Rain', rain: 45 },
      { day: 'Mon', max: 31, min: 26, condition: 'Monsoon Showers', rain: 80 },
      { day: 'Tue', max: 30, min: 26, condition: 'Monsoon Rain', rain: 85 },
    ]
  },
  Bengaluru: {
    name: 'Bengaluru',
    state: 'Karnataka',
    temp: 24,
    feelsLike: 24,
    condition: 'Pleasant & Breezy',
    conditionType: 'cloudy',
    humidity: 62,
    windSpeed: 18,
    windDirection: 'W',
    rainProbability: 20,
    uvIndex: 6,
    aqi: 36,
    aqiStatus: 'Good Air Quality',
    sunrise: '06:09 AM',
    sunset: '06:33 PM',
    alertLevel: 'Green',
    alertMessage: 'Prototype Status: Mild weather conditions with low rain probability.',
    hourly: [
      { time: '06:00 AM', temp: 19, rain: 10, uv: 1, aqi: 30, wind: 12 },
      { time: '09:00 AM', temp: 22, rain: 15, uv: 5, aqi: 34, wind: 16 },
      { time: '12:00 PM', temp: 25, rain: 20, uv: 7, aqi: 40, wind: 20 },
      { time: '03:00 PM', temp: 24, rain: 25, uv: 4, aqi: 38, wind: 18 },
      { time: '06:00 PM', temp: 22, rain: 15, uv: 0, aqi: 35, wind: 15 },
      { time: '09:00 PM', temp: 20, rain: 10, uv: 0, aqi: 32, wind: 12 },
    ],
    forecast7Days: [
      { day: 'Today', max: 25, min: 19, condition: 'Pleasant & Breezy', rain: 20 },
      { day: 'Thu', max: 24, min: 18, condition: 'Light Drizzle', rain: 30 },
      { day: 'Fri', max: 25, min: 19, condition: 'Partly Cloudy', rain: 15 },
      { day: 'Sat', max: 26, min: 19, condition: 'Sunny Spells', rain: 10 },
      { day: 'Sun', max: 26, min: 20, condition: 'Clear Sky', rain: 5 },
      { day: 'Mon', max: 25, min: 19, condition: 'Passing Clouds', rain: 20 },
      { day: 'Tue', max: 24, min: 18, condition: 'Breezy', rain: 25 },
    ]
  }
};

/**
 * DETERMINISTIC PERSONALIZATION ENGINE
 * Converts raw meteorological metrics into contextual decisions per persona.
 */

function runPersonalizationEngine(weather, personaId) {
  const temp = weather.temp;
  const feelsLike = weather.feelsLike;
  const humidity = weather.humidity;
  const wind = weather.windSpeed;
  const rain = weather.rainProbability;
  const uv = weather.uvIndex;
  const aqi = weather.aqi;

  // -------------------------------------------------------
  // Helper functions
  // -------------------------------------------------------

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  const heatScore = clamp(
    ((feelsLike - 28) / 15) * 100,
    0,
    100
  );

  const rainScore = clamp(rain, 0, 100);

  const windScore = clamp(
    ((wind - 15) / 35) * 100,
    0,
    100
  );

  const uvScore = clamp(
    ((uv - 3) / 8) * 100,
    0,
    100
  );

  const aqiScore = clamp(
    ((aqi - 50) / 200) * 100,
    0,
    100
  );

  // -------------------------------------------------------
  // Persona-specific analysis
  // -------------------------------------------------------

  let riskScore = 0;
  let headline = "";
  let recommendation = "";
  let bestWindow = "";
  let why = "";
  let priorityMetrics = [];
  let gear = [];
  let timeline = [];

  // =========================
  // FITNESS
  // =========================

  if (personaId === "fitness") {
    riskScore =
      heatScore * 0.30 +
      aqiScore * 0.25 +
      uvScore * 0.15 +
      rainScore * 0.20 +
      windScore * 0.10;

    if (riskScore >= 70) {
      headline = "Outdoor workout is not recommended right now.";
      recommendation =
        "Choose an indoor workout or move your session to a cooler, cleaner time window.";
    } else if (riskScore >= 45) {
      headline = "Outdoor workout needs caution.";
      recommendation =
        "Keep the session shorter, reduce intensity and avoid peak heat.";
    } else {
      headline = "Good conditions for outdoor activity.";
      recommendation =
        "Outdoor training is reasonable with normal hydration and weather precautions.";
    }

    if (rain >= 60) {
      bestWindow = "Wait for a lower-rain window";
    } else if (feelsLike >= 36) {
      bestWindow = "Early morning · 6:00–8:00 AM";
    } else {
      bestWindow = "Morning or evening · 6:00–9:00 AM / 6:00–8:00 PM";
    }

    priorityMetrics = [
      {
        label: "Heat stress",
        value: `${feelsLike}°C`,
        sub: feelsLike >= 36 ? "High heat load" : "Manageable heat",
        highlight: feelsLike >= 36
      },
      {
        label: "Air quality",
        value: `AQI ${aqi}`,
        sub: aqi > 150 ? "Poor air" : aqi > 100 ? "Moderate" : "Good air",
        highlight: aqi > 100
      },
      {
        label: "UV exposure",
        value: `UV ${uv}`,
        sub: uv >= 7 ? "High exposure" : uv >= 4 ? "Moderate" : "Low",
        highlight: uv >= 7
      },
      {
        label: "Rain probability",
        value: `${rain}%`,
        sub: rain >= 60 ? "High disruption" : rain >= 30 ? "Possible rain" : "Low",
        highlight: rain >= 60
      }
    ];

    why =
      `${temp}°C feels like ${feelsLike}°C, humidity is ${humidity}%, ` +
      `AQI is ${aqi}, UV is ${uv}, and rain probability is ${rain}%. ` +
      `These factors are combined to estimate outdoor workout suitability.`;

    gear = [
      "Water bottle",
      "Light breathable clothing",
      uv >= 6 ? "Sunscreen / cap" : "Normal outdoor protection",
      aqi > 100 ? "Consider an indoor alternative" : "Running/cycling gear"
    ];

    timeline = [
      "Avoid the hottest part of the day.",
      rain >= 50
        ? "Keep an eye on changing rain conditions."
        : "Conditions are relatively stable.",
      aqi > 100
        ? "Prefer cleaner-air periods for intense exercise."
        : "Air quality is suitable for normal activity."
    ];
  }

  // =========================
  // TRAVELER
  // =========================

  else if (personaId === "traveler") {
    riskScore =
      rainScore * 0.40 +
      windScore * 0.25 +
      heatScore * 0.15 +
      uvScore * 0.10 +
      aqiScore * 0.10;

    if (riskScore >= 70) {
      headline = "Travel conditions may be significantly disrupted.";
      recommendation =
        "Allow extra travel time and avoid unnecessary outdoor movement during the highest-risk period.";
    } else if (riskScore >= 45) {
      headline = "Travel is possible with precautions.";
      recommendation =
        "Keep buffer time, carry rain protection and monitor changing conditions.";
    } else {
      headline = "Travel conditions look manageable.";
      recommendation =
        "Normal travel precautions should be sufficient.";
    }

    bestWindow =
      rain >= 60
        ? "Prefer travel during the lowest-rain period"
        : "Current conditions are suitable for travel";

    priorityMetrics = [
      {
        label: "Rain disruption",
        value: `${rain}%`,
        sub: rain >= 60 ? "High disruption" : rain >= 30 ? "Possible delay" : "Low",
        highlight: rain >= 60
      },
      {
        label: "Wind",
        value: `${wind} km/h`,
        sub: wind >= 35 ? "Strong winds" : wind >= 20 ? "Moderate" : "Light",
        highlight: wind >= 30
      },
      {
        label: "Feels like",
        value: `${feelsLike}°C`,
        sub: feelsLike >= 38 ? "Very uncomfortable" : "Travel comfort",
        highlight: feelsLike >= 38
      }
    ];

    why =
      `Travel advice considers rain probability (${rain}%), wind (${wind} km/h), ` +
      `feels-like temperature (${feelsLike}°C) and air quality (${aqi}).`;

    gear = [
      rain >= 40 ? "Umbrella / rain jacket" : "Normal travel gear",
      "Phone + power bank",
      "Water bottle",
      wind >= 30 ? "Secure loose belongings" : "Light bag"
    ];

    timeline = [
      rain >= 60
        ? "Plan a buffer around expected rainfall."
        : "No major rain-related disruption expected.",
      wind >= 30
        ? "Expect stronger winds in exposed areas."
        : "Wind conditions are manageable.",
      "Check local transport conditions before departure."
    ];
  }

  // =========================
  // FAMILY
  // =========================

  else if (personaId === "family") {
    riskScore =
      heatScore * 0.30 +
      aqiScore * 0.30 +
      rainScore * 0.20 +
      uvScore * 0.20;

    if (riskScore >= 70) {
      headline = "Outdoor family activities should be limited.";
      recommendation =
        "Prefer indoor activities and avoid prolonged outdoor exposure during peak-risk hours.";
    } else if (riskScore >= 45) {
      headline = "Outdoor activities need some caution.";
      recommendation =
        "Short outdoor activities are okay during the safer time window.";
    } else {
      headline = "Family outdoor activities look comfortable.";
      recommendation =
        "Good conditions for normal outdoor activities with basic precautions.";
    }

    if (feelsLike >= 36) {
      bestWindow = "Early morning · 7:00–9:00 AM";
    } else if (rain >= 60) {
      bestWindow = "Use the dry window between showers";
    } else {
      bestWindow = "Morning / evening";
    }

    priorityMetrics = [
      {
        label: "Heat",
        value: `${feelsLike}°C`,
        sub: feelsLike >= 36 ? "High heat" : "Comfortable",
        highlight: feelsLike >= 36
      },
      {
        label: "Air quality",
        value: `AQI ${aqi}`,
        sub: aqi > 150 ? "Poor air" : aqi > 100 ? "Moderate" : "Good air",
        highlight: aqi > 100
      },
      {
        label: "Rain",
        value: `${rain}%`,
        sub: rain >= 60 ? "High chance" : "Low–moderate",
        highlight: rain >= 60
      },
      {
        label: "UV",
        value: `UV ${uv}`,
        sub: uv >= 7 ? "High exposure" : "Moderate",
        highlight: uv >= 7
      }
    ];

    why =
      `Family recommendations combine heat, air quality, UV exposure and ` +
      `rain risk to identify safer periods for children and other family members.`;

    gear = [
      "Water bottle",
      feelsLike >= 32 ? "Cap / light clothing" : "Comfortable clothing",
      uv >= 6 ? "Sunscreen" : "Normal protection",
      rain >= 40 ? "Umbrella / rain protection" : "Normal outdoor essentials"
    ];

    timeline = [
      feelsLike >= 35
        ? "Avoid prolonged outdoor activity during peak heat."
        : "Temperature remains manageable.",
      aqi > 100
        ? "Prefer indoor activities during poor-air periods."
        : "Air quality is suitable for normal outdoor activity.",
      rain >= 50
        ? "Keep outdoor plans flexible."
        : "Outdoor plans can remain mostly unchanged."
    ];
  }

  // =========================
  // EVENT PLANNER
  // =========================

  else if (personaId === "event") {
    riskScore =
      rainScore * 0.40 +
      windScore * 0.30 +
      heatScore * 0.20 +
      uvScore * 0.10;

    if (riskScore >= 70) {
      headline = "Outdoor event conditions are high-risk.";
      recommendation =
        "Prepare an indoor backup plan and secure temporary structures before the event.";
    } else if (riskScore >= 45) {
      headline = "Outdoor event is possible with precautions.";
      recommendation =
        "Strengthen contingency planning and choose the safest setup window.";
    } else {
      headline = "Conditions are favorable for an outdoor event.";
      recommendation =
        "Normal event preparations should be sufficient.";
    }

    if (rain >= 60) {
      bestWindow = "Choose the lowest-rain setup window";
    } else if (wind >= 30) {
      bestWindow = "Complete temporary-structure setup before stronger winds";
    } else {
      bestWindow = "Current conditions are suitable for setup";
    }

    priorityMetrics = [
      {
        label: "Rain risk",
        value: `${rain}%`,
        sub: rain >= 60 ? "High event risk" : "Manageable",
        highlight: rain >= 60
      },
      {
        label: "Wind",
        value: `${wind} km/h`,
        sub: wind >= 35 ? "Strong gust risk" : "Manageable",
        highlight: wind >= 30
      },
      {
        label: "Guest comfort",
        value: `${feelsLike}°C`,
        sub: feelsLike >= 36 ? "High heat" : "Comfortable",
        highlight: feelsLike >= 36
      }
    ];

    why =
      `Event planning prioritizes precipitation (${rain}%), wind (${wind} km/h), ` +
      `and guest comfort (${feelsLike}°C) because these factors directly affect ` +
      `outdoor structures, setup and attendee comfort.`;

    gear = [
      rain >= 40 ? "Rain backup / waterproof covers" : "Standard event setup",
      wind >= 25 ? "Secure tents and temporary structures" : "Standard structure checks",
      feelsLike >= 32 ? "Water stations" : "Normal guest facilities",
      "Indoor contingency plan"
    ];

    timeline = [
      wind >= 30
        ? "Inspect and secure tents, banners and stage structures."
        : "Normal structure inspection is sufficient.",
      rain >= 50
        ? "Keep a rain contingency window available."
        : "Rain disruption risk is relatively manageable.",
      feelsLike >= 34
        ? "Provide shaded/rest areas for guests."
        : "Guest thermal comfort should be manageable."
    ];
  }

  // -------------------------------------------------------
  // Convert numerical risk into an understandable level
  // -------------------------------------------------------

  let riskLevel;
  let riskBadge;

  if (riskScore >= 70) {
    riskLevel = "High";
    riskBadge = "Red";
  } else if (riskScore >= 45) {
    riskLevel = "Moderate";
    riskBadge = "Orange";
  } else if (riskScore >= 25) {
    riskLevel = "Low";
    riskBadge = "Yellow";
  } else {
    riskLevel = "Favorable";
    riskBadge = "Green";
  }

  const decisionFactors = [];

  if (feelsLike >= 36) {
    decisionFactors.push({
      icon: "🌡️",
      label: "Heat stress",
      value: `${feelsLike}°C feels like`,
      impact: "High",
      reason: "Elevated apparent temperature can reduce outdoor comfort."
    });
  } else if (feelsLike >= 32) {
    decisionFactors.push({
      icon: "🌡️",
      label: "Heat",
      value: `${feelsLike}°C feels like`,
      impact: "Moderate",
      reason: "Warm conditions may require shorter outdoor exposure."
    });
  }

  if (aqi >= 150) {
    decisionFactors.push({
      icon: "😷",
      label: "Air quality",
      value: `AQI ${aqi}`,
      impact: "High",
      reason: "Poor air quality increases outdoor activity concerns."
    });
  } else if (aqi >= 100) {
    decisionFactors.push({
      icon: "😷",
      label: "Air quality",
      value: `AQI ${aqi}`,
      impact: "Moderate",
      reason: "Sensitive users may prefer cleaner-air periods."
    });
  }

  if (uv >= 7) {
    decisionFactors.push({
      icon: "☀️",
      label: "UV exposure",
      value: `UV ${uv}`,
      impact: "High",
      reason: "Peak sunlight increases UV exposure."
    });
  }

  if (rain >= 60) {
    decisionFactors.push({
      icon: "🌧️",
      label: "Rain risk",
      value: `${rain}% probability`,
      impact: "High",
      reason: "High precipitation probability can disrupt outdoor plans."
    });
  } else if (rain >= 30) {
    decisionFactors.push({
      icon: "🌧️",
      label: "Rain risk",
      value: `${rain}% probability`,
      impact: "Moderate",
      reason: "Changing rainfall conditions may affect outdoor plans."
    });
  }

  if (wind >= 30) {
    decisionFactors.push({
      icon: "💨",
      label: "Wind",
      value: `${wind} km/h`,
      impact: "High",
      reason: "Strong winds can affect outdoor activity and temporary structures."
    });
  }

  if (decisionFactors.length === 0) {
    decisionFactors.push({
      icon: "✅",
      label: "Overall conditions",
      value: "Favorable",
      impact: "Low",
      reason: "No major weather factor is currently creating elevated risk."
    });
  }

  return {
    riskScore: Math.round(riskScore),
    riskLevel,
    riskBadge,
    headline,
    recommendation,
    bestWindow,
    why,
    priorityMetrics,
    decisionFactors,

    // Existing Gemini UI expects gearList
    gearList: gear.map((item, index) => ({
      id: `${personaId}-gear-${index}`,
      label: item,
      completed: false
    })),

    timeline,
    metrics: priorityMetrics,
    checklist: gear,
    advice: recommendation,
    actions: timeline
  };
}

export default function App() {
  // Navigation & View States
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'forecast', 'alerts', 'profile', 'onboarding'
  const [selectedPersona, setSelectedPersona] = useState('fitness');
  const [selectedLocation, setSelectedLocation] = useState('Delhi');
  
  // Interactive UI Modal States for SIH Evaluation
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [showAdaptMatrix, setShowAdaptMatrix] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkedGear, setCheckedGear] = useState({});

  // Fetch active weather location data
  const currentWeather = MOCK_LOCATIONS[selectedLocation] || MOCK_LOCATIONS.Delhi;

  // Run Personalization Engine whenever location or persona changes
  const personalizedData = useMemo(() => {
    return runPersonalizationEngine(currentWeather, selectedPersona);
  }, [currentWeather, selectedPersona]);

  // Simulate real-time IMD data refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 700);
  };

  // Toggle checklist gear items
  const handleToggleGear = (gearId) => {
    setCheckedGear(prev => ({ ...prev, [gearId]: !prev[gearId] }));
  };

  // Helper for rendering SVG weather condition icons
  const getWeatherIcon = (type, className = "w-6 h-6") => {
    switch (type) {
      case 'thunderstorm':
        return <CloudLightning className={`${className} text-amber-400 animate-pulse`} />;
      case 'rain':
        return <CloudRain className={`${className} text-cyan-400`} />;
      case 'cloudy':
        return <Cloud className={`${className} text-slate-300`} />;
      case 'sunny':
      default:
        return <Sun className={`${className} text-amber-300`} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between items-center selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* Main Container Frame (Simulates Mobile / Tablet Responsive Display) */}
      <div className="w-full max-w-md min-h-screen bg-slate-900 border-x border-slate-800/80 flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* Top Government & App Branding Header Bar */}
        <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 p-2 rounded-xl text-slate-950 font-bold shadow-md shadow-indigo-500/20">
              <Sun className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-200 via-orange-300 to-indigo-200 bg-clip-text text-transparent">
                  Mausam
                </span>
                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-mono uppercase tracking-widest">
                  SIH AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5">SIH 2026 Prototype</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Quick Refresh Button */}
            <button
              onClick={handleRefresh}
              title="Sync latest IMD data"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full border border-slate-700/60 transition-all active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            {/* Location Selector Trigger */}
            <button
              onClick={() => setShowLocationModal(true)}
              className="flex items-center space-x-1.5 bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700/80 px-3 py-1.5 rounded-full text-xs transition-all text-slate-200 shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold max-w-[80px] truncate">{selectedLocation}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </header>

        {/* CORE INNOVATION CALLOUT: "See Mausam Adapt" Demo Bar */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-950 to-indigo-950 border-b border-indigo-500/30 px-3 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">SIH Innovation Showcase</span>
          </div>

          <button
            onClick={() => setShowAdaptMatrix(true)}
            className="px-2.5 py-1 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-slate-950 font-black rounded-lg text-[11px] shadow-md flex items-center space-x-1 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
            <span>See Mausam Adapt</span>
          </button>
        </div>

        {/* Main Application Router Body */}
        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {isLoading ? (
            /* Skeleton Loading State during Data Refresh */
            <div className="space-y-4 animate-pulse">
              <div className="h-32 bg-slate-800/60 rounded-3xl" />
              <div className="h-28 bg-slate-800/60 rounded-3xl" />
              <div className="grid grid-cols-2 gap-2.5">
                <div className="h-20 bg-slate-800/60 rounded-2xl" />
                <div className="h-20 bg-slate-800/60 rounded-2xl" />
                <div className="h-20 bg-slate-800/60 rounded-2xl" />
                <div className="h-20 bg-slate-800/60 rounded-2xl" />
              </div>
            </div>
          ) : (
            <>
              {currentPage === 'home' && (
                <HomePage
                  weather={currentWeather}
                  persona={PERSONAS[selectedPersona]}
                  data={personalizedData}
                  selectedPersona={selectedPersona}
                  onSelectPersona={setSelectedPersona}
                  onOpenWhy={() => setShowWhyModal(true)}
                  onOpenAdapt={() => setShowAdaptMatrix(true)}
                  getWeatherIcon={getWeatherIcon}
                  checkedGear={checkedGear}
                  onToggleGear={handleToggleGear}
                />
              )}

              {currentPage === 'forecast' && (
                <ForecastPage
                  weather={currentWeather}
                  persona={PERSONAS[selectedPersona]}
                  data={personalizedData}
                  getWeatherIcon={getWeatherIcon}
                />
              )}

              {currentPage === 'alerts' && (
                <AlertsPage
                  weather={currentWeather}
                  persona={PERSONAS[selectedPersona]}
                  data={personalizedData}
                />
              )}

              {currentPage === 'profile' && (
                <ProfilePage
                  selectedPersona={selectedPersona}
                  onSelectPersona={setSelectedPersona}
                  selectedLocation={selectedLocation}
                  onSelectLocation={setSelectedLocation}
                  onRestartOnboarding={() => setCurrentPage('onboarding')}
                />
              )}

              {currentPage === 'onboarding' && (
                <OnboardingView
                  selectedPersona={selectedPersona}
                  setSelectedPersona={setSelectedPersona}
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  onFinish={() => setCurrentPage('home')}
                />
              )}
            </>
          )}
        </main>

        {/* Persistent Bottom Mobile Navigation Bar */}
        {currentPage !== 'onboarding' && (
          <nav className="fixed bottom-0 max-w-md w-full bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-6 py-2.5 flex justify-between items-center z-40">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex flex-col items-center space-y-1 transition-all ${
                currentPage === 'home' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-5 h-5" />
              <span className="text-[10px]">Home</span>
            </button>

            <button
              onClick={() => setCurrentPage('forecast')}
              className={`flex flex-col items-center space-y-1 transition-all ${
                currentPage === 'forecast' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="text-[10px]">Forecast</span>
            </button>

            <button
              onClick={() => setCurrentPage('alerts')}
              className={`flex flex-col items-center space-y-1 relative transition-all ${
                currentPage === 'alerts' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Bell className="w-5 h-5" />
                {currentWeather.alertLevel !== 'Green' && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900 animate-ping" />
                )}
              </div>
              <span className="text-[10px]">Alerts</span>
            </button>

            <button
              onClick={() => setCurrentPage('profile')}
              className={`flex flex-col items-center space-y-1 transition-all ${
                currentPage === 'profile' ? 'text-amber-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px]">Profile</span>
            </button>
          </nav>
        )}

        {/* MODAL 1: "Why am I seeing this?" Explanation Drawer */}
        {showWhyModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-indigo-500/40 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <HelpCircle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-slate-100">Why am I seeing this?</h3>
                </div>
                <button
                  onClick={() => setShowWhyModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-2xl">{PERSONAS[selectedPersona].emoji}</span>
                  <div>
                    <div className="text-xs text-slate-400">Active Persona Context</div>
                    <div className="text-sm font-bold text-amber-300">{PERSONAS[selectedPersona].name} Mode</div>
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl text-xs text-slate-200 leading-relaxed space-y-2">
                  <p className="font-medium text-slate-200">{personalizedData.whyExplanation}</p>
                  <p className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                    ⚡ <strong>Deterministic Logic Engine:</strong> Mausam maps physical meteorological risks directly against human physiological & spatial thresholds without relying on unverified LLM generation.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowWhyModal(false)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-colors"
              >
                Understood, Got It
              </button>
            </div>
          </div>
        )}

        {/* MODAL 2: "See Mausam Adapt" Real-Time Context Showcase */}
        {showAdaptMatrix && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto p-5 space-y-4 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 sticky top-0 bg-slate-900 z-10 pt-1">
                <div>
                  <div className="flex items-center space-x-1.5 text-indigo-400 text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>SIH Core Innovation Matrix</span>
                  </div>
                  <h2 className="text-lg font-extrabold text-slate-100">
                    See Mausam Adapt
                  </h2>
                </div>
                <button
                  onClick={() => setShowAdaptMatrix(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Baseline Weather Snapshot */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-indigo-900/50 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-amber-400 flex items-center justify-between">
                  <span>Constant Location: {selectedLocation}</span>
                  <span className="font-mono bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    {currentWeather.temp}°C | Rain {currentWeather.rainProbability}% | UV {currentWeather.uvIndex}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Notice how identical atmospheric metrics generate 4 completely distinct actionable decisions:
                </p>
              </div>

              {/* Persona Comparison Cards */}
              <div className="space-y-3">
                {['fitness', 'traveler', 'family', 'event'].map((pKey) => {
                  const pObj = PERSONAS[pKey];
                  const pData = runPersonalizationEngine(currentWeather, pKey);
                  const isSelected = selectedPersona === pKey;

                  return (
                    <div
                      key={pKey}
                      onClick={() => {
                        setSelectedPersona(pKey);
                        setShowAdaptMatrix(false);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-950/50 border-indigo-500 text-white ring-2 ring-indigo-500/50 shadow-lg'
                          : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{pObj.emoji}</span>
                          <div>
                            <span className="font-bold text-xs text-slate-100">{pObj.name} Mode</span>
                            <span className="text-[10px] text-slate-400 block -mt-0.5">{pObj.role}</span>
                          </div>
                        </div>

                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${pData.riskBadge}`}>
                          {pData.riskLevel}
                        </span>
                      </div>

                      <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 mb-2 font-medium">
                        "{pData.recommendation}"
                      </p>
                      
                      <div className="flex items-center gap-2 px-1 py-1.5">
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                          Why it changes
                        </span>

                        <span className="text-[10px] text-slate-400 truncate">
                          {pData.decisionFactors
                            .filter((factor) => factor.impact === "High")
                            .slice(0, 2)
                            .map((factor) => factor.label)
                            .join(" • ") || "Weather conditions are favorable"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                        <span>Best Window: <strong className="text-amber-300 font-mono">{pData.bestWindow}</strong></span>
                        <span className="text-indigo-400 font-semibold flex items-center">
                          {isSelected ? 'Currently Selected' : 'Apply Mode →'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setShowAdaptMatrix(false)}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-indigo-600 rounded-xl text-slate-950 font-black text-xs shadow-lg"
              >
                Close Matrix & Continue
              </button>
            </div>
          </div>
        )}

        {/* MODAL 3: Location Selector Modal */}
        {showLocationModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-slate-100">Select Region</h3>
                </div>
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {Object.keys(MOCK_LOCATIONS).map((locKey) => {
                  const item = MOCK_LOCATIONS[locKey];
                  const isSelected = selectedLocation === locKey;
                  return (
                    <button
                      key={locKey}
                      onClick={() => {
                        setSelectedLocation(locKey);
                        setShowLocationModal(false);
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/60 text-amber-300 ring-1 ring-amber-500/40'
                          : 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-sm">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.state}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-mono font-bold text-slate-100">{item.temp}°C</div>
                        <div className="text-[11px] text-slate-400">{item.condition}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function HomePage({ weather, persona, data, selectedPersona, onSelectPersona, onOpenWhy, onOpenAdapt, getWeatherIcon, checkedGear, onToggleGear }) {
  const PersonaIcon = persona.icon;
  const alertColor = ALERT_COLORS[weather.alertLevel] || ALERT_COLORS.Yellow;

  return (
    <div className="space-y-4">
      
      {/* 1. CENTRAL FEATURE HIGHLIGHT: "Personalized for You" Hero Banner */}
      <section className="bg-gradient-to-b from-indigo-950/70 via-slate-900 to-slate-900 border-2 border-indigo-500/40 rounded-3xl p-4 space-y-3 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500 text-slate-950">
              Personalized For You
            </span>
            <span className="text-slate-400 text-xs">Context Engine</span>
          </div>

          {/* Interactive "Why am I seeing this?" Button */}
          <button
            onClick={onOpenWhy}
            className="flex items-center space-x-1 text-xs bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 px-2.5 py-1 rounded-full transition-all active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-[11px]">Why am I seeing this?</span>
          </button>
        </div>

        {/* Selected Persona Badge & Role */}
        <div className="flex items-center justify-between bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-2xl bg-gradient-to-tr ${persona.color} text-slate-950 shadow-md`}>
              <PersonaIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-black text-slate-100">{persona.name} Mode</span>
                <span className="text-lg">{persona.emoji}</span>
              </div>
              <p className="text-[11px] text-slate-400">{persona.role}</p>

              <p className="text-[9px] text-indigo-400 font-semibold mt-1">
                Same weather → personalized decision
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAdapt}
            title="Switch context"
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold bg-indigo-950 px-2.5 py-1 rounded-lg border border-indigo-800/80 flex items-center space-x-1"
          >
            <span>Change</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Quick Horizontal Persona Switch Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-1">
          {Object.keys(PERSONAS).map((key) => {
            const item = PERSONAS[key];
            if (!item.implemented) return null;
            const isActive = selectedPersona === key;
            return (
              <button
                key={key}
                onClick={() => onSelectPersona(key)}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap flex items-center space-x-1.5 transition-all ${
                  isActive
                    ? `${item.activeTabColor} shadow-md`
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                }`}
              >
                <span>{item.emoji}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Meteorological Context Summary Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/90 via-slate-800/60 to-slate-900 border border-slate-700/60 rounded-3xl p-5 shadow-lg">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{weather.name}, {weather.state}</span>
            </div>
            <div className="text-4xl font-black tracking-tight mt-1 text-slate-100 flex items-baseline space-x-1">
              <span>{weather.temp}°</span>
              <span className="text-base font-normal text-slate-400">C</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            {getWeatherIcon(weather.conditionType, "w-10 h-10")}
            <span className="text-xs font-bold text-slate-200 mt-1">{weather.condition}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-300 border-t border-slate-700/50 pt-3 mt-2">
          <div>Feels like <strong className="text-amber-300">{weather.feelsLike}°C</strong></div>
          <div className="w-1 h-1 bg-slate-700 rounded-full" />
          <div>Humidity <strong className="text-slate-100">{weather.humidity}%</strong></div>
          <div className="w-1 h-1 bg-slate-700 rounded-full" />
          <div>Wind <strong className="text-slate-100">{weather.windSpeed} km/h</strong></div>
        </div>
      </div>

      {/* 3. Actionable Natural Language Recommendation & Optimal Slot */}
      <div className="bg-slate-800/80 border border-slate-700/70 rounded-3xl p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Primary Advisory
            </h3>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${data.riskBadge}`}>
            {data.riskLevel}
          </span>
        </div>

        {/* Natural Language Statement */}
        <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl">
          <p className="text-xs text-slate-100 leading-relaxed font-semibold">
            "{data.recommendation}"
          </p>
        </div>

        {/* Optimal Activity Window Bar */}
        <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center space-x-2 text-slate-300">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-[11px]">Optimal Window:</span>
          </div>
          <span className="font-bold text-amber-300 font-mono text-xs">{data.bestWindow}</span>
        </div>
      </div>

      {/* WHY THIS RECOMMENDATION */}
      <div className="mt-4 bg-slate-800/80 border border-slate-700/70 rounded-3xl p-4 space-y-3 shadow-md">

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Why this recommendation?
            </h3>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-700 bg-slate-900 text-amber-300">
            Explainable
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Mausam considers the weather factors that matter most for your selected
          activity and converts them into an actionable recommendation.
        </p>

        <div className="space-y-2.5">
          {data.decisionFactors.map((factor, index) => (
          <div
          key={`${factor.label}-${index}`}
          className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-base">
              {factor.icon}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-slate-200">
                  {factor.label}
                </p>

                <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  factor.impact === "High"
                  ? "bg-red-500/10 border-red-500/30 text-red-300"
                  : factor.impact === "Moderate"
                  ? "bg-orange-500/10 border-orange-500/30 text-orange-300"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                }`}
                >
                  {factor.impact}
                </span>
              </div>

              <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                {factor.value}
              </p>

              <p className="mt-1 text-[10px] leading-relaxed text-slate-500">
                {factor.reason}
              </p>
            </div>
          </div>
          ))}
        </div>

        <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-2.5">

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/10">
              <span className="text-sm">🧠</span>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                How Mausam decides
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                Context-aware decision pipeline
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">

            <div className="flex-1 text-center bg-slate-950/70 border border-slate-800 rounded-xl p-2">
              <div className="text-sm">🌦️</div>
              <p className="mt-1 text-[9px] font-bold text-slate-400">
                Weather
              </p>
            </div>

            <span className="text-slate-600 text-xs">→</span>

            <div className="flex-1 text-center bg-slate-950/70 border border-slate-800 rounded-xl p-2">
              <div className="text-sm">{persona.emoji}</div>
              <p className="mt-1 text-[9px] font-bold text-slate-400 truncate">
                {persona.name}
              </p>
            </div>

            <span className="text-slate-600 text-xs">→</span>

            <div className="flex-1 text-center bg-slate-950/70 border border-slate-800 rounded-xl p-2">
              <div className="text-sm">⚠️</div>
              <p className="mt-1 text-[9px] font-bold text-slate-400">
                Risk
              </p>
              <p className="text-[9px] font-bold text-slate-300">
                {data.riskLevel}
              </p>
            </div>

            <span className="text-slate-600 text-xs">→</span>

            <div className="flex-1 text-center bg-slate-950/70 border border-slate-800 rounded-xl p-2">
              <div className="text-sm">🎯</div>
              <p className="mt-1 text-[9px] font-bold text-slate-400">
                Action
              </p>
              <p className="text-[9px] font-bold text-amber-300">
                Adapted
              </p>
            </div>

          </div>

          

        </div>

      </div>
      

      {/* 4. Score Visualization Meter / Circular Gauge (If Applicable) */}
      {data.scoreType === 'gauge' && (
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-3xl p-4 flex items-center space-x-4">
          <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={data.score > 60 ? 'text-amber-400' : 'text-rose-500'}
                strokeDasharray={`${data.score}, 100`}
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-base font-black font-mono text-slate-100">{data.score}</span>
              <span className="text-[9px] text-slate-400 -mt-1">/ 100</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-200">{data.scoreLabel}</div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Calculated dynamically based on temperature, humidity strain, AQI index, and rain risk.
            </p>
          </div>
        </div>
      )}

      {/* 5. Persona-Prioritized Metrics Grid */}
      <div className="space-y-2">
        <h3 className="text-[11px] uppercase font-bold text-slate-400 tracking-wider px-1">
          {persona.name} High-Priority Parameters
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {data.priorityMetrics.map((m, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border transition-all ${
                m.highlight
                  ? 'bg-slate-800/90 border-amber-500/50 shadow-sm'
                  : 'bg-slate-800/40 border-slate-700/50'
              }`}
            >
              <div className="text-[10px] text-slate-400">{m.label}</div>
              <div className="text-base font-bold font-mono text-slate-100 mt-0.5">
                {m.value}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Interactive Gear & Checklist */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-4 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Tailored Checklist & Gear Advisory</span>
        </div>

        <div className="space-y-2">
          {data.gearList.map((gear) => {
            const isChecked = !!checkedGear[gear.id];
            return (
              <div
                key={gear.id}
                onClick={() => onToggleGear(gear.id)}
                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 line-through opacity-70'
                    : gear.recommended
                    ? 'bg-slate-900/80 border-amber-500/30 text-slate-200'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${isChecked ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600'}`}>
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-[11px] font-medium">{gear.text}</span>
                </span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800">
                  {gear.recommended ? 'Recommended' : 'Optional'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Baseline IMD Weather Gauges */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-[10px]">Raw Atmospheric Values</span>
          <span>Baseline Metrics</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-slate-800/40 p-2 rounded-2xl border border-slate-800">
            <div className="text-slate-400 text-[10px]">Air Quality</div>
            <div className="font-bold text-amber-300 font-mono mt-0.5">{weather.aqi} AQI</div>
          </div>
          <div className="bg-slate-800/40 p-2 rounded-2xl border border-slate-800">
            <div className="text-slate-400 text-[10px]">UV Radiation</div>
            <div className="font-bold text-amber-300 font-mono mt-0.5">UV {weather.uvIndex}</div>
          </div>
          <div className="bg-slate-800/40 p-2 rounded-2xl border border-slate-800">
            <div className="text-slate-400 text-[10px]">Rain Risk</div>
            <div className="font-bold text-cyan-300 font-mono mt-0.5">{weather.rainProbability}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForecastPage({ weather, persona, data, getWeatherIcon }) {
  const getHourlyImpact = (h) => {
    const rain = h.rain;
    const uv = h.uv;
    const wind = h.wind;
    const temp = h.temp;

    if (persona.id === 'fitness') {
      if (rain >= 60) return { label: 'Avoid Outdoor', tone: 'rose' };
      if (uv >= 8 || temp >= 34) return { label: 'High Heat', tone: 'orange' };
      if (wind >= 30) return { label: 'Windy', tone: 'orange' };
      return { label: 'Good for Activity', tone: 'emerald' };
    }

    if (persona.id === 'traveler') {
      if (rain >= 70) return { label: 'Travel Disruption', tone: 'rose' };
      if (wind >= 30) return { label: 'Wind Caution', tone: 'orange' };
      if (rain >= 40) return { label: 'Carry Rain Gear', tone: 'orange' };
      return { label: 'Travel Friendly', tone: 'emerald' };
    }

    if (persona.id === 'family') {
      if (rain >= 60) return { label: 'Outdoor Caution', tone: 'rose' };
      if (uv >= 7 || temp >= 34) return { label: 'Heat / UV Caution', tone: 'orange' };
      return { label: 'Family Friendly', tone: 'emerald' };
    }

    if (persona.id === 'event') {
      if (rain >= 60) return { label: 'Rain Risk', tone: 'rose' };
      if (wind >= 30) return { label: 'Secure Setup', tone: 'orange' };
      if (temp >= 34) return { label: 'Guest Heat Risk', tone: 'orange' };
      return { label: 'Event Friendly', tone: 'emerald' };
    }

    return { label: 'Monitor Conditions', tone: 'indigo' };
  };

  const getToneClass = (tone) => {
    if (tone === 'rose') {
      return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
    }

    if (tone === 'orange') {
      return 'bg-orange-500/10 text-orange-300 border-orange-500/30';
    }

    if (tone === 'emerald') {
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    }

    return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
  };

  const getDayImpact = (item) => {
    if (persona.id === 'fitness') {
      if (item.rain >= 60) return 'Outdoor caution';
      if (item.max >= 34) return 'High heat';
      return 'Activity friendly';
    }

    if (persona.id === 'traveler') {
      if (item.rain >= 60) return 'Travel disruption';
      if (item.rain >= 40) return 'Carry rain gear';
      return 'Travel friendly';
    }

    if (persona.id === 'family') {
      if (item.rain >= 60) return 'Outdoor caution';
      if (item.max >= 34) return 'Heat caution';
      return 'Family friendly';
    }

    if (persona.id === 'event') {
      if (item.rain >= 60) return 'Rain risk';
      if (item.max >= 34) return 'Guest comfort risk';
      return 'Event friendly';
    }

    return 'Monitor conditions';
  };

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-5 space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-100">
              Persona-Filtered Forecast
            </h2>

            <p className="text-xs text-slate-400">
              Forecast interpreted for {persona.name}
            </p>
          </div>

          <span className="text-2xl">
            {persona.emoji}
          </span>
        </div>

        {/* PERSONALIZATION EXPLANATION */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
            Personalization
          </span>

          <span className="text-[10px] text-slate-500">
            Same weather, different decision
          </span>
        </div>
      </div>


      {/* 24-HOUR SUITABILITY TIMELINE */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-4 space-y-3">

        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
            24-Hour Suitability Window
          </h3>

          <span className="text-[9px] text-indigo-400 font-semibold">
            Adapted for {persona.name}
          </span>
        </div>

        <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2 pt-1">

          {weather.hourly.map((h, idx) => {
            const impact = getHourlyImpact(h);

            return (
              <div
                key={idx}
                className="min-w-[110px] bg-slate-900/80 border border-slate-800 p-3 rounded-2xl text-center flex flex-col items-center space-y-2 shrink-0"
              >

                <span className="text-[11px] text-slate-400 font-mono">
                  {h.time}
                </span>

                {getWeatherIcon(
                  h.rain > 50 ? 'rain' : 'sunny',
                  "w-6 h-6"
                )}

                <span className="text-sm font-bold font-mono text-slate-100">
                  {h.temp}°C
                </span>

                {/* PERSONA-SPECIFIC DECISION */}
                <div
                  className={`text-[9px] px-1.5 py-1 rounded font-bold border ${getToneClass(
                    impact.tone
                  )}`}
                >
                  {impact.label}
                </div>

                {/* WEATHER SIGNALS */}
                <div className="flex items-center gap-1.5 text-[8px] text-slate-500 font-mono">
                  <span>☔ {h.rain}%</span>
                  <span>💨 {h.wind}</span>
                </div>

              </div>
            );
          })}

        </div>
      </div>


      {/* HOW FORECAST CHANGES */}
      <div className="bg-slate-800/80 border border-slate-700/70 rounded-3xl p-4 space-y-3 shadow-md">

        <div className="flex items-center gap-2">
          <span className="text-base">🧠</span>

          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Forecast → Decision
            </h3>

            <p className="text-[10px] text-slate-500">
              Mausam converts forecast signals into profile-specific actions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">

          <div className="flex-1 text-center bg-slate-950/70 border border-slate-800 rounded-xl p-2">
            <div className="text-sm">🌦️</div>
            <p className="mt-1 text-[9px] font-bold text-slate-400">
              Forecast
            </p>
          </div>

          <span className="text-slate-600 text-xs">→</span>

          <div className="flex-1 text-center bg-slate-950/70 border border-slate-800 rounded-xl p-2">
            <div className="text-sm">
              {persona.emoji}
            </div>
            <p className="mt-1 text-[9px] font-bold text-slate-400 truncate">
              {persona.name}
            </p>
          </div>

          <span className="text-slate-600 text-xs">→</span>

          <div className="flex-1 text-center bg-slate-950/70 border border-slate-800 rounded-xl p-2">
            <div className="text-sm">🎯</div>
            <p className="mt-1 text-[9px] font-bold text-slate-400">
              Decision
            </p>
            <p className="text-[9px] font-bold text-amber-300">
              Adapted
            </p>
          </div>

        </div>

      </div>


      {/* 7-DAY EXTENDED FORECAST */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-4 space-y-3">

        <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
          7-Day Outlook
        </h3>

        <div className="space-y-2">

          {weather.forecast7Days.map((item, idx) => {

            const dayImpact = getDayImpact(item);

            const isHighRisk =
              item.rain >= 60 ||
              (persona.id !== 'traveler' && item.max >= 34);

            return (
              <div
                key={idx}
                className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between text-xs"
              >

                <div className="w-14 font-bold text-slate-300">
                  {item.day}
                </div>

                <div className="flex items-center space-x-2 flex-1 justify-center">

                  <span className="text-slate-400 text-[11px]">
                    {item.condition}
                  </span>

                  {item.rain > 40 && (
                    <span className="text-[10px] text-cyan-400 font-mono">
                      ({item.rain}%)
                    </span>
                  )}

                </div>

                <div className="flex items-center space-x-3">

                  <div className="text-right font-mono">
                    <span className="font-bold text-slate-200">
                      {item.max}°
                    </span>

                    <span className="text-slate-500 text-[10px] ml-1">
                      {item.min}°
                    </span>
                  </div>

                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border ${
                      isHighRisk
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {dayImpact}
                  </span>

                </div>

              </div>
            );

          })}

        </div>
      </div>

    </div>
  );
}

function AlertsPage({ weather, persona, data }) {
  const alertColor = ALERT_COLORS[weather.alertLevel] || ALERT_COLORS.Orange;

  return (
    <div className="space-y-4">
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-5 space-y-2">
        <div className="flex items-center space-x-2 text-rose-400">
          <AlertTriangle className="w-5 h-5 animate-bounce" />
          <h2 className="text-lg font-extrabold text-slate-100">Weather Alerts — Prototype</h2>
        </div>
        <p className="text-xs text-slate-400">
          Meteorological warnings translated for active profile: {persona.name}.
        </p>
      </div>

      {/* Prototype Weather Alert Card */}
      <div className={`${alertColor.bg} border ${alertColor.border} rounded-3xl p-5 space-y-3`}>
        <div className="flex items-center justify-between">
          <span className={`text-xs font-black font-mono uppercase px-2.5 py-1 rounded-full ${alertColor.tag}`}>
            {weather.alertLevel} Alert Active
          </span>
          <span className="text-xs text-slate-400">{weather.name} District</span>
        </div>

        <p className="text-sm font-semibold text-slate-200 leading-relaxed">
          {weather.alertMessage}
        </p>

        {/* Dynamic Context Impact */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-3 mt-2">

          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Action Required for {persona.name}:</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {data.recommendation}
          </p>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Alert factors affecting you
            </p>

            <div className="flex flex-wrap gap-1.5">
              {data.decisionFactors
              .filter((factor) => factor.impact === "High")
              .slice(0, 3)
              .map((factor, index) => (
                <span
                key={`${factor.label}-${index}`}
                className="text-[10px] font-bold px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300"
                >
                  {factor.icon} {factor.label}
                </span>
              ))}

              {data.decisionFactors.filter(
                (factor) => factor.impact === "High"
                ).length === 0 && (
                  <span className="text-[10px] text-emerald-300">
                    ✓ No major risk factors for this profile
                  </span>
                )}
            </div>
          </div>

        </div>    
      </div>
    </div>
  );
}

function ProfilePage({ selectedPersona, onSelectPersona, selectedLocation, onSelectLocation, onRestartOnboarding }) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-5 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-100">Persona & Preferences</h2>
            <p className="text-xs text-slate-400">Configure context rules engine</p>
          </div>
        </div>
      </div>

      {/* Switch Persona Grid */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-4 space-y-3">
        <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">
          Active Persona Profile
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {Object.keys(PERSONAS).map((key) => {
            const p = PERSONAS[key];
            const isSelected = selectedPersona === key;
            return (
              <button
                key={key}
                disabled={!p.implemented}
                onClick={() => p.implemented && onSelectPersona(key)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  !p.implemented
                    ? 'opacity-40 bg-slate-900/40 border-slate-800 cursor-not-allowed'
                    : isSelected
                    ? 'bg-amber-500/10 border-amber-500/60 text-amber-300 ring-1 ring-amber-500/50'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xl">{p.emoji}</span>
                  {!p.implemented && (
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                      Soon
                    </span>
                  )}
                  {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="font-bold text-xs">{p.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Technical Concept Explanation Box */}
      <div className="bg-slate-900 border border-indigo-500/30 p-4 rounded-3xl space-y-3 text-xs">

        <div className="flex items-center space-x-1.5 text-indigo-400 font-bold uppercase tracking-wider text-[10px]">
          <Info className="w-4 h-4" />
          <span>SIH Judge Evaluation Brief</span>
        </div>

        <p className="text-slate-300 leading-relaxed text-[11px]">
          <strong className="text-slate-100">
            Core Innovation — Context-Aware Weather Decisions:
          </strong>{' '}
          Mausam does not stop at displaying weather. It maps the same atmospheric
          conditions to different actions based on the user's context.
        </p>

        <div className="grid grid-cols-3 gap-2 pt-1">

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-2.5 text-center">
            <div className="text-sm">🌦️</div>
            <p className="mt-1 text-[9px] font-bold text-slate-300">
              Weather
            </p>
            <p className="text-[8px] text-slate-500">
              Raw signals
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-2.5 text-center">
            <div className="text-sm">🧠</div>
            <p className="mt-1 text-[9px] font-bold text-slate-300">
              Context
            </p>
            <p className="text-[8px] text-slate-500">
              User profile
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-2.5 text-center">
            <div className="text-sm">🎯</div>
            <p className="mt-1 text-[9px] font-bold text-slate-300">
              Action
            </p>
            <p className="text-[8px] text-slate-500">
              Adapted advice
            </p>
          </div>

        </div>

        <div className="pt-2 border-t border-slate-800">
          <p className="text-[10px] text-slate-400 leading-relaxed">
          <span className="text-amber-300 font-bold">
            Why it matters:
          </span>{' '}
            Identical weather can create different risks for a runner, traveller,
            family, or event planner. Mausam makes that difference explicit and
            explainable.
          </p>
        </div>

      </div>

      <button
        onClick={onRestartOnboarding}
        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-2xl border border-slate-700 transition-colors"
      >
        Restart Onboarding Flow
      </button>
    </div>
  );
}

function OnboardingView({ selectedPersona, setSelectedPersona, selectedLocation, setSelectedLocation, onFinish }) {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-[80vh] flex flex-col justify-between py-6 space-y-6">
      <div className="text-center space-y-2 pt-4">
        <div className="inline-flex p-3 bg-gradient-to-tr from-amber-500 via-orange-500 to-indigo-600 rounded-3xl text-slate-950 mb-2 shadow-xl">
          <Sun className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-100">Welcome to Mausam</h1>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          "Don't just tell me the weather. Tell me what it means for me."
        </p>
      </div>

      {step === 1 ? (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-sm font-bold text-slate-200">How do you use Mausam?</h2>
            <p className="text-[11px] text-slate-400">Select your primary activity context</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 max-h-[50vh] overflow-y-auto px-1">
            {Object.keys(PERSONAS).map((key) => {
              const item = PERSONAS[key];
              const isSelected = selectedPersona === key;
              return (
                <button
                  key={key}
                  disabled={!item.implemented}
                  onClick={() => item.implemented && setSelectedPersona(key)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    !item.implemented
                      ? 'opacity-40 bg-slate-900 border-slate-800 cursor-not-allowed'
                      : isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/50'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{item.emoji}</div>
                  <div className="font-bold text-xs">{item.name}</div>
                  {!item.implemented && (
                    <span className="text-[9px] text-slate-500 font-mono">Coming soon</span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-indigo-600 rounded-2xl text-slate-950 font-bold text-sm shadow-xl"
          >
            Continue to Location
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-sm font-bold text-slate-200">Select Primary Location</h2>
            <p className="text-[11px] text-slate-400">Default set to Delhi NCR</p>
          </div>

          <div className="space-y-2">
            {Object.keys(MOCK_LOCATIONS).map((locKey) => {
              const isSelected = selectedLocation === locKey;
              return (
                <button
                  key={locKey}
                  onClick={() => setSelectedLocation(locKey)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex justify-between items-center ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300'
                  }`}
                >
                  <span className="font-bold text-xs">{locKey}</span>
                  {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                </button>
              );
            })}
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              onClick={() => setStep(1)}
              className="w-1/3 py-3.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-2xl border border-slate-700"
            >
              Back
            </button>
            <button
              onClick={onFinish}
              className="w-2/3 py-3.5 bg-gradient-to-r from-amber-500 to-indigo-600 rounded-2xl text-slate-950 font-bold text-sm shadow-xl"
            >
              Launch Homepage
            </button>
          </div>
        </div>
      )}
    </div>
  );
}