export type Step = {
  id: string;
  label: string;
  completed: boolean;
  mandatory: boolean;
};

export type WorkType = {
  id: string;
  title: string;
  deadline?: string; // ISO date string
  steps: Step[];
}; 