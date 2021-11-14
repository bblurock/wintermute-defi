import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  provider: null,
  account: '',
}

export const counterSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<any>) => {
      state.account = action.payload
    },

    setProvider: (state, action: PayloadAction<any>) => {
      state.provider = action.payload
    },

    clearState: (state) => {
      state = initialState
    },
  },
})

// Action creators are generated for each case reducer function
export const { setAccount, setProvider, clearState } = counterSlice.actions

export default counterSlice.reducer