import React from "react";
import { standardCatch } from "../../FIREBASE_SUDO";
import {
  getAuth,
  PhoneAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  sendEmailVerification
} from "firebase/auth";
import FIREBASE_EMAIL from "./FIREBASE_EMAIL";
class FIREBASE_MULTI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    //this.emailAuthProvider = new EmailAuthProvider(getAuth());
    this.phoneAuthProvider = new PhoneAuthProvider(getAuth());
  }

  //if (err.code !== "auth/requires-recent-login")
  //return console.log("updateEmail ", err.code, err.message);
  //this.props.setHumanCodeCredential({ humanCodeCredential: true });
  addEmail = async (User) =>
    await updateEmail(User, this.props.openEmail)
      .then(async () => {
        const callbackUser = async (email) => {
          window.alert(
            "email updated to " +
              email +
              ". Click the link (and login again) to confirm it works."
          );
          //if (!this.state.humanCodeCredential) {
          console.log(
            "added email " + email + ". Able to verify by link in email."
          ); //upsert (update, assert/set)
          //return this.FIREBASE_email.current.click(); //this.handleUpdateEmail(email);
          //await emailMulti(email); //confirm
          this.props.logoutofapp();
          //var gotAuth = getAuth().currentUser;
          //Cannot destructure property 'auth' of 'user' as it is null.
        };
        return await sendEmailVerification(User)
          .then(callbackUser(this.props.openEmail))
          .catch((err) => console.log("sendEmailVerification ", err.message));
      }) //({ user } = (re) => re) =>
      .catch((err) => console.log(err.message));

  promptCode = async () =>
    await this.phoneAuthProvider
      .verifyPhoneNumber(this.props.auth.phoneNumber, window.recaptchaVerifier) //recaptchaWidgetId
      .then(async (verificationId) => {
        const credential = PhoneAuthProvider.credential(
          verificationId,
          window.prompt("Enter your code")
        );
        console.log("id, credential: ", verificationId, credential);
        //return emailMulti(email); //confirm getAuth().currentUser
        //getAuth().currentUser.getIdToken is not a function
        var User = this.props.auth;
        if (
          getAuth().currentUser &&
          getAuth().currentUser.getIdToken &&
          getAuth().currentUser.getIdToken instanceof Function
        ) {
          User = getAuth().currentUser;
        } //else User.getIdToken = () => { return; };
        console.log("User ", User);

        return await reauthenticateWithCredential(
          User,
          credential //this.emailAuthProvider.credentialFromResult(res)
        ).then(async () => await this.addEmail(User));
      })
      .catch(standardCatch);
  responseCallback = () => {
    console.log("multi");
    this.promptCode();
    //window.recaptchaId=""
  };
  mountRecaptcha = () => {
    console.log("mount recaptcha multi");
    !this.isMountCanceled &&
      window.recaptchaVerifier
        .render()
        .then((id) => (window.recaptchaId = id)) //onload=onloadCallback&render=explicit
        .catch(standardCatch);
  };
  componentWillUnmount = () => {
    this.isMountCanceled = true;
  };
  render() {
    const isEmail = (email) =>
      email !== "" && email.split("@")[1] && email.split("@")[1].split(".")[1];
    //handleReauth //console.log(this.props.auth);
    /*const nothing = async () =>
      await this.emailAuthProvider
        .credentialWithLink(this.props.auth, window.location.href)
        // linkWithCredential(User, credential)
        .then(
          async (res) =>
            await reauthenticateWithCredential(
              getAuth(),
              this.emailAuthProvider.credentialFromResult(res)
            )
              //signInWithCredential
              .catch((err) => console.log(err.message))
        )
        .catch((err) =>
          console.log(
            //err.code,
            "multi error: ",
            err.message,
            "currentUser: ",
            getAuth().currentUser,
            "window[windowKey]",
            this.props.auth
          )
        );*/
    return (
      <div>
        <div
          ref={this.props.FIREBASE_MULTI}
          onClick={() => this.responseCallback()}
        />
        <div
          ref={this.props.FIREBASE_EMAIL}
          onClick={() => {
            if (
              this.props.auth.email &&
              this.props.auth.emailVerified === false
            )
              return this.props.getUserInfo();
            if (
              !this.props.auth.email ||
              (!this.props.auth.emailVerified &&
                window.confirm("resend email?"))
            ) {
              if (this.props.auth.email && !this.props.auth.emailVerified)
                return window.alert(
                  "check your email: " + this.props.auth.email
                );
              const email = window.prompt(
                "your decanter email" +
                  (this.props.auth.emailVerified
                    ? this.props.auth.email
                    : ` (you will enter this again while visiting the confirmation path)`)
              );
              if (!email) return null;
              if (isEmail(email)) {
                this.props.setEmail({ openEmail: email });
                console.log("email", email);
                if (!this.props.auth.email || this.props.auth.email !== email) {
                  console.log("mount recaptcha");
                  return this.mountRecaptcha();
                }
                return null;
              } else return window.alert(`${email} is not an email format`);
            }
          }}
        />
        <FIREBASE_EMAIL
          isEmail={isEmail}
          hide={this.props.hide}
          handleUpdateEmail={this.reauthenticate}
          setHumanCodeCredential={this.setState}
          humanCodeCredential={this.state.humanCodeCredential}
          auth={this.props.auth}
          user={this.props.user}
        />
      </div>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <FIREBASE_MULTI {...props} {...ref.current} />
));

//database email
/*getDoc(doc(firestore, "userDatas", this.props.auth.uid))
      .then((doc) =>
        (doc.exists() ? updateDoc : setDoc)(
          doc(firestore, "userDatas", this.props.auth.uid),
          {
            email: openEmail
          }
        )
          .then(() =>
            window.alert(
              `great, please click the link in the email` +
                ` from Google sent to ${openEmail}` +
                ` in order to add bank accounts`
            )
          )
          .catch(standardCatch)
      )
      .catch(standardCatch);
          deleteStripe={() => {
            /*const account = await this.stripe.customers.delete(
                this.stripe.user.id
              );*
            updateDoc(doc(firestore, "users", this.props.auth.uid), {
              banked: false
            });
          }}
          */

/*if (
      !this.props.auth ||
      !this.props.auth.getIdToken ||
      !(this.props.auth.getIdToken instanceof Function)
    )
      return this.props.getUserInfo();*/

//window.recaptchaVerifier.clear(); //../../../FIREBASE_SUDO.js
//how to get a script query react window function to run
/*window.recaptchaVerifier.render().then(
      (id) =>
        //this.props.FIREBASE_PHONE_recaptcha.current
        //https://developers.google.com/recaptcha/docs/display#render_param
        //https://blog.logrocket.com/implement-recaptcha-react-application/
        //https://firebase.google.com/docs/auth/web/phone-auth#web-version-9_5
        (window.phoneNumber = this.props.auth.phoneNumber) &&
        (window.recaptchaWidgetId = id)
    );*/
/* 
    new RecaptchaVerifier(
                    this.props.FIREBASE_PHONE_recaptcha.current,
                    {
                      callback: (response) => console.log("callback", response),
                      size: "invisible"
                    }
                  )
    */
