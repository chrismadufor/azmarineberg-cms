import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/dashboardSlice";
import adminReducer from "./slices/adminSlice";
import toastReducer from "./slices/ToastSlice"
import sessionStorage from "redux-persist/lib/storage/session";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "root",
  // storage,
  storage: sessionStorage,
  stateReconciler: autoMergeLevel2,
};

const reducers = combineReducers({
  toast: toastReducer,
  auth: authReducer,
  dashboard: dashboardReducer,
  admin: adminReducer,
  // users: usersReducer,
  // notification: notificationReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: ["payload.createdAt", "payload.0.createdAt"],
      },
    }),
});

export const persistor = persistStore(store);
