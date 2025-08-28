import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
    private router = inject(Router);
  private firestore = inject(Firestore);
   user$ = new BehaviorSubject<UserModel | null>(null);

  constructor() {
    onAuthStateChanged(this.auth, async (user:any) => {
      if (user) {
        const snap = await getDoc(doc(this.firestore, `users/${user.uid}`));
        const profile = snap.exists() ? (snap.data() as UserModel) : { uid: user.uid, email: user.email };
        this.user$.next(profile);
      } else {
        this.user$.next(null);
      }
    });
  }

  get currentUser$() { return this.user$.asObservable(); }

  async register(email:string, password:string, displayName:string, role:UserModel['role']='user') {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(cred.user, { displayName });
    const userDoc: UserModel = { uid: cred.user.uid, email, displayName, role };
    await setDoc(doc(this.firestore, `users/${cred.user.uid}`), userDoc);
    this.user$.next(userDoc);
    return cred.user;
  }

  async login(email:string, password:string) {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    const snap = await getDoc(doc(this.firestore, `users/${cred.user.uid}`));
    if (snap.exists()) this.user$.next(snap.data() as UserModel);
    return cred.user;
  }

  async logout() { await signOut(this.auth); this.user$.next(null);   
     this.router.navigate(['/login']);}

  isLoggedIn(): boolean { return this.user$.value != null; }
  hasRole(allowed:string[]=[]): boolean { const role = this.user$.value?.role; if (!allowed || allowed.length===0) return true; return !!role && allowed.includes(role); }
}
