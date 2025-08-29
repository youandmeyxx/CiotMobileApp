import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { userDetail, userInfo } from '@/views/components/support/interface'


export const userInfoDetailStore = defineStore('userInfoDetail',{
  state() {
    return {
      userInfoDetail: ref<userDetail>({
        userid: '',
        mobile: '',
        password: '',
        name: '',
        gender: 0,
        email: '',
        avatar: '',
        qrCode: '',
      }),
    }
  }
})

export const userInfoStore = defineStore('userInfo',{
  state(){
    return {
      userInfo: ref<userInfo>({
        userid: '',
        name: '',
        position: '',
      }),
    }
  }
})

