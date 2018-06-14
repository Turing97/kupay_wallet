<div class="ga-new-page" ev-back-click="backPrePage" w-class="ga-new-page">
    <app-components-topBar-topBar>{title:"创建钱包"}</app-components-topBar-topBar>
    <div w-class="ga-line20"></div>
    <div w-class="ga-notice-text">注意：密码用于保护私钥和交易授权，fairblock不储存用户密码，如果您忘了密码，我们将无法帮助你重置，请务必牢记。</div>
    <div w-class="ga-registered-container">
        <div w-class="ga-registered-item" ev-input-change="walletNameChange">
            <div w-class="ga-registered-item-label">钱包名称</div>
            <div w-class="ga-input-father"><app-components-input-input>{placeHolder:"钱包名称"}</app-components-input-input></div>
        </div>
        <div w-class="ga-registered-item" ev-input-change="walletPswChange">
            <div w-class="ga-registered-item-label">密码，不少于8位字符，可包含英文、数字、特殊字符</div>
            <div w-class="ga-input-father">
                <app-components-input-input>{itype:"password",placeHolder:"输入密码"}</app-components-input-input>
                <span w-class="ga-password-strength" style="color:{{it1.curWalletPswStrength.color}};">
                    <span w-class="ga-password-strength-label">安全强度:</span>
                    <span w-class="ga-password-strength-text">{{it1.curWalletPswStrength.text}}</span>
                </span>
            </div>
        </div>
       <div w-class="ga-psw-tip-hidden  {{it1.walletPsw.length>0 ? 'ga-psw-tip-show' : ''}}">不少于8位字符，可包含英文、数字、特殊字符</div>
        <div w-class="ga-registered-item" ev-input-change="walletPswConfirmChange">
            <div w-class="ga-registered-item-label">再次输入密码</div>
            <div w-class="ga-input-father"><app-components-input-input>{itype:"password",placeHolder:"再次输入密码"}</app-components-input-input></div>
        </div>
        <div w-class="ga-registered-item" ev-input-change="walletPswTipsChange">
            <div w-class="ga-registered-item-label">密码提示（可不填）</div>
            <div w-class="ga-input-father"><app-components-input-input>{placeHolder:"密码提示（可不填）"}</app-components-input-input></div>
        </div>
        <div w-class="ga-registered-protocol" ev-checkbox-click="checkBoxClick">
            <app-components-checkbox-checkbox>{itype:"false",text:"我已经认证阅读并同意"}</app-components-checkbox-checkbox>
            <span w-class="ga-user-protocol" on-tap="agreementClick">用户协议</span>
        </div>
        <div w-class="ga-wallet-create-btn" on-tap="createWalletClick" style="backgroundColor:{{it1.userProtocolReaded ? '#203260' : '#ccc'}}">创建钱包</div>
        <div w-class="ga-wallet-import-btn" on-tap="importWalletClick">导入钱包</div>
    </div>
</div>