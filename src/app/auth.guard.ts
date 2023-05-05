import { inject } from '@angular/core';
import { DataService } from './data.service';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { map, Observable, tap } from 'rxjs';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): boolean | Observable<boolean> => {
  console.log(route.url[0].path)
  const data = inject(DataService);
  const router = inject(Router);

  return data.verifyUser(route.url[0].path).pipe(
    map((data) => {
      console.log(data)
      return data.message == 'Verified';
    }),
    tap((value) => {
      if (!value) {
        router.navigateByUrl('/login');
      }
    })
  );
};
