import { Injectable } from "@angular/core";
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';

@Injectable()
export class GetOrderStatusTypesResolver implements Resolve<Observable<string[]>> {

  constructor(private apiService: ApiService) {
  }

  resolve(route: import("@angular/router").ActivatedRouteSnapshot, 
  state: import("@angular/router").RouterStateSnapshot): Observable<string[]> {
    return this.apiService.getOrderStatusTypes();
  }
}

