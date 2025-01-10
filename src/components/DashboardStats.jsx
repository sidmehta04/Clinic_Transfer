import React, { useMemo } from 'react';
import { 
  Activity, 
  Package, 
  AlertCircle, 
  Box,
  CheckCircle2
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, change, subtitle }) => (
  <div className="stat-card">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        {change && (
          <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
          </p>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
  </div>
);

const InventoryStatCard = ({ title, items, icon: Icon }) => (
  <div className="stat-card">
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
    <div className="space-y-2">
      {Object.entries(items).map(([key, value]) => (
        <div key={key} className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground capitalize">{key}:</span>
          <span className="text-sm font-medium">{value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  </div>
);

const DashboardStats = ({ clinicData, masterInventory, inventoryData }) => {
  const stats = useMemo(() => {
    if (!clinicData.length || !masterInventory?.equipment_info) {
      return {
        totalClinics: 0,
        activeClinics: 0,
        totalInventoryValue: 0,
        pendingClosures: 0,
        totalItems: {},
        matchedClinics: 0
      };
    }

    const totalClinics = clinicData.length;
    const activeClinics = clinicData.filter(clinic => 
      clinic.closure_status !== "Closed"
    ).length;
    
    // Initialize inventory counts
    const totalItems = {
      table: 0,
      chair: 0,
      stool: 0,
      fan: 0
    };

    let totalInventoryValue = 0;
    
    clinicData.forEach(clinic => {
      const hasNoFan = clinic.rent_status === "In-House Clinic";
      
      Object.entries(masterInventory.equipment_info).forEach(([item, details]) => {
        if (item === 'fan' && hasNoFan) return;
        
        totalItems[item] += details.quantity;
        totalInventoryValue += details.quantity * details.unit_cost;
      });
    });

    const pendingClosures = clinicData.filter(clinic => 
      clinic.closure_status === "Pending"
    ).length;

    // Count clinics that match with inventory data
    let matchedClinics = 0;
    if (inventoryData) {
      const matchedClinicCodes = new Set();
      
      // Collect all clinic codes from inventory data
      Object.values(inventoryData).forEach(regionData => {
        Object.keys(regionData).forEach(clinicCode => {
          matchedClinicCodes.add(clinicCode);
        });
      });

      // Count how many clinic codes from clinicData match
      matchedClinics = clinicData.filter(clinic => 
        matchedClinicCodes.has(clinic["E-Clinic Code"])
      ).length;
    }

    return {
      totalClinics,
      activeClinics,
      totalInventoryValue,
      pendingClosures,
      totalItems,
      matchedClinics
    };
  }, [clinicData, masterInventory, inventoryData]);

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="dashboard-grid">
        <StatCard
          title="Total Clinics"
          value={stats.totalClinics}
          icon={Package}
        />
        <StatCard
          title="Active Clinics"
          value={stats.activeClinics}
          icon={Activity}
          change={((stats.activeClinics / stats.totalClinics) * 100).toFixed(1)}
        />
        <StatCard
          title="Total Inventory Value"
          value={`₹${stats.totalInventoryValue.toLocaleString()}`}
          icon={Box}
          subtitle="Across all clinics"
        />
        <StatCard
          title="Pending Closures"
          value={stats.pendingClosures}
          icon={AlertCircle}
          subtitle={`${((stats.pendingClosures / stats.totalClinics) * 100).toFixed(1)}% of total`}
        />
        <StatCard
          title="Matched Inventory Clinics"
          value={stats.matchedClinics}
          icon={CheckCircle2}
          subtitle={`${((stats.matchedClinics / stats.totalClinics) * 100).toFixed(1)}% of total`}
        />
        <InventoryStatCard
          title="Total Equipment Count"
          items={stats.totalItems}
          icon={Package}
        />
      </div>


    </div>
  );
};

export default DashboardStats;