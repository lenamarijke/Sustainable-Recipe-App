export interface Recipe {
  id?: string;
  title: string;
  score: string;
  scoreInfo: string;
  ingredients: string[];
  instructions: string[];
  imageUrl: string;
  state: boolean;
  description: string;
}
