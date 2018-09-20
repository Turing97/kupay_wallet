/**
 * add asset 
 */
import { Widget } from "../../../../pi/widget/widget";
import { fetchWalletAssetListAdded, getCurrentAddrInfo } from "../../../utils/tools";
import { find, updateStore } from "../../../store/store";
import { dataCenter } from "../../../logic/dataCenter";

export class AddAsset extends Widget{
    public ok:()=>void;
    public create() {
        super.create();
        this.init();
    }
    public init() {
        const assetList = fetchWalletAssetListAdded()
        this.state = {
            assetList,
            searchText:"",
            showAssetList:assetList
        };
        console.log(this.state);
    }
    public backPrePage(){
        this.ok && this.ok();
    }
    /**
     * 处理滑块改变
     */
    public onSwitchChange(e: any, index: number) {
        const added = e.newType;
        const currencys = this.state.assetList[index];
        currencys.added = added;
        this.paint();

        // 处理search数据
        const wallet = find('curWallet');
        const showCurrencys = wallet.showCurrencys || [];
        const oldIndex = showCurrencys.indexOf(currencys.currencyName);
        if (added && oldIndex < 0) {
            showCurrencys.push(currencys.currencyName);
            const curAddr = getCurrentAddrInfo(currencys.currencyName)
            dataCenter.updateAddrInfo(curAddr.addr, currencys.currencyName);
        } else{
            showCurrencys.splice(oldIndex, 1);
        }
        wallet.showCurrencys = showCurrencys;

        updateStore('curWallet', wallet);
    }

    public searchTextChange(e:any){
        this.state.searchText = e.value;
        if (this.state.searchText) {
            this.state.showAssetList = this.state.assetList.filter(v => v.currencyName.toLowerCase().indexOf(this.state.searchText.toLowerCase()) >= 0);
        }else{
            this.state.showAssetList = this.state.assetList;
        }
        this.paint();
    }

    public searchTextClear(){
        this.state.showAssetList = this.state.assetList;
        this.paint();
    }
    public searchClick(){
        
    }
}