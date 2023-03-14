import { createAsyncThunk, createDraftSafeSelector, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import { FS } from "../other/constance";
import { mergeObject } from '../utils';

const client = Axios.create({
    baseURL: "https://iot-attendance-system-be.vercel.app",
});

export const fetchAdminPageData = createAsyncThunk("ttendance-system/fetchAdminPageData", async (_, thunkAPI) => {
    // prettier-ignore
    await Promise.all([
        thunkAPI.dispatch(fetchAllAttendancesData()),
    ]);
});

export const fetchAllAttendancesData = createAsyncThunk("attendance-system/fetchAllAttendances", async (_, thunkAPI) => {
    const res = await client.get("/attendances").then((res) => {
        return res.data
    });
    return res;
});


const initialState = {
    fetchAllAttendancesStatus: FS.INITIAL,
    attendances: undefined,
    allAttendancesConfig: {
        rowsPerPage: 10
    }
}

const allAttendancesSlice = createSlice({
    name: "allAttendancesSlice",
    initialState: initialState,
    reducers: {
        updateAllAttendancesConfig: (state, action) => {
            state.allAttendancesConfig = mergeObject(state.allAttendancesConfig, action.payload)
        }
    },
    extraReducers: (builder) =>
        builder
            .addCase(fetchAdminPageData.pending, (state, _) => {
                state.fetchAllAttendancesStatus = FS.FETCHING;
            })
            .addCase(fetchAdminPageData.fulfilled, (state, _) => {
                if (state.fetchAllAttendancesStatus !== FS.FAIL) {
                    state.fetchAllAttendancesStatus = FS.SUCCESS;
                }
            })
            .addCase(fetchAllAttendancesData.rejected, (state, _) => {
                state.fetchAllAttendancesStatus = FS.FAIL;
                state.attendances = undefined;
           })
            .addCase(fetchAllAttendancesData.fulfilled, (state, action) => {
                state.attendances = action.payload;
                // delete state.attendances._id;
                // delete state.attendances.__v;
            }),


});

export default allAttendancesSlice.reducer;

export const { filterChange, updateAllAttendancesConfig } = allAttendancesSlice.actions;

export const selectAllAttendancesSlice = (state) => state.allAttendancesSlice;

export const selectAllAttendances = createDraftSafeSelector(
    selectAllAttendancesSlice,
    (allAttendancesSlice) => {
        if (!allAttendancesSlice.attendances) return null;
        return allAttendancesSlice.attendances;
    }
)