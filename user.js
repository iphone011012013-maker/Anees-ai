/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║                user.js — ملف المستخدم                        ║
 * ║   الروبوت يحفظ هنا كل معلومة تقولها له تلقائياً             ║
 * ║   يمكنك تعديله يدوياً أو تركه فارغاً والروبوت يملأه         ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// ═══════════════════════════════════════════════════════
//  البيانات الافتراضية للمستخدم الجديد (قابلة للتعديل)
// ═══════════════════════════════════════════════════════
const USER_DEFAULTS = {
  name:          "",       // الروبوت هيسأل عنه لو فاضي
  nickname:      "",
  age:           null,
  birthday:      "",
  country:       "",
  city:          "",
  job:           "",
  education:     "",
  favColor:      "",
  favFood:       "",
  favMovie:      "",
  favMusic:      "",
  favoriteQuote: "",
  hobbies:       [],
  skills:        [],
  customFacts:   {},       // أي معلومة تانية يذكرها المستخدم
};

// ═══════════════════════════════════════════════════════
//  نظام حفظ واسترجاع بيانات المستخدم (localStorage)
// ═══════════════════════════════════════════════════════
const UserDB = (function () {
  const STORAGE_KEY = 'aboelfadl_robot_user';

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...USER_DEFAULTS, ...JSON.parse(raw) } : { ...USER_DEFAULTS };
    } catch (e) {
      return { ...USER_DEFAULTS };
    }
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  function reset() {
    try { localStorage.removeItem(STORAGE_KEY); return true; }
    catch (e) { return false; }
  }

  function get(key) {
    return load()[key];
  }

  // تحديث حقل واحد
  function set(key, value) {
    if (key === '__proto__' || key === 'constructor') return false;
    const data = load();
    data[key] = value;
    return save(data);
  }

  // إضافة عنصر لمصفوفة (hobbies, skills...)
  function push(key, value) {
    const data = load();
    if (!Array.isArray(data[key])) data[key] = [];
    if (!data[key].includes(value)) data[key].push(value);
    return save(data);
  }

  // حفظ معلومة مخصصة (customFacts)
  function setFact(label, value) {
    const data = load();
    if (!data.customFacts) data.customFacts = {};
    data.customFacts[label] = value;
    return save(data);
  }

  // استرجاع كل البيانات كـ object
  function all() {
    return load();
  }

  return { load, save, reset, get, set, push, setFact, all };
})();

// ═══════════════════════════════════════════════════════
//  محرك الذكاء: استخراج معلومات من كلام المستخدم
// ═══════════════════════════════════════════════════════
const UserLearner = (function () {

  // أنماط الاستخراج
  const PATTERNS = [

    // الاسم
    { regex: /اسمي\s+(\S+)/,              key: 'name',     msg: 'تمام! هنادي عليك بـ {val} من دلوقتي 😊' },
    { regex: /اناديني\s+(\S+)/,           key: 'name',     msg: 'حاضر! هنادي عليك بـ {val} 👍' },
    { regex: /اسم\w*\s+(\S+)/,           key: 'name',     msg: 'اتفضل يا {val}! حفظت اسمك 😄' },

    // العمر
    { regex: /عندي\s+(\d+)\s+سن/,        key: 'age',      msg: 'تمام، {val} سنة — حفظتها! 📝', parse: Number },
    { regex: /عمري\s+(\d+)/,             key: 'age',      msg: 'حفظت إنك {val} سنة! 📝',        parse: Number },
    { regex: /(\d+)\s+سنة/,              key: 'age',      msg: 'ماشي، {val} سنة حفظتها! 📝',    parse: Number },

    // تاريخ الميلاد
    { regex: /مولود\s+(في\s+)?(.+)/,     key: 'birthday', msg: 'تمام! مولود في {val} 🎂',        group: 2 },
    { regex: /ميلادي\s+(في\s+)?(.+)/,    key: 'birthday', msg: 'حفظت تاريخ ميلادك 🎂',           group: 2 },

    // البلد والمدينة
    { regex: /من\s+(مصر|السعودية|الإمارات|الكويت|الأردن|المغرب|تونس|ليبيا|العراق|سوريا|لبنان|اليمن|السودان|الجزائر|فلسطين|قطر|البحرين|عُمان)/i,
      key: 'country', msg: 'أهلاً بك من {val}! 🇪🇬' },
    { regex: /ساكن\s+في\s+(\S+)/,        key: 'city',     msg: 'تمام، {val} — حفظت مدينتك! 🏙️' },
    { regex: /في\s+(القاهرة|الإسكندرية|الجيزة|أسوان|الأقصر|المنصورة|الرياض|جدة|دبي|أبوظبي|الكويت|عمان|بيروت|دمشق|بغداد|الدار البيضاء|تونس)/i,
      key: 'city',    msg: 'تمام، {val} — حفظت مدينتك! 🏙️' },

    // العمل والدراسة
    { regex: /بشتغل\s+(.+)/,             key: 'job',      msg: 'تمام! حفظت إنك {val} 💼' },
    { regex: /شغلي\s+(.+)/,              key: 'job',      msg: 'حفظت شغلك — {val} 💼' },
    { regex: /بدرس\s+(.+)/,              key: 'education',msg: 'تمام! بتدرس {val} 📚' },
    { regex: /طالب\s+(.+)/,              key: 'education',msg: 'حفظت إنك طالب {val} 📚' },

    // الهوايات
    { regex: /بحب\s+(.+)/,               key: 'hobbies',  msg: 'تمام! بتحب {val} 🎯', push: true },
    { regex: /هوايتي\s+(.+)/,            key: 'hobbies',  msg: 'حلوة! هوايتك {val} 🎯', push: true },
    { regex: /اهتمامي\s+(.+)/,           key: 'hobbies',  msg: 'تمام! {val} — حفظتها 🎯', push: true },

    // الألوان والمفضلات
    { regex: /لوني\s+المفضل\s+(.+)/,    key: 'favColor', msg: 'جميل! لونك المفضل {val} 🎨' },
    { regex: /أكلتي\s+المفضلة\s+(.+)/,  key: 'favFood',  msg: 'يمي! بتحب {val} 😋' },
    { regex: /فيلمي\s+المفضل\s+(.+)/,   key: 'favMovie', msg: 'حلو! بتحب فيلم {val} 🎬' },
    { regex: /موسيقتي\s+(.+)/,           key: 'favMusic', msg: 'تمام! بتحب {val} 🎵' },

    // حكمة أو مقولة
    { regex: /حكمتي\s+(.+)/,             key: 'favoriteQuote', msg: 'حكمة جميلة! حفظتها 💡' },
    { regex: /مبدأي\s+(.+)/,             key: 'favoriteQuote', msg: 'مبدأ رائع! حفظته 💡' },
  ];

  // جرّب تستخرج معلومة من جملة المستخدم
  function extract(input) {
    const txt = input.trim();
    for (const p of PATTERNS) {
      const m = txt.match(p.regex);
      if (m) {
        const group = p.group || 1;
        let val = (m[group] || '').trim();
        if (!val) continue;
        if (p.parse) val = p.parse(val);
        if (p.push) {
          UserDB.push(p.key, val);
        } else {
          UserDB.set(p.key, val);
        }
        const msg = p.msg.replace(/\{val\}/g, val);
        return { key: p.key, val, msg };
      }
    }
    return null;
  }

  // حفظ معلومة مخصصة يدوياً
  function remember(label, value) {
    UserDB.setFact(label, value);
  }

  return { extract, remember };
})();

// ═══════════════════════════════════════════════════════
//  دوال إجابة أسئلة المستخدم عن نفسه
// ═══════════════════════════════════════════════════════
function findUserAnswer(input) {
  const txt  = input.toLowerCase().trim();
  const data = UserDB.all();

  // أسئلة الشخص عن بياناته المحفوظة
  const selfQA = [
    { q: ['اسمي إيه', 'اسمي', 'تعرفني'],
      fn: () => data.name ? `اسمك ${data.name}! أنا مش بنسى 😄` : null },
    { q: ['عمري', 'عندي كام'],
      fn: () => data.age  ? `عندك ${data.age} سنة 📝` : null },
    { q: ['ميلادي', 'تاريخ ميلادي'],
      fn: () => data.birthday ? `مولود في ${data.birthday} 🎂` : null },
    { q: ['من فين', 'بلدي'],
      fn: () => (data.country || data.city) ? `من ${data.city || ''} ${data.country || ''} 🌍`.trim() : null },
    { q: ['شغلي', 'وظيفتي'],
      fn: () => data.job ? `شغلك ${data.job} 💼` : null },
    { q: ['دراستي', 'بدرس'],
      fn: () => data.education ? `بتدرس ${data.education} 📚` : null },
    { q: ['هواياتي', 'بحب إيه', 'اهتماماتي'],
      fn: () => data.hobbies && data.hobbies.length ? `بتحب: ${data.hobbies.join('، ')} 🎯` : null },
    { q: ['نسيت', 'تذكر', 'فاكرني'],
      fn: () => data.name ? `أيوه فاكرك يا ${data.name}! ما بنساش 😊` : `مش عارفك لسه، قولي اسمك! 🤖` },
    { q: ['امسح بياناتي', 'نسّي بياناتي', 'reset'],
      fn: () => { UserDB.reset(); return 'تم مسح بياناتك! ابدأ من جديد 🗑️'; } },
  ];

  for (const item of selfQA) {
    for (const kw of item.q) {
      if (txt.includes(kw)) {
        const ans = item.fn();
        if (ans) return ans;
      }
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════
//  رسالة ترحيب شخصية للمستخدم
// ═══════════════════════════════════════════════════════
function getUserGreeting() {
  const data = UserDB.all();
  const h    = new Date().getHours();
  const time = h >= 5 && h < 12 ? 'صباح النور' : h < 18 ? 'أهلاً' : 'مساء النور';

  if (data.name) {
    return `${time} يا ${data.name}! كيف حالك النهارده؟ 😊`;
  }
  return `${time}! أنا روبوت أبو الفضل 🤖\nقولي اسمك وأنا أتعرف عليك!`;
}

// ═══════════════════════════════════════════════════════
//  فحص هل المستخدم موجود أم جديد
// ═══════════════════════════════════════════════════════
function isNewUser() {
  return !UserDB.get('name');
}
