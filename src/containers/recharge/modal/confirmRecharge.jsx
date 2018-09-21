import React from "react";
import PropTypes from "prop-types";

// REDUX
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {setModalStep} from "../redux/rechargeAction";

//COMPONENTS
import ButtonContinue from "./component/buttonContinue";

// UTILS
import i18n from "../../../utils/i18n";

// STYLES
import style from "./style.css";

class ConfirmRecharge extends React.Component {
  constructor(props) {
    super(props);
  }

  confirmPay = () => {
    const {setModalStep} = this.props;
    setModalStep(4);
  }

  render() {
    const {loading, recharge } = this.props;
    return (
      <div className={style.modalBox}>
        <div>{i18n.t("RECHARGE_CONFIRM_1")}</div>
        <div>
          <span>{i18n.t("RECHARGE_CONFIRM_2")}</span>
          <span className={style.totalConfirmBlock}>{recharge.amount + recharge.fee.fee.fee} {recharge.coin.abbreviation.toUpperCase()}</span>
        </div>

        <div className={style.smallDescription}>
          {i18n.t("RECHARGE_CONFIRM_3")}
        </div>

        <ButtonContinue
          label={i18n.t("PAYMENT_BTN_PAY")}
          action={()=>this.confirmPay()}
          loading={loading}
        />

      </div>
    );
  }
}

ConfirmRecharge.propTypes = {
  setModalStep:     PropTypes.func.isRequired,
  recharge:         PropTypes.object.isRequired,
  loading:          PropTypes.bool.isRequired
}

const mapStateToProps = store => ({
  recharge:   store.recharge.recharge,
  loading:    store.recharge.loading
});

const mapDispatchToProps = dispatch =>bindActionCreators(
  {setModalStep},
  dispatch
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConfirmRecharge);
