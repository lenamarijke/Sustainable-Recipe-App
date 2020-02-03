import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

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
@Injectable({
  providedIn: 'root'
})
export class RecipesService {

   private _recipes = new BehaviorSubject<Recipe[]>([]);

  private recipes: Observable<Recipe[]>;
  private recipeCollection: AngularFirestoreCollection<Recipe>;


  constructor(private http: HttpClient, private firestore: AngularFirestore) {
    this.recipeCollection = this.firestore.collection<Recipe>('recipes');
    this.recipes = this.recipeCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data};
      });
    }));
  }

  getRecipes(): Observable<Recipe[]> {
    return this.recipes; 
  }

  getRecipe(id: string): Observable<Recipe> {
    return this.recipeCollection.doc<Recipe>(id).valueChanges().pipe(
      take(1),
      map(recipe => {
        recipe.id = id;
        return recipe;
        console.log(recipe);
      })
    );
  }
}
