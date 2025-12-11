// src/stores/user.js
import { defineStore } from 'pinia';
import request from '@/utils/request';

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      id: '',
      username: '',
      avatar: '',
      token: localStorage.getItem('accessToken') || ''
    },
    isLogin: false
  }),
  actions: {
    setUserInfo(data) {
      this.userInfo = { ...this.userInfo, ...data };
      this.isLogin = true;
      if (data.token) localStorage.setItem('token', data.token);
    },
    logout() {
      this.userInfo = { id: '', username: '', avatar: '', token: '' };
      this.isLogin = false;
      localStorage.removeItem('token');
    },
    async fetchUserInfo() {
      if (!this.userInfo.token) return;
      try {
        // 核心修改：接口路径改为/userinfo
        const res = await request({
          url: '/userinfo',  // 原路径：/user/info/
          method: 'GET'
        });
        this.setUserInfo(res.data);
      } catch (error) {
        console.error('获取用户信息失败：', error);
        this.logout();
      }
    }
  }
});