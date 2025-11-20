// components/onboarding/steps/Step5AssetsResources.tsx
import React, { useState } from 'react';
import { AlertCircle, Package, Check } from 'lucide-react';

const assets = [
  { id: 'laptop', label: 'Laptop', model: 'MacBook Pro 16" M3' },
  { id: 'mouse', label: 'Mouse', model: 'Logitech MX Master 3' },
  { id: 'keyboard', label: 'Keyboard', model: 'Keychron K8' },
  { id: 'monitor', label: 'Monitor', model: 'Dell 27" 4K' },
  { id: 'headphones', label: 'Headphones', model: 'Sony WH-1000XM5' },
  { id: 'accessCard', label: 'Access Card', model: 'Office Entry Card' }
];

interface ResourceAllocationProps {
  savedEmployee: any;
}

const ResourceAllocation: React.FC<ResourceAllocationProps> = () => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const selectedCount = selectedAssets.length;

  const handleAssetToggle = (assetId: string) => {
    setSelectedAssets(prev =>
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  return (
    <div className="space-y-3">
      <div className="p-3 bg-warning-50 border border-warning-200 rounded flex items-start gap-2">
        <AlertCircle size={16} className="text-warning-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-warning-900">Asset Allocation</p>
          <p className="text-xs text-warning-800 mt-0.5">
            Select equipment to be allocated. IT team will be notified for setup.
          </p>
        </div>
      </div>

      {assets.map((asset) => (
        <div key={asset.id} className="card-compact">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name={asset.id}
                checked={selectedAssets.includes(asset.id)}
                onChange={() => handleAssetToggle(asset.id)}
                className="w-4 h-4 text-burgundy-600 border-steel-300 rounded focus:ring-burgundy-500"
              />
              <div>
                <p className="text-sm font-medium text-steel-900">{asset.label}</p>
                <p className="text-xs text-steel-500">{asset.model}</p>
              </div>
            </div>
            {selectedAssets.includes(asset.id) && (
              <span className="badge badge-success">
                <Check size={12} className="mr-1" />
                Allocated
              </span>
            )}
          </div>
        </div>
      ))}

      <div className="card-cap bg-success-50 border-success-200">
        <h4 className="text-sm font-semibold text-success-900 mb-2 flex items-center gap-1.5">
          <Package size={14} />
          Assets Summary
        </h4>
        <p className="text-xs text-success-800">
          {selectedCount} items selected for allocation
        </p>
      </div>
    </div>
  );
};

export default ResourceAllocation;