"use client";

import { FormEvent, useState } from "react";
import { Property, PropertyInput, PropertyStatus, PropertyType } from "@/lib/api";
import { TextInput, TextAreaField, SelectField } from "@/components/profile/FormField";
import { InlineBanner } from "@/components/profile/InlineBanner";
import { Button } from "@/components/ui/Button";

const TYPE_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "HOUSE", label: "House" },
  { value: "VILLA", label: "Villa" },
  { value: "STUDIO", label: "Studio" },
  { value: "TOWNHOUSE", label: "Townhouse" },
  { value: "CONDO", label: "Condo" },
  { value: "OTHER", label: "Other" },
];

const STATUS_OPTIONS: { value: PropertyStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft (hidden)" },
  { value: "AVAILABLE", label: "Available" },
  { value: "RENTED", label: "Rented" },
  { value: "ARCHIVED", label: "Archived" },
];

function numberToInput(n: number | null | undefined): string {
  return n === null || n === undefined ? "" : String(n);
}

export function PropertyForm({
  mode,
  initial,
  onSubmit,
  submitting,
}: {
  mode: "create" | "edit";
  initial?: Property;
  onSubmit: (input: PropertyInput) => Promise<void>;
  submitting: boolean;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [propertyType, setPropertyType] = useState<string>(initial?.property_type ?? "");
  const [status, setStatus] = useState<string>(initial?.status ?? "DRAFT");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [addressLine1, setAddressLine1] = useState(initial?.address_line1 ?? "");
  const [addressLine2, setAddressLine2] = useState(initial?.address_line2 ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [state, setState] = useState(initial?.state ?? "");
  const [postalCode, setPostalCode] = useState(initial?.postal_code ?? "");
  const [country, setCountry] = useState(initial?.country ?? "");
  const [bedrooms, setBedrooms] = useState(numberToInput(initial?.bedrooms ?? 1));
  const [bathrooms, setBathrooms] = useState(numberToInput(initial?.bathrooms ?? 1));
  const [areaSqft, setAreaSqft] = useState(numberToInput(initial?.area_sqft));
  const [rentAmount, setRentAmount] = useState(numberToInput(initial?.rent_amount));
  const [depositAmount, setDepositAmount] = useState(numberToInput(initial?.deposit_amount));
  const [amenities, setAmenities] = useState((initial?.amenities ?? []).join(", "));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (title.trim().length < 3) next.title = "Title must be at least 3 characters.";
    if (!propertyType) next.propertyType = "Select a property type.";
    if (addressLine1.trim().length < 3) next.addressLine1 = "Enter a street address.";
    if (!city.trim()) next.city = "City is required.";
    if (bedrooms === "" || Number(bedrooms) < 0) next.bedrooms = "Enter a valid number of bedrooms.";
    if (bathrooms === "" || Number(bathrooms) < 0) next.bathrooms = "Enter a valid number of bathrooms.";
    if (rentAmount === "" || Number(rentAmount) < 0) next.rentAmount = "Enter a valid monthly rent.";
    if (areaSqft !== "" && Number(areaSqft) < 0) next.areaSqft = "Enter a valid area.";
    if (depositAmount !== "" && Number(depositAmount) < 0) next.depositAmount = "Enter a valid deposit.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    const input: PropertyInput = {
      title: title.trim(),
      description: description.trim() || null,
      propertyType: propertyType as PropertyType,
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim() || null,
      city: city.trim(),
      state: state.trim() || null,
      postalCode: postalCode.trim() || null,
      country: country.trim() || null,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      areaSqft: areaSqft === "" ? null : Number(areaSqft),
      rentAmount: Number(rentAmount),
      depositAmount: depositAmount === "" ? null : Number(depositAmount),
      amenities: amenities.split(",").map((a) => a.trim()).filter(Boolean),
      status: status as PropertyStatus,
    };

    try {
      await onSubmit(input);
    } catch (err: any) {
      setFormError(err.message ?? "Failed to save property.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextInput id="title" label="Listing title" value={title} onChange={setTitle} placeholder="Sunny 2-bed near downtown" required error={errors.title} />
        <SelectField id="propertyType" label="Property type" value={propertyType} onChange={setPropertyType} options={TYPE_OPTIONS} placeholder="Select a type" required error={errors.propertyType} />
      </div>

      {mode === "edit" && (
        <SelectField id="status" label="Status" value={status} onChange={setStatus} options={STATUS_OPTIONS} />
      )}

      <TextAreaField id="description" label="Description" value={description} onChange={setDescription} maxLength={2000} placeholder="Tell tenants what makes this place worth renting." />

      <div className="border-t border-ink/10 pt-5">
        <p className="mb-4 text-sm font-medium text-ink">Location</p>
        <div className="space-y-5">
          <TextInput id="addressLine1" label="Address line 1" value={addressLine1} onChange={setAddressLine1} required error={errors.addressLine1} />
          <TextInput id="addressLine2" label="Address line 2" value={addressLine2} onChange={setAddressLine2} placeholder="Apt, suite, unit (optional)" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextInput id="city" label="City" value={city} onChange={setCity} required error={errors.city} />
            <TextInput id="state" label="State / Province" value={state} onChange={setState} />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <TextInput id="postalCode" label="Postal code" value={postalCode} onChange={setPostalCode} />
            <TextInput id="country" label="Country" value={country} onChange={setCountry} />
          </div>
        </div>
      </div>

      <div className="border-t border-ink/10 pt-5">
        <p className="mb-4 text-sm font-medium text-ink">Details &amp; pricing</p>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          <TextInput id="bedrooms" label="Bedrooms" type="number" value={bedrooms} onChange={setBedrooms} error={errors.bedrooms} />
          <TextInput id="bathrooms" label="Bathrooms" type="number" value={bathrooms} onChange={setBathrooms} error={errors.bathrooms} />
          <TextInput id="areaSqft" label="Area (sq ft)" type="number" value={areaSqft} onChange={setAreaSqft} error={errors.areaSqft} />
          <TextInput id="rentAmount" label="Rent / month" type="number" value={rentAmount} onChange={setRentAmount} required error={errors.rentAmount} />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <TextInput id="depositAmount" label="Security deposit" type="number" value={depositAmount} onChange={setDepositAmount} error={errors.depositAmount} />
          <TextInput id="amenities" label="Amenities" value={amenities} onChange={setAmenities} placeholder="WiFi, Parking, Pool (comma separated)" />
        </div>
      </div>

      {formError && <InlineBanner kind="error" message={formError} />}

      <Button type="submit" variant="primary" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? (mode === "create" ? "Creating…" : "Saving…") : (mode === "create" ? "Create property" : "Save changes")}
      </Button>
    </form>
  );
}