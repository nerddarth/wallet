const initialState = {
  operadoras: [],
  valores: [],
  coins: [],
  history: [],
  loading: false,
  modalStep: 1,
  recharge: {
    value: 0,
    number: null, 
    coin: {
      address: null, 
      abbreviation: null,
    }, 
    balance: null, 
    amount: null, 
    operator: null,
  },
  fee: {
    fee: {
      low: 0,
      medium: 0,
      high: 0
    }
  },
  user: {
    gdpr: 'unread'
  },
};

const recharge = (state=initialState, action) => {
  switch(action.type){
      case "SET_MODAL_RECHARGE_STEP_REDUCER":
        return {
          ...state,
          modalStep: action.step
        };
  
      case "SET_LOADING_REDUCER":
        return {
          ...state,
          loading: action.payload
        };
      
      case "SET_LOADING_VAL_REDUCER":
        return {
          ...state,
          loadingValores: action.payload
        };
  
      case "GET_COINS_REDUCER":
        return {
          ...state,
          coins: action.coins
        };

      case "GET_OPERADORAS_REDUCER":
        return {
          ...state,
          operadoras: action.operadoras,
          loadingValores: false
        };

      case "GET_VALORES_REDUCER":
        return {
          ...state,
          valores: action.valores,
          loadingValores: false
        }

      case "SET_RECHARGE_REDUCER": 
        return {
          ...state, 
          recharge: action.payload, 
          loading: false
        }

      case "GET_FEE_RECHARGE_REDUCER":
        return {
          ...state,
          fee: action.fee,
          loading: false
        };
  
      case "SET_FEE_RECHARGE_REDUCER":
        return {
          ...state,
          recharge: {
            ...state.payment,
            fee: action.fee
          }
        };




  
      case "GET_PAYMENT_DATA_REDUCER":
        return {
          ...state,
          number: action.number
        };
  
      case "SET_PAYMENT_REDUCER":
        return {
          ...state,
          payment: action.payload,
          loading: false
        };
  
      
  
      case "GET_INVOICE_REDUCER":
        return {
          ...state,
          payment: {
            ...state.payment,
            ...action.payment
          }
        };
  
      case "GET_USER_GDPR_REDUCER":
        return {
          ...state,
          user: action.user
        };
  
      case "SET_USER_GDPR_REDUCER":
        return {
          ...state,
          user: action.user
        };
  
      case "GET_HISTORY_PAY_REDUCER":
        return {
          ...state,
          history: action.history
        };
  
      case "SET_CLEAR_PAYMENT_REDUCER":
        return {
          ...initialState
        };

    default: {
      return {
        ...state
      };
    }
  }
};

export default recharge;
