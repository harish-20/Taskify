import Office from "@/components/icons/Office";
import Contact from "@/components/icons/Contact";
import Location from "@/components/icons/Location";
import Technology from "@/components/icons/Technology";
import Confirm from "@/components/icons/Confirm";

export const step_data: Step[] = [
  {
    label: "Organization Details",
    Icon: () => (
      <>
        <Office className="h-6 w-6" />
      </>
    ),
  },
  {
    label: "Contact Details",
    Icon: () => (
      <>
        <Contact className="h-6 w-6" />
      </>
    ),
  },
  {
    label: "Location & Address",
    Icon: () => (
      <>
        <Location className="h-6 w-6" />
      </>
    ),
  },
  {
    label: "Technology & Interests",
    Icon: () => (
      <>
        <Technology className="h-6 w-6" />
      </>
    ),
  },
  {
    label: "Review & Confirm",
    Icon: () => (
      <>
        <Confirm className="h-6 w-6" />
      </>
    ),
  },
];
