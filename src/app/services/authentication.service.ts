import { Injectable } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from '@angular/fire/auth';
import { BehaviorSubject, from, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUser$ = authState(this.auth);
  private url = new BehaviorSubject('');
  currentUrl = this.url.asObservable();

  private name = new BehaviorSubject('');
  userName = this.name.asObservable();

  constructor(private auth: Auth) { }

  login(username: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, username, password))
  }

  signUp(name: string, email: string, password: string) {
    return from(createUserWithEmailAndPassword(this.auth, email, password)
    )
    // .pipe(switchMap(({ user }) => updateProfile(user, { displayName: name })
    // ));
  }

  logout() {
    return from(this.auth.signOut());
  }

  getUrl(url: string) {
    this.url.next(url);
  }

  getName(name: string) {
    this.name.next(name)
  }
}
