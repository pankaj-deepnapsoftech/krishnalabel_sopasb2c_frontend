import { configureStore } from "@reduxjs/toolkit";
import {
  agentApi,
  api,
  bomApi,
  employeeApi,
  invoiceApi,
  paymentApi,
  processApi,
  productApi,
  proformaInvoiceApi,
  storeApi,
  userRoleApi,
} from "./api/api";

import authSlice from "./reducers/authSlice";
import sidebarSlice from "./reducers/sidebarSlice";
import drawersSlice from "./reducers/drawersSlice";
import commonSlice from "./reducers/commonSlice";
import socketReducer from "./reducers/socketSlice";

const store = configureStore({
  reducer: {
    socket: socketReducer,
    [authSlice.name]: authSlice.reducer,
    [sidebarSlice.name]: sidebarSlice.reducer,
    [drawersSlice.name]: drawersSlice.reducer,
    [commonSlice.name]: commonSlice.reducer,

    // ✅ Add API reducers here
    [api.reducerPath]: api.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [storeApi.reducerPath]: storeApi.reducer,
    [agentApi.reducerPath]: agentApi.reducer,
    [bomApi.reducerPath]: bomApi.reducer,
    [userRoleApi.reducerPath]: userRoleApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [proformaInvoiceApi.reducerPath]: proformaInvoiceApi.reducer,
    [invoiceApi.reducerPath]: invoiceApi.reducer,
    [processApi.reducerPath]: processApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      api.middleware,
      productApi.middleware,
      storeApi.middleware,
      agentApi.middleware,
      bomApi.middleware,
      userRoleApi.middleware,
      employeeApi.middleware,
      proformaInvoiceApi.middleware,
      invoiceApi.middleware,
      processApi.middleware,
      paymentApi.middleware,
    ]),
});


export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
