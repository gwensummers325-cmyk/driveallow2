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

interface AddBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  teenId: string;
  teenName: string;
}

const bonusTypes = [
  { value: 'safe_driving_week', label: 'Safe Driving Week', amount: '5.00' },
  { value: 'perfect_week', label: 'Perfect Week (No Violations)', amount: '10.00' },
  { value: 'speed_compliance', label: 'Speed Limit Compliance', amount: '2.00' },
  { value: 'good_behavior', label: 'Good Behavior', amount: '5.00' },
  { value: 'custom', label: 'Custom Bonus', amount: '' },
];

export function AddBonusModal({ isOpen, onClose, teenId, teenName }: AddBonusModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    description: '',
  });

  const addBonusMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/bonuses", {
        teenId,
        amount: parseFloat(data.amount),
        description: data.description,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/parent"] });
      toast({
        title: "Success",
        description: `Bonus added for ${teenName}!`,
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
        description: "Failed to add bonus. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setFormData({
      type: '',
      amount: '',
      description: '',
    });
    onClose();
  };

  const handleTypeChange = (type: string) => {
    const bonusType = bonusTypes.find(t => t.value === type);
    setFormData(prev => ({
      ...prev,
      type,
      amount: bonusType?.amount || '',
      description: bonusType?.label || '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    addBonusMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Bonus for {teenName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bonus-type">Bonus Type *</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select bonus type" />
              </SelectTrigger>
              <SelectContent>
                {bonusTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="amount">Bonus Amount *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                className="pl-6"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Reason for bonus..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={addBonusMutation.isPending}
            >
              {addBonusMutation.isPending ? 'Adding...' : 'Add Bonus'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
