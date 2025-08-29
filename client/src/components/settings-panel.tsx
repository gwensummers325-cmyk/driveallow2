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
import { Badge } from "@/components/ui/badge";
import { MapPin, Shield, Clock, Plus, Settings, Users } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GeofencingModal } from "@/components/geofencing-modal";
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
    allowanceAmount: '0.00',
    frequency: 'weekly',
    speedingMinorPenalty: '5.00',
    speedingMajorPenalty: '10.00',
    harshBrakingPenalty: '5.00',
    aggressiveAccelPenalty: '5.00',
    phoneUsagePenalty: '15.00',
    geofenceViolationPenalty: '20.00',
    curfewViolationPenalty: '25.00',
    perfectWeekBonus: '10.00',
    speedComplianceBonus: '2.00',
    geofenceComplianceBonus: '5.00',
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
        allowanceAmount: settings.allowanceAmount,
        frequency: settings.frequency,
        speedingMinorPenalty: settings.speedingMinorPenalty,
        speedingMajorPenalty: settings.speedingMajorPenalty,
        harshBrakingPenalty: settings.harshBrakingPenalty,
        aggressiveAccelPenalty: settings.aggressiveAccelPenalty,
        phoneUsagePenalty: settings.phoneUsagePenalty || '15.00',
        geofenceViolationPenalty: settings.geofenceViolationPenalty || '20.00',
        curfewViolationPenalty: settings.curfewViolationPenalty || '25.00',
        perfectWeekBonus: settings.perfectWeekBonus,
        speedComplianceBonus: settings.speedComplianceBonus,
        geofenceComplianceBonus: settings.geofenceComplianceBonus || '5.00',
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg md:text-xl">Allowance & Penalty Settings</CardTitle>
          {teens.length > 1 && onTeenChange && (
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Label className="text-sm text-gray-600">Configure for:</Label>
              <Select value={teenId || ''} onValueChange={onTeenChange}>
                <SelectTrigger className="w-full sm:w-48">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Allowance Settings */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Allowance Configuration</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="allowance-amount">Allowance Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="allowance-amount"
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-6"
                      value={settings.allowanceAmount}
                      onChange={(e) => handleInputChange('allowanceAmount', e.target.value)}
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
                
              </div>
            </div>

            {/* Penalty Settings */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Violation Penalties</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2">
                  <Label className="text-sm text-gray-600">Speeding (3-10 mph over)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-6 text-sm"
                      value={settings.speedingMinorPenalty}
                      onChange={(e) => handleInputChange('speedingMinorPenalty', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label className="text-sm text-gray-600">Speeding (11+ mph over)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-6 text-sm"
                      value={settings.speedingMajorPenalty}
                      onChange={(e) => handleInputChange('speedingMajorPenalty', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label className="text-sm text-gray-600">Harsh Braking</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-6 text-sm"
                      value={settings.harshBrakingPenalty}
                      onChange={(e) => handleInputChange('harshBrakingPenalty', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label className="text-sm text-gray-600">Aggressive Acceleration</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-6 text-sm"
                      value={settings.aggressiveAccelPenalty}
                      onChange={(e) => handleInputChange('aggressiveAccelPenalty', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label className="text-sm text-gray-600">Phone Usage While Driving</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-6 text-sm"
                      value={settings.phoneUsagePenalty}
                      onChange={(e) => handleInputChange('phoneUsagePenalty', e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Automatic penalty applied when phone usage is detected during driving
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label className="text-sm text-gray-600">Geofence Violation</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-6 text-sm"
                      value={settings.geofenceViolationPenalty}
                      onChange={(e) => handleInputChange('geofenceViolationPenalty', e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Penalty for entering restricted areas or leaving safe zones
                  </p>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label className="text-sm text-gray-600">Curfew Violation</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-6 text-sm"
                      value={settings.curfewViolationPenalty}
                      onChange={(e) => handleInputChange('curfewViolationPenalty', e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Penalty for being outside curfew zones during restricted hours
                  </p>
                </div>
              </div>
            </div>

            {/* Incentive Settings */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Safe Driving Incentives</h4>
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2">
                  <Label className="text-sm text-gray-600">Perfect week (no violations)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-6 text-sm"
                      value={settings.perfectWeekBonus}
                      onChange={(e) => handleInputChange('perfectWeekBonus', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label className="text-sm text-gray-600">Speed limit compliance</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-6 text-sm"
                      value={settings.speedComplianceBonus}
                      onChange={(e) => handleInputChange('speedComplianceBonus', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label className="text-sm text-gray-600">Geofence compliance</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-6 text-sm"
                      value={settings.geofenceComplianceBonus}
                      onChange={(e) => handleInputChange('geofenceComplianceBonus', e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Weekly bonus for staying within safe zones and respecting restricted areas
                  </p>
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

            {/* Geofence Management - only show for the first teen or when no specific teen */}
            {(!teenId || teenId === teens?.[0]?.id) && (
              <div className="col-span-full">
                <GeofenceManagement teens={teens || []} />
              </div>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Geofence Management Component
function GeofenceManagement({ teens }: { teens: any[] }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // Get all geofences (not teen-specific)
  const { data: allGeofences = [] } = useQuery({
    queryKey: ["/api/geofences"],
  });

  // State for assignment modal
  const [selectedGeofence, setSelectedGeofence] = useState<any>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Get teen assignments for a geofence
  const getTeenAssignments = (geofenceId: string) => {
    return useQuery({
      queryKey: ["/api/geofences", geofenceId, "teens"],
      enabled: !!geofenceId,
    });
  };

  // Assignment mutations
  const assignMutation = useMutation({
    mutationFn: async ({ geofenceId, teenId }: { geofenceId: string; teenId: string }) => {
      await apiRequest("POST", `/api/geofences/${geofenceId}/assign/${teenId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/geofences"] });
      queryClient.invalidateQueries({ queryKey: ["/api/teens"] });
      toast({ title: "Success", description: "Geofence assigned successfully!" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "Error", description: "Failed to assign geofence", variant: "destructive" });
    },
  });

  const unassignMutation = useMutation({
    mutationFn: async ({ geofenceId, teenId }: { geofenceId: string; teenId: string }) => {
      await apiRequest("DELETE", `/api/geofences/${geofenceId}/assign/${teenId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/geofences"] });
      queryClient.invalidateQueries({ queryKey: ["/api/teens"] });
      toast({ title: "Success", description: "Geofence unassigned successfully!" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "Error", description: "Failed to unassign geofence", variant: "destructive" });
    },
  });

  if (allGeofences.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Geofencing Management
            </div>
            <Button
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Geofence
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">
            No geofences configured yet. Create safe zones, restricted areas, and curfew zones to monitor your teens' locations.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'safe_zone':
        return <Shield className="h-4 w-4" />;
      case 'restricted':
        return <MapPin className="h-4 w-4" />;
      case 'curfew':
        return <Clock className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'safe_zone':
        return 'Safe Zone';
      case 'restricted':
        return 'Restricted Area';
      case 'curfew':
        return 'Curfew Zone';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'safe_zone':
        return 'bg-green-100 text-green-800';
      case 'restricted':
        return 'bg-red-100 text-red-800';
      case 'curfew':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Geofencing Management ({allGeofences.length})
            </div>
            <Button
              size="sm"
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Geofence
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {allGeofences.map((geofence: any) => (
              <GeofenceCard
                key={geofence.id}
                geofence={geofence}
                teens={teens}
                onManageAssignments={(gf) => {
                  setSelectedGeofence(gf);
                  setShowAssignmentModal(true);
                }}
                assignMutation={assignMutation}
                unassignMutation={unassignMutation}
              />
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>How Geofencing Works:</strong> Create geofences and assign them to specific teens. 
              Click "Manage Teens" on any geofence to control which teens it applies to.
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Create Geofence Modal */}
      {showCreateModal && (
        <GeofencingModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          teenId="" // Not needed for creation
        />
      )}
      
      {/* Teen Assignment Modal */}
      {showAssignmentModal && selectedGeofence && (
        <TeenAssignmentModal
          geofence={selectedGeofence}
          teens={teens}
          isOpen={showAssignmentModal}
          onClose={() => {
            setShowAssignmentModal(false);
            setSelectedGeofence(null);
          }}
          assignMutation={assignMutation}
          unassignMutation={unassignMutation}
        />
      )}
    </>
  );
}

// Individual Geofence Card Component
function GeofenceCard({ geofence, teens, onManageAssignments, assignMutation, unassignMutation }: {
  geofence: any;
  teens: any[];
  onManageAssignments: (geofence: any) => void;
  assignMutation: any;
  unassignMutation: any;
}) {
  const { data: assignments = [] } = useQuery({
    queryKey: ["/api/geofences", geofence.id, "teens"],
  });

  const assignedTeenIds = assignments.map((a: any) => a.teenId);
  const assignedTeens = teens.filter(teen => assignedTeenIds.includes(teen.id));

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'safe_zone':
        return <Shield className="h-4 w-4" />;
      case 'restricted':
        return <MapPin className="h-4 w-4" />;
      case 'curfew':
        return <Clock className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'safe_zone':
        return 'Safe Zone';
      case 'restricted':
        return 'Restricted Area';
      case 'curfew':
        return 'Curfew Zone';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'safe_zone':
        return 'bg-green-100 text-green-800';
      case 'restricted':
        return 'bg-red-100 text-red-800';
      case 'curfew':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center gap-3">
        {getTypeIcon(geofence.type)}
        <div>
          <div className="font-medium text-sm">{geofence.name}</div>
          <div className="text-xs text-gray-500">{geofence.address}</div>
          {geofence.radius && (
            <div className="text-xs text-gray-400">
              {(geofence.radius / 1609).toFixed(1)} mile radius
            </div>
          )}
          <div className="flex items-center gap-2 mt-1">
            <Badge className={`text-xs ${getTypeColor(geofence.type)}`}>
              {getTypeName(geofence.type)}
            </Badge>
            {!geofence.isActive && (
              <Badge variant="secondary" className="text-xs">
                Inactive
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium">
            {assignedTeens.length} of {teens.length} teens
          </div>
          <div className="text-xs text-gray-500">
            {assignedTeens.length > 0 
              ? assignedTeens.map(teen => `${teen.firstName} ${teen.lastName}`).join(', ')
              : 'No teens assigned'
            }
          </div>
        </div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => onManageAssignments(geofence)}
          className="text-xs"
        >
          <Users className="h-3 w-3 mr-1" />
          Manage Teens
        </Button>
      </div>
    </div>
  );
}

// Teen Assignment Modal Component
function TeenAssignmentModal({ geofence, teens, isOpen, onClose, assignMutation, unassignMutation }: {
  geofence: any;
  teens: any[];
  isOpen: boolean;
  onClose: () => void;
  assignMutation: any;
  unassignMutation: any;
}) {
  const { data: assignments = [] } = useQuery({
    queryKey: ["/api/geofences", geofence.id, "teens"],
    enabled: isOpen,
  });

  const assignedTeenIds = assignments.map((a: any) => a.teenId);

  const handleTeenToggle = (teenId: string, isAssigned: boolean) => {
    if (isAssigned) {
      unassignMutation.mutate({ geofenceId: geofence.id, teenId });
    } else {
      assignMutation.mutate({ geofenceId: geofence.id, teenId });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'safe_zone':
        return <Shield className="h-4 w-4" />;
      case 'restricted':
        return <MapPin className="h-4 w-4" />;
      case 'curfew':
        return <Clock className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon(geofence.type)}
            Assign Teens to {geofence.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium">{geofence.name}</div>
            <div className="text-xs text-gray-600">{geofence.address}</div>
          </div>
          
          <div className="space-y-3">
            <div className="text-sm font-medium">Select which teens this geofence applies to:</div>
            {teens.map((teen) => {
              const isAssigned = assignedTeenIds.includes(teen.id);
              return (
                <div key={teen.id} className="flex items-center space-x-3">
                  <Checkbox
                    checked={isAssigned}
                    onCheckedChange={(checked) => handleTeenToggle(teen.id, !checked)}
                    disabled={assignMutation.isPending || unassignMutation.isPending}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {teen.firstName} {teen.lastName}
                    </div>
                    <div className="text-xs text-gray-500">@{teen.username}</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
