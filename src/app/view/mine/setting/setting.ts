/**
 * setting
 */
// =============================================导入
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Forelet } from '../../../../pi/widget/forelet';
import { Widget } from '../../../../pi/widget/widget';
import { getStore, register, setStore } from '../../../store/memstore';
import { hasWallet, logoutAccount, logoutAccountDel, popPswBox } from '../../../utils/tools';
import { backupMnemonic } from '../../../utils/walletTools';
// ================================================导出
// tslint:disable-next-line:no-reserved-keywords
declare var module: any;
export const forelet = new Forelet();
export const WIDGET_NAME = module.id.replace(/\//g, '-');

export class Setting extends Widget {
    public ok: () => void;
    public language: any;
    constructor() {
        super();
    }

    public create() {
        super.create();
        this.init();
    }

    public init() {
        this.language = this.config.value[getLang()];
        const lan = getStore('setting/language', 'zh_Hans');
        const unit = getStore('setting/currencyUnit', 'CNY');
        const color = getStore('setting/changeColor', 'redUp');
        this.props = {
            lockScreenPsw: '',  // 锁屏密码
            openLockScreen: false,  // 是否打开锁屏开关 
            lockScreenTitle: '',  // 锁屏密码页面标题
            numberOfErrors: 0,  // 锁屏密码输入错误次数
            itemList: [
                { title: this.language.itemTitle[0], list: this.language.languageSet, selected: lan, flag: 0 },
                { title: this.language.itemTitle[1], list: this.language.currencyUnit, selected: unit, flag: 1 },
                { title: this.language.itemTitle[2], list: this.language.changeColor, selected: color, flag: 2 }
            ],
            wallet: null
        };
        this.initData();
    }

    public initData() {
        const wallet = getStore('wallet');
        if (wallet) {
            this.props.wallet = wallet;
        }
        const ls = getStore('setting/lockScreen');
        if (ls) {
            this.props.lockScreenPsw = ls.psw;
            this.props.openLockScreen = ls.psw && ls.open !== false;
        }

        this.paint();
    }

    public backPrePage() {
        this.ok && this.ok();
    }
    /**
     * 处理锁屏开关切换
     */
    public onSwitchChange() {
        if (this.props.openLockScreen) {   // 如果锁屏开关打开则直接关闭
            const ls = getStore('setting/lockScreen');
            ls.open = !ls.open;
            this.props.openLockScreen = false;
            setStore('setting/lockScreen', ls);
        } else if (this.props.wallet) {
            popNew('app-components1-lockScreenPage-lockScreenPage', { setting: true }, (r) => {
                if (!r) {
                    this.closeLockPsw();
                    this.props.openLockScreen = false;
                } else {
                    this.props.openLockScreen = true;
                }
            });
        } else {
            // tslint:disable-next-line:max-line-length
            popNew('app-components1-modalBox-toLoginBox', undefined, () => {
                popNew('app-view-wallet-create-home');
            }, () => {
                this.closeLockPsw();
            });
        }

        this.paint(true);
    }

    /**
     * 关闭锁屏开关
     */
    public closeLockPsw() {
        this.props.openLockScreen = false;
        this.props.lockScreenPsw = '';
        this.paint();
    }

    /**
     * 点击切换基础属性 
     */
    public itemClick(ind: number) {
        // if (!hasWallet()) return;
        const data = this.props.itemList[ind];
        popNew('app-view-mine-setting-itemList', data);
    }

    /**
     * 备份
     */
    public async backUp() {
        const psw = await popPswBox();
        if (!psw) return;
        const ret = await backupMnemonic(psw);
        if (ret) {
            popNew('app-view-wallet-backup-index', { ...ret,pi_norouter:true });
            this.ok && this.ok();
        }
    }

    /**
     * 退出账户不删除信息
     */
    public logOut() {
        if (!hasWallet()) return;
        // const backup = this.props.wallet.isBackup;
        popNew('app-components1-modalBox-modalBox', this.language.modalBox2 , () => {
            // if (!backup) {
            //     this.backUp();
            // }
            console.log('取消');
        }, () => {
            popNew('app-components1-modalBox-modalBox', { title: '', content: this.language.tips[2], style: 'color:#F7931A;' }, () => {
                logoutAccount();
                this.backPrePage();
            });
        });
    }

    /**
     * 注销账户
     */
    public logOutDel() {
        if (!hasWallet()) return;
        // const backup = this.props.wallet.isBackup;
        popNew('app-components1-modalBox-modalBox', this.language.modalBox3 , () => {
            // if (!backup) {
            //     this.backUp();
            // }
            console.log('取消');
        }, () => {
            popNew('app-components1-modalBox-modalBox', { title: '', content: this.language.tips[2], style: 'color:#F7931A;' }, () => {
                logoutAccountDel();
                this.backPrePage();
            });
        });
    }
}

// ================================================本地，立即执行
register('setting/language', (r) => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.language = w.config.value[r];
        w.init();
    }
});
register('setting/currencyUnit', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});
register('setting/changeColor', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});
register('setting/lockScreen', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});
register('wallet', () => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.initData();
    }
});

register('user',() => {
    const w: any = forelet.getWidget(WIDGET_NAME);
    if (w) {
        w.init();
    }
});
