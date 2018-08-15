import { isArray } from '../../pi/net/websocket/util';
import { formatBalance, kpt2kt, smallUnit2LargeUnit } from '../utils/tools';
import { AccountDetail, CurrencyType, CurrencyTypeReverse, TaskSid } from './interface';

/**
 * 解析数据
 */
// ===================================================== 导入
// ===================================================== 导出
/**
 * 解析云端账号余额
 */
export const parseCloudBalance = (balanceInfo): Map<CurrencyType, number> => {
    const m = new Map<CurrencyType, number>();
    for (let i = 0; i < balanceInfo.value.length; i++) {
        const each = balanceInfo.value[i];
        m.set(each[0], smallUnit2LargeUnit(CurrencyTypeReverse[each[0]], each[1]));
    }

    return m;
};

/**
 * 解析云端账号详情
 */
export const parseCloudAccountDetail = (coinType: CurrencyType, infos): AccountDetail[] => {
    const list = [];
    infos.forEach(v => {
        const itype = v[0];
        const amount = formatBalance(smallUnit2LargeUnit(CurrencyTypeReverse[coinType], v[1]));
        let behavior = '';
        if (itype === TaskSid.redEnvelope) {
            if (amount > 0) {
                behavior = '领红包';
            } else {
                behavior = '发红包';
            }
        } else {
            behavior = isArray(v[2]) ? v[2].map(v1 => String.fromCharCode(v1)).join('') : v[2];
        }
        list.push({
            itype,
            amount,
            behavior,
            time: v[3]
        });
    });

    return list;
};

/**
 * 处理矿山排名列表
 */
export const parseMineRank = (data) => {
    const mineData: any = {
        mineSecond: false,
        mineThird: false,
        minePage: 1,
        mineMore: false,
        mineList: data.value,
        mineRank: [
            {
                index: 1,
                name: '昵称未设置',
                num: '0'
            }
        ],
        myRank: data.me
    };
    if (data.value.length > 10) {
        mineData.mineMore = true;
        mineData.mineSecond = true;
        mineData.mineThird = true;
    } else if (data.value.length > 2) {
        mineData.mineSecond = true;
        mineData.mineThird = true;
    } else if (data.value.length > 1) {
        mineData.mineSecond = true;
    }
    const data1 = [];
    for (let i = 0; i < data.value.length && i < 10; i++) {
        data1.push({
            index: i + 1,
            name: data.value[i][1] === '' ? '昵称未设置' : data.value[i][1],
            num: kpt2kt(data.value[i][2])
        });
    }
    mineData.mineRank = data1;
    
    return mineData;
};

/**
 * 处理挖矿排名列表
 */
export const parseMiningRank = (data) => {
    const miningData: any = {
        miningSecond: false,
        miningThird: false,
        miningFirst: true,
        miningPage: 1,
        miningMore: false,
        miningList: data.value,
        miningRank: [
            {
                index: 1,
                name: '昵称未设置',
                num: '0'
            }
        ]
    };
    if (data.value === '') {
        miningData.miningFirst = false;
        
        return miningData;
    }

    if (data.value.length > 10) {
        miningData.miningMore = true;
        miningData.miningSecond = true;
        miningData.miningThird = true;
    } else if (data.value.length > 2) {
        miningData.miningSecond = true;
        miningData.miningThird = true;
    } else if (data.value.length > 1) {
        miningData.miningSecond = true;
    }
    const data2 = [];
    for (let i = 0; i < data.value.length && i < 10; i++) {
        data2.push({
            index: i + 1,
            name: data.value[i][1] === '' ? '昵称未设置' : data.value[i][1],
            num: kpt2kt(data.value[i][2])
        });
    }
    miningData.miningRank = data2;
    
    return miningData;
};

/**
 * 
 */
export const parseMineDetail = (detail) => {
    const list = [
        {
            isComplete: false,
            itemNum: 0
        }, {
            isComplete: false,
            itemNum: 0
        }, {
            isComplete: false,
            itemNum: 0
        }, {
            isComplete: false,
            itemNum: 0
        }, {
            isComplete: false,
            itemNum: 0
        }, {
            isComplete: false,
            itemNum: 0
        }
    ];
    if (detail.value.length !== 0) {
        for (let i = 0; i < detail.value.length; i++) {
            if (detail.value[i][0] === TaskSid.createWlt) {// 创建钱包
                list[0].isComplete = true;
                list[0].itemNum = kpt2kt(detail.value[i][1]);
            } else if (detail.value[i][0] === TaskSid.bindPhone) {// 注册手机号
                list[1].isComplete = true;
                list[1].itemNum = kpt2kt(detail.value[i][1]);
            } else if (detail.value[i][0] === TaskSid.chargeEth) {// 存币
                list[2].itemNum = kpt2kt(detail.value[i][1]);
            } else if (detail.value[i][0] === TaskSid.inviteFriends) {// 与好友分享
                list[3].itemNum = kpt2kt(detail.value[i][1]);
            } else if (detail.value[i][0] === TaskSid.buyFinancial) {// 购买理财
                list[4].itemNum = kpt2kt(detail.value[i][1]);
            } else if (detail.value[i][0] === TaskSid.chat) {// 聊天
                list[5].isComplete = true;
                list[5].itemNum = kpt2kt(detail.value[i][1]);
            }
        }
    }

    return list;
};
// ===================================================== 本地
// ===================================================== 立即执行