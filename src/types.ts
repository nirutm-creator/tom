export interface Question {
  id: number;
  title: string;
  category: string;
  description?: string;
}

export interface SurveyResponse {
  id: string;
  timestamp: number;
  scores: { [questionId: number]: number }; // 1 to 5
  comment?: string;
  clientUuid?: string;
}

export interface QuestionStat {
  id: number;
  title: string;
  category: string;
  average: number;
  count: number;
  distribution: { [score: number]: number }; // score 1-5 counts
}

export interface AggregatedStats {
  totalResponses: number;
  overallAverage: number;
  interpretation: {
    level: string;
    description: string;
    color: string;
    bgLight: string;
  };
  questionStats: QuestionStat[];
  recentComments: {
    id: string;
    text: string;
    timestamp: number;
    overallScore: number;
  }[];
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}
