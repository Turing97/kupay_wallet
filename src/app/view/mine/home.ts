/**
 * mine home page
 */
import { popNew } from '../../../pi/ui/root';
import { notify } from '../../../pi/widget/event';
import { Widget } from '../../../pi/widget/widget';
import { getCurrentWallet, getLocalStorage } from '../../utils/tools';

export class Home extends Widget {
    constructor() {
        super();
    }
    public create() {
        super.create();
        this.init();
    }
    public init() {
        this.state = {
            hasNews: true,
            mineList: [{
                icon: 'icon_mine_wallet.png',
                text: '我的钱包',
                components: 'app-view-mine-walletManagement-walletManagement'
            }, {
                icon: 'icon_mine_annal.png',
                text: '交易记录',
                components: 'app-view-mine-transaction-record'
            }, {
                icon: 'icon_mine_address.png',
                text: '地址管理',
                components: 'app-view-mine-addressManage-addressManage'
            }, {
                icon: 'icon_mine_Language.png',
                text: '语言设置',
                components: 'app-view-mine-languageAndcoinset-language'
            }, {
                icon: 'icon_mine_money.png',
                text: '货币设置',
                components: 'app-view-mine-languageAndcoinset-coinset'
            }, {
                icon: 'icon_mine_problem.png',
                text: '常见问题',
                components: 'app-view-mine-FAQ-FAQ'
            }, {
                icon: 'icon_mine_about.png',
                text: '关于我们',
                components: 'app-view-mine-aboutus-aboutus'
            }, {
                icon: 'icon_mine_share.png',
                text: '分享下载链接',
                components: 'app-view-financialManagement-fund-share'
            }]
        };
    }

    public itemClick(e:any, index:number) {
        if (index <= 2) {
            const wallets = getLocalStorage('wallets');
            const wallet = getCurrentWallet(wallets);
            if (!wallet) {
                popNew('app-view-wallet-switchWallet-switchWallet');

                return;
            }
        }
        popNew(this.state.mineList[index].components,{},(home) => {
            if (home) {
                notify(this.tree,'ev-change-tab',{ index:0 });
            }
            
        });
    }

    public goNotice(event: any) {
        popNew('app-view-messageList-messageList', { hasNews: this.state.hasNews }, (r) => {
            if (r) {
                this.state.hasNews = false;
                this.paint();
            }
        });
    }
}