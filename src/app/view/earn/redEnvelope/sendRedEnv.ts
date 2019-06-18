/**
 * sendRedEnv
 */
import { ShareType } from '../../../../pi/browser/shareToPlatforms';
import { popNew } from '../../../../pi/ui/root';
import { getLang } from '../../../../pi/util/lang';
import { Widget } from '../../../../pi/widget/widget';
import { sharePerUrl } from '../../../config';
import { getStoreData } from '../../../middleLayer/memBridge';
import { LuckyMoneyType } from '../../../publicLib/interface';

interface Props {
    rid: string;
    rtype:string;  // '00' 等额红包  '01' 拼手气红包  '99' 邀请码
    message: string;
}
export class SendRedEnv extends Widget {
    public props: Props;
    public language:any;
    public ok: () => void;

    public create() {
        super.create();
        this.language = this.config.value[getLang()];
    }

    /**
     * 发红包
     */
    public async sendRedEnv() {
        const [lan,user] = await Promise.all([getStoreData('setting/language','zh_Hans'),getStoreData('user')]);
        let url = '';
        let title = '';
        const accId = user.info.acc_id;
        const uid = user.conUid;
        if (this.props.rtype === '00') {
            // tslint:disable-next-line:max-line-length
            url = `${sharePerUrl}?type=${LuckyMoneyType.Normal}&rid=${this.props.rid}&uid=${uid}&accId=${accId}&lm=${(<any>window).encodeURIComponent(this.props.message)}&lan=${lan}`;
            title = this.language.redEnvType[0]; 
        } else if (this.props.rtype === '01') {
            // tslint:disable-next-line:max-line-length
            url = `${sharePerUrl}?type=${LuckyMoneyType.Random}&rid=${this.props.rid}&uid=${uid}&accId=${accId}&lm=${(<any>window).encodeURIComponent(this.props.message)}&lan=${lan}`;
            title = this.language.redEnvType[1]; 
        } else {
            url = `${sharePerUrl}?cid=${this.props.rid}&type=${LuckyMoneyType.Invite}&lan=${lan}`;
            title = this.language.redEnvType[2];
        }
        popNew('app-components-share-share', { 
            shareType: ShareType.TYPE_LINK,
            url,
            title,
            content:this.props.message
        },() => {
            this.backPrePage();
        },() => {
            this.backPrePage();
        });
        console.error(url);
    }

    public backPrePage() {
        this.ok && this.ok();
    }
}