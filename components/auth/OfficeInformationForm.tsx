"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  AlertCircle,
  Building,
  FileText,
  CreditCard,
  MapPin,
  Check,
  X,
  Store,
} from "lucide-react";
import { z } from "zod";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { PhoneInput } from "../ui/phone-input";
import type { Value } from "react-phone-number-input";
import { Button } from "../ui/button";
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

const formSchema = z.object({
  officeName: z
    .string()
    .nonempty("Office name is required")
    .min(2, { message: "Office name is required" }),
  commercialRegistration: z
    .string()
    .nonempty("Commercial registration number is required")
    .min(2, { message: "Commercial registration number is required" }),
  currencyLicense: z
    .string()
    .nonempty("Currency exchange license number is required")
    .min(2, { message: "Currency exchange license number is required" }),
  streetAddress: z
    .string()
    .nonempty("Street address is required")
    .min(5, { message: "Street address is required" }),
  city: z
    .string()
    .nonempty("City is required")
    .min(2, { message: "City is required" }),
  province: z
    .string()
    .nonempty("Province is required")
    .min(2, { message: "Province is required" }),
  primaryPhone: z
    .string({ required_error: "Phone number is required" })
    .nonempty("Phone number is required")
    .refine((val) => phoneRegex.test(val), {
      message: "Invalid phone number format",
    }),
  isWhatsApp: z.boolean().optional(),
  otherNumber: z
    .string()
    .optional()
    .refine((val) => !val || phoneRegex.test(val), {
      message: "Invalid phone number format",
    }),
  logo: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function OfficeInformationForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Partial<FormData>>({
    isWhatsApp: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [showOtherNumber, setShowOtherNumber] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+212");
  const [otherCountryCode, setOtherCountryCode] = useState("+121");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [otherPhone, setOtherPhone] = useState("");
  const [phone, setPhone] = useState<Value | undefined>(undefined);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      updateFormData("logo", file);

      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrimaryPhoneChange = (value: string) => {
    setPrimaryPhone(value);
    // Store the raw phone value - avoid adding space after code which causes validation issues
    updateFormData("primaryPhone", value || "");
  };

  const handleOtherPhoneChange = (value: string) => {
    setOtherPhone(value);
    // Store the raw phone value
    updateFormData("otherNumber", value || "");
  };

  const handleCountryCodeChange = (value: string) => {
    setSelectedCountryCode(value);
    updateFormData("primaryPhone", value + " " + primaryPhone);
  };

  const handleOtherCountryCodeChange = (value: string) => {
    setOtherCountryCode(value);
    updateFormData("otherNumber", value + " " + otherPhone);
  };

  const validateForm = () => {
    try {
      // Create a partial schema excluding logo and otherNumber if not provided
      const partialSchema = formSchema.partial({
        logo: true,
        otherNumber: true,
      });

      console.log("Validating form data:", formData);
      const result = partialSchema.safeParse(formData);

      if (result.success) {
        setErrors({});
        return true;
      } else {
        const newErrors: Record<string, string> = {};
        console.log("Validation errors:", result.error.format());

        // Extract and format errors
        result.error.errors.forEach((err) => {
          if (err.path[0]) {
            const fieldName = String(err.path[0]);
            // Use meaningful error messages
            const errorMessage =
              err.message ||
              `${
                fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
              } is required`;
            newErrors[fieldName] = errorMessage;
            console.log(`Field ${fieldName} error:`, errorMessage);
          }
        });

        setErrors(newErrors);
        return false;
      }
    } catch (error) {
      console.error("Form validation error:", error);
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        console.log("Zod validation errors:", error.format());

        error.errors.forEach((err) => {
          if (err.path[0]) {
            const fieldName = String(err.path[0]);
            // Use meaningful error messages
            const errorMessage =
              err.message ||
              `${
                fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
              } is required`;
            newErrors[fieldName] = errorMessage;
          }
        });

        setErrors(newErrors);
      } else {
        // Handle unexpected errors
        setErrors({ form: "An unexpected error occurred. Please try again." });
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);

    // Double check empty required fields before validation
    const requiredFields = [
      "officeName",
      "commercialRegistration",
      "currencyLicense",
      "streetAddress",
      "city",
      "province",
      "primaryPhone",
    ];

    const emptyFields = requiredFields.filter(
      (field) => !formData[field as keyof FormData]
    );

    if (emptyFields.length > 0) {
      console.log("Empty required fields:", emptyFields);
      const newErrors: Record<string, string> = { ...errors };

      emptyFields.forEach((field) => {
        const fieldName =
          field.charAt(0).toUpperCase() +
          field
            .slice(1)
            .replace(/([A-Z])/g, " $1")
            .trim();
        newErrors[field] = `${fieldName} is required`;
      });

      setErrors(newErrors);
      return;
    }

    // Run validation
    if (!validateForm()) {
      console.log("Form validation failed");
      return;
    }

    console.log("Form validation passed, submitting...");
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to set location page with smooth transition
      router.push("/set-location");
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors({ form: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleWhatsApp = () => {
    setFormData((prev) => ({
      ...prev,
      isWhatsApp: !prev.isWhatsApp,
    }));
  };

  const cancelOtherNumber = () => {
    setShowOtherNumber(false);
    updateFormData("otherNumber", "");
    setOtherPhone("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Logo Upload */}
      <div className="flex flex-col items-center mb-8">
        <motion.div
          className="relative w-[140px] h-[140px] rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
          whileHover={{
            scale: 1.02,
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
          transition={{ duration: 0.2 }}
        >
          {logoPreview ? (
            <motion.img
              src={logoPreview}
              alt="Office Logo"
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
            </motion.div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.gif"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </motion.div>
        <motion.button
          type="button"
          className="mt-4 px-6 py-2 text-sm border border-[var(--color-greeny)] text-[var(--color-greeny)] rounded-md flex items-center gap-2 font-medium"
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ backgroundColor: "rgba(74, 175, 87, 0.05)" }}
          transition={{ duration: 0.2 }}
        >
          Upload Logo
        </motion.button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          .png, .jpeg, .gif, files up to 8MB.
          <br />
          Recommended size 256x256
        </p>
        <AnimatePresence>
          {errors.logo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-1 mt-1 text-red-500 text-xs"
            >
              <AlertCircle className="w-3 h-3" />
              <span>{errors.logo}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-4">
        <div>
          <FloatingLabelInput
            label="Office Name"
            placeholder="Placeholder"
            icon={Store}
            defaultValue={formData.officeName || ""}
            onChange={(value) => updateFormData("officeName", value)}
          />
          <AnimatePresence>
            {errors.officeName && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-1 mt-1 text-red-500 text-xs"
              >
                <AlertCircle className="w-3 h-3" />
                <span>{errors.officeName}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <FloatingLabelInput
            label="Commercial Registration Number"
            placeholder="Placeholder"
            icon={FileText}
            defaultValue={formData.commercialRegistration || ""}
            onChange={(value) =>
              updateFormData("commercialRegistration", value)
            }
          />
          <AnimatePresence>
            {errors.commercialRegistration && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-1 mt-1 text-red-500 text-xs"
              >
                <AlertCircle className="w-3 h-3" />
                <span>{errors.commercialRegistration}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <FloatingLabelInput
            label="Currency Exchange License Number"
            placeholder="Placeholder"
            icon={CreditCard}
            defaultValue={formData.currencyLicense || ""}
            onChange={(value) => updateFormData("currencyLicense", value)}
          />
          <AnimatePresence>
            {errors.currencyLicense && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-1 mt-1 text-red-500 text-xs"
              >
                <AlertCircle className="w-3 h-3" />
                <span>{errors.currencyLicense}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div>
          <FloatingLabelInput
            label="Street Address"
            placeholder="Placeholder"
            icon={MapPin}
            defaultValue={formData.streetAddress || ""}
            onChange={(value) => updateFormData("streetAddress", value)}
          />
          <AnimatePresence>
            {errors.streetAddress && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-1 mt-1 text-red-500 text-xs"
              >
                <AlertCircle className="w-3 h-3" />
                <span>{errors.streetAddress}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FloatingLabelInput
              label="City"
              placeholder="Placeholder"
              icon={Building}
              defaultValue={formData.city || ""}
              onChange={(value) => updateFormData("city", value)}
            />
            <AnimatePresence>
              {errors.city && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-1 mt-1 text-red-500 text-xs"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.city}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <FloatingLabelInput
              label="Province"
              placeholder="Placeholder"
              icon={Building}
              defaultValue={formData.province || ""}
              onChange={(value) => updateFormData("province", value)}
            />
            <AnimatePresence>
              {errors.province && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-1 mt-1 text-red-500 text-xs"
                >
                  <AlertCircle className="w-3 h-3" />
                  <span>{errors.province}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Phone Number Section */}
        <div className="relative z-50">
          <PhoneInput
            label="Primary Phone Number"
            value={primaryPhone}
            onChange={(value) => {
              // Only update if there's a value
              if (value) {
                handlePrimaryPhoneChange(value.toString());
              } else {
                // Clear the value if it's empty
                handlePrimaryPhoneChange("");
              }
            }}
            placeholder="Type your phone number"
            defaultCountry="MA"
          />
          <AnimatePresence>
            {errors.primaryPhone && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-1 mt-1 text-red-500 text-xs"
              >
                <AlertCircle className="w-3 h-3" />
                <span>{errors.primaryPhone}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* WhatsApp checkbox */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={`w-5 h-5 rounded flex items-center justify-center ${
              formData.isWhatsApp
                ? "bg-[var(--color-greeny)] border-[var(--color-greeny)]"
                : "border border-gray-300"
            }`}
            onClick={toggleWhatsApp}
          >
            {formData.isWhatsApp && <Check className="h-4 w-4 text-white" />}
          </button>
          <span className="text-sm text-gray-600">
            Is this also your WhatsApp number?
          </span>
        </div>

        {/* Other Number Field (conditionally shown) */}
        <AnimatePresence>
          {showOtherNumber && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 16 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
            >
              <div className="flex items-center justify-end mb-2">
                <button
                  type="button"
                  onClick={cancelOtherNumber}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Cancel</span>
                </button>
              </div>

              <div className="relative z-40">
                <PhoneInput
                  value={otherPhone}
                  label="Other Number"
                  onChange={(value) => {
                    // Only update if there's a value
                    if (value) {
                      handleOtherPhoneChange(value.toString());
                    } else {
                      // Clear the value if it's empty
                      handleOtherPhoneChange("");
                    }
                  }}
                  placeholder="Type your phone number"
                  defaultCountry="MA"
                />

                <AnimatePresence>
                  {errors.otherNumber && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-1 mt-1 text-red-500 text-xs"
                    >
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.otherNumber}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add new number button */}
        {!showOtherNumber && (
          <motion.button
            type="button"
            className="flex items-center gap-2 text-[var(--color-greeny)] cursor-pointer hover:text-[var(--color-greeny-bold)]"
            onClick={() => setShowOtherNumber(true)}
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <span className="text-sm font-medium">Add new Number</span>
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {errors.form && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 border border-red-200 text-red-500 text-sm rounded-md p-3"
          >
            {errors.form}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        variant="gradient"
        className="w-full py-5"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-[#1A3617]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Processing...</span>
          </div>
        ) : (
          "Next"
        )}
      </Button>
    </form>
  );
}
