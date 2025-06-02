'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from 'framer-motion';
import { CheckCircle, Smartphone, BarChart3, ShieldPlus, Brain, LifeBuoy, PlusCircle } from 'lucide-react';

interface Addon {
  id: string;
  label: string;
  icon: React.ElementType;
}

const availableAddons: Addon[] = [
  { id: 'mobile_app', label: 'Companion Mobile App (React Native)', icon: Smartphone },
  { id: 'analytics', label: 'Advanced Analytics Dashboard', icon: BarChart3 },
  { id: 'hosting', label: 'Hosting & Maintenance Package', icon: ShieldPlus },
  { id: 'ai_consult', label: 'AI Strategy Consultation', icon: Brain },
  { id: 'priority_support', label: 'Priority Support Package', icon: LifeBuoy },
];

interface StepAddonsCustomProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

const StepAddonsCustom: React.FC<StepAddonsCustomProps> = ({ formData, setFormData, onNext, onPrev }) => {
  const selectedAddons = formData.addons || [];
  const customRequests = formData.customRequests || '';

  const toggleAddon = (addonId: string) => {
    const newAddons = selectedAddons.includes(addonId)
      ? selectedAddons.filter((id: string) => id !== addonId)
      : [...selectedAddons, addonId];
    setFormData({ ...formData, addons: newAddons });
  };

  const handleCustomRequestsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, customRequests: event.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Want to go the extra mile?
        </h2>
        <p className="text-muted-foreground text-lg">
          Select any additional services or tell us about specific needs. <PlusCircle className="inline h-5 w-5 text-primary"/>
        </p>
      </div>

      <div>
        <Label className="text-base font-semibold text-foreground dark:text-slate-200 mb-3 block">Optional Add-ons:</Label>
        <div className="space-y-3">
          {availableAddons.map((addon) => (
            <motion.div
              key={addon.id}
              onClick={() => toggleAddon(addon.id)}
              className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out group
                ${selectedAddons.includes(addon.id) 
                  ? 'bg-primary/10 border-primary ring-2 ring-primary' 
                  : 'bg-card hover:bg-muted/60 dark:bg-slate-800 dark:hover:bg-slate-700/80 border-border dark:border-slate-700'}
              `}
              whileHover={{ borderColor: 'var(--primary)' }}
            >
              <Checkbox
                id={addon.id}
                checked={selectedAddons.includes(addon.id)}
                onCheckedChange={() => toggleAddon(addon.id)}
                className="border-border dark:border-slate-600 data-[state=checked]:bg-primary data-[state=checked]:border-primary shrink-0"
              />
              <addon.icon className={`w-6 h-6 transition-colors duration-200 ${selectedAddons.includes(addon.id) ? 'text-primary' : 'text-muted-foreground group-hover:text-primary/80'}`} />
              <Label htmlFor={addon.id} className="text-sm font-medium text-foreground dark:text-slate-200 cursor-pointer flex-grow">
                {addon.label}
              </Label>
            </motion.div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="customRequests" className="text-base font-semibold text-foreground dark:text-slate-200 mb-2 block">
          Specific Features or Problems to Solve?
        </Label>
        <Textarea
          id="customRequests"
          value={customRequests}
          onChange={handleCustomRequestsChange}
          placeholder="Describe any unique requirements, specific integrations, or particular challenges you're aiming to address..."
          rows={4}
          className="w-full bg-background dark:bg-slate-700 border-border dark:border-slate-600 placeholder:text-muted-foreground dark:placeholder:text-slate-400 focus:ring-primary text-sm p-3"
        />
      </div>

      <div className="flex justify-between mt-10">
        <Button onClick={onPrev} variant="outline" className="border-border hover:bg-muted dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
          Previous
        </Button>
        <Button onClick={onNext} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Next: Your Details
          <CheckCircle className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default StepAddonsCustom; 