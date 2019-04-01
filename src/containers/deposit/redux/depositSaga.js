import { put, call } from "redux-saga/effects";
import { internalServerError } from "../../errors/statusCodeMessage";

// SERVICES
import DepositService from "../../../services/depositService";
import SettingsService from "../../../services/settingsService";

// UTILS
import { getAuthToken } from "../../../utils/localStorage";
import i18n from "../../../utils/i18n";

const depositService = new DepositService();
const settingsService = new SettingsService();

export function* getPackagesSaga() {
  try {
    yield put({
      type: "SET_LOADING_DEPOSIT",
      loading: true
    });
    let token = yield call(getAuthToken);
    let response = yield call(depositService.getPackages, token);    
    yield put({
      type: "GET_PACKAGES_REDUCER",
      packages: response
    });
  } catch (error) {
    yield put(internalServerError());    
  }
  yield put({
    type: "SET_LOADING_DEPOSIT",
    loading: false
  });
}

export function* getDepositHistorySaga() {
  try {
    yield put({
      type: "SET_LOADING_DEPOSIT",
      loading: true
    });
    let token = yield call(getAuthToken);
    let response = yield call(depositService.getDepositHistory, token);

    if (response.status !== 200) return yield put(internalServerError());

    yield put({
      type: "GET_HISTORY_DEPOSIT_REDUCER",
      history: response.data
    });
    yield put({
      type: "SET_LOADING_DEPOSIT",
      loading: false
    });
  } catch (error) {
    yield put(internalServerError());
    yield put({
      type: "SET_LOADING_DEPOSIT",
      loading: false
    });
  }
}

export function* getKycData(){
  try{
    let token = yield call(getAuthToken);
    let response = yield call(depositService.getKycData, token);
    if(response.code !== 200){
      yield put(internalServerError());
      return ;
    }
    yield put({
      type: "SET_KYC_DATA",
      response
    });

  }catch(error){
    yield put(internalServerError());
  }
}
export function* depositGetStates(payload) {
  try {
    yield put({ type: "SET_LOADING_DEPOSIT_STATE" });
    let token = yield call(getAuthToken);
    let response = yield call(
      settingsService.kycGetStates,
      token,
      payload.country
    );
    if (response.code !== 200) {
      yield put(internalServerError());
      return;
    }
    yield put({
      type: "DEPOSIT_SET_STATE",
      response
    });
    return;
  } catch (error) {
    yield put(internalServerError());
  }
}
export function* depositGetCity(payload) {
  try {
    yield put({ type: "SET_LOADING_DEPOSIT_CITY" });
    let token = yield call(getAuthToken);
    let { country, state } = payload.location;
    let response = yield call(
      settingsService.kycGetCity,
      token,
      country,
      state
    );
    if (response.code !== 200) {
      yield put(internalServerError());
      return;
    }
    yield put({
      type: "DEPOSIT_SET_CITY",
      response
    });
    return;
  } catch (error) {
    yield put(internalServerError());
  }
}
export function* getPaymentsMethods() {
  try {
    let token = yield call(getAuthToken);
    let response = yield call(depositService.getPaymentsMethods, token);
    if (response.code !== "200") {
      yield put(internalServerError());
      return ;
    }
    yield put({
      type: "SET_PAYMENT_METHODS",
      response
    });
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* createDepositBillSaga(payload) {
  try {
    yield put({
      type: "SET_LOADING_DEPOSIT",
      loading: true
    });
    let token = yield call(getAuthToken);
    let response = yield call(depositService.createDepositBill, token,payload.payload);

    if (response.status !== 200) return yield put(internalServerError());

    yield put({
      type: "SET_BUY_ID",
      id: response.data.data.buyID

    });

    yield put({
      type: "SET_LOADING_DEPOSIT",
      loading: false
    });
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* getPaymentsMethodsServiceCreditSaga(payload) {
  try {
    let token = yield call(getAuthToken);
    let response = yield call(depositService.getPaymentsMethodsServiceCredit, token, payload.serviceId);
    
    if (response.code !== 200) {
      yield put(internalServerError());
      return ;
    }
    const services = response.data.servicePaymentMethods;
   
    const methods = services.reduce((availableMethod, method) => {
      if (method.status === "active") {
        let titleMethod = undefined;
        if(method.paymentMethodName === 'coin'){
          titleMethod =  i18n.t("RECHARGE_COIN_PAYMENT");
        }
        if(method.paymentMethodName === 'credit'){
          titleMethod =  i18n.t("RECHARGE_CREDIT_PAYMENT");
        }
        const active = {
          id: method.id,
          title: titleMethod,
          value: method.paymentMethodName
        };
        availableMethod.push(active);
      }

      return availableMethod;
    }, []);

    yield put({
      type: "SET_METHODS_SERVICE_CREDIT_REDUCER",
      data: methods
    });
  } catch (error) {
    yield put(internalServerError());
  }
}

export function* getDepositBillSaga(payload) {
  try {
    yield put({
      type: "SET_LOADING_DEPOSIT",
      loading: true
    });
    let token = yield call(getAuthToken);
    let response = yield call(depositService.getDepositBill, token,payload.buyID);
    if (response.status !== 200) return yield put(internalServerError());
    let data = response.data.data;
    yield put ({
      type: "SET_DEPOSIT_RETURN",
      depositReturn: data
    });
    yield put({
      type: "SET_LOADING_DEPOSIT",
      loading: false
    });
  } catch (error) {
    yield put(internalServerError());
  }

}