"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  FlaskConical,
  Truck,
  MapPin,
  Store,
  ShieldCheck,
  Headset,
  ArrowRight,
  Network,
  Building2,
  Globe,
  Users
} from "lucide-react";
import { Link } from "@/i18n/routing";

export default function ServicesPage() {
  const t = useTranslations();

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Section: ภาพรวมบริการ */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-primary-900/90 z-10" />

        <div className="absolute inset-0 z-0">
          {/* ใส่รูปโรงงาน หรือ รูปคลังสินค้าที่ดูอลังการ */}
          <Image
            src="/images/logo.svg"
            alt="CBF Services"
            fill
            loading="eager"
            className="object-cover opacity-50"
          />
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-4">
          <span className="text-accent font-bold tracking-widest uppercase text-sm">
            {t("heroBadge")} {/* e.g., EXCELLENCE IN PHARMACEUTICALS */}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {t("heroDesc")}
          </p>
        </div>
      </section>

      {/* 2. Main Services Grid (Core Business) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">
              {t("coreServicesTitle")}
            </h2>
            <p className="text-gray-500">{t("coreServicesSubtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1: Production */}
            <ServiceCard
              icon={<Building2 className="w-8 h-8" />}
              title={t("productionTitle")}
              desc={t("productionDesc")}
              badge="+856 20 9898 9689"
            />

            {/* Service 2: Distribution/Sales */}
            <ServiceCard
              icon={<Network className="w-8 h-8" />}
              title={t("distributionTitle")}
              desc={t("distributionDesc")}
              badge="+856 20 22 013 791"
            />

            {/* Service 3: Logistics */}
            <ServiceCard
              icon={<Network className="w-8 h-8" />}
              title={t("logisticsTitle")}
              desc={t("logisticsDesc")}
              badge="+856 20 95 820 990"
            />
          </div>
        </div>
      </section>

      {/* 3. Nationwide Coverage (Map Concept) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Content Side */}
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-primary text-sm font-semibold">
                <MapPin className="w-4 h-4" />
                <span>Across Laos</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t("networkTitle")}{" "}
                <span className="text-primary">{t("networkHighlight")}</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t("networkDesc")}
              </p>

              <ul className="space-y-4 pt-4">
                <FeatureItem text={t("networkFeat1")} />
                <FeatureItem text={t("networkFeat2")} />
                {/* <FeatureItem text={t("networkFeat3")} /> */}
              </ul>
            </div>

            {/* Visual Side (Map Graphic) */}
            <div className="lg:w-1/2 w-full">
              <div className="relative w-full h-70 sm:h-80 md:h-100 rounded-3xl overflow-hidden bg-gray-100 border border-gray-200">
                <Image
                  src="/images/map.png"
                  alt="Network Map"
                  fill
                  priority
                  loading="eager"
                  className="object-cover"
                  sizes="100vw"
                />

                {/* Floating Stats Card */}
                <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-xl border-l-4 border-accent">
                  <p className="text-gray-500 text-xs uppercase">
                    {t("totalBranches")}
                  </p>
                  <p className="text-2xl font-bold text-primary">50+</p>
                  <p className="text-xs text-gray-400">Provinces Covered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Customer Groups */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">
              {t("CustomerGroups.title")}
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-4 flex items-center justify-center"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Group 1: Public Sector */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t("CustomerGroups.publicSector")}</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-2">{t("CustomerGroups.moh")}</h4>
                  <ul className="space-y-1 pl-2">
                    <ListSubItem text={t("CustomerGroups.centralHospitals")} />
                    <ListSubItem text={t("CustomerGroups.provincialHospitals")} />
                    <ListSubItem text={t("CustomerGroups.others")} />
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-2">{t("CustomerGroups.mod")}</h4>
                  <ul className="space-y-1 pl-2">
                    <ListSubItem text={t("CustomerGroups.h103")} />
                    <ListSubItem text={t("CustomerGroups.regionalHospitals")} />
                    <ListSubItem text={t("CustomerGroups.militaryHospitals")} />
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-2">{t("CustomerGroups.mops")}</h4>
                  <ul className="space-y-1 pl-2">
                    <ListSubItem text={t("CustomerGroups.h5april")} />
                  </ul>
                </div>
              </div>
            </div>

            {/* Group 2: Private Sector */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t("CustomerGroups.privateSector")}</h3>
              <ul className="space-y-2">
                <ListSubItem text={t("CustomerGroups.privateHospitals")} />
                <ListSubItem text={t("CustomerGroups.clinics")} />
                <ListSubItem text={t("CustomerGroups.distributors")} />
                <ListSubItem text={t("CustomerGroups.pharmacies")} />
                <ListSubItem text={t("CustomerGroups.others")} />
              </ul>
            </div>

            {/* Group 3: NGOs */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t("CustomerGroups.ngos")}</h3>
              <ul className="space-y-2">
                <ListSubItem text="GLOBAL FUND" />
                <ListSubItem text="WORLD BANK" />
                <ListSubItem text="WHO" />
                <ListSubItem text="ADB" />
                <ListSubItem text="UNICEF" />
                <ListSubItem text="JICA" />
                <ListSubItem text="KOICA" />
                <ListSubItem text={t("CustomerGroups.others")} />
              </ul>
            </div>

            {/* Group 4: Neighboring Countries */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t("CustomerGroups.neighboring")}</h3>
              <ul className="space-y-2">
                <ListSubItem text={t("CustomerGroups.cambodia")} />
                <ListSubItem text={t("CustomerGroups.vietnam")} />
                <ListSubItem text={t("CustomerGroups.china")} />
                <ListSubItem text={t("CustomerGroups.thailand")} />
                <ListSubItem text={t("CustomerGroups.others")} />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Partner With Us (B2B Focus) */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-12">{t("whyPartnerTitle")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm">
              <ShieldCheck className="w-10 h-10 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{t("qualityTitle")}</h3>
              <p className="text-primary-100 text-sm">{t("qualityDesc")}</p>
            </div>
            <div className="p-6 border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm">
              <Truck className="w-10 h-10 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{t("speedTitle")}</h3>
              <p className="text-primary-100 text-sm">{t("speedDesc")}</p>
            </div>
            <div className="p-6 border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm">
              <Headset className="w-10 h-10 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{t("supportTitle")}</h3>
              <p className="text-primary-100 text-sm">{t("supportDesc")}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- Components ย่อย ---

function ServiceCard({
  icon,
  title,
  desc,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <div className="group bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

      {badge && (
        <span className="absolute top-6 right-6 text-[12px] font-bold uppercase tracking-wider text-primary bg-white/80 backdrop-blur px-2 py-1 rounded-md shadow-sm">
          {badge}
        </span>
      )}

      <div className="relative z-10">
        <div className="w-14 h-14 bg-primary text-white rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-green-900/20 group-hover:bg-accent group-hover:text-primary-900 transition-colors">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-primary shrink-0">
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
      <span className="text-gray-700 font-medium">{text}</span>
    </li>
  );
}

function ListSubItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2 text-gray-600 text-sm">
      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
      <span>{text}</span>
    </li>
  );
}
