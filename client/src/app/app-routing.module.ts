import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesComponent } from './sales/sales.component';
import { SalesDetailsComponent } from './sales-details/sales-details.component';
import { AddSalesComponent } from './add-sales/add-sales.component';
import { EditSalesComponent } from './edit-sales/edit-sales.component';
import { MktFeedComponent } from './mkt-feed/mkt-feed.component';
import { GetVendorsResolver } from './resolvers/get-vendors.resolver';
import { GetOrderStatusTypesResolver } from './resolvers/get-order-status-types.resolver';

const routes: Routes = [
  { path: '',
    pathMatch: 'full',
    redirectTo: '/mkt-feed'
  },
  {
    path: 'mkt-feed',
    component: MktFeedComponent,
    resolve: {
      vendorSources: GetVendorsResolver,
      orderStatusTypes: GetOrderStatusTypesResolver
    }
  },
  {
    path: 'sales',
    component: SalesComponent,
    data: { title: 'List of Sales' }
  },
  {
    path: 'sales-details/:id',
    component: SalesDetailsComponent,
    data: { title: 'Sales Details' }
  },
  {
    path: 'add-sales',
    component: AddSalesComponent,
    data: { title: 'Add Sales' }
  },
  {
    path: 'edit-sales/:id',
    component: EditSalesComponent,
    data: { title: 'Edit Sales' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    GetVendorsResolver,
    GetOrderStatusTypesResolver
  ]
})
export class AppRoutingModule { }
