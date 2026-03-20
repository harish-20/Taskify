import AddressInput from "@/components/UI/AddressInput";
import Title from "@/components/UI/Title";
import Select from "@/components/UI/Select";

import useOranization from "@/lib/store/organization";

const TECH_STACK_OPTIONS = [
  { label: "React", value: "react" },
  { label: "Node.js", value: "nodejs" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "Ruby on Rails", value: "ruby_on_rails" },
  { label: "Go", value: "go" },
  { label: "PHP", value: "php" },
  { label: "C#", value: "csharp" },
  { label: "C++", value: "cpp" },
  { label: "Django", value: "django" },
  { label: "Flask", value: "flask" },
  { label: "Spring Boot", value: "spring_boot" },
];

const INTEREST_OPTIONS = [
  { label: "AI/ML", value: "ai_ml" },
  { label: "Cloud Computing", value: "cloud_computing" },
  { label: "Data Science", value: "data_science" },
  { label: "DevOps", value: "devops" },
  { label: "Mobile Development", value: "mobile_development" },
  { label: "Web Development", value: "web_development" },
  { label: "Cybersecurity", value: "cybersecurity" },
  { label: "Blockchain", value: "blockchain" },
  { label: "IoT", value: "iot" },
  { label: "AR/VR", value: "ar_vr" },
  { label: "Game Development", value: "game_development" },
  { label: "Other", value: "other" },
];

interface Step4Props {}

const Step4: React.FC<Step4Props> = () => {
  const { formData, setField } = useOranization();

  return (
    <div className="flex flex-col gap-6">
      <Title>Your technology profile</Title>

      <div className="border border-gray rounded-xl p-6">
        <Select
          label="Tech Stack"
          options={TECH_STACK_OPTIONS}
          value={formData.techStack}
          multiple
          onChange={(value) => setField("techStack", [...value])}
        />
      </div>

      <div className="border border-gray rounded-xl p-6">
        <Select
          label="Interests"
          options={INTEREST_OPTIONS}
          value={formData.interests}
          multiple
          onChange={(value) => setField("interests", [...value])}
        />
      </div>
    </div>
  );
};

export default Step4;
