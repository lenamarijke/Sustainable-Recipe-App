import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SavedRecipe } from './saved-recipe.model';

import { AuthService } from './../../../auth/auth.service';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


@Injectable({ providedIn: 'root' })

export class SavedRecipesService {
  private recipes: Observable<SavedRecipe[]>;
  private recipeCollection: AngularFirestoreCollection<SavedRecipe>;

    constructor(private http: HttpClient, private firestore: AngularFirestore, private authService: AuthService) {
      console.log('MEAIL', this.authService);
      
      this.recipeCollection = this.firestore.collection('users').doc(this.authService.emailIn).collection<SavedRecipe>('recipes');
      this.recipes = this.recipeCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data};
      });
    }));
    }

    getRecipes() {
      return this.recipes;

    }
    // not needed
    deleteRecipe(recipeId: string) {
      //   return this.http
      // .delete(
      //   `https://spice-94dcf.firebaseio.com/savedRecipes/${recipeId}.json`
      // )
      // .pipe(
      //   switchMap(() => {
      //     return this.savedRecipes;
      //   }),
      //   take(1),
      //   tap(savedRecipes => {
      //     this._savedRecipes.next(savedRecipes.filter(b => b.id !== recipeId));
      //   })
      // );
    }
}
