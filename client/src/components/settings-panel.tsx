import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SettingsPanelProps {
  teenId?: string;
  teens?: any[];
  onTeenChange?: (teenId: string) => void;
}

export function SettingsPanel({ teenId, teens = [], onTeenChange }: SettingsPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState({
    weeklyAmount: '50.00',
    frequency: 'weekly',
    allowOverdraft: true,
    speedingMinorPenalty: '5.00',
    speedingMajorPenalty: '15.00',
    harshBrakingPenalty: '5.00',
    aggressiveAccelPenalty: '5.00',
    weeklyBonus: '5.00',
    perfectWeekBonus: '10.00',
    speedComplianceBonus: '2.00',
  });

  // Fetch existing settings
  const { data: existingSettings } = useQuery({
    queryKey: ["/api/allowance-settings", teenId],
    enabled: !!teenId,
  });

  // Update local state when data is loaded
  useEffect(() => {
    if (existingSettings) {
      const settings = existingSettings as any;
      setSettings({
        weeklyAmount: settings.weeklyAmount,
        frequency: settings.frequency,
        allowOverdraft: settings.allowOverdraft,
        speedingMinorPenalty: settings.speedingMinorPenalty,
        speedingMajorPenalty: settings.speedingMajorPenalty,
        harshBrakingPenalty: settings.harshBrakingPenalty,
        aggressiveAccelPenalty: settings.aggressiveAccelPenalty,
        weeklyBonus: settings.weeklyBonus,
        perfectWeekBonus: settings.perfectWeekBonus,
        speedComplianceBonus: settings.speedComplianceBonus,
      });
    }
  }, [existingSettings]);

  const saveSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/allowance-settings", {
        ...data,
        teenId,
      });
    },
    onSuccess: () => {
      // Invalidate settings and dashboard data to refresh everything
      queryClient.invalidateQueries({ queryKey: ["/api/allowance-settings", teenId] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/parent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/teen"] });
      toast({
        title: "Success", 
        description: "Settings updated! Teen cards will refresh with new values.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!teenId) {
      toast({
        title: "Error",
        description: "No teen selected for settings.",
        variant: "destructive",
      });
      return;
    }

    saveSettingsMutation.mutate(settings);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectedTeen = teens.find(t => t.id === teenId);

  if (!teenId && teens.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Allowance & Penalty Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">No teens available. Create a teen account first.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Allowance & Penalty Settings</CardTitle>
          {teens.length > 1 && onTeenChange && (
            <div className="flex items-center space-x-2">
              <Label className="text-sm text-gray-600">Configure for:</Label>
              <Select value={teenId || ''} onValueChange={onTeenChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select teen" />
                </SelectTrigger>
                <SelectContent>
                  {teens.map((teen: any) => (
                    <SelectItem key={teen.id} value={teen.id}>
                      {teen.firstName} {teen.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        {selectedTeen && (
          <div className="text-sm text-gray-600 mt-2">
            Currently configuring settings for {selectedTeen.firstName} {selectedTeen.lastName}
            <span className="ml-2 text-green-600 font-medium">
              Current Balance: ${parseFloat(selectedTeen.balance?.currentBalance || '0.00').toFixed(2)}
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Allowance Settings */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Allowance Configuration</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="weekly-amount">Weekly Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="weekly-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-6"
                      value={settings.weeklyAmount}
                      onChange={(e) => handleInputChange('weeklyAmount', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="frequency">Payment Frequency</Label>
                  <Select value={settings.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="allow-overdraft"
                    checked={settings.allowOverdraft}
                    onCheckedChange={(checked) => handleInputChange('allowOverdraft', checked)}
                  />
                  <Label htmlFor="allow-overdraft" className="text-sm">Allow overdraft</Label>
                </div>
              </div>
            </div>

            {/* Penalty Settings */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Violation Penalties</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600">Speeding (1-10 mph over)</Label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-16 text-xs"
                      value={settings.speedingMinorPenalty}
                      onChange={(e) => handleInputChange('speedingMinorPenalty', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600">Speeding (11+ mph over)</Label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-16 text-xs"
                      value={settings.speedingMajorPenalty}
                      onChange={(e) => handleInputChange('speedingMajorPenalty', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600">Harsh Braking</Label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-16 text-xs"
                      value={settings.harshBrakingPenalty}
                      onChange={(e) => handleInputChange('harshBrakingPenalty', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600">Aggressive Acceleration</Label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-16 text-xs"
                      value={settings.aggressiveAccelPenalty}
                      onChange={(e) => handleInputChange('aggressiveAccelPenalty', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Incentive Settings */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Safe Driving Incentives</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600">7 days violation-free</Label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-16 text-xs"
                      value={settings.weeklyBonus}
                      onChange={(e) => handleInputChange('weeklyBonus', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600">Perfect week (no violations)</Label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-16 text-xs"
                      value={settings.perfectWeekBonus}
                      onChange={(e) => handleInputChange('perfectWeekBonus', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600">Speed limit compliance</Label>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-1">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-16 text-xs"
                      value={settings.speedComplianceBonus}
                      onChange={(e) => handleInputChange('speedComplianceBonus', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={saveSettingsMutation.isPending}
                  >
                    {saveSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
