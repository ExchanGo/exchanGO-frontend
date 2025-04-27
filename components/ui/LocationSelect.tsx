"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, LocateFixed } from "lucide-react";
import { useState } from "react";

interface LocationSelectProps {
  label: string;
  defaultValue?: string;
  locations?: { value: string; label: string }[];
  onValueChange?: (value: string) => void;
  icon?: React.ReactNode;
  prefixIcon?: React.ReactNode;
  iconClassName?: string;
  prefixIconClassName?: string;
}

const defaultCity = [
  { value: "casablanca", label: "Casablanca" },
  { value: "rabat", label: "Rabat" },
  { value: "marrakech", label: "Marrakech" },
  { value: "fes", label: "Fès" },
  { value: "tangier", label: "Tanger" },
  { value: "agadir", label: "Agadir" },
  { value: "meknes", label: "Meknès" },
  { value: "oujda", label: "Oujda" },
  { value: "kenitra", label: "Kénitra" },
  { value: "tetouan", label: "Tétouan" },
  { value: "safi", label: "Safi" },
  { value: "mohammedia", label: "Mohammedia" },
  { value: "el-jadida", label: "El Jadida" },
  { value: "beni-mellal", label: "Béni Mellal" },
  { value: "nador", label: "Nador" },
  { value: "taza", label: "Taza" },
  { value: "settat", label: "Settat" },
  { value: "larache", label: "Larache" },
  { value: "khouribga", label: "Khouribga" },
  { value: "ouarzazate", label: "Ouarzazate" },
  { value: "essaouira", label: "Essaouira" },
  { value: "al-hoceima", label: "Al Hoceïma" },
  { value: "errachidia", label: "Errachidia" },
  { value: "guelmim", label: "Guelmim" },
  { value: "berrechid", label: "Berrechid" },
  { value: "temara", label: "Témara" },
  { value: "sale", label: "Salé" },
  { value: "dakhla", label: "Dakhla" },
  { value: "ifrane", label: "Ifrane" },
  { value: "laayoune", label: "Laâyoune" },
];

export function LoactionSelect({
  defaultValue = "rabat",
  locations = defaultCity,
  onValueChange,
  prefixIcon,
  iconClassName,
  prefixIconClassName,
}: LocationSelectProps) {
  const [value, setValue] = useState<string>(defaultValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onValueChange?.(newValue);
  };

  const getDisplayValue = (val: string | undefined) => {
    if (!val) return "";
    const city = locations.find((city) => city.value === val);
    return city ? `${city.label} - Morocco` : "";
  };

  return (
    <div className="flex items-center justify-between cursor-pointer">
      <Select
        defaultValue={defaultValue}
        value={value}
        onValueChange={handleValueChange}
      >
        <SelectTrigger
          className="bg-white border-0 focus:ring-0 focus:ring-offset-0 outline-none px-0 py-0 h-6 font-dm text-lg text-[#585858] flex items-center gap-2"
          icon={<LocateFixed className={iconClassName} />}
        >
          <div className="flex items-center gap-2 max-w-[200px] overflow-hidden">
            {prefixIcon || (
              <MapPin
                className={`h-5 w-5 flex-shrink-0 ${prefixIconClassName}`}
                color="#292D32"
              />
            )}
            <SelectValue placeholder="Select location" className="truncate">
              <span className="truncate block">{getDisplayValue(value)}</span>
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {locations.map((location) => (
            <SelectItem
              key={location.value}
              value={location.value}
              className="flex items-center gap-2"
            >
              <span className="truncate block">{location.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
