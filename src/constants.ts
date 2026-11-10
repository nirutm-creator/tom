import { Question, SurveyResponse } from './types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    title: '1. ความรู้ความสามารถและการถ่ายทอดของวิทยากร',
    category: 'วิทยากร',
    description: 'วิทยากรมีความเชี่ยวชาญ ตอบข้อซักถามชัดเจน และสื่อสารเข้าใจง่าย'
  },
  {
    id: 2,
    title: '2. เนื้อหาหลักสูตรมีความเหมาะสม ครบถ้วน และเป็นประโยชน์',
    category: 'เนื้อหา',
    description: 'เนื้อหาสอดคล้องกับวัตถุประสงค์ ทันสมัย และสามารถนำไปประยุกต์ใช้งานจริงได้'
  },
  {
    id: 3,
    title: '3. เทคนิค วิธีการจัดกิจกรรม และการสร้างการมีส่วนร่วม',
    category: 'กระบวนการ',
    description: 'มีการเปิดโอกาสให้ซักถาม แลกเปลี่ยนความคิดเห็น และบรรยากาศการเรียนรู้ดี'
  },
  {
    id: 4,
    title: '4. ความพร้อมของสถานที่ โสตทัศนูปกรณ์ และการอำนวยความสะดวก',
    category: 'สถานที่ & อุปกรณ์',
    description: 'สัญญาณภาพ เสียง อินเทอร์เน็ต และอาหาร/เครื่องดื่มมีความพร้อม'
  },
  {
    id: 5,
    title: '5. ความพึงพอใจในภาพรวมของการอบรมครั้งนี้',
    category: 'ภาพรวม',
    description: 'ความคุ้มค่าและภาพรวมความประทับใจตลอดการจัดอบรม'
  }
];

export const RATING_OPTIONS = [
  { value: 5, label: 'มากที่สุด', emoji: '🤩', color: 'bg-emerald-500 hover:bg-emerald-600', ring: 'ring-emerald-500', text: 'text-emerald-400' },
  { value: 4, label: 'มาก', emoji: '😊', color: 'bg-sky-500 hover:bg-sky-600', ring: 'ring-sky-500', text: 'text-sky-400' },
  { value: 3, label: 'ปานกลาง', emoji: '😐', color: 'bg-amber-500 hover:bg-amber-600', ring: 'ring-amber-500', text: 'text-amber-400' },
  { value: 2, label: 'น้อย', emoji: '🙁', color: 'bg-orange-500 hover:bg-orange-600', ring: 'ring-orange-500', text: 'text-orange-400' },
  { value: 1, label: 'น้อยที่สุด', emoji: '😞', color: 'bg-rose-500 hover:bg-rose-600', ring: 'ring-rose-500', text: 'text-rose-400' }
];

export function interpretScore(mean: number) {
  if (mean >= 4.51) {
    return {
      level: 'มากที่สุด',
      description: 'ระดับความพึงพอใจอยู่ในเกณฑ์ดีเยี่ยม (4.51 - 5.00)',
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
      bgLight: 'bg-emerald-500',
      badge: 'bg-emerald-500 text-white'
    };
  }
  if (mean >= 3.51) {
    return {
      level: 'มาก',
      description: 'ระดับความพึงพอใจอยู่ในเกณฑ์ดี (3.51 - 4.50)',
      color: 'text-sky-400 border-sky-500/40 bg-sky-500/10',
      bgLight: 'bg-sky-500',
      badge: 'bg-sky-500 text-white'
    };
  }
  if (mean >= 2.51) {
    return {
      level: 'ปานกลาง',
      description: 'ระดับความพึงพอใจอยู่ในเกณฑ์ปานกลาง (2.51 - 3.50)',
      color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      bgLight: 'bg-amber-500',
      badge: 'bg-amber-500 text-white'
    };
  }
  if (mean >= 1.51) {
    return {
      level: 'น้อย',
      description: 'ระดับความพึงพอใจอยู่ในเกณฑ์ต้องปรับปรุง (1.51 - 2.50)',
      color: 'text-orange-400 border-orange-500/40 bg-orange-500/10',
      bgLight: 'bg-orange-500',
      badge: 'bg-orange-500 text-white'
    };
  }
  return {
    level: 'น้อยที่สุด',
    description: 'ระดับความพึงพอใจอยู่ในเกณฑ์เร่งด่วน (1.00 - 1.50)',
    color: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    bgLight: 'bg-rose-500',
    badge: 'bg-rose-500 text-white'
  };
}

export const INITIAL_SAMPLE_RESPONSES: SurveyResponse[] = [
  {
    id: 'sample-1',
    timestamp: Date.now() - 1000 * 60 * 25,
    scores: { 1: 5, 2: 5, 3: 5, 4: 4, 5: 5 },
    comment: 'วิทยากรสอนสนุกมาก ยกตัวอย่างเห็นภาพชัดเจน เข้าใจง่ายมากครับ'
  },
  {
    id: 'sample-2',
    timestamp: Date.now() - 1000 * 60 * 18,
    scores: { 1: 5, 2: 4, 3: 4, 4: 5, 5: 5 },
    comment: 'เนื้อหาดีและครอบคลุม อยากให้มีหลักสูตรขั้นสูง (Advanced) เพิ่มเติมในครั้งต่อไป'
  },
  {
    id: 'sample-3',
    timestamp: Date.now() - 1000 * 60 * 12,
    scores: { 1: 4, 2: 5, 3: 5, 4: 4, 5: 4 },
    comment: 'เวิร์กช็อปภาคปฏิบัติช่วยให้เข้าใจเร็วขึ้นมาก อุปกรณ์และสัญญาณเน็ตเร็วดีครับ'
  },
  {
    id: 'sample-4',
    timestamp: Date.now() - 1000 * 60 * 7,
    scores: { 1: 5, 2: 5, 3: 4, 4: 5, 5: 5 },
    comment: 'ชอบการมีส่วนร่วมและการทำกิจกรรมกลุ่ม อาหารว่างอร่อย ทีมงานดูแลดีมาก'
  },
  {
    id: 'sample-5',
    timestamp: Date.now() - 1000 * 60 * 2,
    scores: { 1: 5, 2: 4, 3: 5, 4: 4, 5: 5 },
    comment: 'นำไปปรับใช้กับการทำงานจริงได้ทันที ขอบคุณทีมผู้จัดทุกท่านครับ'
  }
];
