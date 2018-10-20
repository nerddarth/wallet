import React from "react";
import PropTypes from "prop-types";

// REDUX
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setCoinSelected } from "../../redux/buyAction";

// MATERIAL
import { Grid, Radio, FormControlLabel, withStyles } from "@material-ui/core/";

// COMPONENTS
import Select from "../../../../components/select";

// STYLE
import style from "./style.css";

const stylesCustom = theme => ({
  root: {
    color: "#68f285",
    "&$checked": {
      color: "#68f285"
    }
  },
  rootLabel: {
    fontSize: "11px",
    color: "#fff"
  },
  checked: {
    color: "#68f285"
  }
});

class PaymentBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Escolha",
      img: null
    };
  }

  coinSelected = (value, title, img = undefined) => {
    const { setCoinSelected } = this.props;
    this.setState({
      title: title,
      value,
      img
    });

    setCoinSelected(title.toLowerCase(), value);
  };

  render() {
    const { title, img } = this.state;
    const { classes, coins } = this.props;

    let coinspayment = [];

    Object.keys(coins).map(key => {
      const val = coins[key];
      let item = {
        img: `images/icons/coins/${val.abbreviation}.png`,
        title: val.abbreviation.toUpperCase(), 
        value: val.address,
      };
      if (val.abbreviation.toLowerCase() != "lunes") {
        coinspayment.push(item);
      }
    });

    return (
      <div className={style.baseBar}>
        <Grid container>
          <Grid item xs={12} md={8}>
            <span className={style.label}>
              Selecione uma forma de pagamento
            </span>
            <div className={style.baseBackgroundFlex}>
              <FormControlLabel
                value="cripto"
                classes={{ label: classes.rootLabel }}
                control={
                  <Radio
                  checked="true"
                    color="primary"
                    classes={{ root: classes.root, checked: classes.checked }}
                  />
                }
                label="Criptomoeda"
                labelPlacement="start"
              />
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <span className={style.label}>Moeda para pagamento</span>
            <div className={style.baseBackground}>
              <Select
                list={coinspayment}
                title={title}
                titleImg={img}
                selectItem={this.coinSelected}
                error={null}
                width={"100%"}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

PaymentBar.propTypes = {
  classes: PropTypes.object.isRequired,
  setCoinSelected: PropTypes.func.isRequired,
  coins: PropTypes.array.isRequired
};

const mapStateToProps = store => ({
  coins: store.buy.coinsPayment || []
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setCoinSelected
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(stylesCustom)(PaymentBar));