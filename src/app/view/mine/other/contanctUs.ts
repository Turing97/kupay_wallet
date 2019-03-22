/**
 * 联系我们
 */
// ===============================================导入
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { openNewActivity } from '../../../logic/native';
import { getModulConfig } from '../../../modulConfig';
import { rippleShow } from '../../../utils/tools';
// ==================================================导出
declare var pi_update;
export class ContanctUs extends Widget {
    public ok: () => void;
    public create() {
        super.create();
        const tips = { zh_Hans:'客服',zh_Hant:'客服',en:'' };
        this.props = {
            version:pi_update.updateJson.version,
            data:[
                { value: '',desc:getModulConfig('WALLET_WEBSITE') },
                { value: '',desc:getModulConfig('WALLET_NAME') + tips[getLang()] },
                { value: '',desc:getModulConfig('WALLET_NAME') }
            ],
            walletLogo:getModulConfig('WALLET_LOGO'),
            walletName:getModulConfig('WALLET_NAME')
        };
    }

    public backPrePage() {
        this.ok && this.ok();
    }

    // 动画效果执行
    public onShow(e:any) {
        rippleShow(e);
    }
    
    public itemClick(e:any,ind:any) {
        switch (ind) {
            // 点击钱包官网
            case 0:
                openNewActivity(this.props.data[0].desc,this.props.walletName);
                break;
            // KuPay小助手
            case 1:
                popNew('app-view-mine-other-wechatQrcode',{ fg:0 });
                break;
            // KuPay公众号
            case 2:
                popNew('app-view-mine-other-wechatQrcode',{ fg:1 });
                break;
            default:
                console.log(this.props.cfgData.tips);
        }
    }
}