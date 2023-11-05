import { Component, Vue } from 'vue-property-decorator';
import { AuthComponent } from '../auth';
import { ChatComponent } from './../chat';

import './app.scss';

@Component({
  template: require('./app.html'),
  components: {
    'auth': AuthComponent,
    'chat': ChatComponent
  }
})
export class AppComponent extends Vue {
  fixed: boolean = false;
  dialog: boolean = false;

  openAuth() {
    this.dialog = true;
  }
  toggleAuth(val) {
    this.dialog = val;
  }
  signOut() {
    this.$store.commit('signOut');
  }
  secret() {
    const headers = new Headers({
      'Authorization': this.user.token
    });
    console.log(this.user.token);

    fetch('/test', {
      headers
    })
    .then(data => {
      return data.json();
    })
    .then(data => {
      console.log(data);
    });
  }
  test() {
    fetch('/test')
    .then(data => {
      return data.json();
    })
    .then(data => {
      console.log(data);
    });
  }
  get user() {
    return this.$store.state.user;
  }
}