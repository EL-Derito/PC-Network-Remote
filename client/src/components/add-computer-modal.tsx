import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertComputerSchema, updateComputerSchema, type Computer } from "@shared/schema";
import { z } from "zod";

const formSchema = insertComputerSchema.extend({
  ipAddress: z.string().regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, "Invalid IP address format"),
});

type FormData = z.infer<typeof formSchema>;

interface AddComputerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  computer?: Computer | null;
}

export default function AddComputerModal({ isOpen, onClose, onSuccess, computer }: AddComputerModalProps) {
  const { toast } = useToast();
  const isEditing = !!computer;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      processor: "",
      ram: "",
      storage: "",
      ipAddress: "",
      remoteEnabled: false,
      remotePassword: "",
      status: "offline",
    },
  });

  const remoteEnabled = form.watch("remoteEnabled");

  useEffect(() => {
    if (computer) {
      form.reset({
        name: computer.name,
        processor: computer.processor,
        ram: computer.ram,
        storage: computer.storage,
        ipAddress: computer.ipAddress,
        remoteEnabled: computer.remoteEnabled,
        remotePassword: computer.remotePassword || "",
        status: computer.status,
      });
    } else {
      form.reset({
        name: "",
        processor: "",
        ram: "",
        storage: "",
        ipAddress: "",
        remoteEnabled: false,
        remotePassword: "",
        status: "offline",
      });
    }
  }, [computer, form]);

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const url = isEditing ? `/api/computers/${computer.id}` : "/api/computers";
      const method = isEditing ? "PATCH" : "POST";
      
      const payload = isEditing ? updateComputerSchema.parse(data) : data;
      await apiRequest(method, url, payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: `Computer ${isEditing ? "updated" : "added"} successfully`,
      });
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Computer" : "Add New Computer"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Computer Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., DEV-WORKSTATION-01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ipAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Address</FormLabel>
                    <FormControl>
                      <Input placeholder="192.168.1.100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="processor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processor</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Intel Core i7-12700K" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="ram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RAM</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select RAM" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="4GB DDR4">4GB DDR4</SelectItem>
                        <SelectItem value="8GB DDR4">8GB DDR4</SelectItem>
                        <SelectItem value="16GB DDR4">16GB DDR4</SelectItem>
                        <SelectItem value="32GB DDR4">32GB DDR4</SelectItem>
                        <SelectItem value="64GB DDR4">64GB DDR4</SelectItem>
                        <SelectItem value="64GB ECC DDR4">64GB ECC DDR4</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="storage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 1TB NVMe SSD" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-900">Remote Access Configuration (Optional)</h4>
              
              <FormField
                control={form.control}
                name="remoteEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Enable Remote Access</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {remoteEnabled && (
                <FormField
                  control={form.control}
                  name="remotePassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remote Access Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter secure password" {...field} />
                      </FormControl>
                      <p className="text-xs text-gray-500">Password will be used for VNC connections</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-6">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending 
                  ? (isEditing ? "Updating..." : "Adding...") 
                  : (isEditing ? "Update Computer" : "Add Computer")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
