import { DOMAIN_RUL } from "@/plugins/globalVariables";
import router from "@/router";
import { userInfoDetailStore, userInfoStore, userPermissionStore } from "@/stores/userInfoDetail";
import axios from "axios";

const userInfoDetail = userInfoDetailStore();
const userInfo = userInfoStore();
const userPermission = userPermissionStore();

export function getRandomInt() {
}

/**
 * 获取当前日期，格式为 YYYY-MM-DD。
 * 
 * @returns {string} 当前日期的字符串，格式为 YYYY-MM-DD。
 */
export function nowDate() {
  // 创建一个新的 Date 对象，获取当前日期和时间
  const date = new Date();
  // 获取当前年份
  const year = date.getFullYear();
  // 获取当前月份（注意：月份从 0 开始，所以要加 1），并确保为两位数
  const month = String(date.getMonth() + 1).padStart(2, '0');
  // 获取当前日期，并确保为两位数
  const day = String(date.getDate()).padStart(2, '0');
  // 返回格式化后的日期字符串
  return `${year}-${month}-${day}`;
}

/**
 * 生成一个随机的 10 位字符串作为随机数（nonce）。
 * 随机数通常用于安全和防重放攻击，确保请求的唯一性。
 * 
 * @returns {string} 一个 10 位的随机字符串。
 */
export function generateNonce() {
  // 使用 Math.random() 生成一个随机数，转换为 36 进制字符串，并截取第 3 位开始的 10 个字符
  return Math.random().toString(36).substr(2, 10);
}

/**
 * 从 sessionStorage 中获取用户信息，并检查信息是否过期。
 * 如果未过期，将信息设置到相应的存储中；如果过期，清除存储的数据并跳转到登录页面。
 */
export const getUserinfoFromSession = () => {
  // 从 sessionStorage 中获取 userInfoDetail 数据
  const storedData = sessionStorage.getItem('userInfoDetail');
  // 从 sessionStorage 中获取 userInfo 数据
  const storedUserInfo = sessionStorage.getItem('userInfo');      
  // 检查 userPermission 数据是否存在
  const storedUserPermission = sessionStorage.getItem('userPermission');
  // 检查 userInfoDetail 数据是否存在
  if (storedData) {
    // 解析存储的 JSON 数据
    const parsedData = JSON.parse(storedData);
    // 检查数据是否未过期
    if (parsedData.expiration > Date.now()) {
      // 将未过期的 userInfoDetail 数据设置到相应的存储中
      userInfoDetail.userInfoDetail = parsedData.data;
      // 检查 userInfo 数据是否存在
      if (storedUserInfo) {
        // 将 userInfo 数据解析并设置到相应的存储中
        userInfo.userInfo = JSON.parse(storedUserInfo);
      } 
      if (storedUserPermission) {
        // 将 userPermission 数据解析并设置到相应的存储中
        userPermission.rolePermissions = JSON.parse(storedUserPermission);
      }
    } else {
      // 数据已过期，清除 sessionStorage 中的 userInfoDetail 数据
      sessionStorage.removeItem('userInfoDetail');
      // 数据已过期，清除 sessionStorage 中的 userInfo 数据
      sessionStorage.removeItem('userInfo');
      // 数据已过期，清除 sessionStorage 中的 userPermission 数据
      sessionStorage.removeItem('userPermission');
      // 跳转到登录页面
      router.push("/home");
    }
  }
}

export const setUserInfoToSession = () => {
  // 将 userInfoDetail 存入 sessionStorage，并设置过期时间
  const expirationTime = Date.now() + 3 * 60 * 60 * 1000; // 3 小时后过期
  const dataToStore = {
    data: userInfoDetail.userInfoDetail,
    expiration: expirationTime
  };
  sessionStorage.setItem('userInfoDetail', JSON.stringify(dataToStore));
  sessionStorage.setItem('userInfo', JSON.stringify(userInfo.userInfo));
  sessionStorage.setItem('userPermission', JSON.stringify(userPermission.rolePermissions));
}


export function bytesToSize (flowVlueBytes: number){
  var size = '';
  var x = flowVlueBytes ? flowVlueBytes : 0;
  if (Number((x / 1024 / 1024).toFixed(2)) >= 1) {
    size = (x / 1024 / 1024).toFixed(2) + 'GB';
  } else {
    size = (x / 1024).toFixed(2) + 'MB';
    // size = x + "MB";
  }
  var sizestr = size + '';
  var len = sizestr.indexOf('.');
  var dec = sizestr.substr(len + 1, 2);
  if (dec == '00') {
    //当小数点后为00时 去掉小数部分
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }
  return sizestr;
}