/**
 * 处理提示信息
 */
import { popNew } from '../../pi/ui/root';

/**
 * 显示错误信息
 */
export const showError = (result, str?) => {
    if (result === 1) return;
    if (!str) {
        switch (result) {
            case 600: str = '数据库错误'; break;
            case 711: str = '兑换码不存在'; break;
            case 712: str = '兑换码已兑换'; break;
            case 713: str = '兑换码已过期'; break;
            case 2010: str = '无法兑换自己的兑换码'; break;
            case -1: str = '无效的兑换码'; break;
            case -2: str = '你已经兑换了同类型的兑换码'; break;
            default: str = '出错啦';

        }
    }

    popNew('app-components-message-message', { itype: 'error', center: true, content: str });
};

/**
 * 显示错误信息
 * @param err 错误对象
 */
export const doErrorShow = (err:Error) => {
    if (!err) return;
    let showStr = '';
    switch (err.message) {
        case 'Invalid Mnemonic' : showStr = '密码错误';break;
        default: showStr = `出错啦`;
    }
    popNew('app-components-message-message', { itype: 'error', center: true, content: showStr });
};