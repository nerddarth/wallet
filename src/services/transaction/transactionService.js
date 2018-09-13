import axios from "axios";

// CONTANTS
import {
  BASE_URL,
  API_HEADER,
  TESTNET,
  HEADER_RESPONSE
} from "../../constants/apiBaseUrl";
import { networks } from "../../constants/network";

import {
  internalServerError,
  modalError
} from "../../containers/errors/statusCodeMessage";

// COINS
import { BtcTransaction, LunesTransaction } from "./coins";
import CoinService from "../../services/coinService";
// import LeasingService from "../../services/leasingService";

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
      const utxos = [];
      setAuthToken(response.headers[HEADER_RESPONSE]);

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
      setAuthToken(response.headers[HEADER_RESPONSE]);

      return response;
    } catch (error) {
      internalServerError();
      return;
    }
  }

  /* eslint-disable */
  async transaction(transaction, lunesWallet, seed, token) {
    try {
      let responde = undefined;
      let network = undefined;
      let coinService = new CoinService();
      let {
        fromAddress,
        toAddress,
        fee,
        feePerByte,
        feeLunes,
        price,
        amount,
        coin,
        decimalPoint
      } = transaction;
      if (
        !lunesWallet ||
        !fromAddress ||
        !toAddress ||
        !seed ||
        !fee ||
        !price ||
        !feePerByte ||
        !amount ||
        !token ||
        !coin ||
        !decimalPoint
      ) {
        modalError(i18n.t("MESSAGE_TRANSACTION_FAILED"));
        return;
      }

      if (coin === "btc")
        network = TESTNET ? networks.BTCTESTNET : networks.BTC;

      if (coin === "ltc")
        network = TESTNET ? networks.LTCTESTNET : networks.LTC;

      if (coin === "bch")
        network = TESTNET ? networks.BCHTESTNET : networks.BCH;

      if (coin === "lunes")
        network = TESTNET ? networks.LUNESTESTNET : networks.LUNES;

      if (coin === "btc" || coin === "ltc" || coin === "bch") {
        let transactionBtc = new BtcTransaction();
        let responseBtc = await transactionBtc.createTransaction({
          fromAddress: fromAddress,
          toAddress: toAddress,
          seed: seed,
          lunesWallet: lunesWallet,
          fee: convertSmallerCoinUnit(fee, decimalPoint),
          feePerByte: feePerByte,
          feeLunes: feeLunes,
          amount: convertSmallerCoinUnit(amount, decimalPoint),
          coin: coin,
          token: token,
          network: network
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
          transaction.price,
          "P2P",
          token
        );
        return responseSaveBtc;
      } else if (coin === "lunes") {
        let transactionLunes = new LunesTransaction();
        let respondeLunes = await transactionLunes.createLunesTransaction({
          network: network,
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
          serviceId,
          feeLunes,
          respondeLunes,
          coin,
          transaction.price,
          "P2P",
          token
        );
        return responseSaveLunes;
      }

      return;
    } catch (error) {
      internalServerError();
      return error;
    }
  }

  async createLeasing(amount, fee, address, seed, token) {
    let lunes = new LunesTransaction();
    let coinService = new CoinService();
    console.warn(token);
    let response = await lunes.createLeasing({
      amount: amount,
      fee: fee,
      recipient: address,
      seed: seed,
      network: TESTNET ? networks.LUNESTESTNET : networks.LUNES
    });

    await coinService.saveTransaction(
      4,
      0,
      {
        id: response.id,
        sender: response.sender,
        recipient: response.recipient,
        amount: response.amount,
        fee: response.fee
      },
      "lunes",
      undefined,
      "Leasing",
      token
    );

    return response;
  }

  async cancelLeasing(data) {
    let lunes = new LunesTransaction();
    let response = await lunes.cancelLeasing(data);

    return response;
  }

  async transactionService(coin = undefined, token) {
    try {
      API_HEADER.headers.Authorization = token;
      let coins = [];
      let response = await axios.get(
        BASE_URL + "/service/transferencia",
        API_HEADER
      );

      let lunesCoin = await response.data.data.services.map((value, index) => {
        coins[value.abbreviation] = value;
      });

      await Promise.all(lunesCoin);

      setAuthToken(response.headers[HEADER_RESPONSE]);
      return coin ? coins[coin] : coins;
    } catch (error) {
      console.warn(error);
      internalServerError();
      return error;
    }
  }
}
export default TransactionService;