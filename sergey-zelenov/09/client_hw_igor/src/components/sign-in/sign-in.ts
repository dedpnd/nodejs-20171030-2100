import { Component, Vue } from 'vue-property-decorator';

import './sign-in.scss';

@Component({
  template: require('./sign-in.html')
})
export class SignInComponent extends Vue {
  displayName: string = '';
  password: string = '';
  email: string = '';
  emailRules: Array<any> = [
    (v) => !!v || 'E-mail is required',
    (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
  ];
  valid: boolean = true;
  accessToken: string = '';

  signIn() {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    if ((<any>this.$refs.signInForm).validate()) {
      fetch('/login', {
        method: 'POST',
        body: JSON.stringify({ 
          email: this.email,
          password: this.password
        }),
        mode: 'cors',
        headers
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          this.$store.commit('setUserData', data);
          this.$emit('closeAuth');
          this.clearFields();
        });
    } else {
      alert('Not valid!');
    }
  }
  signInSocial(provider) {
    (<any>window).authenticateCallback = (data) => {
      this.$store.commit('setUserData', data);
      this.$emit('closeAuth');
      this.clearFields();
    };

    window.open(`/login/${provider}`);
  }
  clearFields() {
    this.email = '';
    this.password = '';
  }
}