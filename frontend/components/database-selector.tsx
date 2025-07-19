"use client"
import { useState, ChangeEvent, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "./ui/textarea"
import { Plus } from "lucide-react"

interface DatabaseSelectorProps {
  onChange?: (value: string) => void;
  views: string[];
  userRole: string;
}

interface AddViewFormData {
  view_key: string;
  view_name: string;
  ddl: string;
  db_url: string;
}

const DatabaseSelector = ({ views, onChange = () => {}, userRole }: DatabaseSelectorProps) => {
  const [selectedView, setSelectedView] = useState(views[0] || "StudentDB");
  const [isAddViewOpen, setIsAddViewOpen] = useState(false);
  const [formData, setFormData] = useState<AddViewFormData>({
    view_key: "",
    view_name: "",
    ddl: "",
    db_url: ""
  });

  const handleViewChange = (value: string) => {
    setSelectedView(value);
    onChange(value);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAddView = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/database/add-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to add view');
      }

      // Reset form and close dialog
      setFormData({ view_key: "", view_name: "", ddl: "", db_url: "" });
      setIsAddViewOpen(false);
      
      // Refresh the views list
      window.location.reload();
    } catch (error) {
      console.error("Error adding view:", error);
      alert(error instanceof Error ? error.message : "Failed to add view. Please try again.");
    }
  };

  useEffect(() => {
    if (onChange) {
      onChange(selectedView); // Call onChange with the selected database when it changes
    }
  }, [selectedView, onChange]); // This ensures that the onChange callback is called whenever 'database' changes


  return (
    <div className="space-y-4">
      <Select value={selectedView} onValueChange={handleViewChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a view" />
        </SelectTrigger>
        <SelectContent>
          {views.map((view) => (
            <SelectItem key={view} value={view}>
              {view}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {["Admin", "Super Admin"].includes(userRole) && (
        <Dialog open={isAddViewOpen} onOpenChange={setIsAddViewOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add New View
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Database</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="view_key">Database Name</Label>
                <Input
                  id="view_key"
                  value={formData.view_key}
                  onChange={handleInputChange}
                  placeholder="Enter the database name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="view_name">View Name (Same as in the database)</Label>
                <Input
                  id="view_name"
                  value={formData.view_name}
                  onChange={handleInputChange}
                  placeholder="Enter the view name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ddl">DDL Statements (Schema)</Label>
                <Textarea
                  id="ddl"
                  value={formData.ddl}
                  onChange={handleInputChange}
                  placeholder="Provide DDL statement for the view"
                  className="min-h-[100px]"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Tip: Provide the DDL for a <strong>single consolidated view</strong>. The system queries this view to process user requests.
              </p>
              <div className="grid gap-2">
                <Label htmlFor="db_url">Database URL</Label>
                <Input
                  id="db_url"
                  value={formData.db_url}
                  onChange={handleInputChange}
                  placeholder="postgresql+asyncpg://user:password@localhost:5432/database"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddViewOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddView}>Add View</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DatabaseSelector;