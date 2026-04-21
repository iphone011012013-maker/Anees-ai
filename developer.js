/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║              developer.js — ملف المطوّر                      ║
 * ║      هذا الملف خاص بالمطوّر ولا يمكن تعديله بالكود          ║
 * ║              © محمود إبراهيم محمد أبو الفضل                  ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 *  ⚠️  تحذير: هذا الملف محمي — لا تعدّله إلا يدوياً من هنا
 *  ⚠️  WARNING: This file is read-only to the robot runtime
 */

// ═══════════════════════════════════════════════════════
//  بيانات المطوّر — مجمّدة، القراءة فقط
// ═══════════════════════════════════════════════════════
const DEV_INFO = Object.freeze({

  // ── الهوية ──────────────────────────────────────────
  name:       "محمود",
  fullName:   "محمود إبراهيم محمد أبو الفضل",
  nickname:   "باشا",
  age:        19,
  birthday:   "25 مايو 2005",
  zodiac:     "الجوزاء ♊",
  gender:     "ذكر",
  country:    "مصر",
  city:       "القاهرة",
  role:       "المطوّر والمالك",

  // ── الدراسة والعمل ───────────────────────────────────
  education:  "طالب — كلية الآداب، جامعة حلوان، قسم التاريخ",
  job:        "مدير وكالة AboElfadl Media للتسويق الرقمي",

  skills: Object.freeze([
    "HTML / CSS / JavaScript",
    "Python", "PHP",
    "Java (Sketchware Pro)",
    "C++ / Go / Rust — قيد التعلم",
    "الأمن السيبراني — White Hat Hacking",
    "تطوير الويب والموبايل",
    "التسويق الرقمي",
    "تصميم الجرافيك",
  ]),

  projects: Object.freeze([
    "AboElfadl Media — وكالة تسويق رقمي",
    "AboElfadl Store — إكسسوارات وتكنولوجيا",
    "AboElfadl Clothing — ملابس رجالية",
    "AboElfadl UserBot — يوزربوت تيليجرام (Pyrogram، 9 وحدات)",
    "AboElfadl Vault v3 — خزنة وسائط بصمة إصبع وPIN",
    "تطبيق OSINT متكامل لـ Android",
    "لعبة الدومينو المصري — Android",
    "AboElfadl Windows Tools — Python/tkinter",
    "A9 IP Camera — نظام أمان DIY بـ Python وOpenCV",
    "موقع بورتفوليو بـ HTML/CSS/JS",
  ]),

  // ── الاهتمامات ───────────────────────────────────────
  hobbies: Object.freeze([
    "البرمجة وبناء التطبيقات",
    "الأمن السيبراني",
    "التاريخ",
    "التصميم والإبداع",
    "ريادة الأعمال",
    "السوشيال ميديا والمحتوى",
  ]),
  favColor:      "الأزرق الكهربائي",
  favoriteQuote: "من جدّ وجد",
  ambition:      "بناء براند أبو الفضل موحد والتوسع خارج مصر",

  // ── الروابط ─────────────────────────────────────────
  social: Object.freeze({
    facebook:  "https://facebook.com/AboElfadlMedia",
    instagram: "https://instagram.com/AboElfadlMedia",
    telegram:  "@AboElfadl",
    website:   "",
  }),

  pages: Object.freeze(["KnzaSundul", "عالم الحيوان", "حكم وأمثال"]),

  // ── أسئلة وأجوبة خاصة بالمطوّر ─────────────────────
  qa: Object.freeze([
    { q: ["من طوّر", "من صمّم", "من عمل", "مطوّرك", "من برمجك"],
      a: "طوّرني {devName} — مطور ومسوّق رقمي من القاهرة 🛠️🇪🇬" },

    { q: ["مالكك", "صاحبك", "المطور"],
      a: "أنا ملك {devFullName} — أنا روبوته الشخصي 🤖" },

    { q: ["نسخة", "version", "إصدار"],
      a: "أنا AboElfadl Robot v4 Ultimate — طوّرني {devName} بـ HTML/JS 🚀" },

    { q: ["مشاريع المطوّر", "أعمال المطوّر"],
      a: "المطوّر {devName} عنده: AboElfadl Media, Store, Clothing, UserBot وتطبيقات Android كتير 💼" },
  ]),

  // ── رسائل المطوّر للروبوت ───────────────────────────
  devMessages: Object.freeze({
    devGreeting: "أنا روبوت {devName} — طوّرني بنفسه! 🛠️",
    copyright:   "© AboElfadl Robot v4 — by محمود أبو الفضل",
  }),
});

// ═══════════════════════════════════════════════════════
//  حماية: منع أي تعديل على DEV_INFO من الكود
// ═══════════════════════════════════════════════════════
(function lockDev() {
  // Object.freeze بيمنع الإضافة والحذف والتعديل
  // هنعمل deep freeze لكل nested objects
  function deepFreeze(obj) {
    Object.getOwnPropertyNames(obj).forEach(name => {
      const val = obj[name];
      if (val && typeof val === 'object') deepFreeze(val);
    });
    return Object.freeze(obj);
  }
  deepFreeze(DEV_INFO);

  // منع إعادة تعريف DEV_INFO
  try {
    Object.defineProperty(window, 'DEV_INFO', {
      configurable: false,
      writable:     false,
      enumerable:   true,
      value:        DEV_INFO,
    });
  } catch(e) { /* already defined */ }
})();

// ═══════════════════════════════════════════════════════
//  دوال قراءة بيانات المطوّر (للقراءة فقط)
// ═══════════════════════════════════════════════════════
function getDevAnswer(input) {
  const txt = input.toLowerCase().trim();
  for (const item of DEV_INFO.qa) {
    for (const kw of item.q) {
      if (txt.includes(kw)) {
        return item.a
          .replace(/\{devName\}/g,     DEV_INFO.name)
          .replace(/\{devFullName\}/g, DEV_INFO.fullName);
      }
    }
  }
  return null;
}

function getDevCopyright() {
  return DEV_INFO.devMessages.copyright;
}
