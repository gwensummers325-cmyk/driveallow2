import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  teenId: string;
}

const incidentTypes = [
  { value: 'speeding_minor', label: 'Speed Violation (1-10 mph over)', penalty: '5.00' },
  { value: 'speeding_major', label: 'Speed Violation (11+ mph over)', penalty: '15.00' },
  { value: 'harsh_braking', label: 'Harsh Braking', penalty: '5.00' },
  { value: 'aggressive_acceleration', label: 'Aggressive Acceleration', penalty: '5.00' },
  { value: 'other', label: 'Other', penalty: '10.00' },
];

export function ReportIncidentModal({ isOpen, onClose, teenId }: ReportIncidentModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    type: '',
    location: '',
    penaltyAmount: '',
    notes: '',
  });

  const reportIncidentMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/incidents", {
        ...data,
        teenId,
        penaltyAmount: parseFloat(data.penaltyAmount).toFixed(2),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/parent"] });
      toast({
        title: "Success",
        description: "Incident reported successfully!",
      });
      handleClose();
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
        description: "Failed to report incident. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setFormData({
      type: '',
      location: '',
      penaltyAmount: '',
      notes: '',
    });
    onClose();
  };

  const handleTypeChange = (type: string) => {
    const incidentType = incidentTypes.find(t => t.value === type);
    setFormData(prev => ({
      ...prev,
      type,
      penaltyAmount: incidentType?.penalty || '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.penaltyAmount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    reportIncidentMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report Driving Incident</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="incident-type">Incident Type *</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent>
                {incidentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. Main Street, Oak Avenue"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="penalty">Penalty Amount *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="penalty"
                type="number"
                step="0.01"
                min="0"
                className="pl-6"
                value={formData.penaltyAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, penaltyAmount: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Additional details about the incident..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={reportIncidentMutation.isPending}
            >
              {reportIncidentMutation.isPending ? 'Reporting...' : 'Report Incident'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
