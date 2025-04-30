import {configureStore, createSlice} from "@reduxjs/toolkit"

const chatListSlice = createSlice({
    name: "chatList",
    initialState: {
        currentChatUsername: "",
        unreads: {}
    },
    reducers: {
        updateCurrentChat(state, action){
            state.currentChatUsername = action.payload
            state.unreads[action.payload] = 0
        },
        setInitialUnread(state, action){
            state.unread = action.payload
        },
        updateUnread(state, action){
            state.unread[action.payload] = (state.unread[action.payload] || 0) + 1
        }
    }
})

const store = configureStore({
    reducer: {
        chatList: chatListSlice.reducer
    }
})

export default store