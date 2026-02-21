import TextInput from "@/components/UI/TextInput";
import Select from "@/components/UI/Select";
import Title from "@/components/UI/Title";

import useOrganization from "@/lib/store/organization";
import { CompanySize } from "@/lib/types/organization";

export const COMPANY_SIZE_OPTIONS: {
  label: string;
  value: CompanySize;
}[] = [
  { label: "1–10 employees", value: "1-10" },
  { label: "11–50 employees", value: "11-50" },
  { label: "51–100 employees", value: "51-100" },
  { label: "101–200 employees", value: "101-200" },
  { label: "201–500 employees", value: "201-500" },
  { label: "501–1000 employees", value: "501-1000" },
  { label: "1001–2000 employees", value: "1001-2000" },
  { label: "2000+ employees", value: "2000+" },
];

const Step1: React.FC = () => {
  const { formData, setField } = useOrganization();

  return (
    <div className="flex flex-col gap-4">
      <Title order={3}>Tell us about your organization</Title>

      <TextInput
        label="Organization Name"
        name="name"
        value={formData.name}
        onChange={(e) => setField("name", e.target.value)}
        placeholder="Enter organization name"
      />

      <TextInput
        label="Description"
        name="description"
        value={formData.description}
        onChange={(e) => setField("description", e.target.value)}
        placeholder="Brief description of the organization"
      />

      <TextInput
        label="Industry"
        name="industry"
        value={formData.industry}
        onChange={(e) => setField("industry", e.target.value)}
        placeholder="e.g. FinTech, HealthTech"
      />

      <Select
        label="Company Size"
        options={COMPANY_SIZE_OPTIONS}
        value={formData.size}
        onChange={(value) => setField("size", value as CompanySize)}
      />
    </div>
  );
};

export default Step1;
