export interface setuprecord {
    billcode : string;
    tel: string;
    addr: string;
    contact: string;
    operator: string;
    cusname: string;
    topology: string;
    carrier: string;
    realnametype: string;
    routertype: string;
    routername: string;
    aftersetup: string;
    setupdate: string;
    recorddate: string;
    picurl: string;
    wxpicurl: string;
    jobid: number;
    assigntype: string;
    verifytype: string;
    billto: string;
    empname: string;
    remark: string;
};

export interface SaleBill {
  billcode: string;
  billdate: string;
  billid: string;
  billstatusname  : string;
  billto: string;
  ctradername: string;
  depname: string;
  empname: string;
  operator : string;
  jobdate: string;
  jobtime: string;
  assigntype: string;
  jobid: number;
  userdef1: string;
}

export interface SaleBillDetail {
  billid: string;
  goodscode: string;
  goodsname: string;
  specs: string;
  unitname: string;
  unitquantity: number;
  unitprice: number;
  userdef7: string;
  userdef8: string;
  userdef1: string;
}

export interface Message {
  msgId: number;
  userName: string;
  msgType : string;
  msgContent: string;
  msgDate: string;
  msgUrl : string;
  msgReadStatus: number;
}


export interface CalendarValue {
    getFullYear: () => number;
    getMonth: () => number;
    getDate: () => number;
  };

export interface Option{
    text:string,
    value:string,
  };

export interface userDetail {
  userid: string;
  password: string;
  name: string;
  mobile: string;
  email: string;
  gender : number;
  avatar : string;
  qrCode : string;
}

export interface userInfo {
  userid: string;
  name: string;
  position: string;
}

export interface CardStatuInfo {
  iccid: string;
  MSISDN: string;
  IMEI: string;
  apnName: string;
  speedLimitStatus:   string;
  serviceStatus:  string;
  monthlyUsage:   string;
  groupName:  string;
  areaRestriction:  string;
  areaRestrictType:   string;
  restrictionStatus:    string;
  cardSeparationStatus:   string;
  iotStatus:  string;
  cardStatus:  string;
  realNameStatus:   string;
  stopReason:  string;
}

export interface CardInfoMeta {
  cardId: number;
  iccidCode: string;
  accessCode: string;
  cardStatus: string;
  validTime: string;
  invalidTime: string;
  usedFlow: string;
  flowQuota: string;
  packageName: string;
  leftFlow: string;
  cardType: string;
  cardSource: string;
}

export interface GroupInfo {
  offeringId: string;
  offeringName: string;
  remainAmount: number;
  totalAmount: number;
  useAmount: number;
}

export interface SendModel {
  touser: string;
  toparty: string;
  totag: string;
  msgtype: string;
  agentid: number;
  text: {
    content: string;
  };
  safe: number;
  enable_id_trans: number;
  enable_duplicate_check: number;
  duplicate_check_interval: number;

}

export interface cardFlowPackage{
  packageId: string;
  packageName: string;
  packageType: string;
  packageFlow: number;
}

export interface kaiDanReport {
  typename: string;
  billdate: string;
  billcode: string;
  ctradername: string;
  empname: string;
  extendname: string;
  bunit: string;
  quantity: string;
  price: string;
  amount: string;
  referamt: string;
  scamt: string;
  remark: string;
  remark1: string;
  skBillcode: string;
}

