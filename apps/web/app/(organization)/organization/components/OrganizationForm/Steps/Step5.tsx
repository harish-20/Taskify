import Title from "@/components/UI/Title";
import Office from "@/components/icons/Office";
import Email from "@/components/icons/Email";
import Location from "@/components/icons/Location";
import Technology from "@/components/icons/Technology";
import Confirm from "@/components/icons/Confirm";

import useOranization from "@/lib/store/organization";

interface Step5Props {}

const Step5: React.FC<Step5Props> = () => {
  const { formData } = useOranization();

  const formatAddress = () => {
    const { street, city, state, zip, country } = formData.address;
    const parts = [street, city, state, zip, country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Not provided";
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Title>Review Your Organization Details</Title>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Office className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Organization Name
              </label>
              <p className="text-gray-900 font-medium">
                {formData.name || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Description
              </label>
              <p className="text-gray-900">
                {formData.description || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Industry
              </label>
              <p className="text-gray-900">
                {formData.industry || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Company Size
              </label>
              <p className="text-gray-900">{formData.size || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <Email className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Contact Details
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Email className="h-4 w-4 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="text-gray-900">
                  {formData.contactEmail || "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Confirm className="h-4 w-4 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Phone
                </label>
                <p className="text-gray-900">
                  {formData.phoneNumber || "Not provided"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Confirm className="h-4 w-4 text-gray-400" />
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Website
                </label>
                <p className="text-gray-900">
                  {formData.website || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Location className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Location</h3>
          </div>
          <div className="flex items-start gap-3">
            <Location className="h-4 w-4 text-gray-400 mt-1" />
            <div>
              <label className="text-sm font-medium text-gray-500">
                Address
              </label>
              <p className="text-gray-900">{formatAddress()}</p>
            </div>
          </div>
        </div>

        {/* Technology & Interests */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Technology className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Technology & Interests
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Technology className="h-4 w-4" />
                Tech Stack
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.techStack.length > 0 ? (
                  formData.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">None selected</p>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Confirm className="h-4 w-4" />
                Interests
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.interests.length > 0 ? (
                  formData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">None selected</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Confirm className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Ready to Submit
          </h3>
        </div>
        <p className="text-gray-700">
          Your organization details look great! Click "Submit" to create your
          organization and get started with Taskify.
        </p>
      </div>
    </div>
  );
};

export default Step5;
