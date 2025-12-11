
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLogin: false,
    userInfo: {
      id: '',
      username: '',
      avatar: '',
      bio: '',
      create_time: '',
      last_login_time: ''
    },
    accessToken: localStorage.getItem('accessToken') || ''
  }),
  actions: {
    setUserInfo(info) {
      if (!info) return; // 容错：避免传入空值
      this.userInfo = { ...this.userInfo, ...info };
      this.isLogin = !!info.username;
    },
    clearUserInfo() {
      this.userInfo = {
        id: '',
        username: '',
        avatar: '',
        bio: '',
        create_time: '',
        last_login_time: ''
      };
      this.isLogin = false;
      this.accessToken = '';
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');
    },
    initUserInfo() {
      try { // 容错：避免本地缓存解析失败
        const localUser = localStorage.getItem('userInfo');
        if (localUser) {
          const parsedUser = JSON.parse(localUser);
          this.userInfo = parsedUser;
          this.isLogin = true;
        }
      } catch (e) {
        console.error('解析本地用户信息失败：', e);
        this.isLogin = false;
      }
    }
  }
})