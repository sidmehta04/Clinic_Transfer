import React from 'react';
import { Card, CardContent } from './ui/card';
import { MapPin, Package, Calendar, AlertCircle, ChevronDown, ChevronUp, Building, Truck } from 'lucide-react';

const ClinicCard = ({ 
  clinic, 
  isSelected, 
  onSelect, 
  inventoryValue, 
  inventoryDetails,
  regionInventory,
  relocationInfo 
}) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'closed':
        return 'text-red-500 bg-red-50';
      case 'pending':
        return 'text-yellow-500 bg-yellow-50';
      default:
        return 'text-green-500 bg-green-50';
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardContent className="p-4">
        {/* Header Section */}
        <div 
          className="cursor-pointer"
          onClick={() => onSelect(clinic)}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-primary">{clinic.clinic_name}</h3>
              <span className="text-xs text-muted-foreground">{clinic["E-Clinic Code"]}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(clinic.closure_status)}`}>
                {clinic.closure_status || 'Active'}
              </span>
              {isSelected ? 
                <ChevronUp className="w-5 h-5 text-primary" /> : 
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              }
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{clinic.branch_name}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building className="w-4 h-4" />
              <span>{clinic.region}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Started: {clinic.start_date}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Package className="w-4 h-4" />
              <span>₹{inventoryValue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isSelected && (
          <div className="border-t mt-4 pt-4">
            <div className="grid gap-4">
              {/* Master Inventory Section */}
              <div>
                <h4 className="font-semibold mb-2 text-primary text-sm">Master Inventory</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(inventoryDetails).map(([item, details]) => (
                    <div key={item} className="flex items-center justify-between bg-secondary/50 p-2 rounded">
                      <span className="text-muted-foreground capitalize">{item}:</span>
                      <span className="font-medium">
                        {details.quantity} 
                        {details.quantity > 0 && 
                          <span className="text-xs text-muted-foreground ml-1">
                            (₹{(details.quantity * details.unit_cost).toLocaleString()})
                          </span>
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Region-specific Inventory */}
              {regionInventory && (
                <div>
                  <h4 className="font-semibold mb-2 text-primary text-sm">
                    Current Inventory ({regionInventory.region})
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(regionInventory.inventory).map(([item, quantity]) => (
                      <div key={item} className="flex items-center justify-between bg-secondary/50 p-2 rounded">
                        <span className="text-muted-foreground capitalize">{item}:</span>
                        <span className="font-medium">{quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status & Relocation */}
              <div>
                <h4 className="font-semibold mb-2 text-primary text-sm">Status Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="space-y-1">
                    <p>
                      <span className="text-muted-foreground">Closure Week:</span>{' '}
                      {clinic.closure_week}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Rent Status:</span>{' '}
                      {clinic.rent_status}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p>
                      <span className="text-muted-foreground">Ageing:</span>{' '}
                      {clinic.ageing}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Security:</span>{' '}
                      {clinic.security_deposit || 'NA'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Relocation Status */}
              {clinic.relocation_info && (
                <div>
                  <h4 className="font-semibold mb-2 text-primary text-sm flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Relocation Status
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(clinic.relocation_info).map(([type, info]) => (
                      <div key={type} className="bg-secondary/50 p-2 rounded">
                        <p className="capitalize text-muted-foreground">{type}:</p>
                        <p className="font-medium">{info.status || 'Not Relocated'}</p>
                        {info.relocated_to && (
                          <p className="text-xs text-muted-foreground">To: {info.relocated_to}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClinicCard;