
import React from 'react';
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PredictRequest } from '@/lib/api';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PredictFormProps {
  onSubmit: (data: PredictRequest) => void;
  isLoading: boolean;
}

export function PredictForm({ onSubmit, isLoading }: PredictFormProps) {
  const [date, setDate] = React.useState<Date>(new Date());
  const [category, setCategory] = React.useState("Shirt");
  const [size, setSize] = React.useState("M");
  const [color, setColor] = React.useState("Blue");
  const [price, setPrice] = React.useState(29.99);
  const [inventory, setInventory] = React.useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date,
      category,
      size,
      color,
      price,
      inventory
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-card rounded-xl border shadow-sm">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-tight">Configurar Prenda</h3>
        <p className="text-sm text-muted-foreground">Introduce las características para estimar la demanda.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Date Picker */}
        <div className="space-y-2 flex flex-col">
          <Label>Fecha de Venta</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Seleccionar fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {["Shirt", "Pants", "Dress", "Jacket", "Skirt"].map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Size */}
        <div className="space-y-2">
          <Label>Talla</Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              {["XS", "S", "M", "L", "XL"].map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color */}
        <div className="space-y-2">
          <Label>Color</Label>
          <Select value={color} onValueChange={setColor}>
            <SelectTrigger>
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {["Red", "Blue", "Green", "Black", "White"].map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label>Precio ($)</Label>
          <Input 
            type="number" 
            step="0.01" 
            value={price} 
            onChange={(e) => setPrice(parseFloat(e.target.value))} 
          />
        </div>

        {/* Inventory */}
        <div className="space-y-2 md:col-span-2">
          <div className="flex justify-between">
            <Label>Inventario Disponible</Label>
            <span className="text-sm text-muted-foreground">{inventory} unidades</span>
          </div>
          <Slider 
            value={[inventory]} 
            max={200} 
            step={1} 
            onValueChange={(v) => setInventory(v[0])} 
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Calculando..." : "Predecir Ventas"}
      </Button>
    </form>
  );
}
