export interface IReview {
  pros: string[];
  cons: string[];
  score: number; // out of 10
  summary: string;
  recommendations: string[];
  job_fit: string;
  verdict: 'strong candidate' | 'pass' | 'needs improvement';
  grammar_issues: number;
  highlighted_projects: string[];
  tech_stack_strengths: string[];
}