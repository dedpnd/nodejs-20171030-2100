import { Component, Vue } from 'vue-property-decorator';
import { SignInComponent } from '../sign-in';
import { SignUpComponent } from '../sign-up';

import './auth.scss';

@Component({
  template: require('./auth.html'),
  components: {
    'sign-in': SignInComponent,
    'sign-up': SignUpComponent
  },
  props: ['dialog'],
  watch: {
    dialog(val) {
      this.opened = val;
    },
    opened(val) {
      this.$emit('toggleAuth', val);
    }
  }
})

export class AuthComponent extends Vue {
  active: any = 'sign-in';
  tabs: Array<string> = ['sign-in', 'sign-up'];
  opened: boolean = false;

  closeAuth() {
    this.opened = false;
  }
}

