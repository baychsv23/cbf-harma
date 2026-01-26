import BannerSection from "@/components/UI/BannerSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50/30 pb-20">

      {/* 1. Banner Section */}
      <div className="pt-6">
        <BannerSection />
      </div>

      {/* 2. Example Content Below (Optional) */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Latest Updates</h2>
          <button className="text-sm text-blue-600 font-semibold hover:underline">View All</button>
        </div>

        {/* Placeholder for content grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-white rounded-2xl border border-gray-100 shadow-sm"></div>
          ))}
        </div>
      </div>

    </main>
  );
}