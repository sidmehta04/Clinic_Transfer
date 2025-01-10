import React, { useState, useEffect, useMemo } from 'react';
import { Card } from './ui/card';
import { AlertCircle } from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import DashboardStats from './DashboardStats';
import SearchHeader from './SearchHeader';
import ClinicCard from './ClinicCard';

const firebaseConfig = {
  apiKey: "AIzaSyAPw2XrDvYMu49IiWJmEEUFL6O2Zb2kyIg",
  authDomain: "clinic-inventory-e77e6.firebaseapp.com",
  databaseURL: "https://clinic-inventory-e77e6-default-rtdb.firebaseio.com",
  projectId: "clinic-inventory-e77e6",
  storageBucket: "clinic-inventory-e77e6.firebasestorage.app",
  messagingSenderId: "28860646838",
  appId: "1:28860646838:web:200b70eba27855ca712d17"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const ClinicDashboard = () => {
  const [clinicData, setClinicData] = useState([]);
  const [masterInventory, setMasterInventory] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMatchedOnly, setShowMatchedOnly] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const facilityRef = ref(database, 'facility_data');
        const locationRef = ref(database, 'location_details');
        const operationalRef = ref(database, 'operational_status');
        const inventoryRef = ref(database, 'master_inventory');
        const regionInventoryRef = ref(database, 'inventory');

        const [facilitySnapshot, locationSnapshot, operationalSnapshot, inventorySnapshot, regionInventorySnapshot] = 
          await Promise.all([
            get(facilityRef),
            get(locationRef),
            get(operationalRef),
            get(inventoryRef),
            get(regionInventoryRef)
          ]);

        const facilityData = facilitySnapshot.val();
        const locationData = locationSnapshot.val();
        const operationalData = operationalSnapshot.val();
        const inventoryData = inventorySnapshot.val();
        const regionInventoryData = regionInventorySnapshot.val();

        const combinedData = Object.keys(facilityData).map(clinicCode => ({
          "E-Clinic Code": clinicCode,
          ...facilityData[clinicCode],
          ...locationData[clinicCode],
          ...operationalData[clinicCode]
        }));

        setClinicData(combinedData);
        setMasterInventory(inventoryData);
        setInventoryData(regionInventoryData);
        setError(null);
      } catch (err) {
        setError('Error fetching data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateInventoryValue = (clinic) => {
    if (!masterInventory?.equipment_info) return { inventory: {}, total: 0 };
    
    const inventory = { ...masterInventory.equipment_info };
    const hasNoFan = clinic.rent_status === "In-House Clinic";
    
    if (hasNoFan) {
      inventory.fan.quantity = 0;
    }
    
    let total = 0;
    Object.entries(inventory).forEach(([item, details]) => {
      total += details.quantity * details.unit_cost;
    });
    
    return { inventory, total };
  };

  const getClinicInventory = (clinicCode) => {
    if (!inventoryData) return null;

    // Check each region for the clinic
    for (const [region, regionData] of Object.entries(inventoryData)) {
      // Find the clinic in the region
      const clinicInventory = Object.entries(regionData)
        .find(([code]) => code === clinicCode);
      
      if (clinicInventory) {
        return {
          region,
          inventory: clinicInventory[1]
        };
      }
    }
    return null;
  };

  const hasInventoryData = (clinicCode) => {
    if (!inventoryData) return false;
    return Object.values(inventoryData).some(regionData => 
      Object.keys(regionData).includes(clinicCode)
    );
  };

  const states = useMemo(() => {
    return [...new Set(clinicData.map(clinic => clinic.state))].sort();
  }, [clinicData]);

  const filteredClinics = useMemo(() => {
    return clinicData.filter(clinic => {
      const matchesState = !selectedState || clinic.state === selectedState;
      const matchesSearch = !searchQuery || 
        clinic["E-Clinic Code"].toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.clinic_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesInventory = !showMatchedOnly || hasInventoryData(clinic["E-Clinic Code"]);
      
      return matchesState && matchesSearch && matchesInventory;
    });
  }, [clinicData, selectedState, searchQuery, showMatchedOnly, inventoryData]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="p-6 text-center text-red-500">
      <AlertCircle className="w-8 h-8 mx-auto mb-2" />
      <p>{error}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <DashboardStats 
        clinicData={clinicData} 
        masterInventory={masterInventory} 
        inventoryData={inventoryData}
      />

      <SearchHeader 
        selectedState={selectedState}
        states={states}
        searchQuery={searchQuery}
        showMatchedOnly={showMatchedOnly}
        onStateChange={(e) => {
          setSelectedState(e.target.value);
          setSelectedClinic(null);
        }}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onMatchedChange={(value) => setShowMatchedOnly(value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClinics.map(clinic => {
          const { inventory, total } = calculateInventoryValue(clinic);
          const clinicInventory = getClinicInventory(clinic["E-Clinic Code"]);
          return (
            <ClinicCard 
              key={clinic["E-Clinic Code"]}
              clinic={clinic}
              isSelected={selectedClinic?.["E-Clinic Code"] === clinic["E-Clinic Code"]}
              onSelect={(clinic) => {
                setSelectedClinic(
                  selectedClinic?.["E-Clinic Code"] === clinic["E-Clinic Code"] ? null : clinic
                );
              }}
              inventoryValue={total}
              inventoryDetails={inventory}
              regionInventory={clinicInventory}
              relocationInfo={clinic.relocation_info}
            />
          );
        })}
      </div>

      {filteredClinics.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No clinics found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ClinicDashboard;