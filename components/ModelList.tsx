// components/ModelList.tsx
import React from 'react';
import { GirlProfile } from '../types';
import ModelCard from './ModelCard';
import { UI_TEXT_BN } from '../constants';

interface ModelListProps {
  models: GirlProfile[];
  onSelectModel: (model: GirlProfile) => void;
}

const ModelList: React.FC<ModelListProps> = ({ models, onSelectModel }) => {
  return (
    <div className="p-4 md:p-8 space-y-10 animate-fade-in max-w-7xl mx-auto">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
          {UI_TEXT_BN.models}
        </h2>
        <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-accent mx-auto rounded-full" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
        {models.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            onSelect={onSelectModel}
          />
        ))}
      </div>
    </div>
  );
};

export default ModelList;