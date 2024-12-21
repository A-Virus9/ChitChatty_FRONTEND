import {configureStore, createSlice} from "@reduxjs/toolkit"

const currentChatInitialState = {
    currentChatUsername: "",
}

const currentChatSlice = createSlice({
    name: "currentChat",
    initialState: currentChatInitialState,
    reducers: {
        updateCurrentChat(state, action){
            state.currentChatUsername = action.payload
        }
    }
})

const store = configureStore({
    reducer: {
        currentChat: currentChatSlice.reducer
    }
})

export default store