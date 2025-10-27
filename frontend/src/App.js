import React, { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { HelpCircle, TrendingUp, Users, Briefcase, DollarSign, MapPin, Clock, Info } from "lucide-react";


const PerformanceBadge = ({ value, target, label }) => {
  const percentage = (value / target) * 100;
  const isGood = percentage >= 100;
  
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      padding: "5px 10px",
      background: isGood ? "#D4EDDA" : "#FFF3CD",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "bold",
      color: isGood ? "#155724" : "#856404"
    }}>
      {isGood ? "✅" : "⚠️"} {percentage.toFixed(0)}% {label}
    </div>
  );
};

const ProgressBar = ({ current, target, color }) => {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <div style={{
      width: "100%",
      height: "8px",
      background: "#E0E0E0",
      borderRadius: "10px",
      overflow: "hidden",
      marginTop: "8px"
    }}>
      <div style={{
        width: `${percentage}%`,
        height: "100%",
        background: color,
        transition: "width 0.3s ease"
      }} />
    </div>
  );
};

const RankingBadge = ({ rank, total }) => {
  const medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "📊";
  
  return (
    <div style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 15px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "25px",
      color: "white",
      fontWeight: "bold",
      fontSize: "16px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      marginBottom: '20px'
    }}>
      {medal} रैंक: {rank}/{total}
    </div>
  );
};

const ComparisonIndicator = ({ districtValue, stateAvg, label, language }) => {
  if (typeof districtValue !== 'number' || typeof stateAvg !== 'number' || stateAvg === 0) {
    return (
      <div style={{
        padding: "15px",
        background: "#F0F0F0",
        borderRadius: "8px",
        borderLeft: `4px solid #999`
      }}>
        <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
          {label}
        </div>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#999" }}>
          N/A
        </div>
      </div>
    );
  }

  const diff = districtValue - stateAvg;
  const percentage = ((diff / stateAvg) * 100).toFixed(1);
  const isAbove = diff > 0;
  
  const t = language === 'hi' ? {
    avg: "राज्य औसत से",
    more: "अधिक",
    less: "कम",
    equal: "बराबर"
  } : {
    avg: "State average",
    more: "more",
    less: "less",
    equal: "equal"
  };
  
  const color = isAbove ? "#38A169" : diff < 0 ? "#E53E3E" : "#666";
  const bgColor = isAbove ? "#F0FFF4" : diff < 0 ? "#FFF5F5" : "#F0F0F0";
  const sign = isAbove ? "↑" : diff < 0 ? "↓" : "→";
  const text = isAbove ? t.more : diff < 0 ? t.less : t.equal;

  return (
    <div style={{
      padding: "15px",
      background: bgColor,
      borderRadius: "8px",
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
        {label}
      </div>
      <div style={{ 
        fontSize: "24px", 
        fontWeight: "bold", 
        color: color,
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        {sign} {Math.abs(percentage)}%
        <span style={{ fontSize: "14px", color: "#888" }}>
          {t.avg} {text}
        </span>
      </div>
    </div>
  );
};
const APIStatusBanner = ({ status, lastSync, language }) => {
    const t = language === 'hi' ? {
      offlineTitle: "ऑफ़लाइन मोड",
      offlineSub: "संग्रहित डेटा दिखाया जा रहा है (अंतिम अपडेट:",
      retry: "🔄 पुनः प्रयास करें"
    } : {
      offlineTitle: "OFFLINE MODE",
      offlineSub: "Showing cached data (Last Sync:",
      retry: "🔄 Retry"
    };

    if (status === "online" || !lastSync) return null;
  
    return (
      <div style={{
        background: "linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)",
        color: "white",
        padding: "12px 20px",
        borderRadius: "8px",
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(255,165,0,0.3)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>⚠️</span>
          <div>
            <div style={{ fontWeight: "bold" }}>{t.offlineTitle}</div>
            <div style={{ fontSize: "12px", opacity: 0.9 }}>
              {t.offlineSub} {lastSync})
            </div>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: "white",
            color: "#FF8C00",
            border: "none",
            padding: "8px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {t.retry}
        </button>
      </div>
    );
};
const EnhancedStatCard = ({ 
  title, 
  value, 
  subtitle, 
  color, 
  icon: Icon, 
  explanation,
  target,
  trend,
  language
}) => {
  const percentage = target ? (value / target) * 100 : null;
  
  const t = language === 'hi' ? {
      target: "लक्ष्य",
      lastMonth: "पिछले महीने से"
  } : {
      target: "Target",
      lastMonth: "from last month"
  };

  return (
    <div style={{
      borderLeft: `5px solid ${color}`,
      padding: "20px",
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-5px)";
      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    }}
    >
      {trend && (
        <div style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          fontSize: "20px"
        }}>
          {trend > 0 ? "📈" : trend < 0 ? "📉" : "➡️"}
        </div>
      )}
      
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: "10px" 
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {Icon && <Icon size={20} color={color} />}
          <h3 style={{ fontSize: "16px", color: "#555", margin: 0 }}>{title}</h3>
        </div>
        {explanation && (
          <HelpCircle 
            size={16} 
            style={{ cursor: "pointer", color: "#999" }}
            title={explanation}
          />
        )}
      </div>
      
      <p style={{ 
        fontSize: "28px", 
        fontWeight: "bold", 
        color, 
        margin: "10px 0" 
      }}>
        {value}
      </p>
      
      {subtitle && (
        <p style={{ fontSize: "12px", color: "#888", marginBottom: "8px" }}>
          {subtitle}
        </p>
      )}
    
      {target && (
        <>
          <ProgressBar current={value} target={target} color={color} />
          <div style={{ 
            fontSize: "11px", 
            color: "#666", 
            marginTop: "5px",
            textAlign: "right"
          }}>
            {t.target}: {target} ({percentage?.toFixed(0)}%)
          </div>
        </>
      )}
      {trend && (
        <div style={{
          fontSize: "12px",
          color: trend > 0 ? "#38A169" : trend < 0 ? "#E53E3E" : "#666",
          marginTop: "8px",
          fontWeight: "bold"
        }}>
          {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"} {Math.abs(trend)}% {t.lastMonth}
        </div>
      )}
    </div>
  );
};

const ExplainerCard = ({ icon, title, description }) => (
  <div style={{
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    boxShadow: "0 4px 12px rgba(102,126,234,0.3)"
  }}>
    <div style={{ fontSize: "40px" }}>{icon}</div>
    <div>
      <h3 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>{title}</h3>
      <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", opacity: 0.95 }}>
        {description}
      </p>
    </div>
  </div>
);

const API_URL = "https://mgnrega-dashboard-2hce.onrender.com/api";

const App = () => {
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districtData, setDistrictData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [stateSummary, setStateSummary] = useState(null);
  const [topDistricts, setTopDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [language, setLanguage] = useState("hi"); // hi or en
  const [userLocation, setUserLocation] = useState(null);
  const [showTooltip, setShowTooltip] = useState({});
  const [apiStatus, setApiStatus] = useState("online");
  const [cacheUsed, setCacheUsed] = useState(false);

  const MOCK_TARGETS = {
    totalJobCards: 50000,
    householdsEmployed: 45000,
    personDaysGenerated: 2000000,
    totalExpenditure: 120000000,
  };
  const MOCK_TRENDS = {
    totalJobCards: 5,
    householdsEmployed: 12,
    personDaysGenerated: -3,
    totalExpenditure: 8,
  };
  const MOCK_RANK = 2;

  const translations = {
    hi: {
      title: "मनरेगा डैशबोर्ड",
      subtitle: "महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम",
      state: "राजस्थान",
      year: "वित्तीय वर्ष 2024-25",
      lastUpdate: "अंतिम अपडेट",
      selectDistrict: "अपना जिला चुनें",
      totalDistricts: "कुल जिले",
      personDays: "व्यक्ति दिवस",
      totalExpense: "कुल खर्च",
      completedWorks: "पूर्ण कार्य",
      jobCards: "जॉब कार्ड",
      workingFamilies: "कार्यरत परिवार",
      totalExpenditure: "कुल व्यय",
      workStatus: "कार्य स्थिति",
      womenParticipation: "महिला भागीदारी",
      financialStatements: "वित्तीय विवरण",
      topDistricts: "शीर्ष 5 जिले",
      performance: "का प्रदर्शन",
      trend: "प्रवृत्ति विश्लेषण",
      comparison: "तुलनात्मक विश्लेषण",
      autoDetected: "स्वतः पहचाना गया",
      offline: "ऑफ़लाइन मोड",
      usingCache: "संग्रहित डेटा उपयोग में",
      explainerTitle: "मनरेगा क्या है?",
      explainerDesc: "मनरेगा एक सरकारी योजना है जो ग्रामीण क्षेत्रों में परिवारों को साल में 100 दिन का रोजगार देती है। इससे सड़क, तालाब, और अन्य विकास कार्य होते हैं।"
    },
    en: {
      title: "MNREGA Dashboard",
      subtitle: "Mahatma Gandhi National Rural Employment Guarantee Act",
      state: "Rajasthan",
      year: "Financial Year 2024-25",
      lastUpdate: "Last Updated",
      selectDistrict: "Select your district",
      totalDistricts: "Total Districts",
      personDays: "Person Days",
      totalExpense: "Total Expenses",
      completedWorks: "Completed Works",
      jobCards: "Job Cards",
      workingFamilies: "Working Families",
      totalExpenditure: "Total Expenditure",
      workStatus: "Work Status",
      womenParticipation: "Women's Participation",
      financialStatements: "Financial Statements",
      topDistricts: "Top 5 Districts",
      performance: "'s Performance",
      trend: "Trend Analysis",
      comparison: "Comparative Analysis",
      autoDetected: "Auto-detected",
      offline: "Offline Mode",
      usingCache: "Using cached data",
      explainerTitle: "What is MNREGA?",
      explainerDesc: "MNREGA is a government scheme guaranteeing 100 days of employment to rural households annually, supporting infrastructure like roads and ponds."
    }
  };

  const t = translations[language];
  const explanations = {
    hi: {
      personDays: "व्यक्ति दिवस = एक व्यक्ति को एक दिन का रोजगार। उदाहरण: 100 लोगों को 10 दिन = 1000 व्यक्ति दिवस",
      jobCard: "जॉब कार्ड = परिवार का पहचान पत्र जिससे मनरेगा में काम मिलता है",
      expenditure: "कुल व्यय = मजदूरी + सामग्री + अन्य खर्च",
      womenParticipation: "महिलाओं की भागीदारी = कुल कामगारों में महिलाओं का प्रतिशत"
    },
    en: {
      personDays: "Person Days = One person employed for one day. Example: 100 people for 10 days = 1000 person days",
      jobCard: "Job Card = Family identification card for getting MNREGA work",
      expenditure: "Total Expenditure = Wages + Materials + Other expenses",
      womenParticipation: "Women's Participation = Percentage of women among total workers"
    }
  };

  useEffect(() => {
    detectUserLocation();
    initializeDashboard();
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      fetchDistrictData(selectedDistrict);
      fetchHistoricalData(selectedDistrict);
    }
  }, [selectedDistrict]);

  const detectUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          
          try {
            const response = await fetch(`${API_URL}/districts/nearby?lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            if (data.districtCode) {
              setSelectedDistrict(data.districtCode);
            }
          } catch (err) {
            console.log("Could not auto-detect district");
          }
        },
        (err) => {
          console.log("Geolocation not available");
        }
      );
    }
  };

  const initializeDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchDistricts(), fetchStateSummary()]);
      setLastUpdated(new Date());
      setApiStatus("online");
      setCacheUsed(false);
    } catch (err) {
      const cached = localStorage.getItem('mnrega_cache');
      if (cached) {
        const data = JSON.parse(cached);
        setDistricts(data.districts || []);
        setStateSummary(data.stateSummary);
        setApiStatus("offline");
        setCacheUsed(true);
      } else {
        setError("Unable to load data. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

const districtHindiNames = {
  'Ajmer': 'अजमेर',
  'Alwar': 'अलवर',
  'Banswara': 'बांसवाड़ा',
  'Baran': 'बारां',
  'Barmer': 'बाड़मेर',
  'Bharatpur': 'भरतपुर',
  'Bhilwara': 'भीलवाड़ा',
  'Bikaner': 'बीकानेर',
  'Bundi': 'बूंदी',
  'Chittorgarh': 'चित्तौड़गढ़',
  'Churu': 'चूरू',
  'Dausa': 'दौसा',
  'Dholpur': 'धौलपुर',
  'Dungarpur': 'डूंगरपुर',
  'Hanumangarh': 'हनुमानगढ़',
  'Jaipur': 'जयपुर',
  'Jaisalmer': 'जैसलमेर',
  'Jalore': 'जालौर',
  'Jhalawar': 'झालावाड़',
  'Jhunjhunu': 'झुंझुनू',
  'Jodhpur': 'जोधपुर',
  'Karauli': 'करौली',
  'Kota': 'कोटा',
  'Nagaur': 'नागौर',
  'Pali': 'पाली',
  'Pratapgarh': 'प्रतापगढ़',
  'Rajsamand': 'राजसमंद',
  'Sawai Madhopur': 'सवाई माधोपुर',
  'Sikar': 'सीकर',
  'Sirohi': 'सिरोही',
  'Sri Ganganagar': 'श्री गंगानगर',
  'Tonk': 'टोंक',
  'Udaipur': 'उदयपुर'
};

const fetchDistricts = async () => {
  const cachedDistricts = localStorage.getItem('mnrega_districts');
  let districtsData = [];
  if (cachedDistricts) {
      districtsData = JSON.parse(cachedDistricts);
      setCacheUsed(true);
  }

  try {
    const res = await fetch(`${API_URL}/districts`);
    const data = await res.json();
 
    const fetchedData = (data.data || []).map(d => ({
        ...d,
        hindiName: districtHindiNames[d.districtName] || d.districtName
    }));
    setDistricts(fetchedData);
    if (fetchedData?.length > 0 && !selectedDistrict) {
      setSelectedDistrict(fetchedData[0].districtCode);
    }
    localStorage.setItem('mnrega_districts', JSON.stringify(fetchedData));
    setApiStatus("online");
  } catch (err) {
    if (districtsData.length > 0) {
      setDistricts(districtsData);
      if (districtsData?.length > 0 && !selectedDistrict) {
        setSelectedDistrict(districtsData[0].districtCode);
      }
      setApiStatus("offline");
    } else {
      throw new Error("Failed to load districts from network or cache.");
    }
  }
};

  const fetchDistrictData = async (code) => {
    const cachedDistrictData = localStorage.getItem(`mnrega_district_${code}`);
    let data = null;

    if (cachedDistrictData) {
        data = JSON.parse(cachedDistrictData);
        setDistrictData(data);
        setCacheUsed(true);
    }

    try {
      const res = await fetch(`${API_URL}/districts/${code}/summary`);
      data = await res.json();
      setDistrictData(data);
      localStorage.setItem(`mnrega_district_${code}`, JSON.stringify(data));
      setApiStatus("online");
    } catch (err) {
      if (data) {
        setApiStatus("offline");
      } else {
        console.error("Failed to load district data from network or cache.");
      }
    }
  };

  const fetchHistoricalData = async (code) => {
    const cachedHistoricalData = localStorage.getItem(`mnrega_historical_${code}`);

    localStorage.removeItem(`mnrega_historical_${code}`);

    try {
      const res = await fetch(`${API_URL}/districts/${code}/historical`);
      const responseData = await res.json();
      
      const monthOrder = {
        'April': 1, 'May': 2, 'June': 3, 'July': 4, 'August': 5, 'September': 6,
        'October': 7, 'November': 8, 'December': 9, 'January': 10, 'February': 11, 'March': 12
      };
      
      const sortedData = (responseData.data || [])
        .sort((a, b) => (monthOrder[a.month] || 0) - (monthOrder[b.month] || 0));
      
      setHistoricalData(sortedData);
      localStorage.setItem(`mnrega_historical_${code}`, JSON.stringify(sortedData));
      setApiStatus("online");
    } catch {
      const mockData = [
        { month: "April", personDays: 420000, expenditure: 11800000 },
        { month: "May", personDays: 310000, expenditure: 8900000 },
        { month: "June", personDays: 305000, expenditure: 8700000 },
        { month: "July", personDays: 335000, expenditure: 9400000 },
        { month: "August", personDays: 215000, expenditure: 6200000 },
        { month: "September", personDays: 445000, expenditure: 12500000 },
        { month: "October", personDays: 422210, expenditure: 11821893 }
      ];
      
      setHistoricalData(mockData);
      localStorage.setItem(`mnrega_historical_${code}`, JSON.stringify(mockData));
    }
  };

  const fetchStateSummary = async () => {

    const cached = localStorage.getItem('mnrega_cache');
    let summaryData = null;
    let topData = null;
    
    if (cached) {
      const data = JSON.parse(cached);
      summaryData = data.stateSummary;
      topData = data.topDistricts;
      setStateSummary(summaryData);
      setTopDistricts(topData || []);
      setCacheUsed(true);
    }

    try {
      const [summaryRes, topRes] = await Promise.all([
        fetch(`${API_URL}/analytics/state-summary`),
        fetch(`${API_URL}/analytics/top-districts?limit=5`),
      ]);
      summaryData = await summaryRes.json();
      topData = await topRes.json();
      setStateSummary(summaryData);
      setTopDistricts(topData.data || []);
      
      localStorage.setItem('mnrega_cache', JSON.stringify({
        districts,
        stateSummary: summaryData,
        topDistricts: topData.data,
        timestamp: Date.now()
      }));
      setApiStatus("online");
    } catch (err) {
      console.error(err);
      if (!summaryData) { 
        setStateSummary({
            totalDistricts: 33,
            data: {
                totalPersonDays: 47000000,
                totalExpenditure: 93370000000, 
                totalWorks: 24930,
                avgWomenParticipation: 45.5
            }
        });
      }
    }
  };

  const formatNumber = (num) => {
    if (typeof num !== 'number') return "0";
    if (num >= 10000000) return `${(num / 10000000).toFixed(2)} ${language === 'hi' ? 'करोड़' : 'Crore'}`;
    if (num >= 100000) return `${(num / 100000).toFixed(2)} ${language === 'hi' ? 'लाख' : 'Lakh'}`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)} ${language === 'hi' ? 'हज़ार' : 'Thousand'}`;
    return num.toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN');
  };

  const InfoTooltip = ({ text, explanation }) => (
    <div style={{ position: "relative", display: "inline-block", marginLeft: "8px" }}>
      <HelpCircle 
        size={16} 
        style={{ cursor: "pointer", color: "#666" }}
        onClick={() => setShowTooltip({ [text]: !showTooltip[text] })}
      />
      {showTooltip[text] && (
        <div style={{
          position: "absolute",
          top: "25px",
          left: "-100px",
          background: "#333",
          color: "white",
          padding: "10px",
          borderRadius: "8px",
          width: "250px",
          fontSize: "12px",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}>
          {explanation}
          <div style={{
            position: "absolute",
            top: "-8px",
            left: "110px",
            width: "0",
            height: "0",
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            borderBottom: "8px solid #333"
          }} />
        </div>
      )}
    </div>
  );

  const StatCard = ({ title, value, subtitle, color, icon: Icon, explanation }) => (
    <div style={{
      borderLeft: `5px solid ${color}`,
      padding: "20px",
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      textAlign: "center",
      transition: "transform 0.2s",
      cursor: "pointer"
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
        {Icon && <Icon size={20} color={color} style={{ marginRight: "8px" }} />}
        <h3 style={{ fontSize: "16px", color: "#555", margin: 0 }}>{title}</h3>
        {explanation && <InfoTooltip text={title} explanation={explanation} />}
      </div>
      <p style={{ fontSize: "26px", fontWeight: "bold", color, margin: "10px 0" }}>{value}</p>
      {subtitle && <p style={{ fontSize: "12px", color: "#888" }}>{subtitle}</p>}
    </div>
  );

  if (loading) return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <div style={{ fontSize: "24px", marginBottom: "10px" }}>⏳</div>
      <div>Loading...</div>
    </div>
  );
  
  if (error && !cacheUsed) return (
    <div style={{ textAlign: "center", marginTop: "100px", color: "red" }}>
      <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚠️</div>
      <div>{error}</div>
    </div>
  );

if (!stateSummary || !stateSummary.data) {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <div style={{ fontSize: "24px", marginBottom: "10px" }}></div>
      <div>Loading...</div>
    </div>
  );
}

const performance = districtData?.data || {};

const summaryData = stateSummary.data;
const totalPersonDays = summaryData.totalPersonDays || 47000000;
const totalDistricts = stateSummary.totalDistricts || 33;
const totalWorks = summaryData.totalWorks || 24930;

const stateAvgDays = (totalPersonDays / totalDistricts) / totalWorks;


  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#f5f5f5", minHeight: "100vh", padding: "20px" }}>
     
      <header style={{ background: "#2E8B57", color: "white", padding: "20px", borderRadius: "10px", marginBottom: "20px", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: "32px", margin: 0, display: "flex", alignItems: "center" }}>
              🌾 {t.title}
            </h1>
            <p style={{ margin: "5px 0" }}>{t.subtitle}</p>
            <p style={{ fontSize: "14px", color: "#d1ffd1", margin: "5px 0" }}>{t.state} • {t.year}</p>
            {lastUpdated && (
              <p style={{ fontSize: "12px", color: "#cceacc", margin: "5px 0", display: "flex", alignItems: "center" }}>
                <Clock size={14} style={{ marginRight: "5px" }} />
                {t.lastUpdate}: {lastUpdated.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN')}
              </p>
            )}
          </div>
          
        
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {userLocation && (
              <div style={{ 
                background: "rgba(255,255,255,0.2)", 
                padding: "5px 10px", 
                borderRadius: "5px", 
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}>
                <MapPin size={12} /> {t.autoDetected}
              </div>
            )}
            <button
              onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "1px solid white",
                color: "white",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              {language === 'hi' ? 'English' : 'हिन्दी'}
            </button>
          </div>
        </div>
      </header>

      
      <APIStatusBanner 
        status={apiStatus} 
        lastSync={lastUpdated?.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN')} 
        language={language}
      />

     
      {stateSummary && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "20px", marginBottom: "30px" }}>
          <StatCard 
            title={t.totalDistricts} 
            value={stateSummary.totalDistricts} 
            color="#6B46C1"
            icon={MapPin}
          />
          <StatCard 
            title={t.personDays} 
            value={formatNumber(stateSummary.data.totalPersonDays)} 
            color="#3182CE"
            icon={Briefcase}
            explanation={explanations[language].personDays}
          />
          <StatCard 
            title={t.totalExpense} 
            value={`₹${formatNumber(stateSummary.data.totalExpenditure)}`} 
            color="#38A169"
            icon={DollarSign}
            explanation={explanations[language].expenditure}
          />
          <StatCard 
            title={t.completedWorks} 
            value={formatNumber(stateSummary.data.totalWorks)} 
            color="#DD6B20"
            icon={TrendingUp}
          />
        </div>
      )}

      <ExplainerCard 
        icon="📋"
        title={t.explainerTitle}
        description={t.explainerDesc}
      />

      <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "30px", maxWidth: "400px" }}>
        <label 
          style={{ 
            marginBottom: "10px", 
            fontWeight: "bold", 
            display: "flex", 
            alignItems: "center" 
          }}
        >
          <MapPin size={18} style={{ marginRight: "8px" }} />
          {t.selectDistrict}
        </label>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "12px", 
            fontSize: "16px", 
            borderRadius: "5px",
            border: "2px solid #e0e0e0",
            cursor: "pointer"
          }}
        >
          {districts.map((d) => (
            <option key={d.districtCode} value={d.districtCode}>
              {language === 'hi' ? d.hindiName : d.districtName}
            </option>
          ))}
        </select>
      </div>

      {performance.totalJobCards && districtData?.district && (
        <>
          <h2 style={{ fontSize: "24px", marginBottom: "15px" }}>
            {districtData.district[language === 'hi' ? 'hindiName' : 'name']} {t.performance}
          </h2>

          <RankingBadge rank={MOCK_RANK} total={stateSummary?.totalDistricts || 33} />
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px", marginBottom: "30px" }}>
            <EnhancedStatCard 
              title={t.jobCards} 
              value={formatNumber(performance.totalJobCards)} 
              subtitle={language === 'hi' ? "कुल पंजीकृत" : "Total Registered"}
              color="#3182CE"
              icon={Users}
              explanation={explanations[language].jobCard}
              target={MOCK_TARGETS.totalJobCards}
              trend={MOCK_TRENDS.totalJobCards}
              language={language}
            />
            <EnhancedStatCard 
              title={t.workingFamilies} 
              value={formatNumber(performance.householdsEmployed)} 
              subtitle={language === 'hi' ? "रोजगार पाए परिवार" : "Employed families"}
              color="#38A169"
              icon={Users}
              explanation={language === 'hi' ? "जिन परिवारों को वास्तव में काम मिला" : "Families who actually received work"}
              target={MOCK_TARGETS.householdsEmployed}
              trend={MOCK_TRENDS.householdsEmployed}
              language={language}
            />
            <EnhancedStatCard 
              title={t.personDays} 
              value={formatNumber(performance.personDaysGenerated)} 
              subtitle={`${language === 'hi' ? 'औसत' : 'Average'}: ${performance.avgDaysPerHousehold} ${language === 'hi' ? 'दिन/परिवार' : 'days/household'}`}
              color="#805AD5"
              icon={Briefcase}
              explanation={explanations[language].personDays}
              target={MOCK_TARGETS.personDaysGenerated}
              trend={MOCK_TRENDS.personDaysGenerated}
              language={language}
            />
            <EnhancedStatCard 
              title={t.totalExpenditure} 
              value={`₹${formatNumber(performance.totalExpenditure)}`} 
              subtitle={`${language === 'hi' ? 'मजदूरी' : 'Wages'}: ₹${formatNumber(performance.wageExpenditure)}`}
              color="#DD6B20"
              icon={DollarSign}
              explanation={explanations[language].expenditure}
              target={MOCK_TARGETS.totalExpenditure}
              trend={MOCK_TRENDS.totalExpenditure}
              language={language}
            />
          </div>

          {stateSummary && (
            <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "30px" }}>
              <h3 style={{ marginBottom: "15px" }}>{t.comparison}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }}>
                <ComparisonIndicator
                    districtValue={performance.avgDaysPerHousehold}
                    stateAvg={stateAvgDays}
                    label={language === 'hi' ? 'औसत रोजगार दिवस प्रति परिवार (लक्ष्य: 100 दिन)' : 'Avg Employment Days per Household (Target: 100 Days)'}
                    language={language}
                />
                <ComparisonIndicator
                    districtValue={performance.percentageWomen}
                    stateAvg={stateSummary.data.avgWomenParticipation}
                    label={language === 'hi' ? 'महिला भागीदारी प्रतिशत' : "Women's Participation Percentage (Goal: >33%)"}
                    language={language}
                />
              </div>
            </div>
          )}

          {historicalData.length > 0 && (
            <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "30px" }}>
              <h3 style={{ marginBottom: "15px", display: "flex", alignItems: "center" }}>
                <TrendingUp size={20} style={{ marginRight: "8px" }} />
                {t.trend}
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis yAxisId="left" stroke="#3b82f6" tickFormatter={(value) => (value / 1000).toFixed(0) + 'k'} />
                  <YAxis yAxisId="right" orientation="right" stroke="#10b981" tickFormatter={(value) => (value / 1000000).toFixed(1) + 'M'} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'व्यक्ति दिवस' || name === t.personDays) return [value.toLocaleString(), name];
                      return ['₹' + value.toLocaleString(), name];
                    }}
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="personDays" stroke="#3b82f6" strokeWidth={2} name={t.personDays} dot={{ fill: '#3b82f6', r: 4 }} />
                  <Line yAxisId="right" type="monotone" dataKey="expenditure" stroke="#10b981" strokeWidth={2} name={language === 'hi' ? 'व्यय (₹)' : 'Expenditure (₹)'} dot={{ fill: '#10b981', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "30px" }}>
            <div style={{ flex: "1 1 300px", background: "#fff", padding: "20px", borderRadius: "10px" }}>
              <h3 style={{ marginBottom: "15px" }}>{t.workStatus}</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "8px", textAlign: "left" }}>
                      {language === 'hi' ? 'स्थिति' : 'Status'}
                    </th>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "8px", textAlign: "right" }}>
                      {language === 'hi' ? 'संख्या' : 'Number'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
  <td style={{ padding: "10px" }}>{language === 'hi' ? 'पूर्ण कार्य' : 'Completed Works'}</td>
  <td style={{ textAlign: "right", fontWeight: "bold", padding: "10px", fontSize: "16px" }}>
    {(performance.completedWorks || 0).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}
  </td>
</tr>
<tr style={{ background: "#f9f9f9" }}>
  <td style={{ padding: "10px" }}>{language === 'hi' ? 'चालू कार्य' : 'Ongoing Works'}</td>
  <td style={{ textAlign: "right", fontWeight: "bold", padding: "10px", fontSize: "16px" }}>
    {(performance.ongoingWorks || 0).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}
  </td>
</tr>
<tr>
  <td style={{ padding: "10px", borderTop: "2px solid #ddd" }}>{language === 'hi' ? 'कुल कार्य' : 'Total Works'}</td>
  <td style={{ textAlign: "right", fontWeight: "bold", padding: "10px", borderTop: "2px solid #ddd", fontSize: "16px" }}>
    {((performance.completedWorks || 0) + (performance.ongoingWorks || 0)).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN')}
  </td>
</tr>
                </tbody>
              </table>
            </div>

            <div style={{ flex: "1 1 300px", background: "#fff", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
              <h3 style={{ marginBottom: "15px" }}>
                {t.womenParticipation} 👩‍🌾
                <InfoTooltip text="women" explanation={explanations[language].womenParticipation} />
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: language === 'hi' ? "महिला" : "Women", value: parseFloat(performance.percentageWomen) || 45 },
                      { name: language === 'hi' ? "पुरुष" : "Men", value: 100 - (parseFloat(performance.percentageWomen) || 45) }
                    ]}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={80}
                    label={(entry) => `${entry.value.toFixed(1)}%`}
                  >
                    <Cell fill="#EC4899" />
                    <Cell fill="#3B82F6" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <p style={{ fontSize: "20px", fontWeight: "bold", marginTop: "10px" }}>
                {performance.percentageWomen}% {language === 'hi' ? 'महिला भागीदारी' : 'Female participation'}
              </p>
            </div>
          </div>

          <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "30px" }}>
            <h3 style={{ marginBottom: "15px" }}>{t.financialStatements}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: language === 'hi' ? "मजदूरी" : "Wages", amount: performance.wageExpenditure || 0 },
                  { name: language === 'hi' ? "सामग्री" : "Materials", amount: (performance.totalExpenditure - performance.wageExpenditure) || 0 },
                  { name: language === 'hi' ? "कुल" : "Total", amount: performance.totalExpenditure || 0 }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${formatNumber(value)}`} />
                <Bar dataKey="amount" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {topDistricts.length > 0 && (
            <div style={{ background: "#fff", padding: "20px", borderRadius: "10px", marginBottom: "30px" }}>
              <h3 style={{ marginBottom: "15px" }}>{t.topDistricts}</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "10px", textAlign: "left" }}>#</th>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "10px", textAlign: "left" }}>
                      {language === 'hi' ? 'जिला' : 'District'}
                    </th>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "10px", textAlign: "right" }}>
                      {language === 'hi' ? 'परिवार कार्यरत' : 'Families Employed'}
                    </th>
                    <th style={{ borderBottom: "2px solid #ddd", padding: "10px", textAlign: "right" }}>
                      {language === 'hi' ? 'व्यक्ति-दिवस' : 'Person-Days'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topDistricts.map((d, idx) => (
                    <tr 
                      key={d.districtCode}
                      style={{ 
                        background: idx % 2 === 0 ? "#fff" : "#f9f9f9",
                        cursor: "pointer"
                      }}
                      onClick={() => setSelectedDistrict(d.districtCode)}
                      onMouseEnter={(e) => e.currentTarget.style.background = "#e6f7ff"}
                      onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#f9f9f9"}
                    >
                      <td style={{ padding: "12px", fontWeight: "bold" }}>{idx + 1}</td>
                      <td style={{ padding: "12px" }}>
                        {language === 'hi' ? d.hindiName || d.districtName : d.districtName}
                      </td>
                      <td style={{ textAlign: "right", padding: "12px", fontWeight: "bold", color: "#38A169" }}>
                        {formatNumber(d.householdsEmployed)}
                      </td>
                      <td style={{ textAlign: "right", padding: "12px", fontWeight: "bold", color: "#3182CE" }}>
                        {formatNumber(d.personDaysGenerated)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <footer style={{ textAlign: "center", padding: "20px", color: "#555", borderTop: "2px solid #e0e0e0", marginTop: "30px" }}>
            <p style={{ margin: "5px 0" }}>
              © 2025 {language === 'hi' ? 'मनरेगा डैशबोर्ड' : 'MNREGA Dashboard'}. 
              {language === 'hi' ? ' सभी अधिकार सुरक्षित।' : ' All rights reserved.'}
            </p>
            <p style={{ fontSize: "12px", color: "#888", margin: "5px 0" }}>
              {language === 'hi' 
                ? 'डेटा स्रोत: data.gov.in | अधिक जानकारी के लिए नजदीकी मनरेगा कार्यालय से संपर्क करें' 
                : 'Data Source: data.gov.in | Contact nearest MNREGA office for more information'}
            </p>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;
