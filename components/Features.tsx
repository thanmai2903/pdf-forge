import {
  Shield,
  Zap,
  FileText,
  Smartphone,
}
from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure",
  },
  {
    icon: Zap,
    title: "Fast",
  },
  {
    icon: FileText,
    title: "PDF Tools",
  },
  {
    icon: Smartphone,
    title: "Responsive",
  },
];

export default function Features() {
  return (
    <section
     id="features"
      className="
      grid
      md:grid-cols-4
      gap-6
      my-20
      "
    >
      {features.map(
        (feature) => (
          <div
            key={
              feature.title
            }
            className="
            border
            rounded-xl
            p-6
            text-center
            "
          >
            <feature.icon
              className="
              mx-auto
              mb-4
              "
            />

            <h3>
              {
                feature.title
              }
            </h3>
          </div>
        )
      )}
    </section>
  );
}