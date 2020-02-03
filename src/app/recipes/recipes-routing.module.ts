import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecipesPage } from './recipes.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: RecipesPage,
        children: [
         {
            path: 'discover',
            children: [
             {
                path: '',
                loadChildren: './discover/discover.module#DiscoverPageModule'
             },
             {
              path: 'saved-recipes',
              loadChildren: './discover/saved-recipes/saved-recipes.module#SavedRecipesPageModule'
            },
            {
              path: 'detail',
              children: [
                {
                  path: '',
                  loadChildren: './discover/detail-recipes/detail-recipes.module#DetailRecipesPageModule'
                },
                {
                  path: ':id',
                  loadChildren: './discover/detail-recipes/detail-recipes.module#DetailRecipesPageModule'
                }
              ]

            },
            ]
      },
      {
        path: '',
        redirectTo: '/recipes/tabs/discover',
        pathMatch: 'full'
      }
    ]
},
{
    path: '',
    redirectTo: '/recipes/tabs/discover',
    pathMatch: 'full'
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RecipesRoutingModule {}
