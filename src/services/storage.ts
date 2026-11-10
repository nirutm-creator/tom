import { SurveyResponse, AggregatedStats, QuestionStat } from '../types';
import { QUESTIONS, INITIAL_SAMPLE_RESPONSES, interpretScore } from '../constants';

const STORAGE_KEY = 'training_survey_responses_v1';
const SUBMISSION_FLAG_KEY = 'training_survey_has_submitted';
const CHANNEL_NAME = 'training_survey_channel';

// Setup broadcast channel for cross-tab realtime sync
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not supported', e);
}

export function getStoredResponses(): SurveyResponse[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial sample responses on first load
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_RESPONSES));
      return INITIAL_SAMPLE_RESPONSES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading responses from localStorage', err);
    return INITIAL_SAMPLE_RESPONSES;
  }
}

export function saveResponse(response: Omit<SurveyResponse, 'id' | 'timestamp'>): SurveyResponse {
  const newResponse: SurveyResponse = {
    ...response,
    id: 'res_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: Date.now()
  };

  const current = getStoredResponses();
  const updated = [newResponse, ...current];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(SUBMISSION_FLAG_KEY, 'true');
    
    // Broadcast to other tabs/windows
    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'NEW_RESPONSE', payload: newResponse });
    }
  } catch (err) {
    console.error('Error saving response', err);
  }

  return newResponse;
}

export function hasUserAlreadySubmitted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(SUBMISSION_FLAG_KEY) === 'true';
}

export function resetUserSubmissionFlag(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SUBMISSION_FLAG_KEY);
}

export function clearAllResponses(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'CLEARED' });
  }
}

export function resetToSampleResponses(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_RESPONSES));
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'RESET_SAMPLE', payload: INITIAL_SAMPLE_RESPONSES });
  }
}

export function addRandomMockResponse(): SurveyResponse {
  const mockComments = [
    'ชอบเนื้อหาช่วงบ่ายมาก นำไปใช้งานได้จริง',
    'วิทยากรให้คำแนะนำละเอียด ตรงประเด็น',
    'เอกสารประกอบการสอนสวยงาม เข้าใจง่าย',
    'อยากให้เพิ่มเวลาสำหรับการทำ Work Shop อีกนิดครับ',
    'ระบบและอุปกรณ์ดีมาก ไม่มีสะดุดเลย'
  ];

  // Generate slightly random high scores (4 or 5 mostly)
  const scores: { [key: number]: number } = {};
  QUESTIONS.forEach((q) => {
    scores[q.id] = Math.random() > 0.25 ? 5 : 4;
  });

  const response: SurveyResponse = {
    id: 'mock_' + Date.now(),
    timestamp: Date.now(),
    scores,
    comment: mockComments[Math.floor(Math.random() * mockComments.length)]
  };

  const current = getStoredResponses();
  const updated = [response, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'NEW_RESPONSE', payload: response });
  }

  return response;
}

export function subscribeToResponses(callback: (responses: SurveyResponse[]) => void): () => void {
  const handleMessage = () => {
    callback(getStoredResponses());
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleMessage);
  }

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getStoredResponses());
    }
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleMessage);
    }
    window.removeEventListener('storage', handleStorage);
  };
}

export function calculateStats(responses: SurveyResponse[]): AggregatedStats {
  const totalResponses = responses.length;

  if (totalResponses === 0) {
    return {
      totalResponses: 0,
      overallAverage: 0,
      interpretation: {
        level: 'ยังไม่มีข้อมูล',
        description: 'รอผู้เข้าร่วมอบรมส่งแบบประเมิน',
        color: 'text-slate-400 border-slate-700 bg-slate-800/40',
        bgLight: 'bg-slate-600'
      },
      questionStats: QUESTIONS.map((q) => ({
        id: q.id,
        title: q.title,
        category: q.category,
        average: 0,
        count: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      })),
      recentComments: []
    };
  }

  // Calculate per question statistics
  const questionStats: QuestionStat[] = QUESTIONS.map((q) => {
    const distribution: { [score: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;
    let count = 0;

    responses.forEach((res) => {
      const score = res.scores[q.id];
      if (score && score >= 1 && score <= 5) {
        distribution[score] = (distribution[score] || 0) + 1;
        sum += score;
        count += 1;
      }
    });

    const average = count > 0 ? Number((sum / count).toFixed(2)) : 0;

    return {
      id: q.id,
      title: q.title,
      category: q.category,
      average,
      count,
      distribution
    };
  });

  // Calculate overall mean across all answers
  let totalScoreSum = 0;
  let totalScoreCount = 0;

  questionStats.forEach((qs) => {
    totalScoreSum += qs.average * qs.count;
    totalScoreCount += qs.count;
  });

  const overallAverage = totalScoreCount > 0 ? Number((totalScoreSum / totalScoreCount).toFixed(2)) : 0;
  const interpretation = interpretScore(overallAverage);

  // Extract recent comments with overall scores
  const recentComments = responses
    .filter((r) => r.comment && r.comment.trim().length > 0)
    .slice(0, 15)
    .map((r) => {
      const scoreValues = Object.values(r.scores);
      const avg = scoreValues.length > 0 ? Number((scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length).toFixed(1)) : 5;
      return {
        id: r.id,
        text: r.comment || '',
        timestamp: r.timestamp,
        overallScore: avg
      };
    });

  return {
    totalResponses,
    overallAverage,
    interpretation,
    questionStats,
    recentComments
  };
}

export function exportResponsesToCSV(responses: SurveyResponse[]): void {
  if (responses.length === 0) {
    alert('ยังไม่มีข้อมูลการตอบแบบสอบถามสำหรับดาวน์โหลด');
    return;
  }

  // BOM for Excel Thai language support (\uFEFF)
  let csvContent = '\uFEFF';
  
  // Headers
  const headers = [
    'ลำดับ',
    'วันเวลาที่ตอบ',
    'ข้อ 1 (วิทยากร)',
    'ข้อ 2 (เนื้อหา)',
    'ข้อ 3 (กิจกรรม)',
    'ข้อ 4 (สถานที่/อุปกรณ์)',
    'ข้อ 5 (ภาพรวม)',
    'คะแนนเฉลี่ยรายบุคคล',
    'ข้อเสนอแนะเพิ่มเติม'
  ];
  csvContent += headers.map((h) => `"${h}"`).join(',') + '\r\n';

  // Rows
  responses.forEach((res, index) => {
    const dateStr = new Date(res.timestamp).toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const s1 = res.scores[1] || '';
    const s2 = res.scores[2] || '';
    const s3 = res.scores[3] || '';
    const s4 = res.scores[4] || '';
    const s5 = res.scores[5] || '';

    const validScores = [s1, s2, s3, s4, s5].filter((s) => typeof s === 'number') as number[];
    const avg = validScores.length > 0 ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(2) : '';

    const safeComment = (res.comment || '').replace(/"/g, '""');

    const row = [
      index + 1,
      dateStr,
      s1,
      s2,
      s3,
      s4,
      s5,
      avg,
      safeComment
    ];

    csvContent += row.map((cell) => `"${cell}"`).join(',') + '\r\n';
  });

  // Trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const filename = `training_satisfaction_results_${new Date().toISOString().slice(0, 10)}.csv`;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
