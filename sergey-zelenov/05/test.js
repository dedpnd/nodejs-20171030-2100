const users = [
  {name: 'ivan1'},
  {name: 'ivan2'},
  {name: 'ivan3'},
  {name: 'ivan4'},
  {name: 'ivan5'},
];

const usersByName = {
  'ivan5': users[4]
};
// O(1), O(lg(N))
// const u = users.find(...)
const u = usersByName['ivan5'];
