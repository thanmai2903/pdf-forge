export default function Stats() {
  const stats = [
    ["50K+", "Users"],
    ["1M+", "Files Converted"],
    ["99.9%", "Uptime"],
  ];

  return (
    <section className="max-w-6xl mx-auto py-12">
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map(([value, label]) => (
          <div
            key={label}
            className="border rounded-2xl p-8 text-center"
          >
            <h2 className="text-4xl font-bold">
              {value}
            </h2>

            <p className="text-muted-foreground">
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}