import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { User } from './user.model';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Plugins} from '@capacitor/core';
import { AlertController } from '@ionic/angular';


export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    // localId is user id
    localId: string;
    expiresIn: string;
    registered?: boolean;
}
// this should be in a seperate service for UserProfile/ SavedRecipes but yolo...
export interface UserProfile {
    recipes: string[];
   }

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private userCollection: AngularFirestoreCollection<UserProfile>;
  private users: Observable<UserProfile[]>;
  public emailIn = '';
  private snapshotChangesSubscription: any;
  private activeLogoutTimer: any;

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(map(user => {
        if (user) {
          this.emailIn = user.email
            return !!user.token;
        } else {
            return false;
        }
    })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(map(user => {
        if (user) {
            return user.id;
        } else {
            return null;
        }
    }
        ));
  }

  get userEmail() {
    return this._user.asObservable().pipe(map(user => {
        if (user) {
            return user.email;
        } else {
            return null;
        }
    }
        ));
  }


  constructor(private http: HttpClient, private firestore: AngularFirestore, private alertCtrl: AlertController,) {
    this.userCollection = firestore.collection<UserProfile> ('users');
    this.users = this.userCollection.snapshotChanges().pipe(
      map (actions => {
        return actions.map (a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ... data};
        });
      })
    );
  }
  // new
  autoLogin() {
    return from(Plugins.Storage.get({ key: 'authData' })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          userEmail: string;
          userId: string;
          token: string;
          tokenExpirationDate: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(parsedData.userId, parsedData.userEmail, parsedData.token, expirationTime);
        return user;
    }),
    tap(user => {
      if (user) {
        this._user.next(user);
        this.autoLogout(user.tokenDuration);
      }
    }),
    map(user => {
      // returns a forced boolean
      return !!user;
    })
    );
  }

  signup(email: string, password: string) {
      this.emailIn = email;
      this.addUserProfile(this.emailIn);
      this.alertCtrl.create({
        header: 'Hello!',
        // tslint:disable-next-line: max-line-length
        message: 'Great to see you here. With the Spice app, you get access to a weekly changing dinner menu that is both good for you & good for the planet. Sounds too good to be true? Well you can check yourself. All recipes are algined with the recommendations made by the EAT-Lancet Commission to ensure a nutritious, healthy and environmentally sustainable meal. And that is not all! On top of that, you can check the environmental sustainability of each meal. The score is based on the Eaternity Database - the largest environmental impacts database for food products worldwide. For now, only the CO2 footprint is shown. Let us start small ;)   p.s.: You can check both references in the menu to the left.',
        buttons: [{
          text: 'Ok got it!',
          role: 'ok'
        }
      ]
      }).then(alertEl => {
        alertEl.present();
      });
      return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${
           environment.firebaseAPIkey
        }`,
        { email: email, password: password, returnSecureToken: true }
        ).pipe(tap(this.setUserData.bind(this)));

  }

  login(email: string, password: string) {
    this.emailIn = email;
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${
        environment.firebaseAPIkey
    }`, { email: email, password: password, returnSecureToken: true }
    ).pipe(tap(this.setUserData.bind(this)));
  }
 
  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({key: 'authData'});
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
        new Date().getTime() + +userData.expiresIn * 1000
        );
    const user = new User(
            userData.localId,
            userData.email,
            userData.idToken,
            expirationTime
            );
            // new 
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(
              userData.email,
              userData.localId,
              userData.idToken,
              expirationTime.toISOString());
  }

  // this should all be in a seperate savedRecipes service...
  addUserProfile(emailIn: string) {
    let user: UserProfile = {
      recipes: [],
    };
    this.userCollection.doc(emailIn).set(user);
}

  addRecipeOrder(id: string) {
    this.updateUserProfile(id);
    return id;
    console.log(id);
  }

updateUserProfile(id: string) {
    console.log('Still here', id, this.emailIn);
    // add recipe without deleting last one
    this.userCollection.doc(this.emailIn).update({ recipes: [id] });
}

getSavedRecipes() {
  firebase.firestore().collection('users').doc(this.emailIn)
    .onSnapshot(querySnapshot => {
        console.log('querySnapshot: ' + querySnapshot);
    });
}

addSavedRecipe(
  id: string,
  title: string,
  score: string,
  scoreInfo: string,
  ingredients: string[],
  instructions: string[],
  imageUrl: string,
  state: boolean,
  description: string) {
    return this.firestore.collection('users').doc(this.emailIn).collection('recipes').doc(id).set({
      title,
      score,
      scoreInfo,
      ingredients,
      instructions,
      imageUrl,
      state,
      description
    });
}

// new 
private storeAuthData(
  userEmail: string,
  userId: string,
  token: string,
  tokenExpirationDate: string
) {
  const data = JSON.stringify({
    userEmail: userEmail,
    userId: userId,
    token: token,
    tokenExpirationDate: tokenExpirationDate
  });
  Plugins.Storage.set({key: 'authData', value: data});
}

ngOnDestroy() {
  if (this.activeLogoutTimer) {
    clearTimeout(this.activeLogoutTimer);
  }
}
}
