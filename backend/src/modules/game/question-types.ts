export interface Question {
  id: string;
  type: "flag" | "capital" | "continent";
  text: string;
  image?: string;
  options: string[];
  correctAnswer: string;
}
