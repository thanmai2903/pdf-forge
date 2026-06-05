import { useEffect, useState } from "react";

type Plan = "free" | "pro" | "enterprise";

export default function Pricing() {
  const [currentPlan, setCurrentPlan] = useState<Plan>("free");
  const [loadingPlan, setLoadingPlan] = useState<Plan | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("plan") as Plan | null;
    if (saved) setCurrentPlan(saved);
  }, []);

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      desc: "Basic tools for starters",
      features: ["Basic PDF tools", "Limited conversions", "Watermark included"],
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹299/mo",
      desc: "For professionals",
      features: [
        "Unlimited conversions",
        "OCR support",
        "No watermark",
        "AI PDF tools",
      ],
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "₹999/mo",
      desc: "For teams & business",
      features: [
        "Everything in Pro",
        "Team access",
        "API access",
        "Priority support",
      ],
    },
  ];

  const handleUpgrade = async (planId: Plan) => {
    if (planId === currentPlan) return;

    setLoadingPlan(planId);

    // simulate API call (replace with Stripe/Razorpay later)
    await new Promise((res) => setTimeout(res, 1200));

    setCurrentPlan(planId);
    localStorage.setItem("plan", planId);

    setLoadingPlan(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-8">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Choose Your Plan</h1>
        <p className="text-gray-400 mt-2">
          Upgrade anytime, cancel anytime
        </p>

        <div className="mt-4 inline-block px-4 py-2 rounded-full bg-white/10 border border-white/20">
          Current Plan:{" "}
          <span className="text-green-400 font-bold uppercase">
            {currentPlan}
          </span>
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const isLoading = loadingPlan === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-6 border backdrop-blur-xl bg-white/5 border-white/10 shadow-xl transition transform hover:scale-105 ${
                plan.popular ? "border-purple-500" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute top-3 right-3 text-xs bg-purple-600 px-2 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className="text-gray-400 text-sm mt-1">{plan.desc}</p>

              <p className="text-3xl font-bold mt-4">{plan.price}</p>

              <ul className="mt-5 space-y-2 text-gray-300 text-sm">
                {plan.features.map((f, i) => (
                  <li key={i}>✓ {f}</li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.id as Plan)}
                disabled={isCurrent || isLoading}
                className={`mt-6 w-full py-2 rounded-lg font-semibold transition ${
                  isCurrent
                    ? "bg-green-600 cursor-default"
                    : isLoading
                    ? "bg-gray-500"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {isCurrent
                  ? "Current Plan"
                  : isLoading
                  ? "Upgrading..."
                  : "Upgrade"}
              </button>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="text-center text-gray-500 text-sm mt-12">
        Secure payments • Cancel anytime • Instant upgrade
      </div>
    </div>
  );
}