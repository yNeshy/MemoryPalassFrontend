import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Facebook,
  Instagram,
  Image,
  Globe,
  Type,
  CheckCircle2,
  Link as LinkIcon
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function Settings() {
  const [connectedServices, setConnectedServices] = useState({
    facebook: localStorage.getItem('connected_facebook') === 'true',
    instagram: localStorage.getItem('connected_instagram') === 'true',
    photos: localStorage.getItem('connected_photos') === 'true'
  });
  
  const [language, setLanguage] = useState(localStorage.getItem('app_language') || 'en');
  const [fontSize, setFontSize] = useState(localStorage.getItem('app_fontSize') || 'large');

  const handleConnect = (service) => {
    // Mock connection process
    const newState = !connectedServices[service];
    setConnectedServices(prev => ({
      ...prev,
      [service]: newState
    }));
    localStorage.setItem(`connected_${service}`, newState.toString());
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
    localStorage.setItem('app_language', value);
  };

  const handleFontSizeChange = (value) => {
    setFontSize(value);
    localStorage.setItem('app_fontSize', value);
    // Apply font size change to document
    document.documentElement.setAttribute('data-font-size', value);
  };



  useEffect(() => {
    // Apply saved font size on mount
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, []);

  const services = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      description: 'Connect to see memories and photos from Facebook',
      color: 'from-blue-600 to-blue-700'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      description: 'View your Instagram photos and memories',
      color: 'from-pink-600 to-purple-600'
    },
    {
      id: 'photos',
      name: 'Photos',
      icon: Image,
      description: 'Access your photo library',
      color: 'from-green-600 to-emerald-600'
    }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' }
  ];

  const fontSizes = [
    { value: 'small', label: 'Small', example: 'text-base' },
    { value: 'medium', label: 'Medium', example: 'text-lg' },
    { value: 'large', label: 'Large (Recommended)', example: 'text-xl' },
    { value: 'xlarge', label: 'Extra Large', example: 'text-2xl' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl('Home')}>
            <Button
              variant="outline"
              className="py-6 px-6 text-xl border-2 rounded-2xl"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-gray-800">Settings</h1>
        </div>

        <div className="space-y-6">
          {/* Connected Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 bg-white border-0 shadow-xl rounded-3xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <LinkIcon className="w-7 h-7 text-blue-600" />
                Connected Services
              </h2>
              
              <p className="text-lg text-gray-600 mb-6">
                Connect your accounts to access more memories and photos
              </p>

              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-6 border-2 border-gray-100 rounded-2xl hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                        <service.icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
                        <p className="text-base text-gray-500">{service.description}</p>
                      </div>
                    </div>
                    
                    {connectedServices[service.id] ? (
                      <Button
                        onClick={() => handleConnect(service.id)}
                        variant="outline"
                        className="py-4 px-6 text-lg border-2 border-green-500 text-green-700 rounded-xl flex items-center gap-2 hover:bg-green-50"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Connected
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleConnect(service.id)}
                        className="py-4 px-6 text-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl"
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Language */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 bg-white border-0 shadow-xl rounded-3xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Globe className="w-7 h-7 text-purple-600" />
                Language
              </h2>
              
              <p className="text-lg text-gray-600 mb-6">
                Choose your preferred language
              </p>

              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full text-xl py-7 px-6 border-2 border-gray-200 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code} className="text-xl py-3">
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>
          </motion.div>

          {/* Font Size */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 bg-white border-0 shadow-xl rounded-3xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <Type className="w-7 h-7 text-green-600" />
                Text Size
              </h2>
              
              <p className="text-lg text-gray-600 mb-6">
                Adjust the size of text in the app
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fontSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => handleFontSizeChange(size.value)}
                    className={`p-6 border-2 rounded-2xl text-left transition-all ${
                      fontSize === size.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${size.example}`}>{size.label}</span>
                      {fontSize === size.value && (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                    <p className={`text-gray-600 ${size.example === 'text-base' ? 'text-sm' : size.example === 'text-lg' ? 'text-base' : size.example === 'text-xl' ? 'text-lg' : 'text-xl'}`}>
                      Example text
                    </p>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>


        </div>
      </div>
    </div>
  );
}