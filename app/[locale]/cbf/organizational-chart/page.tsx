"use client";

import { useLocale, useTranslations } from "next-intl";
import { User } from "lucide-react";

const TreeStyles = `
/* เพิ่ม Scrollbar สำหรับมือถือ ให้เลื่อนซ้ายขวาได้เนียนๆ */
.org-tree-container {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 1rem;
}
.org-tree-container::-webkit-scrollbar {
  height: 1px;
}
.org-tree-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.org-tree-container::-webkit-scrollbar-thumb {
  background: #16a34a;
  border-radius: 10px;
}

/* รักษาสไตล์ Tree ให้นำไปใช้กับทุกหน้าจอ (ลบ @media ที่บีบเป็นแนวตั้งออก) */
.org-tree ul {
  padding-top: 20px;
  position: relative;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
}
.org-tree li {
  text-align: center;
  list-style-type: none;
  position: relative;
  padding: 20px 4px 0 4px;
  flex: 1;
}
.org-tree li::before, .org-tree li::after {
  content: '';
  position: absolute; top: 0; right: 50%;
  border-top: 2px solid #16a34a;
  width: 50%; height: 20px;
}
.org-tree li::after {
  right: auto; left: 50%;
  border-left: 2px solid #16a34a;
}
.org-tree li:only-child::after, .org-tree li:only-child::before {
  display: none;
}
.org-tree li:only-child {
  padding-top: 0;
}
.org-tree li:first-child::before, .org-tree li:last-child::after {
  border: 0 none;
}
.org-tree li:last-child::before {
  border-right: 2px solid #16a34a;
  border-radius: 0 5px 0 0;
}
.org-tree li:first-child::after {
  border-radius: 5px 0 0 0;
}
.org-tree ul ul::before {
  content: '';
  position: absolute; top: 0; left: 50%;
  border-left: 2px solid #16a34a;
  width: 0; height: 20px;
}
/* Support group li: override the ::after connector to be taller */
.support-group-li::after {
  height: 110px !important;
}
.support-group-li > ul {
  padding-top: 90px !important;
}
.support-group-li > ul::before {
  height: 0 !important;
}
`;

function NodeCard({ title, name }: { title: string; name: string }) {
    return (
        <div className="border-2 border-green-600 rounded-full py-2 px-8 pl-10 bg-white inline-flex flex-col items-center justify-center shadow-lg relative z-10 w-60 min-h-[70px]">
            <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-green-600 flex items-center justify-center absolute -left-2 top-1/2 -translate-y-1/2 shadow-sm">
                <User className="text-gray-400 w-6 h-6" />
            </div>
            <div className="w-full text-center">
                <h3 className="text-sm font-bold text-green-700 leading-tight mb-0.5">{title}</h3>
                <p className="text-xs text-gray-600 leading-tight">{name}</p>
            </div>
        </div>
    );
}

function GroupCard({ title, items }: { title: string; items: { role: string; name: string }[] }) {
    return (
        <div className="bg-white border-2 border-green-700 rounded-lg shadow-md w-65 mx-auto overflow-hidden relative z-10">
            <div className="bg-green-700 text-white font-bold py-2 px-4 text-xs whitespace-pre-wrap leading-tight text-center">
                {title}
            </div>
            <div className="p-4 flex flex-col gap-3">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className="border border-green-500 rounded-md py-2 pr-2 pl-9 mx-1 relative bg-white flex flex-col items-start text-left shadow-sm"
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-green-500 flex items-center justify-center absolute -left-4 top-1/2 -translate-y-1/2 shadow-inner">
                            <User className="text-gray-400 w-4 h-4" />
                        </div>
                        <h4 className="text-[11px] text-green-700 font-bold leading-tight mb-0.5">{item.role}</h4>
                        <div className="bg-green-700 text-white text-[9px] px-2 py-0.5 rounded-full inline-block mt-1">
                            {item.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function OrganizationalChartPage() {
    const t = useTranslations();
    const locale = useLocale();
    const isEn = locale === "en";
    const tRole = (lo: string, en: string) => (isEn ? en : lo);

    return (
        <main className="min-h-screen py-6 lg:py-12 relative overflow-hidden flex flex-col">
            <style dangerouslySetInnerHTML={{ __html: TreeStyles }} />

            <div className="container mx-auto px-1 w-full pt-1 lg:pt-1 lg:mt-4">
                <div className="text-center mb-8 lg:mb-16">
                    <h1 className="text-2xl lg:text-3xl font-bold text-green-800">{t("organizationalChart")}</h1>
                </div>

                {/* กล่องห่อหุ้มแผนผัง (เปิดใช้งาน Horizontal Scroll) */}
                <div className="org-tree-container w-full">
                    <div className="org-tree inline-block min-w-full pb-8">
                        {/* กำหนด min-w-[1100px] เพื่อบังคับไม่ให้แผนผังบีบเละเมื่ออยู่ในจอมือถือ */}
                        <ul className="min-w-275 lg:min-w-full mx-auto">
                            <li>
                                <NodeCard
                                    title={tRole("ຜູ້ອຳນວຍການ", "Director")}
                                    name={tRole("ດຣ. ຈິນດາ ວີງສຸລິ", "Dr. Jinda Vingsuli")}
                                />
                                <ul>
                                    {/* ຮອງ 1 - ດຣ. ບຸນທະວີ */}
                                    <li>
                                        <NodeCard
                                            title={tRole("ຮອງຜູ້ອຳນວຍການ", "Deputy Director")}
                                            name={tRole("ດຣ. ບຸນທະວີ ກິລາທອງ", "Dr. Bounthavy Kilathong")}
                                        />
                                        <ul>
                                            <li>
                                                <GroupCard
                                                    title={tRole("ກຸ່ມ ຂາຍ-ການຕະຫຼາດ", "Sales & Marketing Group")}
                                                    items={[
                                                        { role: tRole("ພະແນກ ຂາຍ-ການຕະຫຼາດ", "Sales-Marketing Dept"), name: tRole("ທ. ສີສະຫງ່າ ສີສະອາດ", "Mr. Sissanga Sisaat") },
                                                        { role: tRole("ພະແນກ ບໍລິການລູກຄ້າ", "Customer Service Dept"), name: tRole("ທ. ພຸດສາຄອນ ໄຊຍະວົງ", "Mr. Phoutsakhone Xayavong") },
                                                        { role: tRole("ພະແນກ ຢາ ແລະ ອຸປະກອນການແພດ", "Medicine & Equipment Dept"), name: tRole("ທ. ລັດສະໝີ ສຸວັນທອງ", "Mr. Latsamy SouvanhThong") },
                                                    ]}
                                                />
                                            </li>
                                            <li>
                                                <GroupCard
                                                    title={tRole("ສາຂາ", "Branches")}
                                                    items={[
                                                        { role: tRole("ສາຂາ ນະຄອນຫຼວງວຽງຈັນ", "Vientiane Capital Branch"), name: tRole("ດຣ. ມະນີແສງ ແສງດາລາ", "Dr. Maniseng Sengdala") },
                                                        { role: tRole("ສາຂາ ສະຫວັນນະເຂດ", "Savannakhet Branch"), name: tRole("ດຣ. ຄຳເພັດ ຂາວສະຫວ່າງ", "Dr. Khaophet Saovang") },
                                                    ]}
                                                />
                                            </li>
                                        </ul>
                                    </li>

                                    {/* ກຸ່ມ ສະໜັບສະໜູນ — support-group-li extends connector line down */}
                                    <li className="support-group-li">
                                        <ul>
                                            <li>
                                                <GroupCard
                                                    title={tRole("ກຸ່ມ ສະໜັບສະໜູນ", "Support Group")}
                                                    items={[
                                                        { role: tRole("ກອງເລຂາ", "Secretariat"), name: tRole("ທ. ສີສະຫງ່າ ສີສະອາດ", "Mr. Sisanga Sisaat") },
                                                        { role: tRole("ພະແນກ ຈັດຕັ້ງ-ບໍລິຫານ", "Procurement-Admin Dept"), name: tRole("ທ. ບຸມອ້ອມ ໄຊຍະລາດ", "Mr. Bounom Xayalath") },
                                                        { role: tRole("ພະແນກ ບັນຊີ-ການເງິນ", "Accounting-Finance Dept"), name: tRole("ທ. ຝາມບາອານ", "Mr. Pham ba anh") },
                                                        { role: tRole("ພະແນກ ແຜນການ-ການຜະລິດ", "Planning-Production Dept"), name: tRole("ນ. ແກ້ວມະນີ ພູນສະຫວັດ", "Ms. Keomany Phounsavath") },
                                                        { role: tRole("ພະແນກ ວິສະວະກຳ", "Engineering Dept"), name: tRole("ທ. ທອງປານ ແດງມະນີ", "Mr. ThongPan Dengmany") },
                                                    ]}
                                                />
                                            </li>
                                        </ul>
                                    </li>

                                    {/* ຮອງ 2 - ທ່ານ ສິນໄຊ */}
                                    <li>
                                        <NodeCard
                                            title={tRole("ຮອງຜູ້ອຳນວຍການ", "Deputy Director")}
                                            name={tRole("ທ່ານ ສິນໄຊ ຫົງສະຫວາດ", "Mr. Sinxay Hongsavath")}
                                        />
                                        <ul>
                                            <li>
                                                <GroupCard
                                                    title={tRole("ພະແນກ ຮັບປະກັນຄຸນນະພາບ (QA)", "QA Department")}
                                                    items={[
                                                        { role: tRole("ຮັກສາການ ຫົວໜ້າພະແນກ", "Acting Head of Dept"), name: tRole("ທ່ານ ສິນໄຊ ຫົງສະຫວາດ", "Mr. Sinxay Hongsavath") },
                                                    ]}
                                                />
                                            </li>
                                        </ul>
                                    </li>

                                    {/* ຮອງ 3 - ດຣ. ກຽງເພັດ */}
                                    <li>
                                        <NodeCard
                                            title={tRole("ຮອງຜູ້ອຳນວຍການ", "Deputy Director")}
                                            name={tRole("ດຣ. ກຽງເພັດ ກາຖາຍະລາດ", "Dr. Kiengphet Kathayalath")}
                                        />
                                        <ul>
                                            <li>
                                                <GroupCard
                                                    title={tRole("ກຸ່ມ ຜະລິດ", "Production Group")}
                                                    items={[
                                                        { role: tRole("ພະແນກ ຜະລິດ", "Production Dept"), name: tRole("ທ. ບຸນຈັນ ສີບຸນເຮືອງ", "Mr. Bounthan Sibounheuang") },
                                                        { role: tRole("ຫ້ອງ R&D", "R&D Room"), name: tRole("ນ. ອໍລະພິມ ຕື້ຕະກຸນ", "Ms. Oraphim Tuetakoun") },
                                                    ]}
                                                />
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </main>
    );
}