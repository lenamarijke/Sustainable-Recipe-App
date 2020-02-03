import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { map } from 'rxjs/operators';

import { Observable } from 'rxjs';

import { FirestoreService } from '../../service/firestore.service';
import { RecipesService, Recipe } from '../recipes.service';
import { AuthService } from '../../auth/auth.service';
import { SegmentChangeEventDetail } from '@ionic/core';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})

export class DiscoverPage implements OnInit {
   isLoading = true;

  recipes: Observable<Recipe[]>;
  thisWeeksRecipes: Observable<Recipe[]>;

  constructor(
    private recipesService: RecipesService,
    private menuCtrl: MenuController,
    private authService: AuthService,
    private firestoreService: FirestoreService) {}


ngOnInit() {
  console.log(this.authService.emailIn, 'works');

  this.isLoading = true;
  }

ionViewWillEnter() {
    this.recipes = this.recipesService.getRecipes();
    this.thisWeeksRecipes = this.recipes;
    this.isLoading = false;
  }

onOpenMenu() {
    this.menuCtrl.toggle();
  }

onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
    if (event.detail.value === 'all') {
      this.thisWeeksRecipes = this.recipes;
    } else {
      this.thisWeeksRecipes = this.recipes.pipe(
        map((reports: any[]) => reports.filter(p => {
          if (p.state === true) {
            return p;
          }})));
    }
  }
}
