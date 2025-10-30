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
  userdef2: string;
  userdef3: string;
  userdef4: string;
  userdef5: string;
  userdef6: string;
  userdef7: string;
  userdef8: string;
  userdef9: string;
  userdef10: string;
  userdef11: string;
  userdef12: string;
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
  remark: string;
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
  roleName : string;
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

export interface contractInfo {
  billcode: string;
  contracturl: string;
  ctradername: string;
  contracttype: string;
  issigned: number;
  createtime: string;
  signtime: string;
}

// types
export interface RenderOptions {
	className?: string; // 默认和文档样式类的类名/前缀
	inWrapper?: boolean; // 启用在文档内容周围的包装器渲染
	ignoreWidth?: boolean; // 禁用页面宽度渲染
	ignoreHeight?: boolean; // 禁用页面高度渲染
	ignoreFonts?: boolean; // 禁用字体渲染
	breakPages?: boolean; // 启用分页在页面断点上
	ignoreLastRenderedPageBreak?: boolean; // 禁用在lastRenderedPageBreak元素上的分页
	experimental?: boolean; // 启用实验性功能（制表符计算）
	trimXmlDeclaration?: boolean; // 如果为true，将从解析之前的xml文档中移除xml声明
	useBase64URL?: boolean; // 如果为true，图像、字体等将转换为base 64 URL，否则使用URL.createObjectURL
	useMathMLPolyfill?: boolean; // 包括MathML填充，适用于chrome、edge等
	showChanges?: boolean; // 启用文档更改的实验性渲染（插入/删除）
	debug?: boolean; // 启用额外的日志记录
}

export interface Permission {
  permissionCode: string;
  permissionName: string;
  resourceType: string;
  description: string;
  resourcePath: string;
  parentId: number;

}

// 角色信息
export interface SetupRoles {
  roleName: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}


