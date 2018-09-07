import axios from "axios";
import {
  BASE_URL,
  API_HEADER,
  TESTNET,
  HEADER_RESPONSE
} from "../../constants/apiBaseUrl";
import {
  internalServerError,
  modalError
} from "../../containers/errors/statusCodeMessage";
import { networks } from "../../constants/network";
// COINS
import { BtcTransaction, LunesTransaction } from "./coins";
import CoinService from "../../services/coinService";

// UTILS
import i18n from "../../utils/i18n";
import { setAuthToken } from "../../utils/localStorage";
import { convertSmallerCoinUnit } from "../../utils/numbers";

class TransactionService {
  async utxo(address, coin, token) {
    try {
      API_HEADER.headers.Authorization = token;
      let response = await axios.post(
        `${BASE_URL}/coin/${coin}/transaction/utxo`,
        { fromAddress: address },
        API_HEADER
      );
      console.warn(response, "responseUTXO");
      const utxos = [];

      response.data.data.utxos.forEach(utxo => {
        utxos.push({
          txId: utxo.txId,
          vout: utxo.vout,
          value: utxo.value
        });
      });

      return utxos;
    } catch (error) {
      internalServerError();
      return;
    }
  }

  async broadcast(txhex, coin, token) {
    try {
      API_HEADER.headers.Authorization = token;
      let response = await axios.post(
        BASE_URL + "/coin/" + coin + "/transaction/broadcast",
        { txHex: txhex },
        API_HEADER
      );

      return response;
    } catch (error) {
      internalServerError();
      return;
    }
  }

  /* eslint-disable */
  async transaction(transaction, seed, token) {
    try {
      console.warn(transaction);
      let responde = undefined;
      let coinService = new CoinService();
      let {
        fromAddress,
        toAddress,
        fee,
        feePerByte,
        feeLunes,
        amount,
        coin,
        decimalPoint
      } = transaction;
      if (
        !fromAddress ||
        !toAddress ||
        !seed ||
        !fee ||
        !feePerByte ||
        !amount ||
        !token ||
        !coin ||
        !decimalPoint
      ) {
        modalError(i18n.t("MESSAGE_TRANSACTION_FAILED"));
        return;
      }

      switch (coin) {
        case "btc":
          let transactionBtc = new BtcTransaction();
          let responseBtc = await transactionBtc.createTransaction({
            fromAddress: fromAddress,
            toAddress: toAddress,
            seed: seed,
            fee: convertSmallerCoinUnit(fee, decimalPoint),
            feePerByte: feePerByte,
            feeLunes: feeLunes,
            amount: convertSmallerCoinUnit(amount, decimalPoint),
            coin: coin,
            token: token,
            network: TESTNET ? networks.BTCTESTNET : networks.BTC
          });

          if (responseBtc === "error") {
            return;
          }

          let responseSaveBtc = await coinService.saveTransaction(
            {
              id: responseBtc,
              sender: fromAddress,
              recipient: toAddress,
              amount: convertSmallerCoinUnit(amount, decimalPoint),
              fee: convertSmallerCoinUnit(fee, decimalPoint)
            },
            coin,
            "Teste"
          );
          return responseSaveBtc;

        case "lunes":
          let transactionLunes = new LunesTransaction();
          let respondeLunes = await transactionLunes.createLunesTransaction({
            network: TESTNET ? networks.LUNESTESTNET : networks.LUNES,
            seed: seed,
            fromAddress: fromAddress,
            toAddress: toAddress,
            amount: convertSmallerCoinUnit(amount, decimalPoint),
            fee: convertSmallerCoinUnit(fee, decimalPoint)
          });

          if (respondeLunes === "error") {
            return;
          }

          let responseSaveLunes = await coinService.saveTransaction(
            respondeLunes,
            coin,
            "Teste"
          );
          console.warn(responseSaveLunes, "responseSaveLunes");
          return responseSaveLunes;

        case "ltc":
          console.warn("foi");
          let transactionLtc = new BtcTransaction();
          let responseLtc = await transactionLtc.createTransaction({
            fromAddress: fromAddress,
            toAddress: toAddress,
            seed: seed,
            fee: convertSmallerCoinUnit(fee, decimalPoint),
            feePerByte: feePerByte,
            feeLunes: feeLunes,
            amount: convertSmallerCoinUnit(amount, decimalPoint),
            coin: coin,
            token: token,
            network: TESTNET ? networks.LTCTESTNET : networks.LTC
          });

          if (responseLtc === "error") {
            return;
          }

          let responseSaveLtc = await coinService.saveTransaction(
            {
              id: responseLtc,
              sender: fromAddress,
              recipient: toAddress,
              amount: convertSmallerCoinUnit(amount, decimalPoint),
              fee: convertSmallerCoinUnit(fee, decimalPoint)
            },
            coin,
            "Teste"
          );

          console.warn(responseSaveLtc);
          return responseSaveLtc;

        case "bch":
          console.warn("foi");
          let transactionBch = new BtcTransaction();
          let responseBch = await transactionBch.createTransaction({
            fromAddress: fromAddress,
            toAddress: toAddress,
            seed: seed,
            fee: convertSmallerCoinUnit(fee, decimalPoint),
            feePerByte: feePerByte,
            feeLunes: feeLunes,
            amount: convertSmallerCoinUnit(amount, decimalPoint),
            coin: coin,
            token: token,
            network: TESTNET ? networks.LTCTESTNET : networks.LTC
          });

          if (responseLtc === "error") {
            return;
          }

          let responseSaveBch = await coinService.saveTransaction(
            {
              id: responseBch,
              sender: fromAddress,
              recipient: toAddress,
              amount: convertSmallerCoinUnit(amount, decimalPoint),
              fee: convertSmallerCoinUnit(fee, decimalPoint)
            },
            coin,
            "Teste"
          );

          console.warn(responseSaveBch);
          return responseSaveBch;
      }
    } catch (error) {
      internalServerError();
      return error;
    }
  }

  async createLeasing(data) {
    let lunes = new LunesTransaction();
    let response = await lunes.createLeasing(data);
    return response;
  }

  async cancelLeasing(data) {
    let lunes = new LunesTransaction();
    let response = await lunes.cancelLeasing(data);

    return response;
  }

  async transactionService(token) {
    try {
      API_HEADER.headers.Authorization = token;
      let response = await axios.get(
        BASE_URL + "/service/transferencia",
        API_HEADER
      );
      console.warn(response);
      setAuthToken(response.headers[HEADER_RESPONSE]);

      return response.data.data;
    } catch (error) {
      console.warn(error);
      internalServerError();
      return error;
    }
  }
}
export default TransactionService;
