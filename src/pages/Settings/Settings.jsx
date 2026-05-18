import React, { useState, useEffect, useMemo } from 'react';
import useListSettings from '@/hooks/Settings/useListSettings';
import useUpdateSettings from '@/hooks/Settings/useUpdateSettings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Loader2, 
  Save, 
  Percent, 
  Building2, 
  Settings as SettingsIcon, 
  ShoppingBag, 
  CreditCard, 
  BellRing,
  Globe,
  ChevronDown,
  ChevronUp,
  Languages
} from 'lucide-react';
import PageHeader from '@/components/shared/PageHeader';

const GROUP_CONFIG = {
  tax: { label: 'Taxation', icon: Percent },
  company: { label: 'Company Profile', icon: Building2 },
  system: { label: 'System Settings', icon: SettingsIcon },
  orders: { label: 'Order Management', icon: ShoppingBag },
  credit: { label: 'Credit & Payments', icon: CreditCard },
  // notification: { label: 'Notifications', icon: BellRing },
  general: { label: 'General Settings', icon: Globe },
};

export default function Settings() {
  const { data: settingsData, isLoading } = useListSettings();
  const updateSettings = useUpdateSettings();
  const [formValues, setFormValues] = useState({});
  const [expandedSettings, setExpandedSettings] = useState({});

  useEffect(() => {
    if (settingsData?.data) {
      const initialValues = {};
      settingsData.data.forEach((setting) => {
        initialValues[setting.key] = {
          value: setting.value,
          label: setting.label || { en: '', ar: '' },
          description: setting.description || { en: '', ar: '' },
          type: setting.type,
          group: setting.group,
        };
      });
      setFormValues(initialValues);
    }
  }, [settingsData]);

  const groupedSettings = useMemo(() => {
    if (!settingsData?.data) return {};
    return settingsData.data.reduce((acc, setting) => {
      const group = setting.group || 'general';
      if (!acc[group]) acc[group] = [];
      acc[group].push(setting);
      return acc;
    }, {});
  }, [settingsData]);

  const handleValueChange = (key, value) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: { ...prev[key], value },
    }));
  };

  const handleNestedChange = (key, field, lang, value) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: { ...prev[key][field], [lang]: value },
      },
    }));
  };

  const toggleExpand = (key) => {
    setExpandedSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    const updatedSettings = Object.keys(formValues).map((key) => ({
      key,
      value: String(formValues[key].value),
      type: formValues[key].type,
      group: formValues[key].group,
      label: formValues[key].label,
      description: formValues[key].description,
    }));

    updateSettings.mutate({ body: { settings: updatedSettings } });
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settingsData?.data) {
    return (
      <div className="container mx-auto p-10 text-center">
        <p className="text-lg text-muted-foreground">No settings found.</p>
      </div>
    );
  }

  const groups = Object.keys(groupedSettings);

  return (
    <div className="container mx-auto space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <PageHeader title="System Settings" subTitle="Configure your platform preferences and metadata." />
        <Button 
          onClick={handleSave} 
          disabled={updateSettings.isPending}
          className="px-8 py-6 text-lg font-bold shadow-lg transition-all hover:scale-105"
        >
          {updateSettings.isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Save className="mr-2 h-5 w-5" />
          )}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue={groups[0]} className="w-full">
        <TabsList className="mb-8 flex w-full flex-wrap justify-start gap-3 bg-transparent p-0">
          {groups.map((group) => {
            const config = GROUP_CONFIG[group] || GROUP_CONFIG.general;
            const Icon = config.icon;
            return (
              <TabsTrigger
                key={group}
                value={group}
                className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md border border-border/50 px-6 py-3 text-sm font-semibold transition-all"
              >
                <Icon className="mr-2 h-4 w-4" />
                {config.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {Object.entries(groupedSettings).map(([group, settings]) => (
          <TabsContent key={group} value={group} className="space-y-6 mt-6! outline-none animate-in fade-in-50 duration-500">
            <Card className="overflow-hidden border-none shadow-xl">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/20 border-b border-border/40 pb-6">
                <CardTitle className="text-2xl font-black text-secondary">
                  {(GROUP_CONFIG[group]?.label || group)}
                </CardTitle>
                <CardDescription className="text-base">
                  Detailed configuration for {group.toLowerCase()} parameters.
                </CardDescription>
              </CardHeader>
              <CardContent className="divide-y divide-border/30 p-0">
                {settings.map((setting) => (
                  <div key={setting.id} className="group/item transition-colors hover:bg-muted/10">
                    <div className="flex flex-col gap-4 p-8 md:flex-row md:items-center md:justify-between">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-3">
                          <Label className="text-lg font-bold text-secondary">
                            {formValues[setting.key]?.label?.en || setting.key}
                          </Label>
                          {setting.type && (
                             <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase text-primary">
                               {setting.type}
                             </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                          {formValues[setting.key]?.description?.en}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-full md:w-64">
                          {setting.type === 'boolean' ? (
                            <div className="flex justify-end pr-4">
                              <Switch
                                checked={formValues[setting.key]?.value === 'true' || formValues[setting.key]?.value === true}
                                onCheckedChange={(checked) => handleValueChange(setting.key, checked)}
                                size="default"
                              />
                            </div>
                          ) : (
                            <Input
                              type={['integer', 'float', 'decimal'].includes(setting.type) ? 'number' : 'text'}
                              value={formValues[setting.key]?.value || ''}
                              onChange={(e) => handleValueChange(setting.key, e.target.value)}
                              className="h-11 bg-input-bg border-none font-medium shadow-sm focus-visible:ring-primary/30"
                            />
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleExpand(setting.key)}
                          className={`h-11 w-11 transition-transform duration-300 ${expandedSettings[setting.key] ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}
                        >
                          <Languages className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    {expandedSettings[setting.key] && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-muted/5 p-8 border-t border-border/20 animate-in slide-in-from-top-2 duration-300">
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                              <span className="h-1 w-1 rounded-full bg-primary" /> Label (English)
                            </Label>
                            <Input 
                              value={formValues[setting.key]?.label?.en || ''} 
                              onChange={(e) => handleNestedChange(setting.key, 'label', 'en', e.target.value)}
                              className="bg-background border-border/40 focus:border-primary/40"
                            />
                          </div>
                          <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                               <span className="h-1 w-1 rounded-full bg-primary" /> Label (Arabic)
                            </Label>
                            <Input 
                              dir="rtl"
                              value={formValues[setting.key]?.label?.ar || ''} 
                              onChange={(e) => handleNestedChange(setting.key, 'label', 'ar', e.target.value)}
                              className="bg-background border-border/40 font-cairo text-right focus:border-primary/40"
                            />
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                               <span className="h-1 w-1 rounded-full bg-primary" /> Description (English)
                            </Label>
                            <Textarea 
                              value={formValues[setting.key]?.description?.en || ''} 
                              onChange={(e) => handleNestedChange(setting.key, 'description', 'en', e.target.value)}
                              className="bg-background border-border/40 min-h-[90px] focus:border-primary/40"
                            />
                          </div>
                          <div className="space-y-3">
                            <Label className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                               <span className="h-1 w-1 rounded-full bg-primary" /> Description (Arabic)
                            </Label>
                            <Textarea 
                              dir="rtl"
                              value={formValues[setting.key]?.description?.ar || ''} 
                              onChange={(e) => handleNestedChange(setting.key, 'description', 'ar', e.target.value)}
                              className="bg-background border-border/40 font-cairo min-h-[90px] text-right focus:border-primary/40"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
