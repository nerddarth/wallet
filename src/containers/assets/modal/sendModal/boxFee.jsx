import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  setModalAssets,
  setAddressModalStep,
  setAssetsSendModalFinalAmount,
  setAssetsSendModalLoading,
  setAssetsSendModalSelectedFee,
  setAssetsSendModalSelectedFeeLunes,
  setAssetsSendModalSelectedFeePerByte
} from "../../redux/assetsAction";
import { errorInput } from "../../../errors/redux/errorAction";

// COMPONENTS
import ButtonContinue from "./buttonContinue.jsx";

// UTILS
import i18n from "../../../../utils/i18n";

// STYLE
import style from "../../style.css";

class BoxFee extends React.Component {
  constructor() {
    super();
    this.state = {
      error: 0
    };
  }

  calcFee = type => {
    let {
      setAssetsSendModalSelectedFee,
      setAssetsSendModalSelectedFeeLunes,
      setAssetsSendModalSelectedFeePerByte,
      errorInput,
      modal,
      coin,
      coins
    } = this.props;
    if (
      modal.feeValue.fee[type] + modal.sendAmount >=
      coins[coin].balance.available
    ) {
      errorInput("Insufficient funds");
      return;
    }

    setAssetsSendModalSelectedFee(modal.feeValue.fee[type]);
    setAssetsSendModalSelectedFeeLunes(modal.feeValue.feeLunes[type]);
    setAssetsSendModalSelectedFeePerByte(modal.feeValue.feePerByte[type]);
    return;
  };

  confirmFee = () => {
    let {
      modal,
      errorInput,
      setAddressModalStep,
      setAssetsSendModalLoading,
      setAssetsSendModalFinalAmount
    } = this.props;
    let feeAmount = modal.feeValue.selectedFee;
    let amount = modal.sendAmount + (feeAmount ? feeAmount : 0);

    if (feeAmount) {
      setAssetsSendModalLoading();
      setAssetsSendModalFinalAmount(amount.toFixed(8));
      setAddressModalStep(3);

      return;
    }

    errorInput(i18n.t("MESSAGE_SELECT_FEE"));
    return;
  };

  render() {
    let { coin, modal } = this.props;
    let selectedFee = modal.feeValue.selectedFee
      ? modal.feeValue.selectedFee
      : 0;
    let amount = (modal.sendAmount + selectedFee).toFixed(8);

    return (
      <div className={style.modalBox}>
        <img
          src={"/images/icons/coins/" + coin + ".png"}
          className={style.modalIconCoin}
        />
        <div>
          <span>{i18n.t("MODAL_SEND_TO_SEND")}</span>
          <span className={style.totalConfirm}>
            {" " + amount + " " + coin.toUpperCase()}
          </span>
        </div>
        <div>
          <span>{i18n.t("MODAL_SEND_TO_ADDRESS")} </span>
          <span className={style.addressConfirm}>{modal.address}</span>
        </div>

        <div className={style.confirmFee}>
          <div>
            {i18n.t("MODAL_SEND_FEE_TRANSACTION")}
            <span> {coin.toUpperCase()} </span>
            {i18n.t("TEXT_IS")}
          </div>
          <div className={style.txtamount}>{selectedFee}</div>
        </div>

        <div className={style.boxFee}>
          <span
            className={style.greenLabelFee}
            onClick={() => this.calcFee("low")}
          >
            {i18n.t("TEXT_LOW")} {modal.feeValue.fee.low || "-"}
          </span>
          <span
            className={style.yellowLabelFee}
            onClick={() => this.calcFee("medium")}
          >
            {i18n.t("TEXT_MEDIUM")} {modal.feeValue.fee.medium || "-"}
          </span>
          <span
            className={style.redLabelFee}
            onClick={() => this.calcFee("high")}
          >
            {i18n.t("TEXT_HIGH")} {modal.feeValue.fee.high || "-"}
          </span>
        </div>

        <div className={style.paddingTop8}>
          <ButtonContinue
            action={() => this.confirmFee()}
            loading={modal.loading}
          />
        </div>
      </div>
    );
  }
}

BoxFee.propTypes = {
  modal: PropTypes.object.isRequired,
  coin: PropTypes.string.isRequired,
  coins: PropTypes.array.isRequired,
  errorInput: PropTypes.func.isRequired,
  setAddressModalStep: PropTypes.func.isRequired,
  setAssetsSendModalLoading: PropTypes.func.isRequired,
  setAssetsSendModalFinalAmount: PropTypes.func.isRequired,
  setAssetsSendModalSelectedFee: PropTypes.func.isRequired,
  setAssetsSendModalSelectedFeeLunes: PropTypes.func.isRequired,
  setAssetsSendModalSelectedFeePerByte: PropTypes.func.isRequired
};

const mapSateToProps = store => ({
  modal: store.assets.modal,
  coins: store.skeleton.coins
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setModalAssets,
      setAddressModalStep,
      setAssetsSendModalLoading,
      setAssetsSendModalFinalAmount,
      setAssetsSendModalSelectedFee,
      setAssetsSendModalSelectedFeeLunes,
      setAssetsSendModalSelectedFeePerByte,
      errorInput
    },
    dispatch
  );

export default connect(
  mapSateToProps,
  mapDispatchToProps
)(BoxFee);
