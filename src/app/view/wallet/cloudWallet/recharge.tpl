<div class="new-page" w-class="new-page" ev-back-click="backPrePage">
    <div w-class="top-head">
        {{: topBarTitle = {"zh_Hans":it.currencyName +"充值","zh_Hant":it.currencyName +"充值","en":""} }}
        <app-components1-topBar-topBar>{"title":{{topBarTitle}},background:"linear-gradient(to right,#38CFE7,#318DE6)"}</app-components1-topBar-topBar>
        <div w-class="head2">
            <div w-class="item">
                <img src="../../../res/image/local_wallet.png" w-class="icon" />
                <div w-class="text">
                    <pi-ui-lang>{"zh_Hans":"本地钱包","zh_Hant":"本地錢包","en":""}</pi-ui-lang>
                </div>
            </div>
            <div w-class="arow">
                <img src="../../../res/image/left_arrow_white.png" />
            </div>
            <div w-class="item">
                <img src="../../../res/image/cloud_wallet.png" w-class="icon" />
                <div w-class="text">
                    <pi-ui-lang>{"zh_Hans":"云账户","zh_Hant":"雲賬戶","en":""}</pi-ui-lang>
                </div>
            </div>
        </div>
    </div>
    <div w-class="body">
        <div w-class="main">
            <div w-class="item1">
                {{: phrase = [
                    {"zh_Hans":"充值金额","zh_Hant":"充值金額","en":""},
                    {"zh_Hans":"余额：","zh_Hant":"餘額：","en":""},
                    {"zh_Hans":"到账速度","zh_Hant":"到賬速度","en":""},
                    {"zh_Hans":"矿工费","zh_Hant":"礦工費","en":""},
                    {"zh_Hans":"余额不足","zh_Hant":"餘額不足","en":""}] }}
                <div w-class="inner-tip">
                    <span style="position:relative">
                        <img src="app/res/image/currency/{{it.currencyName}}.png" width="32px" w-class="input-icon"/>
                        <widget w-tag="pi-ui-lang" style="padding-left:40px">{{phrase[0]}}</widget>
                    </span>
                    <span w-class="balance"><pi-ui-lang>{{phrase[1]}}</pi-ui-lang>&nbsp;{{it1.balance%1===0?it1.balance.toFixed(2):it1.balance}}</span>
                </div>
                <div w-class="input-father" ev-input-change="amountChange">
                    {{: inputPlace = {"zh_Hans":"输入金额","zh_Hant":"輸入金額","en":""} }}
                    <div w-class="balance-value">≈{{it1.currencyUnitSymbol+" "+it1.amountShow}}</div>
                    <app-components1-input-input>{itype:"number",placeHolder:{{inputPlace}},style:"padding:0;background:transparent;",input:{{it1.amount}},disabled:{{it1.inputDisabled}}}</app-components1-input-input>
                </div>
            </div>
            <div w-class="item1" style="border:none;">
                <div w-class="inner-tip" >
                    <pi-ui-lang>{{phrase[2]}}</pi-ui-lang>
                    <span w-class="speed" on-tap="chooseMinerFee">
                        <widget w-tag="pi-ui-lang" style="margin-right:10px;">{{it1.minerFeeList[it1.curLevel].text}}</widget>
                        <img src="../../../res/image/down_arrow_gray.png" w-class="input-icon" width="32px" style="translateX(-50%)"/>
                    </span>
                </div>
            </div>
            <div w-class="choose-fee">
                <widget w-tag="pi-ui-lang" style="margin-right:10px;">{{phrase[3]}}</widget>
                <span w-class="fee">{{it1.minerFee+it.currencyName}}</span>
                <img src="../../../res/image/41_gray.png" on-tap="speedDescClick" style="border: 20px solid transparent;margin: -20px;width: 32px;transform: translateY(5%);"/>
                
            </div>
            <div w-class="bottom-container">
                {{if it1.balance <= it1.amount + it1.minerFee}}
                <div w-class="tip"><pi-ui-lang>{{phrase[4]}}</pi-ui-lang></div>
                {{end}}
                <div ev-btn-tap="nextClick" w-class="btn">
                    {{: btnName = {"zh_Hans":"充值到云端","zh_Hant":"充值到雲端","en":""} }}
                    <app-components1-btn-btn>{"name":{{btnName}},"types":"big","color":"blue"}</app-components1-btn-btn>
                </div>
            </div>    
        </div>
    </div>
</div>