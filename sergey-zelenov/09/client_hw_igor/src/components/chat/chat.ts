import { Component, Vue } from 'vue-property-decorator';
import io from 'socket.io-client';

import './chat.scss';

@Component({
  template: require('./chat.html')
})
export class ChatComponent extends Vue {
  messages: Array<any> = [];
  newMessage: string = '';
  status: string = '';
  socket: any = null;

  created() {
    this.socket = io.connect('http://localhost:3000');

    this.socket.on('error', (message) => {
      console.error(message);
    });

    this.socket.on('connect', () => {
      this.socket
        .emit('authenticate', { token: this.token })
        .on('authenticated', () => {
          this.status = 'connected';
          this.socket.on('message', (message) => {
            const msgList = (<any>this.$refs.messages).$el;
            this.messages.push(message);
            setTimeout(() => {
              msgList.scrollTop = msgList.scrollHeight + 64;
            }, 0);
          });
        })
        .on('unauthorized', function(msg) {
          console.log('unauthorized: ' + JSON.stringify(msg.data));

          throw new Error(msg.data.type);
        });
    });

    'disconnect reconnect reconnecting reconnect_failed'.split(' ').forEach((event) => {
      this.socket.on(event, () => {
        this.status = event;
      });
    });
  }

  get token() {
    return this.$store.state.user.token;
  }
  get displayName() {
    return this.$store.state.user.displayName;
  }
  sendMessage() {
    this.socket.emit('message', 
      { message: this.newMessage, user: this.displayName, type: 'message' });
    this.newMessage = '';
  }
}