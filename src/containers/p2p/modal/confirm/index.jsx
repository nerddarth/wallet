import React from "react";
import PropTypes from "prop-types";

// MATERIAL UI
import { Grid, Input } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";

// UTILS
import i18n from "../../../../utils/i18n";

// STYLE
import style from "./style.css";

//COMPONENTS
import Starvotes from "../../components/starvotes"

class ConfirmModal extends React.Component {
  render() {
    return (
      <Grid container>
        <Grid item xs={12}>
          <div className={style.profile}>
            <Avatar
              src={"images/lunio/lunio-user@100x100.jpg"}
              className={style.avatar}
            />
            <div className={style.userName}>
              <span className={style.name}>Felipe Mendes</span>
            </div>
            <div className={style.hr} />
          </div>
        </Grid>

        <Grid item xs={12}>
          <div className={style.avaliation}>
            <span className={style.spanTitle}>{i18n.t("P2P_TEXT_3")}</span>
          <div className={style.starVotes}>
              <Starvotes  /> 
          </div>
            <div>
              <Input className={style.comment} />
            </div>
          </div>
        </Grid>

        <Grid item xs={12}>
          <div className={style.btnConfirm}>
            <button className={style.buttonCard}>{i18n.t("P2P_BUTTON_CONFIRM")}</button>
          </div>
        </Grid>
      </Grid>
    );
  }
}

ConfirmModal.propTypes = {};

export default ConfirmModal;

//Criar um container para centralizar os itens