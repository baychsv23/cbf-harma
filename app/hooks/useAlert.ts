"use client";
import { useTranslations } from "next-intl";
import Swal from "sweetalert2";

export function useAlert() {
  const t = useTranslations();

  // สร้างฟังก์ชันจัดการสไตล์ปุ่มที่เป็นเอกลักษณ์ (Glassmorphism + Shadow)
  const getBtnClass = (color: string) =>
    `px-8 py-3 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 
      hover:-translate-y-1 active:scale-95 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.1)] 
      ${color} text-white`;

  const baseConfig = {
    background: "#ffffff",
    backdrop: `rgba(15, 23, 42, 0.2) blur(4px)`, // เพิ่ม Blur หลังฉากให้ดูแพง
    allowOutsideClick: false,
    buttonsStyling: false,
    padding: '2rem',
    customClass: {
      // เพิ่ม Border Gradient หลอกๆ ด้วย shadow
      popup: "rounded-[40px] border border-slate-50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden",
      title: "text-2xl font-black text-slate-900 tracking-tighter",
      htmlContainer: "text-md font-medium text-slate-500 mt-3",
      actions: "mt-8 gap-4",
    },
    // Animation เฉพาะตัว: เด้งแบบนุ่มๆ (Spring Physics)
    showClass: {
      popup: `
          animate__animated 
          animate__backInDown 
          animate__faster
        `
    },
    hideClass: {
      popup: `
          animate__animated 
          animate__fadeOutDown 
          animate__faster
        `
    }
  };

  const showSuccess = (message: string) => {
    Swal.fire({
      ...baseConfig,
      icon: "success",
      iconColor: "#10b981", // Emerald 500
      title: t("successTitle"),
      text: message,
      confirmButtonText: t("ok"),
      customClass: {
        ...baseConfig.customClass,
        // เพิ่ม Aura สีเขียวมิ้นท์จางๆ รอบตัวการ์ด และ Ring ขอบในบางๆ
        popup: `${baseConfig.customClass.popup} ring-1 ring-emerald-100 shadow-[0_40px_120px_-20px_rgba(16,185,129,0.18)]`,

        // ปุ่ม: ใช้ Gradient จาก Emerald ไปหา Teal ให้ความรู้สึกพรีเมียมและมั่นคง
        confirmButton: `
            ${getBtnClass("bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600")} 
            ring-4 ring-emerald-50 shadow-lg shadow-emerald-200/60
          `,
      },
      // Animation: เลื่อนลงมานิ่มๆ พร้อม Fade In
      showClass: {
        popup: "animate__animated animate__fadeInDown animate__faster"
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp animate__faster"
      },
      // ปรับแต่งสไตล์หัวข้อให้ดู Deep & Clean
      didOpen: () => {
        const title = Swal.getTitle();
        if (title) {
          title.style.color = "#064e3b"; // Deep Emerald Green
          title.style.fontWeight = "900";
          title.style.letterSpacing = "-0.025em";
        }
      }
    });
  };

  const showError = (message: string) => {
    Swal.fire({
      ...baseConfig,
      icon: "error",
      iconColor: "#f43f5e", // Rose 500 สำหรับความทันสมัย
      title: t("errorTitle"),
      text: message,
      confirmButtonText: t("tryAgain"),
      customClass: {
        ...baseConfig.customClass,
        // เพิ่มเงาฟุ้งสีแดงจางๆ (Glow) และเส้นขอบกระจก (Glass Ring)
        popup: `${baseConfig.customClass.popup} ring-1 ring-rose-100 shadow-[0_40px_120px_-20px_rgba(244,63,94,0.2)]`,

        // ปุ่มยืนยัน: ไล่เฉดสีจาก Rose ไปหา Deep Red เพิ่มมิติด้วย Ring
        confirmButton: `
            ${getBtnClass("bg-gradient-to-br from-rose-500 via-rose-600 to-red-700")} 
            ring-4 ring-rose-50 shadow-lg shadow-rose-200/60
          `,
      },
      // Animation: ใช้การสั่นแบบนุ่มนวลแต่ชัดเจน (Hard Shake)
      showClass: {
        popup: "animate__animated animate__shakeX animate__faster"
      },
      hideClass: {
        popup: "animate__animated animate__fadeOut animate__faster"
      },
      // ปรับแต่งสีหัวข้อผ่าน JavaScript เพื่อความเป๊ะ
      didOpen: () => {
        const title = Swal.getTitle();
        if (title) {
          title.style.color = "#4c0519"; // สีชมพูเข้มเกือบดำ ดูพรีเมียม
          title.style.fontWeight = "900";
        }
      }
    });
  };

  const showConfirm = async (message: string): Promise<boolean> => {
    const result = await Swal.fire({
      ...baseConfig,
      icon: "question",
      iconColor: "#6366f1", // สี Indigo ทันสมัย
      title: t("confirmTitle"),
      text: message,
      showCancelButton: true,
      confirmButtonText: t("confirm"),
      cancelButtonText: t("cancel"),
      reverseButtons: true, // สลับตำแหน่งให้ปุ่ม "ยืนยัน" อยู่ขวา ตามมาตรฐาน OS สมัยใหม่
      customClass: {
        ...baseConfig.customClass,
        // ตัวการ์ดเพิ่มเส้นขอบเรืองแสงจางๆ
        popup: `${baseConfig.customClass.popup} ring-1 ring-slate-200/60 shadow-[0_40px_100px_-15px_rgba(99,102,241,0.1)]`,

        // ปุ่มยืนยัน: ใช้ Gradient คมๆ แบบ Dark Mode สลับกับ Indigo
        confirmButton: `
            ${getBtnClass("bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900")} 
            ml-3 min-w-[140px] border border-indigo-400/30 ring-4 ring-indigo-50
          `,

        // ปุ่มยกเลิก: ปรับให้ดูเป็น Ghost Button ที่สะอาดตา
        cancelButton: `
            px-8 py-3 rounded-2xl font-bold text-sm text-slate-400 
            hover:text-slate-600 hover:bg-slate-50 transition-all duration-200
          `,

        actions: "mt-10 mb-2 w-full flex justify-end", // จัดปุ่มชิดขวาเหมือนแอป High-end
      },
      // Animation จังหวะการปรากฏแบบ Zoom In เล็กน้อย
      showClass: {
        popup: "animate__animated animate__zoomIn animate__faster"
      },
      hideClass: {
        popup: "animate__animated animate__zoomOut animate__faster"
      }
    });
    return result.isConfirmed;
  };
  const showWarning = (message: string) => {
    Swal.fire({
      ...baseConfig,
      icon: "warning",
      iconColor: "#f59e0b",
      title: t("warningTitle"),
      text: message,
      confirmButtonText: t("continue"),
      customClass: {
        ...baseConfig.customClass,
        // เพิ่มลูกเล่น: เงาสีส้มฟุ้งๆ รอบตัวการ์ด (Orange Glow)
        popup: `${baseConfig.customClass.popup} ring-1 ring-amber-100 shadow-[0_40px_100px_-20px_rgba(245,158,11,0.15)]`,
        confirmButton: `
            ${getBtnClass("bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600")} 
            ring-4 ring-amber-50 shadow-lg shadow-amber-200/50
          `,
      },
      // ใส่ Animation แบบ "ส่ายหน้า" เล็กน้อยเมื่อปรากฏเพื่อดึงดูดสายตา (สมกับเป็นคำเตือน)
      showClass: {
        popup: "animate__animated animate__headShake animate__faster"
      },
      // ตกแต่งส่วนเนื้อหาด้วย Inline CSS (เพื่อความโดดเด่นเฉพาะจุด)
      didOpen: () => {
        const title = Swal.getTitle();
        if (title) title.style.color = "#92400e"; // สีน้ำตาลเข้มแบบ Amber สวยๆ
      }
    });
  };

  const showProcessing = () => {
    Swal.fire({
      ...baseConfig,
      allowOutsideClick: false,
      showConfirmButton: false,
      html: `
          <div class="flex flex-col items-center py-6 px-2">
            <div class="relative flex items-center justify-center">
              <div class="absolute w-24 h-24 bg-fuchsia-500/10 rounded-full blur-2xl"></div>
              <div class="w-20 h-20 border-[3px] border-slate-100 rounded-full"></div>
              <div class="absolute top-0 w-20 h-20 border-[3px] border-t-fuchsia-600 border-r-violet-600 rounded-full animate-[spin_0.8s_linear_infinite]"></div>
              <div class="absolute w-12 h-12 border-[3px] border-b-purple-400 border-l-pink-400 rounded-full animate-[spin_1.2s_linear_infinite_reverse]"></div>
            </div>

            <h2 class="text-2xl font-black mt-10 tracking-tighter bg-gradient-to-r from-violet-950 to-fuchsia-700 bg-clip-text text-transparent">
              ${t("processing")}
            </h2>
            
            <div class="flex items-center gap-2 mt-2">
              <span class="w-1.5 h-1.5 bg-fuchsia-500 rounded-full animate-pulse"></span>
              <p class="text-slate-400 font-medium tracking-wide text-sm uppercase">
                ${t("pleaseWait")}
              </p>
              <span class="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse delay-75"></span>
            </div>
          </div>
        `,
      customClass: {
        ...baseConfig.customClass,
        popup: "rounded-[60px] p-16 shadow-[0_50px_100px_-20px_rgba(162,28,175,0.15)] border-0",
      }
    });
  };

  return { showSuccess, showError, showConfirm, showProcessing, showWarning, closeProcessing: Swal.close };
}