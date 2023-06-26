
// To be Rechecked
const storagePrefix = 'dash_forum_';

const storage = {
  getToken: () => {
    return JSON.parse(window.sessionStorage.getItem(`${storagePrefix}token`) as string);
  },
  setToken: (token: string) => {
    window.sessionStorage.setItem(`${storagePrefix}token`, JSON.stringify(token));
  },
  clearToken: () => {
    window.sessionStorage.clear();
  },
  setUser: (user: any)=>{
    window.sessionStorage.setItem(`${storagePrefix}user`, JSON.stringify(user));
  },
  getUser: ()=>{
    return JSON.parse(window.sessionStorage.getItem(`${storagePrefix}user`) as string);
  },
  clearUser: () => {
    window.sessionStorage.clear();
  }
};

export default storage;