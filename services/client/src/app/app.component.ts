import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { take, tap } from 'rxjs/operators';

import { CentsCommandments } from '@cents-ideas/enums';

import { AuthActions } from './auth/auth.actions';
import { AuthSelectors } from './auth/auth.selectors';

@Component({
  selector: 'ci-component',
  template: `
    <p>CENTS: {{ cents }}</p>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  cents = `${CentsCommandments.Control}, ${CentsCommandments.Entry}, ${CentsCommandments.Need}, ${CentsCommandments.Time}, ${CentsCommandments.Scale}`;

  constructor(private store: Store) {
    this.handleAuthentication();
  }

  handleAuthentication = () => {
    this.store
      .select(AuthSelectors.selectAuthState)
      .pipe(
        take(1),
        tap(state => {
          if (state.authenticationTryCount < 1) {
            this.store.dispatch(AuthActions.authenticate());
          }
        }),
      )
      .subscribe();
  };
}
