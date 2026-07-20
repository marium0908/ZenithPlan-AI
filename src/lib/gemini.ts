export interface Message {
  role: "user" | "model";
  content: string;
}

export const chatModel = "gemini-3.5-flash";

function getMockAIResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes("carbon") || msg.includes("neutral") || msg.includes("footprint") || msg.includes("offset") || msg.includes("mitigate")) {
    return `🍃 Your Carbon-Neutral Travel Guide:

To achieve carbon-neutral travel, focus on three major high-impact pillars:

1. Optimize Transportation: Trains produce up to 80% fewer emissions than flights. If flying is unavoidable, opt for direct flights (takeoffs and landings emit the most carbon) and fly economy.
2. Support Certified Carbon Offsets: Use Gold Standard or Verified Carbon Standard (VCS) certified programs that support community reforestation.
3. Choose Low-Impact Accommodations: Stay at certified eco-lodges that leverage 100% solar or wind energy.

Would you like me to calculate a sample carbon budget for your next route? Just let me know the departure and arrival destinations!`;
  }

  if (msg.includes("pack") || msg.includes("list") || msg.includes("zero-waste") || msg.includes("luggage") || msg.includes("gear")) {
    return `🎒 Zenith Zero-Waste Packing Checklist:

Travel light, pack smart, and leave no trace! Here is our recommended checklist:

• Hydration: Double-walled insulated stainless steel bottle + portable water purifier/filter.
• Dining on the Go: Bamboo cutlery set, collapsible silicone container, and beeswax food wraps.
• Zero-Waste Toiletries: Solid shampoo/conditioner bars, bamboo toothbrush, toothpaste tablets, and mineral reef-safe sunscreen.
• Conscious Apparel: Choose breathable organic cotton, hemp, or recycled-fiber garments.

Pro Tip: Download digital tickets and travel maps beforehand to save paper!`;
  }

  if (msg.includes("costa rica") || msg.includes("patagonia")) {
    return `🌎 Costa Rica vs. Patagonia: Sustainable Showdown:

Both of these destinations are legends of eco-tourism, but offer completely different styles:

🇨🇷 Costa Rica (Tropical Biodiversity Hub)
• The Vibe: Lush rainforests, active volcanoes, beaches, and high-altitude cloud forests.
• Eco-Initiatives: Over 25% of land is protected national territory with carbon-offset canopy tours.
• Best for: Wildlife enthusiasts, warm-weather lovers, and wellness seekers.

🇦🇷🇨🇱 Patagonia (Glacial Frontier & Wilderness)
• The Vibe: Craggy granite peaks, sprawling glaciers, and pristine alpine lakes.
• Eco-Initiatives: Incredible preservation of native flora/fauna and carbon-neutral wind-powered glamping sites.
• Best for: Serious hikers, cooler climate lovers, and stargazers.

Which climate or activity fits your travel goal best? I can help customize a 7-day green itinerary for either!`;
  }

  if (msg.includes("wellness") || msg.includes("luxury") || msg.includes("spa")) {
    return `🧘 High-End Eco-Wellness Sanctuaries:

Luxury does not have to compromise ecological integrity. Here are three world-class sustainable wellness spots:

1. Mashpi Lodge, Ecuador: An ultra-modern sanctuary in a biological reserve with state-of-the-art energy architecture and scientific conservation tours.
2. Six Senses Douro Valley, Portugal: Renowned for deep wellness therapies, circular plastics-free operations, organic estate vineyards, and local wildlife shelter support.
3. Soneva Fushi, Maldives: The pioneer of barefoot luxury. Features a massive solar array, local waste-to-wealth recycling centers, and marine biology preservation labs.

Which region are you targeting? I can suggest closer boutique sanctuaries to limit your flight footprint!`;
  }

  if (msg.includes("adventure") || msg.includes("spot") || msg.includes("trip") || msg.includes("recommend") || msg.includes("where")) {
    return `🗺️ Top Sustainable Adventure Recommendations for 2026:

Here are three pristine, highly curated destinations focusing on regenerative, low-impact adventure:

1. The Azores, Portugal: Awarded global status for sustainable tourism. Explore volcanic craters, thermal hot springs, and go whale-watching with high-integrity marine biologists.
2. Svalbard, Norway: Experience the high Arctic responsibly. Take zero-emission electric snowmobile safaris, glacier hikes, and view polar bears under strict ecological protocols.
3. Tasmania, Australia: Over 40% of this island is protected parkland. Hike famous overland tracks and stay in carbon-neutral off-grid cabins.

Tell me your preferred type of adventure (hiking, diving, wildlife, or cultural) and I'll find your perfect matched destination!`;
  }

  // General fallback response
  return `🗺️ ZenithPlan Sustainable Travel Advisor:

I am fully ready to help you plan your next green getaway! Here are some sustainable topics we can dive into:

• Destinations: Finding carbon-neutral lodges, certified eco-resorts, and off-grid getaways.
• Mitigation: Calculating transportation offsets and choosing low-carbon routes.
• Packing & Gear: Designing personalized zero-waste, plastic-free travel kits.
• Custom Itineraries: Suggesting day-by-day itineraries that support local host communities.

Tell me where you want to go or what adventure you are dreaming of, and let's plan a journey that leaves a positive trace!`;
}

export async function getChatResponse(messages: Message[], businessName: string = "ZenithPlan AI"): Promise<string | undefined> {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages,
        businessName,
        systemInstruction: `You are ZenithPlan AI's eco travel companion for a company named "${businessName}". Your goal is to guide carbon mitigation, suggest zero-waste packing lists, calculate ESG budgets, and guide conscious global citizens with extreme ecological integrity. Keep answers relatively short, beautifully informative, and strictly sustainable.`
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error: any) {
    console.warn("Backend chat unavailable, falling back to smart local chatbot advisor:", error);
    // Get the last user message to generate a smart contextual response
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.content || "";
    return getMockAIResponse(lastUserMsg);
  }
}


