import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Building,
  FileText,
  Shield,
  Globe,
  Linkedin,
  Twitter,
  Navigation,
  Clock,
  Layers,
  Route,
  Calendar,
  ExternalLink,
  Camera,
  Share2,
  Star,
  MapIcon,
  Compass,
  Users,
  Coffee,
  Car,
  Train,
  Bus,
  Plane,
  Hotel,
} from "lucide-react";
import { APIProvider, Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";

export default function Footer() {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 54.352, lng: 18.6466 });
  const [mapZoom, setMapZoom] = useState(15);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [showNearbyPlaces, setShowNearbyPlaces] = useState(false);
  const [activeTab, setActiveTab] = useState<'contact' | 'directions' | 'hours' | 'share'>('contact');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [mapError, setMapError] = useState<string | null>(null);
  const [apiLimited, setApiLimited] = useState(false);

  // Update time of day based on current time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setTimeOfDay('morning');
    else if (hour >= 12 && hour < 18) setTimeOfDay('afternoon');
    else if (hour >= 18 && hour < 22) setTimeOfDay('evening');
    else setTimeOfDay('night');
  }, []);

  const headquarters = {
    lat: 54.352,
    lng: 18.6466,
    address: "Jana Heweliusza 11/lokal 811",
    city: "80-890 Gdańsk",
    country: "Poland",
  };

  const nearbyPoints = [
    {
      id: "headquarters",
      position: headquarters,
      title: "DTO Partners Headquarters",
      description: "Our main office and consultation center",
      type: "office",
      workingHours: "Mon-Fri: 9:00 AM - 6:00 PM",
      rating: 4.8,
      reviews: 47,
    },
    {
      id: "parking",
      position: { lat: 54.3518, lng: 18.6464 },
      title: "Parking Area",
      description: "Available parking spaces for visitors",
      type: "parking",
      capacity: "50 spaces",
    },
    {
      id: "public-transport",
      position: { lat: 54.3515, lng: 18.6470 },
      title: "Public Transport Hub",
      description: "Nearest bus and tram stops",
      type: "transport",
      lines: ["Bus 110, 122", "Tram 2, 6"],
    },
    {
      id: "coffee-shop",
      position: { lat: 54.3525, lng: 18.6460 },
      title: "Costa Coffee",
      description: "Perfect for client meetings",
      type: "amenity",
      category: "coffee",
    },
    {
      id: "hotel",
      position: { lat: 54.3510, lng: 18.6475 },
      title: "Business Hotel",
      description: "Recommended accommodation for visitors",
      type: "amenity",
      category: "hotel",
    },
    {
      id: "restaurant",
      position: { lat: 54.3530, lng: 18.6450 },
      title: "Fine Dining Restaurant",
      description: "Business lunch venue",
      type: "amenity",
      category: "restaurant",
    },
  ];

  const handleMarkerClick = useCallback((markerId: string) => {
    setSelectedMarker(markerId);
  }, []);

  const handleMapClick = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const handleDirections = () => {
    const address = encodeURIComponent(`${headquarters.address}, ${headquarters.city}, ${headquarters.country}`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
  };

  const focusOnHeadquarters = () => {
    setMapCenter(headquarters);
    setMapZoom(18);
    setSelectedMarker('headquarters');
  };

  const toggleNearbyPlaces = () => {
    setShowNearbyPlaces(!showNearbyPlaces);
  };

  const openStreetView = () => {
    const url = `https://www.google.com/maps/@${headquarters.lat},${headquarters.lng},3a,75y,90t/data=!3m6!1e1!3m4!1s0x0:0x0!2e0!7i13312!8i6656`;
    window.open(url, '_blank');
  };

  // Check if advanced APIs are available
  const checkApiCapabilities = async () => {
    try {
      // Simple test for Geocoding API (won't actually use it, just check availability)
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=test&key=${apiKey}`);
      if (response.status === 403) {
        setApiLimited(true);
        console.warn('Some Google Maps APIs are restricted. Using basic map functionality only.');
      }
    } catch (error) {
      console.warn('Unable to check API capabilities:', error);
      setApiLimited(true);
    }
  };

  // Run API check on component mount
  useEffect(() => {
    if (apiKey) {
      checkApiCapabilities();
    }
  }, []);

  const shareLocation = () => {
    const url = `https://www.google.com/maps/place/${headquarters.lat},${headquarters.lng}`;
    if (navigator.share) {
      navigator.share({
        title: 'DTO Partners Location',
        text: 'Visit our headquarters',
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Location link copied to clipboard!');
    }
  };

  const scheduleVisit = () => {
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Visit+DTO+Partners&location=${encodeURIComponent(`${headquarters.address}, ${headquarters.city}, ${headquarters.country}`)}&details=Visit+to+DTO+Partners+headquarters`;
    window.open(calendarUrl, '_blank');
  };

  const getMarkerIcon = (type: string, category?: string) => {
    const baseUrl = "https://maps.google.com/mapfiles/ms/icons/";
    switch (type) {
      case 'office':
        return `${baseUrl}orange-dot.png`;
      case 'parking':
        return `${baseUrl}blue-dot.png`;
      case 'transport':
        return `${baseUrl}green-dot.png`;
      case 'amenity':
        switch (category) {
          case 'coffee':
            return `${baseUrl}brown-dot.png`;
          case 'hotel':
            return `${baseUrl}purple-dot.png`;
          case 'restaurant':
            return `${baseUrl}pink-dot.png`;
          default:
            return `${baseUrl}yellow-dot.png`;
        }
      default:
        return `${baseUrl}red-dot.png`;
    }
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Debug API key in development
  useEffect(() => {
    if (!apiKey) {
      console.error('Google Maps API key is missing. Please check your .env file.');
    } else if (import.meta.env.DEV) {
      console.log('Google Maps API key loaded:', apiKey.slice(0, 10) + '...');
    }
  }, [apiKey]);

  const contactInfo = [
    {
      icon: Mail,
      label: "Candidates",
      value: "candidates@dtopartners.com",
      href: "mailto:candidates@dtopartners.com",
    },
    {
      icon: Building,
      label: "Business",
      value: "business@dtopartners.com",
      href: "mailto:business@dtopartners.com",
    },
    {
      icon: Mail,
      label: "General",
      value: "info@dtopartners.com",
      href: "mailto:info@dtopartners.com",
    },
  ];

  const phoneNumbers = [
    { number: "+48 500 785 691", href: "tel:+48500785691" },
    { number: "+48 573 729 525", href: "tel:+48573729525" },
  ];

  const companyData = [
    { icon: FileText, label: "KRS", value: "0001158155" },
    { icon: FileText, label: "REGON", value: "540998109" },
    { icon: FileText, label: "NIP", value: "5833531476" },
    { icon: Shield, label: "KRAZ", value: "33616" },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Globe, href: "#", label: "Website" },
  ];

  return (
    <APIProvider 
      apiKey={apiKey}
      onLoad={() => {
        console.log('Google Maps API loaded successfully');
        setMapError(null);
      }}
      onError={(error: unknown) => {
        console.error('Google Maps API failed to load:', error);
        setMapError('Failed to load Google Maps. Please check your API key configuration.');
      }}
    >
      <footer
        id="Contact"
        className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] text-white relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(218,165,32,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(218,165,32,0.05),transparent_50%)]" />

        <div className="relative">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 xl:grid-cols-2 min-h-[600px]">
            {/* Google Maps Section */}
            <motion.div
              className="relative h-[400px] md:h-[500px] xl:h-full order-2 xl:order-1"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e]/20 to-transparent pointer-events-none" />
              
              {/* Map Controls - Positioned to avoid Google controls */}
              <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10 flex flex-col gap-2 md:gap-3 pointer-events-auto max-w-[200px] md:max-w-xs">
                
                {/* Map Type Selector */}
                <motion.div
                  className="bg-white/95 backdrop-blur-lg rounded-lg md:rounded-xl p-2 md:p-3 border border-[#daa520]/20 shadow-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center gap-1 md:gap-2 mb-2">
                    <Layers className="w-3 h-3 md:w-4 md:h-4 text-[#1a1a2e]" />
                    <span className="text-xs md:text-sm font-medium text-[#1a1a2e]">Style</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {['roadmap', 'satellite', 'hybrid', 'terrain'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setMapType(type as any)}
                        className={`px-1.5 py-1 md:px-2 md:py-1 text-xs rounded transition-colors ${
                          mapType === type
                            ? 'bg-[#daa520] text-white'
                            : 'bg-gray-100 text-[#1a1a2e] hover:bg-gray-200'
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Nearby Places Toggle */}
                <motion.div
                  className="bg-white/95 backdrop-blur-lg rounded-lg md:rounded-xl p-2 md:p-3 border border-[#daa520]/20 shadow-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <button
                    onClick={toggleNearbyPlaces}
                    disabled={apiLimited}
                    className={`flex items-center gap-1 md:gap-2 transition-colors w-full ${
                      apiLimited 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : showNearbyPlaces 
                          ? 'text-[#daa520]' 
                          : 'text-[#1a1a2e] hover:text-[#daa520]'
                    }`}
                    title={apiLimited ? 'Feature requires additional Google Maps APIs' : ''}
                  >
                    <MapIcon className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="text-xs md:text-sm font-medium">
                      {apiLimited ? 'Places API Limited' : (showNearbyPlaces ? 'Hide' : 'Show') + ' Nearby'}
                    </span>
                  </button>
                  {apiLimited && (
                    <p className="text-xs text-gray-500 mt-1">
                      Enable Places API in Google Cloud Console
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Time-based Greeting - Positioned to avoid Google controls */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-auto md:top-6">
                <motion.div
                  className="bg-white/95 backdrop-blur-lg rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-2 border border-[#daa520]/20 shadow-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center gap-1 md:gap-2 text-[#1a1a2e]">
                    {timeOfDay === 'morning' && <span>🌅</span>}
                    {timeOfDay === 'afternoon' && <span>☀️</span>}
                    {timeOfDay === 'evening' && <span>🌆</span>}
                    {timeOfDay === 'night' && <span>🌙</span>}
                    <span className="text-xs md:text-sm font-medium">
                      Good {timeOfDay}!
                    </span>
                  </div>
                </motion.div>
              </div>
              
              {/* Google Maps */}
              <div className="h-full w-full relative">
                {!apiKey || mapError ? (
                  <div className="h-full w-full bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex flex-col items-center justify-center text-white p-8">
                    <MapPin className="w-16 h-16 text-[#daa520] mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Our Location</h3>
                    {mapError && (
                      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4 max-w-md">
                        <p className="text-red-200 text-sm">{mapError}</p>
                      </div>
                    )}
                    <p className="text-gray-300 text-center max-w-sm mb-4">
                      Jana Heweliusza 11/lokal 811<br/>
                      80-890 Gdańsk, Poland
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a 
                        href="https://maps.google.com/?q=54.352,18.6466" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-6 py-2 bg-[#daa520] text-white rounded-lg hover:bg-[#daa520]/80 transition-all duration-300 flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Google Maps
                      </a>
                      <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
                      >
                        Retry Loading Map
                      </button>
                    </div>
                  </div>
                ) : (
                  <Map
                  style={{ width: '100%', height: '100%' }}
                  center={mapCenter}
                  zoom={mapZoom}
                  mapTypeId={mapType}
                  gestureHandling={'cooperative'}
                  disableDefaultUI={false}
                  mapTypeControl={true}
                  streetViewControl={true}
                  fullscreenControl={true}
                  zoomControl={true}
                  scaleControl={true}
                  rotateControl={true}
                  onClick={handleMapClick}
                  styles={[
                    {
                      featureType: "all",
                      elementType: "geometry.fill",
                      stylers: [{ saturation: -30, lightness: 10 }]
                    },
                    {
                      featureType: "all",
                      elementType: "geometry.stroke",
                      stylers: [{ saturation: -30, lightness: 10 }]
                    },
                    {
                      featureType: "poi.business",
                      elementType: "geometry",
                      stylers: [{ visibility: "on" }]
                    }
                  ]}
                >
                  {nearbyPoints
                    .filter(point => {
                      // Always show office, parking, and transport
                      if (['office', 'parking', 'transport'].includes(point.type)) return true;
                      
                      // Only show amenities if APIs are available and toggle is on
                      if (point.type === 'amenity') {
                        return !apiLimited && showNearbyPlaces;
                      }
                      
                      return showNearbyPlaces;
                    })
                    .map((point) => (
                    <Marker
                      key={point.id}
                      position={point.position}
                      title={point.title}
                      onClick={() => handleMarkerClick(point.id)}
                      icon={getMarkerIcon(point.type, (point as any).category)}
                    />
                  ))}
                  
                  {selectedMarker && (
                    <InfoWindow
                      position={nearbyPoints.find(p => p.id === selectedMarker)?.position}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="p-4 max-w-sm">
                        {(() => {
                          const point = nearbyPoints.find(p => p.id === selectedMarker);
                          return point ? (
                            <div>
                              <h3 className="font-bold text-[#1a1a2e] mb-2 flex items-center gap-2">
                                {point.type === 'office' && <Building className="w-4 h-4 text-[#daa520]" />}
                                {point.type === 'parking' && <Car className="w-4 h-4 text-blue-600" />}
                                {point.type === 'transport' && <Bus className="w-4 h-4 text-green-600" />}
                                {point.type === 'amenity' && (point as any).category === 'coffee' && <Coffee className="w-4 h-4 text-amber-600" />}
                                {point.type === 'amenity' && (point as any).category === 'hotel' && <Hotel className="w-4 h-4 text-purple-600" />}
                                {point.type === 'amenity' && (point as any).category === 'restaurant' && <Users className="w-4 h-4 text-pink-600" />}
                                {point.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-3">{point.description}</p>
                              
                              {/* Rating for headquarters */}
                              {point.type === 'office' && (point as any).rating && (
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${i < Math.floor((point as any).rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {(point as any).rating} ({(point as any).reviews} reviews)
                                  </span>
                                </div>
                              )}

                              {/* Working hours */}
                              {(point as any).workingHours && (
                                <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                                  <Clock className="w-3 h-3" />
                                  {(point as any).workingHours}
                                </p>
                              )}

                              {/* Transport lines */}
                              {(point as any).lines && (
                                <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                                  <Train className="w-3 h-3" />
                                  {(point as any).lines.join(', ')}
                                </p>
                              )}

                              {/* Parking capacity */}
                              {(point as any).capacity && (
                                <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                                  <Car className="w-3 h-3" />
                                  {(point as any).capacity}
                                </p>
                              )}

                              <div className="flex gap-2 flex-wrap">
                                {point.type === 'office' && (
                                  <>
                                    <button
                                      onClick={handleDirections}
                                      className="px-3 py-1 bg-[#daa520] text-white text-xs rounded-md hover:bg-[#daa520]/80 transition-colors flex items-center gap-1"
                                    >
                                      <Navigation className="w-3 h-3" />
                                      Directions
                                    </button>
                                    <button
                                      onClick={openStreetView}
                                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
                                    >
                                      <Camera className="w-3 h-3" />
                                      Street View
                                    </button>
                                    <button
                                      onClick={shareLocation}
                                      className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 transition-colors flex items-center gap-1"
                                    >
                                      <Share2 className="w-3 h-3" />
                                      Share
                                    </button>
                                    <button
                                      onClick={scheduleVisit}
                                      className="px-3 py-1 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700 transition-colors flex items-center gap-1"
                                    >
                                      <Calendar className="w-3 h-3" />
                                      Schedule Visit
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => setMapZoom(mapZoom < 18 ? 18 : 15)}
                                  className="px-3 py-1 bg-gray-600 text-white text-xs rounded-md hover:bg-gray-700 transition-colors"
                                >
                                  {mapZoom < 18 ? 'Zoom In' : 'Zoom Out'}
                                </button>
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    </InfoWindow>
                  )}
                </Map>
                )}
              </div>

              {/* Enhanced Location Overlay */}
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 z-10 pointer-events-auto">
                <motion.div
                  className="bg-white/95 backdrop-blur-lg rounded-xl md:rounded-2xl border border-[#daa520]/20 shadow-2xl overflow-hidden max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  {/* Tab Navigation */}
                  <div className="flex border-b border-gray-200">
                    {[
                      { id: 'contact', label: 'Contact', icon: MapPin },
                      { id: 'directions', label: 'Directions', icon: Route },
                      { id: 'hours', label: 'Hours', icon: Clock },
                      { id: 'share', label: 'Share', icon: Share2 },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-1 md:gap-2 px-2 py-2 md:px-3 md:py-3 text-xs md:text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'text-[#daa520] border-b-2 border-[#daa520] bg-[#daa520]/10'
                            : 'text-[#1a1a2e]/60 hover:text-[#1a1a2e] hover:bg-gray-50'
                        }`}
                      >
                        <tab.icon className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="p-4 md:p-6">
                    <AnimatePresence mode="wait">
                      {activeTab === 'contact' && (
                        <motion.div
                          key="contact"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-start gap-4"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-[#daa520] to-[#daa520]/80 rounded-xl flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-[#1a1a2e] font-bold text-lg mb-1">
                              Headquarters
                            </h3>
                            <p className="text-[#1a1a2e]/80 text-sm leading-relaxed">
                              {headquarters.address}
                              <br />
                              {headquarters.city}
                              <br />
                              {headquarters.country}
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'directions' && (
                        <motion.div
                          key="directions"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="space-y-4">
                            <h3 className="text-[#1a1a2e] font-bold text-lg flex items-center gap-2">
                              <Route className="w-5 h-5 text-[#daa520]" />
                              Getting Here
                            </h3>
                            <div className="grid gap-3">
                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Car className="w-5 h-5 text-blue-600" />
                                <div>
                                  <p className="text-sm font-medium text-[#1a1a2e]">By Car</p>
                                  <p className="text-xs text-gray-600">Parking available nearby</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Bus className="w-5 h-5 text-green-600" />
                                <div>
                                  <p className="text-sm font-medium text-[#1a1a2e]">Public Transport</p>
                                  <p className="text-xs text-gray-600">Bus 110, 122 & Tram 2, 6</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <Plane className="w-5 h-5 text-purple-600" />
                                <div>
                                  <p className="text-sm font-medium text-[#1a1a2e]">From Airport</p>
                                  <p className="text-xs text-gray-600">25 minutes by taxi</p>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={handleDirections}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#daa520] text-white rounded-lg hover:bg-[#daa520]/80 transition-all duration-300"
                            >
                              <Navigation className="w-4 h-4" />
                              Open in Google Maps
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'hours' && (
                        <motion.div
                          key="hours"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="space-y-4">
                            <h3 className="text-[#1a1a2e] font-bold text-lg flex items-center gap-2">
                              <Clock className="w-5 h-5 text-[#daa520]" />
                              Business Hours
                            </h3>
                            <div className="space-y-2">
                              {[
                                { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM', current: true },
                                { day: 'Saturday', hours: 'By Appointment', current: false },
                                { day: 'Sunday', hours: 'Closed', current: false },
                              ].map((schedule, index) => (
                                <div
                                  key={index}
                                  className={`flex justify-between items-center p-3 rounded-lg ${
                                    schedule.current ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                                  }`}
                                >
                                  <span className="text-sm font-medium text-[#1a1a2e]">
                                    {schedule.day}
                                  </span>
                                  <span className={`text-sm ${
                                    schedule.current ? 'text-green-700 font-medium' : 'text-gray-600'
                                  }`}>
                                    {schedule.hours}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <button
                              onClick={scheduleVisit}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#daa520] text-white rounded-lg hover:bg-[#daa520]/80 transition-all duration-300"
                            >
                              <Calendar className="w-4 h-4" />
                              Schedule a Visit
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'share' && (
                        <motion.div
                          key="share"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="space-y-4">
                            <h3 className="text-[#1a1a2e] font-bold text-lg flex items-center gap-2">
                              <Share2 className="w-5 h-5 text-[#daa520]" />
                              Share Location
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={shareLocation}
                                className="flex items-center justify-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                              >
                                <Share2 className="w-4 h-4" />
                                Share Link
                              </button>
                              <button
                                onClick={openStreetView}
                                className="flex items-center justify-center gap-2 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                              >
                                <Camera className="w-4 h-4" />
                                Street View
                              </button>
                              <button
                                onClick={() => {
                                  setMapZoom(mapZoom === 15 ? 18 : 15);
                                  setActiveTab('contact');
                                }}
                                className="flex items-center justify-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
                              >
                                <Compass className="w-4 h-4" />
                                {mapZoom === 15 ? 'Zoom In' : 'Zoom Out'}
                              </button>
                              <button
                                onClick={focusOnHeadquarters}
                                className="flex items-center justify-center gap-2 p-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors"
                              >
                                <Building className="w-4 h-4" />
                                Focus Office
                              </button>
                            </div>
                            
                            {/* Quick Actions */}
                            <div className="pt-3 border-t border-gray-200">
                              <p className="text-xs text-gray-600 mb-3">Quick Actions</p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    const url = `https://wa.me/?text=Check out DTO Partners location: https://www.google.com/maps/place/${headquarters.lat},${headquarters.lng}`;
                                    window.open(url, '_blank');
                                  }}
                                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  WhatsApp
                                </button>
                                <button
                                  onClick={() => {
                                    const url = `https://twitter.com/intent/tweet?text=Visiting DTO Partners&url=https://www.google.com/maps/place/${headquarters.lat},${headquarters.lng}`;
                                    window.open(url, '_blank');
                                  }}
                                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Twitter
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            {/* Company Information Section */}
            <motion.div
              className="p-6 md:p-8 xl:p-12 flex flex-col justify-between order-1 xl:order-2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {/* Company Header */}
              <div className="mb-6 md:mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
                    DTO{" "}
                    <span className="font-bold text-[#daa520]">Partners</span>
                  </h2>
                  <div className="w-20 md:w-24 h-0.5 bg-gradient-to-r from-[#daa520] to-transparent mb-4 md:mb-6" />
                  <p className="text-white/80 leading-relaxed max-w-md text-sm md:text-base">
                    Excellence in executive search and strategic recruitment.
                    Connecting exceptional talent with visionary organizations
                    across global markets.
                  </p>
                </motion.div>
              </div>
              {/* Contact Information */}
              <div className="space-y-6 md:space-y-8">
                {/* Email Contacts */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-white font-semibold mb-3 md:mb-4 text-base md:text-lg">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-2 gap-3 md:gap-4">
                    {contactInfo.map((contact, _) => (
                      <motion.a
                        key={contact.label}
                        href={contact.href}
                        className="flex items-center gap-2 md:gap-3 text-white/80 hover:text-[#daa520] transition-colors duration-300 group"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-[#daa520]/20 transition-colors duration-300">
                          <contact.icon className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div>
                          <p className="text-xs text-white/60 uppercase tracking-wider">
                            {contact.label}
                          </p>
                          <p className="text-xs md:text-sm font-medium">{contact.value}</p>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
                {/* Phone Numbers */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-white font-semibold mb-3 md:mb-4 text-base md:text-lg">
                    Phone Numbers
                  </h3>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
                    {phoneNumbers.map((phone, _) => (
                      <motion.a
                        key={phone.number}
                        href={phone.href}
                        className="flex items-center gap-2 md:gap-3 bg-white/10 hover:bg-[#daa520]/20 rounded-lg px-3 py-2 md:px-4 md:py-3 text-white/80 hover:text-[#daa520] transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Phone className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="text-xs md:text-sm font-medium">
                          {phone.number}
                        </span>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
                {/* Company Registration Data */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-white font-semibold mb-3 md:mb-4 text-base md:text-lg">
                    Company Registration
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    {companyData.map((data, _) => (
                      <div
                        key={data.label}
                        className="flex items-center gap-2 text-white/70 text-xs md:text-sm"
                      >
                        <data.icon className="w-3 h-3 md:w-4 md:h-4 text-[#daa520]/70" />
                        <span className="font-medium">{data.label}:</span>
                        <span>{data.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                {/* Social Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-white font-semibold mb-3 md:mb-4 text-base md:text-lg">
                    Follow Us
                  </h3>
                  <div className="flex gap-2 md:gap-3">
                    {socialLinks.map((social, _) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        className="w-8 h-8 md:w-10 md:h-10 bg-white/10 hover:bg-[#daa520] rounded-lg flex items-center justify-center text-white/80 hover:text-white transition-all duration-300"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.2 }}
                        aria-label={social.label}
                      >
                        <social.icon className="w-4 h-4 md:w-5 md:h-5" />
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
          {/* Bottom Bar */}
          <motion.div
            className="border-t border-white/10 px-4 py-4 md:px-8 md:py-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
              <div className="text-white/60 text-xs md:text-sm text-center md:text-left">
                © {new Date().getFullYear()} DTO Partners Sp. z o.o. All rights
                reserved.
              </div>
              <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm flex-wrap justify-center">
                <a
                  href="#"
                  className="text-white/60 hover:text-[#daa520] transition-colors duration-300"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-white/60 hover:text-[#daa520] transition-colors duration-300"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-white/60 hover:text-[#daa520] transition-colors duration-300"
                >
                  GDPR Compliance
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </APIProvider>
  );
}
