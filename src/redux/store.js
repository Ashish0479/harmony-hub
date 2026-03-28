import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import menuReducer from "./slices/menuSlice";
import messReducer from "./slices/messSlice";
import complaintReducer from "./slices/complaintSlice";
import feedbackReducer from "./slices/feedbackSlice";
import billReducer from "./slices/billSlice";
import paymentReducer from "./slices/paymentSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    menu: menuReducer,
    mess: messReducer,
    complaint: complaintReducer,
    feedback: feedbackReducer,
    bill: billReducer,
    payment: paymentReducer,
  },
});

export default store;
