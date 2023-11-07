import { configureStore } from '@reduxjs/toolkit'
import tableReducer from './reducers/table.slice'

export const store = configureStore({
	reducer: {
		table: tableReducer,
	},
	devTools: true,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
