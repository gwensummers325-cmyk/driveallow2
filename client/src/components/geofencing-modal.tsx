import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Shield, Clock, AlertTriangle, Plus, Edit, Trash2 } from "lucide-react";

interface GeofencingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teenId: string;
}

interface Geofence {
  id: string;
  name: string;
  type: 'safe' | 'restricted' | 'curfew';
  latitude: number;
  longitude: number;
  radius: number;
  address?: string;
  isActive: boolean;
  startTime?: string;
  endTime?: string;
  daysOfWeek?: string[];
  speedLimit?: number;
  allowanceBonus?: number;
  penaltyAmount?: number;
  notifyOnEntry: boolean;
  notifyOnExit: boolean;
  createdAt?: Date;
}

export function GeofencingModal({ isOpen, onClose, teenId }: GeofencingModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("manage");
  const [editingGeofence, setEditingGeofence] = useState<Geofence | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Form state for creating/editing geofences
  const [formData, setFormData] = useState({
    name: "",
    type: "safe" as 'safe' | 'restricted' | 'curfew',
    latitude: "",
    longitude: "",
    radius: "500",
    address: "",
    isActive: true,
    startTime: "",
    endTime: "",
    daysOfWeek: [] as string[],
    speedLimit: "",
    allowanceBonus: "",
    penaltyAmount: "",
    notifyOnEntry: true,
    notifyOnExit: true,
  });

  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);

  // Fetch geofences
  const { data: geofences = [], isLoading } = useQuery({
    queryKey: ["/api/geofences"],
    enabled: isOpen,
  });

  // Fetch geofence events
  const { data: geofenceEvents = [] } = useQuery({
    queryKey: ["/api/geofence-events"],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/geofence-events?teenId=${teenId}&limit=20`);
      return res.json();
    },
    enabled: !!isOpen && !!teenId,
  });

  // Create geofence mutation
  const createGeofenceMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/geofences", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/geofences"] });
      toast({
        title: "Success",
        description: "Geofence created successfully!",
      });
      resetForm();
      setShowCreateForm(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth/parent";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create geofence. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update geofence mutation
  const updateGeofenceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PUT", `/api/geofences/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/geofences"] });
      toast({
        title: "Success",
        description: "Geofence updated successfully!",
      });
      setEditingGeofence(null);
      resetForm();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/auth/parent";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update geofence. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete geofence mutation
  const deleteGeofenceMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/geofences/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/geofences"] });
      toast({
        title: "Success",
        description: "Geofence deleted successfully!",
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
          window.location.href = "/auth/parent";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete geofence. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Search for addresses using HERE Geocoding API
  const searchAddresses = async (query: string) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      return;
    }

    setIsSearchingAddress(true);
    try {
      const res = await apiRequest("GET", `/api/geocode-search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setAddressSuggestions(data.items || []);
      setShowAddressSuggestions(true);
    } catch (error) {
      console.error("Error searching addresses:", error);
      setAddressSuggestions([]);
    } finally {
      setIsSearchingAddress(false);
    }
  };

  // Select an address from suggestions
  const selectAddress = (item: any) => {
    const { lat, lng } = item.position;
    const address = item.address;
    const displayName = [
      address.houseNumber,
      address.street,
      address.city,
      address.stateCode
    ].filter(Boolean).join(' ');

    setFormData(prev => ({
      ...prev,
      address: displayName,
      latitude: lat.toString(),
      longitude: lng.toString(),
      name: prev.name || displayName.split(',')[0] // Auto-fill name if empty
    }));
    setShowAddressSuggestions(false);
    setAddressSuggestions([]);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "safe",
      latitude: "",
      longitude: "",
      radius: "500",
      address: "",
      isActive: true,
      startTime: "",
      endTime: "",
      daysOfWeek: [],
      speedLimit: "",
      allowanceBonus: "",
      penaltyAmount: "",
      notifyOnEntry: true,
      notifyOnExit: true,
    });
    setAddressSuggestions([]);
    setShowAddressSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      radius: parseInt(formData.radius),
      speedLimit: formData.speedLimit ? parseInt(formData.speedLimit) : undefined,
      allowanceBonus: formData.allowanceBonus ? parseFloat(formData.allowanceBonus) : undefined,
      penaltyAmount: formData.penaltyAmount ? parseFloat(formData.penaltyAmount) : undefined,
    };

    if (editingGeofence) {
      updateGeofenceMutation.mutate({ id: editingGeofence.id, data });
    } else {
      createGeofenceMutation.mutate(data);
    }
  };

  const startEditing = (geofence: Geofence) => {
    setEditingGeofence(geofence);
    setFormData({
      name: geofence.name,
      type: geofence.type,
      latitude: geofence.latitude.toString(),
      longitude: geofence.longitude.toString(),
      radius: geofence.radius.toString(),
      address: geofence.address || "",
      isActive: geofence.isActive,
      startTime: geofence.startTime || "",
      endTime: geofence.endTime || "",
      daysOfWeek: geofence.daysOfWeek || [],
      speedLimit: geofence.speedLimit?.toString() || "",
      allowanceBonus: geofence.allowanceBonus?.toString() || "",
      penaltyAmount: geofence.penaltyAmount?.toString() || "",
      notifyOnEntry: geofence.notifyOnEntry,
      notifyOnExit: geofence.notifyOnExit,
    });
    setShowCreateForm(true);
  };

  const getGeofenceTypeColor = (type: string) => {
    switch (type) {
      case 'safe': return 'bg-green-100 text-green-800';
      case 'restricted': return 'bg-red-100 text-red-800';
      case 'curfew': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGeofenceTypeIcon = (type: string) => {
    switch (type) {
      case 'safe': return <Shield className="h-4 w-4" />;
      case 'restricted': return <AlertTriangle className="h-4 w-4" />;
      case 'curfew': return <Clock className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Geofencing & Location Management
          </DialogTitle>
          <DialogDescription>
            Set up safe zones, restricted areas, and location-based rules for your teen driver.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manage" data-testid="tab-manage-geofences">Manage Geofences</TabsTrigger>
            <TabsTrigger value="events" data-testid="tab-geofence-events">Recent Events</TabsTrigger>
            <TabsTrigger value="help" data-testid="tab-geofencing-help">Help</TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Geofences</h3>
              <Button 
                onClick={() => setShowCreateForm(true)} 
                size="sm"
                data-testid="button-create-geofence"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Geofence
              </Button>
            </div>

            {showCreateForm && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingGeofence ? "Edit Geofence" : "Create New Geofence"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Geofence Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Home, School, Work"
                          required
                          data-testid="input-geofence-name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="type">Geofence Type</Label>
                        <Select value={formData.type} onValueChange={(value: 'safe' | 'restricted' | 'curfew') => setFormData(prev => ({ ...prev, type: value }))}>
                          <SelectTrigger data-testid="select-geofence-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="safe">Safe Zone</SelectItem>
                            <SelectItem value="restricted">Restricted Area</SelectItem>
                            <SelectItem value="curfew">Curfew Zone</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="relative">
                        <Label htmlFor="address">Search Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, address: e.target.value }));
                            searchAddresses(e.target.value);
                          }}
                          placeholder="Type an address, school name, or business"
                          data-testid="input-address"
                        />
                        {isSearchingAddress && (
                          <div className="absolute right-2 top-8 text-gray-400">
                            Searching...
                          </div>
                        )}
                        
                        {showAddressSuggestions && addressSuggestions.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                            {addressSuggestions.map((item, index) => (
                              <button
                                key={index}
                                type="button"
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                onClick={() => selectAddress(item)}
                                data-testid={`address-suggestion-${index}`}
                              >
                                <div className="font-medium">{item.title}</div>
                                <div className="text-sm text-gray-600">{item.address.label}</div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {formData.latitude && formData.longitude && (
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 text-green-800">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">Location Confirmed</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">
                            Coordinates: {parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)}
                          </p>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="radius">Coverage Area</Label>
                        <Select value={formData.radius} onValueChange={(value) => setFormData(prev => ({ ...prev, radius: value }))}>
                          <SelectTrigger data-testid="select-radius">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="100">Small (100m - about 1 city block)</SelectItem>
                            <SelectItem value="250">Medium (250m - few blocks)</SelectItem>
                            <SelectItem value="500">Large (500m - neighborhood area)</SelectItem>
                            <SelectItem value="1000">Extra Large (1km - wide area)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {(formData.type === 'curfew' || formData.type === 'restricted') && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-yellow-50 rounded-lg">
                        <div>
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                            data-testid="input-start-time"
                          />
                        </div>
                        <div>
                          <Label htmlFor="endTime">End Time</Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                            data-testid="input-end-time"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="notifyOnEntry"
                          checked={formData.notifyOnEntry}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notifyOnEntry: checked }))}
                          data-testid="switch-notify-entry"
                        />
                        <Label htmlFor="notifyOnEntry">Notify on Entry</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="notifyOnExit"
                          checked={formData.notifyOnExit}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notifyOnExit: checked }))}
                          data-testid="switch-notify-exit"
                        />
                        <Label htmlFor="notifyOnExit">Notify on Exit</Label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        disabled={createGeofenceMutation.isPending || updateGeofenceMutation.isPending}
                        data-testid="button-save-geofence"
                      >
                        {editingGeofence ? "Update" : "Create"} Geofence
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowCreateForm(false);
                          setEditingGeofence(null);
                          resetForm();
                        }}
                        data-testid="button-cancel-geofence"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {isLoading ? (
                <div>Loading geofences...</div>
              ) : (geofences as Geofence[]).length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Geofences Yet</h3>
                    <p className="text-gray-600">
                      Create your first geofence using the "Create Geofence" button above to start monitoring your teen's locations
                    </p>
                  </CardContent>
                </Card>
              ) : (
                (geofences as Geofence[]).map((geofence: Geofence) => (
                  <Card key={geofence.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${getGeofenceTypeColor(geofence.type)}`}>
                            {getGeofenceTypeIcon(geofence.type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{geofence.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className={getGeofenceTypeColor(geofence.type)}>
                                {geofence.type}
                              </Badge>
                              <Badge variant={geofence.isActive ? "default" : "secondary"}>
                                {geofence.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditing(geofence)}
                            data-testid={`button-edit-geofence-${geofence.id}`}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteGeofenceMutation.mutate(geofence.id)}
                            disabled={deleteGeofenceMutation.isPending}
                            data-testid={`button-delete-geofence-${geofence.id}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <p className="font-medium">{geofence.address || `${geofence.latitude}, ${geofence.longitude}`}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Radius:</span>
                          <p className="font-medium">{geofence.radius}m</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Entry Alert:</span>
                          <p className="font-medium">{geofence.notifyOnEntry ? "Yes" : "No"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Exit Alert:</span>
                          <p className="font-medium">{geofence.notifyOnExit ? "Yes" : "No"}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Geofence Events</h3>
            {geofenceEvents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Yet</h3>
                  <p className="text-gray-600">
                    Geofence events will appear here when your teen enters or exits monitored areas
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {geofenceEvents.map((event: any) => (
                  <Card key={event.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${event.action === 'enter' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {event.action === 'enter' ? '→' : '←'}
                          </div>
                          <div>
                            <p className="font-medium">
                              {event.action === 'enter' ? 'Entered' : 'Exited'} geofence
                            </p>
                            <p className="text-sm text-gray-600">{event.address || 'Location not available'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatDateTime(event.createdAt)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="help" className="space-y-4">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Safe Zones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Safe zones are areas where you want your teen to feel secure. When they enter a safe zone, 
                    you can optionally receive notifications. These are typically home, school, or trusted friends' houses.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Restricted Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Restricted areas are locations where your teen should not be. You'll receive immediate 
                    alerts when they enter these zones. These might include certain neighborhoods, 
                    bars, or other inappropriate locations.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    Curfew Zones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Curfew zones are time-restricted areas. Your teen can be there during certain hours, 
                    but you'll receive alerts if they're in these zones outside the allowed times. 
                    Perfect for managing late-night activities.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How to Create Geofences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-gray-600">Creating a geofence is easy:</p>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                      <li>Give your geofence a name (e.g., "Home", "School")</li>
                      <li>Choose the type: Safe Zone, Restricted Area, or Curfew Zone</li>
                      <li>Start typing an address in the search box - suggestions will appear automatically</li>
                      <li>Click on the correct address from the suggestions</li>
                      <li>Choose the coverage area size</li>
                      <li>Set up notifications and time restrictions if needed</li>
                    </ol>
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium">💡 Pro Tip</p>
                      <p className="text-sm text-blue-700">
                        You can search for businesses, schools, or landmarks by name. For example, try "Starbucks near downtown" or "Lincoln High School".
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}