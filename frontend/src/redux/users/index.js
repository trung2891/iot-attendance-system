import { createAsyncThunk, createDraftSafeSelector, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import { FS } from "../other/constance";
import { mergeObject } from '../utils';

const client = Axios.create({
    baseURL: "https://iot-attendance-system-be.vercel.app",
});

export const fetchUserData = createAsyncThunk("ttendance-system/fetchUserData", async (userId, thunkAPI) => {
    // prettier-ignore
    await Promise.all([
        thunkAPI.dispatch(fetchUserById(userId)),
    ]);
});

export const fetchUserById = createAsyncThunk("attendance-system/fetchUserById", async (userId) => {
    const res = await client.get(`/attendances/user/${userId}`).then((res) => {
        
        return res.data
    });
    return res;
});


const initialState = {
    fetchUserDataStatus: FS.INITIAL,
    user: undefined,
    userConfig: {
        rowsPerPage: 5
    }
}

const userSlice = createSlice({
    name: "userSlice",
    initialState: initialState,
    reducers: {
        updateUserSlice: (state, action) => {
            state.userConfig = mergeObject(state.userConfig, action.payload)
        }
    },
    extraReducers: (builder) =>
        builder
            .addCase(fetchUserData.pending, (state, _) => {
                state.fetchAllAttendancesStatus = FS.FETCHING;
            })
            .addCase(fetchUserData.fulfilled, (state, _) => {
                if (state.fetchAllAttendancesStatus !== FS.FAIL) {
                    state.fetchAllAttendancesStatus = FS.SUCCESS;
                }
            })
            .addCase(fetchUserById.rejected, (state, _) => {
                state.fetchAllAttendancesStatus = FS.FAIL;
                state.attendances = undefined;
           })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.attendances = action.payload;
                // delete state.attendances._id;
                // delete state.attendances.__v;
            }),


});
export default userSlice.reducer;

export const { filterChange, updateUserConfig } = userSlice.actions;

export const selectUserSlice = (state) => state.userSlice;

export const selectAllUser = createDraftSafeSelector(
    selectUserSlice,
    (userSlice) => {
        if (!userSlice.user) return null;
        return userSlice.user;
    }
)