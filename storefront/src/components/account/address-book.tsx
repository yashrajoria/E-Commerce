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
    name: "Alex Taylor",
    street: "14 High Street",
    city: "London",
    state: "Greater London",
    zip: "SW1A 1AA",
    country: "United Kingdom",
    phone: "+44 7700 900123",
    isDefault: true,
  },
  {
    id: "2",
    type: "work",
    name: "Alex Taylor",
    street: "88 Commercial Road",
    city: "London",
    state: "Greater London",
    zip: "E1 1LP",
    country: "United Kingdom",
    phone: "+44 7700 900456",
    isDefault: false,
  },
];

export function AddressBook() {
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Saved Addresses ({addresses.length})
        </h2>
        <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-surface border-border">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-foreground">
                Add New Address
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="firstName" className="text-xs">First Name</Label>
                  <Input id="firstName" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName" className="text-xs">Last Name</Label>
                  <Input id="lastName" className="h-9 text-xs" />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="street" className="text-xs">Street Address</Label>
                <Input id="street" className="h-9 text-xs" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="city" className="text-xs">City</Label>
                  <Input id="city" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="state" className="text-xs">County / State</Label>
                  <Input id="state" className="h-9 text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="zip" className="text-xs">Postcode</Label>
                  <Input id="zip" className="h-9 text-xs" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-xs">Phone</Label>
                  <Input id="phone" className="h-9 text-xs" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingAddress(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={() => setIsAddingAddress(false)}>
                  Save Address
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((address, index) => (
          <motion.div
            key={address.id}
            className="bg-surface border border-border rounded-lg p-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold text-xs capitalize text-foreground">{address.type}</span>
                {address.isDefault && (
                  <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                    Default
                  </Badge>
                )}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="space-y-0.5 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">{address.name}</p>
              <p>{address.street}</p>
              <p>
                {address.city}, {address.state} {address.zip}
              </p>
              <p>{address.country}</p>
              <p className="pt-1">{address.phone}</p>
            </div>

            {!address.isDefault && (
              <Button variant="outline" size="sm" className="mt-4 h-7 text-xs">
                Set as Default
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
