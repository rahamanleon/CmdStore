const axios = require('axios');

module.exports = {
  config: {
    name: "ifter",
    version: "1.3",
    author: "RL",
    countDown: 5,
    role: 0,
    shortDescription: { en: "Get Iftar time for your district." },
    description: { en: "Provides the Iftar time for any district in Bangladesh." },
    category: "Islamic",
    guide: { en: "Usage: {pn} <district>\nExample: {pn} Dhaka" }
  },

  onStart: async function ({ message, args }) {
    const districts = {
      // Dhaka Division (13)
      "dhaka": { lat: 23.8103, lon: 90.4125 },
      "faridpur": { lat: 23.6070, lon: 89.8340 },
      "gazipur": { lat: 23.9999, lon: 90.4203 },
      "gopalganj": { lat: 23.0050, lon: 89.8266 },
      "kishoreganj": { lat: 24.4449, lon: 90.7766 },
      "madaripur": { lat: 23.1754, lon: 90.1995 },
      "manikganj": { lat: 23.8644, lon: 90.0047 },
      "munshiganj": { lat: 23.5422, lon: 90.5305 },
      "narayanganj": { lat: 23.6238, lon: 90.4996 },
      "narsingdi": { lat: 23.9322, lon: 90.7150 },
      "rajbari": { lat: 23.7574, lon: 89.6440 },
      "shariatpur": { lat: 23.2423, lon: 90.4348 },
      "tangail": { lat: 24.2513, lon: 89.9167 },

      // Chattogram Division (11)
      "bandarban": { lat: 22.1953, lon: 92.2184 },
      "brahmanbaria": { lat: 23.9571, lon: 91.1116 },
      "chandpur": { lat: 23.2333, lon: 90.6710 },
      "chattogram": { lat: 22.3569, lon: 91.7832 },
      "cox's bazar": { lat: 21.4272, lon: 92.0058 },
      "cumilla": { lat: 23.4573, lon: 91.2045 },
      "feni": { lat: 23.0231, lon: 91.3960 },
      "khagrachari": { lat: 23.1193, lon: 91.9846 },
      "lakshmipur": { lat: 22.9440, lon: 90.8412 },
      "noakhali": { lat: 22.8696, lon: 91.0990 },
      "rangamati": { lat: 22.7333, lon: 92.2985 },

      // Khulna Division (10)
      "bagerhat": { lat: 22.8138, lon: 89.7856 },
      "chuadanga": { lat: 23.6400, lon: 88.8413 },
      "jashore": { lat: 23.1667, lon: 89.2080 },
      "jhenaidah": { lat: 23.5440, lon: 89.1531 },
      "khulna": { lat: 22.8456, lon: 89.5403 },
      "kushtia": { lat: 23.9013, lon: 89.1205 },
      "magura": { lat: 23.4873, lon: 89.4193 },
      "meherpur": { lat: 23.7622, lon: 88.6318 },
      "narail": { lat: 23.1725, lon: 89.5120 },
      "satkhira": { lat: 22.7185, lon: 89.0705 },

      // Rajshahi Division (8)
      "bogura": { lat: 24.8466, lon: 89.3773 },
      "chapainawabganj": { lat: 24.1000, lon: 88.5333 },
      "joypurhat": { lat: 25.0968, lon: 89.0227 },
      "naogaon": { lat: 24.9115, lon: 88.7533 },
      "natore": { lat: 24.4206, lon: 89.0003 },
      "pabna": { lat: 24.0064, lon: 89.2372 },
      "rajshahi": { lat: 24.3745, lon: 88.6042 },
      "sirajganj": { lat: 24.4569, lon: 89.7083 },

      // Barisal Division (6)
      "barishal": { lat: 22.7010, lon: 90.3535 },
      "bhola": { lat: 22.6859, lon: 90.6480 },
      "barguna": { lat: 22.0953, lon: 90.1121 },
      "jhalokathi": { lat: 22.6406, lon: 90.2000 },
      "patuakhali": { lat: 22.3596, lon: 90.3299 },
      "pirojpur": { lat: 22.5800, lon: 89.9700 },

      // Sylhet Division (4)
      "sylhet": { lat: 24.8949, lon: 91.8687 },
      "moulvibazar": { lat: 24.4829, lon: 91.7774 },
      "habiganj": { lat: 24.3750, lon: 91.4167 },
      "sunamganj": { lat: 25.0657, lon: 91.3950 },

      // Rangpur Division (8)
      "dinajpur": { lat: 25.6270, lon: 88.6376 },
      "gaibandha": { lat: 25.3288, lon: 89.5289 },
      "kurigram": { lat: 25.8073, lon: 89.6362 },
      "lalmonirhat": { lat: 25.9923, lon: 89.2847 },
      "nilphamari": { lat: 25.9310, lon: 88.8560 },
      "panchagarh": { lat: 26.3411, lon: 88.5542 },
      "rangpur": { lat: 25.7439, lon: 89.2752 },
      "thakurgaon": { lat: 26.0337, lon: 88.4617 },

      // Mymensingh Division (4)
      "mymensingh": { lat: 24.7471, lon: 90.4203 },
      "jamalpur": { lat: 24.9370, lon: 89.9370 },
      "netrokona": { lat: 24.8700, lon: 90.7276 },
      "sherpur": { lat: 25.0196, lon: 90.0182 }
    };

    if (args.length === 0) return message.reply("Please provide a valid district name.");
    
    const district = args.join(" ").toLowerCase();
    if (!districts[district]) return message.reply("Invalid district name. Please check your spelling.");

    const { lat, lon } = districts[district];
    const today = new Date();
    // Format date as D-M-YYYY
    const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

    try {
      const res = await axios.get(`https://api.aladhan.com/v1/timings/${date}?latitude=${lat}&longitude=${lon}&method=2`);
      
      // Verify API returned valid JSON data
      if (!res.data || !res.data.data || !res.data.data.timings) {
        return message.reply("⚠️ | API returned unexpected data. Please try again later.");
      }
      
      const iftarTime24h = res.data.data.timings.Maghrib;
      const iftarTime12h = convertTo12Hour(iftarTime24h);
      
      return message.reply(`🕌 Iftar time in ${district.charAt(0).toUpperCase() + district.slice(1)} is at ${iftarTime12h}.`);
    } catch (error) {
      console.error("API Error:", error);
      return message.reply("❌ | Failed to fetch Iftar time. Please try again later.");
    }
  }
};

function convertTo12Hour(time) {
  let [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; 
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes} ${period}`;
}
