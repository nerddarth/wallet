const initialState = {
  packages: [],
  history: [],
  user: {},
  modalStep: 1,
  loading: false,
  paymentMethod: null
};

const deposit = (state = initialState, action) => {
  switch (action.type) {
    case "GET_PACKAGES_REDUCER":
      return {
        ...state,
        packages: action.packages
      };
    case "GET_HISTORY_DEPOSIT_REDUCER":
      return {
        ...state,
        history: action.history
      };
    case "SET_MODAL_STEP":
      return {
        ...state,
        modalStep: action.step
      };
    case "SET_USER_DATA":
      return {
        ...state,
        user: action.user,
        loading: false
      };
    case "SET_LOADING_DEPOSIT":
      return {
        ...state,
        loading: action.loading
      };
    case "SET_PAYMENT_METHOD":

      return {
        ...state,
        paymentMethod: action.method
      };

    default: {
      return {
        ...state
      };
    }
  }
};

export default deposit;
