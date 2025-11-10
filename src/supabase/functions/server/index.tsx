import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import * as kv from "./kv_store.tsx";

// Helper function to map OpenWeatherMap icons to our icon system
function getWeatherIcon(iconCode: string): string {
  const iconMap: { [key: string]: string } = {
    '01d': 'sunny', '01n': 'sunny',
    '02d': 'partly-cloudy', '02n': 'partly-cloudy',
    '03d': 'cloudy', '03n': 'cloudy',
    '04d': 'cloudy', '04n': 'cloudy',
    '09d': 'rainy', '09n': 'rainy',
    '10d': 'rainy', '10n': 'rainy',
    '11d': 'rainy', '11n': 'rainy',
    '13d': 'rainy', '13n': 'rainy',
    '50d': 'cloudy', '50n': 'cloudy'
  };
  return iconMap[iconCode] || 'sunny';
}

const app = new Hono();

// CORS and logging
app.use("*", cors({
  origin: "*",
  allowHeaders: ["*"],
  allowMethods: ["*"],
}));
app.use("*", logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Disease Detection Routes
app.post("/make-server-5d78fdfd/disease/detect", async (c) => {
  try {
    const { imageBase64, cropType } = await c.req.json();
    
    // Mock AI disease detection (in real implementation, would use TensorFlow Lite)
    const diseases = [
      { name: "Leaf Spot", confidence: 0.87, severity: "Medium" },
      { name: "Blight", confidence: 0.65, severity: "High" },
      { name: "Rust", confidence: 0.45, severity: "Low" },
    ];
    
    const detectedDisease = diseases[Math.floor(Math.random() * diseases.length)];
    
    const treatment = {
      "Leaf Spot": {
        immediate: ["Remove affected leaves", "Apply copper fungicide"],
        preventive: ["Improve air circulation", "Water at soil level"],
        timeline: "7-14 days"
      },
      "Blight": {
        immediate: ["Isolate affected plants", "Apply bacterial copper spray"],
        preventive: ["Crop rotation", "Resistant varieties"],
        timeline: "14-21 days"
      },
      "Rust": {
        immediate: ["Apply sulfur-based fungicide", "Remove infected parts"],
        preventive: ["Plant in sunny locations", "Avoid overhead watering"],
        timeline: "10-14 days"
      }
    };
    
    return c.json({
      disease: detectedDisease,
      treatment: treatment[detectedDisease.name],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.log("Disease detection error:", error);
    return c.json({ error: "Failed to detect disease" }, 500);
  }
});

// Disease Reporting Routes
app.post("/make-server-5d78fdfd/reports/create", async (c) => {
  try {
    const reportData = await c.req.json();
    const reportId = `report_${Date.now()}`;
    
    const report = {
      ...reportData,
      id: reportId,
      timestamp: new Date().toISOString(),
      status: "active"
    };
    
    await kv.set(reportId, report);
    
    return c.json({ success: true, reportId, report });
  } catch (error) {
    console.log("Report creation error:", error);
    return c.json({ error: "Failed to create report" }, 500);
  }
});

app.get("/make-server-5d78fdfd/reports/search", async (c) => {
  try {
    const { query, location } = c.req.query();
    const reports = await kv.getByPrefix("report_");
    
    let filteredReports = reports.filter(report => 
      report.value && typeof report.value === 'object'
    );
    
    if (query) {
      filteredReports = filteredReports.filter(report =>
        report.value.disease?.toLowerCase().includes(query.toLowerCase()) ||
        report.value.cropType?.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (location) {
      filteredReports = filteredReports.filter(report =>
        report.value.location?.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    return c.json(filteredReports.map(r => r.value));
  } catch (error) {
    console.log("Report search error:", error);
    return c.json({ error: "Failed to search reports" }, 500);
  }
});

// Weather Routes
app.get("/make-server-5d78fdfd/weather/current", async (c) => {
  try {
    const { lat = "30.7333", lon = "76.7794", location = "Punjab" } = c.req.query();
    const apiKey = Deno.env.get("OPENWEATHER_API_KEY");
    
    if (!apiKey) {
      console.log("Weather API key not found, using mock data");
      // Fallback to mock data
      const weatherData = {
        location: location || "Punjab, India",
        temperature: Math.floor(Math.random() * 15) + 20,
        feelsLike: Math.floor(Math.random() * 15) + 22,
        humidity: Math.floor(Math.random() * 30) + 60,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        visibility: Math.floor(Math.random() * 5) + 8,
        uvIndex: Math.floor(Math.random() * 8) + 1,
        pressure: Math.floor(Math.random() * 50) + 1000,
        condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
        icon: ["sunny", "partly-cloudy", "cloudy", "rainy"][Math.floor(Math.random() * 4)],
        sunrise: "06:15",
        sunset: "18:45",
        forecast: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
          high: Math.floor(Math.random() * 15) + 20,
          low: Math.floor(Math.random() * 10) + 12,
          condition: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
          humidity: Math.floor(Math.random() * 30) + 60,
          windSpeed: Math.floor(Math.random() * 20) + 5,
          precipitation: Math.floor(Math.random() * 100),
          icon: ["sunny", "partly-cloudy", "cloudy", "rainy"][Math.floor(Math.random() * 4)]
        }))
      };
      return c.json(weatherData);
    }

    // Real OpenWeatherMap API call
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentUrl),
      fetch(forecastUrl)
    ]);
    
    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error("Failed to fetch weather data from API");
    }
    
    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();
    
    const weatherData = {
      location: `${currentData.name}, ${currentData.sys.country}`,
      temperature: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
      visibility: Math.round(currentData.visibility / 1000), // Convert m to km
      uvIndex: 6, // Would need additional UV API call
      pressure: currentData.main.pressure,
      condition: currentData.weather[0].main,
      icon: getWeatherIcon(currentData.weather[0].icon),
      sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      forecast: forecastData.list.filter((_, index) => index % 8 === 0).slice(0, 7).map((item, i) => ({
        date: item.dt_txt.split(' ')[0],
        day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min),
        condition: item.weather[0].main,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 3.6),
        precipitation: item.pop * 100,
        icon: getWeatherIcon(item.weather[0].icon)
      }))
    };
    
    return c.json(weatherData);
  } catch (error) {
    console.log("Weather fetch error:", error);
    return c.json({ error: "Failed to fetch weather data" }, 500);
  }
});

// Market Data Routes
app.get("/make-server-5d78fdfd/market/prices", async (c) => {
  try {
    const crops = [
      { name: "Wheat", price: 2200, change: "+5.2%", trend: "up" },
      { name: "Rice", price: 3800, change: "-2.1%", trend: "down" },
      { name: "Corn", price: 1900, change: "+3.8%", trend: "up" },
      { name: "Soybeans", price: 4500, change: "+1.5%", trend: "up" },
      { name: "Cotton", price: 5200, change: "-0.8%", trend: "down" },
      { name: "Sugarcane", price: 2800, change: "+4.2%", trend: "up" }
    ];
    
    return c.json(crops);
  } catch (error) {
    console.log("Market prices error:", error);
    return c.json({ error: "Failed to fetch market prices" }, 500);
  }
});

// Government Schemes Routes
app.get("/make-server-5d78fdfd/government/schemes", async (c) => {
  try {
    const schemes = [
      {
        name: "PM-KISAN",
        description: "Direct income support to farmers",
        eligibility: "Small and marginal farmers",
        benefit: "₹6,000 per year",
        deadline: "Ongoing"
      },
      {
        name: "Crop Insurance Scheme",
        description: "Protection against crop loss",
        eligibility: "All farmers",
        benefit: "Up to 90% premium subsidy",
        deadline: "Before sowing season"
      },
      {
        name: "Soil Health Card",
        description: "Soil testing and recommendations",
        eligibility: "All farmers",
        benefit: "Free soil testing",
        deadline: "Ongoing"
      }
    ];
    
    return c.json(schemes);
  } catch (error) {
    console.log("Government schemes error:", error);
    return c.json({ error: "Failed to fetch schemes" }, 500);
  }
});

// IoT Sensor Routes
app.get("/make-server-5d78fdfd/iot/sensors", async (c) => {
  try {
    const sensorData = {
      soilMoisture: Math.floor(Math.random() * 40) + 30, // 30-70%
      soilPH: (Math.random() * 3 + 5.5).toFixed(1), // 5.5-8.5
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
      lightIntensity: Math.floor(Math.random() * 50000) + 20000, // 20000-70000 lux
      recommendation: Math.random() > 0.5 ? "Water needed" : "Soil moisture optimal"
    };
    
    return c.json(sensorData);
  } catch (error) {
    console.log("Sensor data error:", error);
    return c.json({ error: "Failed to fetch sensor data" }, 500);
  }
});

// Learning Content Routes
app.get("/make-server-5d78fdfd/learning/content", async (c) => {
  try {
    const { language = "en", category } = c.req.query();
    
    const content = {
      en: {
        "Disease Prevention": [
          {
            title: "Early Disease Detection",
            content: "Regular monitoring helps catch diseases before they spread...",
            tips: ["Check plants daily", "Look for unusual spots", "Monitor leaf color changes"]
          },
          {
            title: "Proper Sanitation",
            content: "Clean tools and equipment prevent disease transmission...",
            tips: ["Disinfect tools", "Remove diseased plants", "Clean storage areas"]
          }
        ],
        "Crop Management": [
          {
            title: "Optimal Planting Times",
            content: "Timing your planting according to weather patterns...",
            tips: ["Check soil temperature", "Monitor rainfall", "Consider frost dates"]
          }
        ]
      },
      hi: {
        "रोग रोकथाम": [
          {
            title: "जल्दी रोग पहचान",
            content: "नियमित निगरानी रोगों को फैलने से पहले पकड़ने में मदद करती है...",
            tips: ["पौधों की दैनिक जांच करें", "असामान्य धब्बों को देखें", "पत्ती के रंग में बदलाव देखें"]
          }
        ]
      }
    };
    
    return c.json(content[language] || content.en);
  } catch (error) {
    console.log("Learning content error:", error);
    return c.json({ error: "Failed to fetch learning content" }, 500);
  }
});

// YouTube Educational Videos Route
app.get("/make-server-5d78fdfd/learning/videos", async (c) => {
  try {
    const { query = "organic farming", language = "en" } = c.req.query();
    const apiKey = Deno.env.get("YOUTUBE_API_KEY");
    
    if (!apiKey) {
      console.log("YouTube API key not found, using mock data");
      // Fallback to mock video data
      const mockVideos = [
        {
          id: "mock1",
          title: "Organic Farming Techniques",
          description: "Learn the best practices for organic farming...",
          thumbnail: "https://via.placeholder.com/320x180",
          channelTitle: "Agriculture Academy",
          publishedAt: "2024-01-15",
          duration: "10:25"
        },
        {
          id: "mock2", 
          title: "Disease Prevention in Crops",
          description: "Effective methods to prevent crop diseases...",
          thumbnail: "https://via.placeholder.com/320x180",
          channelTitle: "Farm Expert",
          publishedAt: "2024-01-10",
          duration: "15:30"
        }
      ];
      return c.json(mockVideos);
    }

    const searchQuery = language === "hi" ? `${query} farming hindi` : `${query} farming`;
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=10&order=relevance&key=${apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch YouTube videos");
    }
    
    const data = await response.json();
    const videos = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));
    
    return c.json(videos);
  } catch (error) {
    console.log("YouTube videos error:", error);
    return c.json({ error: "Failed to fetch educational videos" }, 500);
  }
});

// AI Chat Routes
app.post("/make-server-5d78fdfd/chat/message", async (c) => {
  try {
    const { message, language = "en" } = await c.req.json();
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    
    if (!apiKey) {
      console.log("OpenAI API key not found, using mock responses");
      // Fallback to mock responses
      const responses = {
        en: {
          weather: "Based on current conditions, it's a good day for field work. Temperature is moderate with low humidity.",
          disease: "For disease prevention, ensure proper plant spacing and avoid overhead watering. Regular inspection is key.",
          market: "Current market prices show wheat at ₹2200/quintal with an upward trend. Consider selling soon.",
          irrigation: "Your soil moisture levels are optimal. Next watering recommended in 2-3 days.",
          default: "I'm here to help with your farming questions! Ask me about weather, diseases, markets, or irrigation."
        },
        hi: {
          weather: "वर्तमान स्थितियों के आधार पर, खेत के काम के लिए यह एक अच्छा दिन है। तापमान मध्यम है और नमी कम है।",
          disease: "रोग रोकथाम के लिए, उचित पौधों की दूरी सुनिश्चित करें और ऊपर से पानी देने से बचें।",
          market: "वर्तमान बाजार भाव गेहूं ₹2200/क्विंटल दिखाते हैं। जल्द बेचने पर विचार करें।",
          default: "मैं आपके कृषि प्रश्नों में मदद के लिए यहाँ हूँ! मुझसे मौसम, रोग, बाजार या सिंचाई के बारे में पूछें।"
        }
      };
      
      const langResponses = responses[language] || responses.en;
      let response = langResponses.default;
      
      if (message.toLowerCase().includes('weather') || message.includes('मौसम')) {
        response = langResponses.weather;
      } else if (message.toLowerCase().includes('disease') || message.includes('रोग')) {
        response = langResponses.disease;
      } else if (message.toLowerCase().includes('market') || message.includes('बाजार')) {
        response = langResponses.market;
      } else if (message.toLowerCase().includes('irrigation') || message.includes('सिंचाई')) {
        response = langResponses.irrigation;
      }
      
      return c.json({ response, timestamp: new Date().toISOString() });
    }

    // Real OpenAI API call
    const systemPrompt = language === "hi" 
      ? "आप एक कृषि विशेषज्ञ AI सहायक हैं। किसानों को हिंदी में सहायता प्रदान करें। फसल प्रबंधन, रोग नियंत्रण, मौसम, सिंचाई, और बाजार की जानकारी दें।"
      : "You are an expert agricultural AI assistant. Help farmers with crop management, disease control, weather advice, irrigation, and market information. Keep responses practical and actionable.";

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!aiResponse.ok) {
      throw new Error("Failed to get AI response");
    }

    const aiData = await aiResponse.json();
    const response = aiData.choices[0].message.content;
    
    return c.json({ response, timestamp: new Date().toISOString() });
  } catch (error) {
    console.log("Chat message error:", error);
    return c.json({ error: "Failed to process message" }, 500);
  }
});

console.log("FarmWise server starting...");
serve(app.fetch);