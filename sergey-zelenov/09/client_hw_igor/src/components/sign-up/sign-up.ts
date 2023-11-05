import { Component, Vue } from 'vue-property-decorator';

import './sign-up.scss';

@Component({
  template: require('./sign-up.html')
})
export class SignUpComponent extends Vue {
  newDisplayName: string = '';
  newPassword: string = '';
  newEmail: string = '';
  valid: boolean = false;

  sended: boolean = false;

  nameRules: Array<any> = [
    (v) => !!v || 'Username is required',
    (v) => v && v.length <= 14 || 'Name must be less than 14 characters'
  ];
  emailRules: Array<any> = [
    (v) => !!v || 'E-mail is required',
    (v) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
  ];
  passRules: Array<any> = [
    (v) => !!v || 'Password is required',
    (v) => v && v.length > 4 || 'Password must be more then 4 characters'
  ];

  signUp() {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    if ((<any>this.$refs.signUpForm).validate()) {
      fetch('/signup', {
        method: 'POST',
        body: JSON.stringify({ 
          email: this.newEmail,
          password: this.newPassword,
          displayName: this.newDisplayName
        }),
        mode: 'cors',
        headers
      })
        .then(response => {
          return response.json();
        })
        .then(data => {
          // this.$store.commit('setUserData', data);
          // this.$emit('closeAuth');
          this.sended = true;
          this.clearFields();
        });
    } else {
      alert('Not valid!');
    }
  }
  clearFields() {
    this.newEmail = '';
    this.newPassword = '';
    this.newDisplayName = '';
  }
  closeAuth() {
    this.$emit('closeAuth');
  }
}