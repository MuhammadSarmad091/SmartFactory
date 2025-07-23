import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Configure axios base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/';
axios.defaults.baseURL = API_BASE_URL;

interface Room {
  name: string;
  temperature: number;
  humidity: number;
  smoke: number;
  noise_level: number;
  lights: boolean[];
}

interface Machine {
  name: string;
  manufacturer: string;
  model: string;
  installation_date: string;
  location: string;
  img_src?: string;
  power: boolean;
  temperature: number;
  vibration: number;
  power_usage: number;
  noise_level: number;
  production_speed?: number;
  maintenance: string | undefined;
}

interface AnalyticsData {
  cartons_production_week: number[];
  img_src?: string;
  sales_num_week: number[];
  cartons_production_month: number[];
  sales_production_month: number[];
}

interface DataContextType {
  rooms: Room[];
  machines: Machine[];
  cartons_num: number;
  analytics: AnalyticsData;
  loading: boolean;
  refreshData: () => Promise<void>;
  toggleLight: (roomName: string, lightNum: number) => Promise<void>;
  toggleMachine: (machineName: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [cartons_num, setCartons_num] = useState(0);
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    cartons_production_week: [],
    sales_num_week: [],
    cartons_production_month: [],
    sales_production_month: []
  });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchAllData = async () => {
    if (!isAuthenticated) return;
    
    try {
      const [allDataRes, weekAnalyticsRes, monthAnalyticsRes] = await Promise.all([
        axios.get('/data/all'),
        axios.get('/data/analytics/week'),
        axios.get('/data/analytics/month')
      ]);

      setRooms(allDataRes.data.rooms);
      setMachines(allDataRes.data.machines);
      setCartons_num(allDataRes.data.cartons_num);
      
      setAnalytics({
        cartons_production_week: weekAnalyticsRes.data.cartons_production_week,
        sales_num_week: weekAnalyticsRes.data.sales_num_week,
        cartons_production_month: monthAnalyticsRes.data.cartons_production_month,
        sales_production_month: monthAnalyticsRes.data.sales_production_month
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchAllData();
  };

  const toggleLight = async (roomName: string, lightNum: number) => {
    try {
      await axios.post('/toggle/lights', { room_name: roomName, light_num: lightNum });
      await refreshData();
    } catch (error) {
      console.error('Error toggling light:', error);
    }
  };

  const toggleMachine = async (machineName: string) => {
    try {
      await axios.post('/toggle/machine', { machine_name: machineName });
      await refreshData();
    } catch (error) {
      console.error('Error toggling machine:', error);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <DataContext.Provider
      value={{
        rooms,
        machines,
        cartons_num,
        analytics,
        loading,
        refreshData,
        toggleLight,
        toggleMachine
      }}
    >
      {children}
    </DataContext.Provider>
  );
};