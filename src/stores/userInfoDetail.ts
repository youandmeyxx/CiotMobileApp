/*
 * @Author: youandmeyxx 86011640@qq.com
 * @Date: 2025-09-28 13:05:07
 * @LastEditors: youandmeyxx 86011640@qq.com
 * @LastEditTime: 2025-10-27 13:13:41
 * @FilePath: \CiotMobileApp\src\stores\userInfoDetail.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { userDetail, userInfo,Permission } from '@/views/components/support/interface'

/**
 * 用户信息详情
 */
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
        roleName: '',
      }),
    }
  }
})
/**
 * 用户信息
 */
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

export const userPermissionStore = defineStore('userPermission',{
  state(){
    return {
      rolePermissions: ref<Permission[]>([]),
    }
  }
})

