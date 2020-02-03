import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { RecipesPage } from './recipes.page';
import { RecipesRoutingModule } from './recipes-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RecipesRoutingModule
  ],
  declarations: [RecipesPage]
})
export class RecipesPageModule {}
