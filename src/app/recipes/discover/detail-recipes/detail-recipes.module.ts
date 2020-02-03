import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailRecipesPage } from './detail-recipes.page';
import { SaveRecipeComponent } from '../saved-recipes/save-recipe/save-recipe.component';

const routes: Routes = [
  {
    path: '',
    component: DetailRecipesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailRecipesPage, SaveRecipeComponent],
  entryComponents: [SaveRecipeComponent]
})
export class DetailRecipesPageModule {}
