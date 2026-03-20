import AddressInput from "@/components/UI/AddressInput";
import Title from "@/components/UI/Title";

import useOranization from "@/lib/store/organization";

const Step3: React.FC = () => {
  const { formData, setField } = useOranization();
  return (
    <div className="flex flex-col gap-6">
      <Title>Where is your organization located?</Title>

      <div className="border border-gray rounded-xl p-6">
        <AddressInput
          value={formData.address}
          onChange={(address) => setField("address", address)}
        />
      </div>
    </div>
  );
};

export default Step3;
