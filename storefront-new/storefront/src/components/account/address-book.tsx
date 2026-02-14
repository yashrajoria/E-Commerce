"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const addresses = [
  {
    id: "1",
    type: "home",
    name: "John Doe",
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zip: "10001",
    country: "United States",
    phone: "+1 (555) 123-4567",
    isDefault: true,
  },
  {
    id: "2",
    type: "work",
    name: "John Doe",
    street: "456 Business Ave",
    city: "New York",
    state: "NY",
    zip: "10002",
    country: "United States",
    phone: "+1 (555) 987-6543",
    isDefault: false,
  },
];

export function AddressBook() {
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Address Book</h2>
        <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" />
                </div>
              </div>
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input id="street" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1">Save Address</Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingAddress(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {addresses.map((address, index) => (
          <motion.div
            key={address.id}
            className="bg-card border rounded-lg p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold capitalize">{address.type}</span>
                {address.isDefault && (
                  <Badge variant="secondary">Default</Badge>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-1 text-sm">
              <p className="font-medium">{address.name}</p>
              <p>{address.street}</p>
              <p>
                {address.city}, {address.state} {address.zip}
              </p>
              <p>{address.country}</p>
              <p className="text-muted-foreground">{address.phone}</p>
            </div>

            {!address.isDefault && (
              <Button variant="outline" size="sm" className="mt-4">
                Set as Default
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
