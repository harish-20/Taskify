import Title from "@/components/UI/Title";

import useOranization from "@/lib/store/organization";

interface Step5Props {}

const Step5: React.FC<Step5Props> = () => {
  const { formData } = useOranization();
  return (
    <div>
      <Title>Preview Your Details</Title>
      {/* Show all the organization form detail for users to preview */}
      <div className="border border-gray rounded-xl p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Organization Name</h3>
            <p>{formData.name || "Not provided"}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Description</h3>
            <p>{formData.description || "Not provided"}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Address</h3>
            <p>
              {formData.address.street}, {formData.address.city},{" "}
              {formData.address.state} {formData.address.zip},{" "}
              {formData.address.country}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Contact Email</h3>
            <p>{formData.contactEmail || "Not provided"}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Phone Number</h3>
            <p>{formData.phoneNumber || "Not provided"}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Website</h3>
            <p>{formData.website || "Not provided"}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Industry</h3>
            <p>{formData.industry || "Not provided"}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Company Size</h3>
            <p>{formData.size || "Not provided"}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Interests</h3>
            <p>
              {formData.interests.length > 0
                ? formData.interests.join(", ")
                : "None selected"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Tech Stack</h3>
            <p>
              {formData.techStack.length > 0
                ? formData.techStack.join(", ")
                : "None selected"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5;
