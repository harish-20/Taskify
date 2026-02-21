"use client";

import AddressInput from "@/components/UI/AddressInput";
import PhoneNumberInput from "@/components/UI/PhoneNumberInput";
import TextInput from "@/components/UI/TextInput";
import Title from "@/components/UI/Title";
import useOrganization from "@/lib/store/organization";

const Step2: React.FC = () => {
  const { formData, setField } = useOrganization();

  return (
    <div className="flex flex-col gap-6">
      <Title order={3}>How can we reach you?</Title>

      <TextInput
        label="Contact Email"
        type="email"
        required
        placeholder="example@company.com"
        value={formData.contactEmail}
        onChange={(e) => setField("contactEmail", e.target.value)}
      />

      <PhoneNumberInput
        label="Phone Number"
        value={formData.phoneNumber}
        onChange={(value) => setField("phoneNumber", value)}
      />

      <TextInput
        label="Website URL"
        type="url"
        placeholder="https://company.com"
        value={formData.website}
        onChange={(e) => setField("website", e.target.value)}
      />

      <div className="flex flex-col gap-2">
        <div className="text-sm text-dark-gray">Address</div>
        <div className="border border-gray rounded-xl p-6">
          <AddressInput
            value={formData.address}
            onChange={(address) => setField("address", address)}
          />
        </div>
      </div>
    </div>
  );
};

export default Step2;
