"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Target,
  Users,
  Award,
} from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("About");

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 1. Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="lg:w-1/2 space-y-6 z-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-primary font-bold text-sm tracking-wide uppercase">
                {t("Hero.since")}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {t("Hero.titlePart1")} <br />
                <span className="text-primary">{t("Hero.titlePart2")}</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t("Hero.description")}
              </p>
              <div className="pt-4">
                <div className="h-1 w-20 bg-accent rounded-full"></div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full flex justify-center relative mt-8 lg:mt-0">
              <div className="relative w-[90%] md:w-full max-w-md h-72 md:h-96 lg:h-[400px] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <Image
                  src="/images/logo.svg"
                  alt="About CBF"
                  fill
                  className="object-contain"
                  loading="eager"
                  priority
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 50vw"
                />
              </div>

              {/* Decorative Floating Element */}
              <div className="md:flex absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-lg border-l-4 border-accent items-center gap-4 hidden">
                <div className="bg-green-100 p-3 rounded-full text-primary">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">15+</p>
                  <p className="text-sm text-gray-500">{t("Hero.awards")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statistics Section (Full Width) */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-green-800/50">
            <StatItem number="10+" label={t("Stats.yearsExperience")} />
            <StatItem number="5k+" label={t("Stats.happyCustomers")} />
            <StatItem number="50+" label={t("Stats.premiumProducts")} />
            <StatItem number="24/7" label={t("Stats.support")} />
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-primary mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t("Mission.title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("Mission.desc")}
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center text-accent mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t("Vision.title")}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t("Vision.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("WhyChoose.title")}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {t("WhyChoose.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Leaf className="w-6 h-6" />}
              title={t("WhyChoose.Natural.title")}
              desc={t("WhyChoose.Natural.desc")}
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6" />}
              title={t("WhyChoose.Quality.title")}
              desc={t("WhyChoose.Quality.desc")}
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title={t("WhyChoose.Expert.title")}
              desc={t("WhyChoose.Expert.desc")}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

// --- Sub Components ---

function StatItem({ number, label }: { number: string; label: string }) {
  return (
    <div className="p-4">
      <div className="text-4xl font-bold text-accent mb-2">{number}</div>
      <div className="text-green-100 text-sm uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
      <div className="w-16 h-16 mx-auto bg-primary text-white rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-900/20">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}