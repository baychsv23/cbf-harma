"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  ShieldCheck,
  Target,
  Award,
  Heart,
  Star,
  Trophy,
  Pill,
} from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("About");

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 1. Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-12 relative">
            {/* Decorative background blobs */}
            <div className="absolute top-0 left-0 w-72 h-72  rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-72 h-72  rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            {/* Text Content */}
            <div className="lg:w-[65%] xl:w-[70%] space-y-6 z-10">
              {/* <span className="inline-block px-4 py-1.5 rounded-full bg-green-100 text-primary font-bold text-sm">
                {t("Hero.since")}
              </span> */}
              <h1 className="text-4xl md:text-5xl font-bold text-primary leading-snug pb-2">
                {t("Hero.titlePart1")} <br />
                <span className="text-primary">{t("Hero.titlePart2")}</span>
              </h1>
              <div className="text-base text-black leading-[1.6] space-y-3">
                <p>{t("Hero.description1")}</p>
                <p>{t("Hero.description2")}</p>
                <p>{t("Hero.description3")}</p>
              </div>
              <div className="pt-2">
                <div className="h-1 w-60 bg-accent rounded-full"></div>
              </div>
            </div>

            <div className="lg:w-[35%] xl:w-[30%] w-full flex justify-center relative mt-8 lg:mt-0 z-10">
              <div className="relative w-[90%] md:w-full max-w-sm h-72 md:h-96 lg:h-[450px] overflow-hidden group">
                <Image
                  src="/images/lab.png"
                  alt="About CBF"
                  fill
                  className="object-contain"
                  loading="eager"
                  priority
                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 50vw"
                />
              </div>

              {/* Decorative Floating Element */}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Statistics Section (Full Width) */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <h2 className="text-3xl font-bold text-accent mb-4">
            {t("StandardOfCompany.title")}
          </h2>

          <p className="text-green-100 max-w-2xl mx-auto">
            {t("StandardOfCompany.subTitle")}
          </p>
        </div>
      </section>

      {/* 3. Core Values, Vision, Mission, and Quality Policy */}
      <section className="py-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-white to-gray-50/50 -z-10"></div>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Values Card */}
            <div className="bg-white/80 backdrop-blur-md p-10 rounded-4xl shadow-xl shadow-red-900/5 border border-white hover:-translate-y-2 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-br from-green-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
              <div className="w-16 h-16 bg-linear-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center text-primary mb-8 shadow-inner shadow-white relative z-10">
                <Trophy className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t("Values.title")}
              </h3>
              <p className="text-gray-600 leading-[1.6] relative z-10">
                {t("Values.desc")}
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white/80 backdrop-blur-md p-10 rounded-4xl shadow-xl shadow-yellow-900/5 border border-white hover:-translate-y-2 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-br from-yellow-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
              <div className="w-16 h-16 bg-linear-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center text-primary mb-8 shadow-inner shadow-white relative z-10">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t("Vision.title")}
              </h3>
              <p className="text-gray-600 leading-[1.6] relative z-10">
                {t("Vision.desc")}
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white/80 backdrop-blur-md p-10 rounded-4xl shadow-xl shadow-green-900/5 border border-white hover:-translate-y-2 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-linear-to-br from-green-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
              <div className="w-16 h-16 bg-linear-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center text-primary mb-8 shadow-inner shadow-white relative z-10">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t("Mission.title")}
              </h3>
              <ul className="text-gray-600 leading-[1.6] space-y-3 list-disc pl-5 marker:text-primary relative z-10">
                <li>{t("Mission.item1")}</li>
                <li>{t("Mission.item2")}</li>
                <li>{t("Mission.item3")}</li>
              </ul>
            </div>

            {/* Quality Policy Card */}
            <div className="bg-white/80 backdrop-blur-md p-10 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-white hover:-translate-y-2 transition-all duration-300 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-50 rounded-2xl flex items-center justify-center text-primary mb-8 shadow-inner shadow-white relative z-10">
                <Pill className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t("QualityPolicy.title")}
              </h3>
              <p className="text-gray-600 leading-[1.6] relative z-10">
                {t("QualityPolicy.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Standards Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-green-50/50 to-white -z-10"></div>
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t("Standards.title")}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {t("Standards.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <StandardCard
              year={t("Standards.year2003.year")}
              title={t("Standards.year2003.title")}
              desc={t("Standards.year2003.desc")}
              icon={<ShieldCheck className="w-6 h-6" />}
              imgSrc="/images/GMP.png"
            />
            <StandardCard
              year={t("Standards.year2004.year")}
              title={t("Standards.year2004.title")}
              desc={t("Standards.year2004.desc")}
              icon={<Award className="w-6 h-6" />}
              imgSrc="/images/GMP.png"
            />
            <StandardCard
              year={t("Standards.year2015.year")}
              title={t("Standards.year2015.title")}
              desc={t("Standards.year2015.desc")}
              icon={<CheckCircle2 className="w-6 h-6" />}
              imgSrc="/images/ISO-9001.png"
            />
            <StandardCard
              year={t("Standards.year2019.year")}
              title={t("Standards.year2019.title")}
              desc={t("Standards.year2019.desc")}
              icon={<Target className="w-6 h-6" />}
              imgSrc="/images/GLP.png"
            />
            <StandardCard
              year={t("Standards.year2023.year")}
              title={t("Standards.year2023.title")}
              desc={t("Standards.year2023.desc")}
              icon={<Award className="w-6 h-6" />}
              imgSrc="/images/ISO-IEC.png"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

// --- Sub Components ---

function StandardCard({
  year,
  title,
  desc,
  icon,
  imgSrc,
}: {
  year: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  imgSrc: string;
}) {
  return (
    <div className="flex flex-col bg-white/80 backdrop-blur-md p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-white hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-700">
        <div className="w-32 h-32 bg-primary rounded-full blur-3xl"></div>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-primary shadow-sm relative z-10 transition-transform group-hover:scale-110 duration-300">
          {icon}
        </div>
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm relative z-10">
          {year}
        </span>
      </div>

      <div className="mb-6 relative h-32 w-full flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden group-hover:bg-green-50/50 transition-colors">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 text-xs">
          <span>{title}</span>
          <span>Logo</span>
        </div>
        <img
          src={imgSrc}
          alt={`${title} Certification`}
          className="object-contain h-24 w-auto relative z-10 drop-shadow-sm transition-transform group-hover:scale-105 duration-300"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3 relative z-10">
        {title}
      </h3>
      <p className="text-gray-500 leading-[1.6] text-sm flex-grow relative z-10">
        {desc}
      </p>
    </div>
  );
}

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
