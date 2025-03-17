import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase'; 
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';

// إضافة عنوان جديد
export const addAddress = createAsyncThunk('Address/add', async (address) => {
  const docRef = await addDoc(collection(db, 'Address'), address);
  return { id: docRef.id, ...address };
});

// تعديل عنوان
export const updateAddress = createAsyncThunk('Address/update', async ({ id, updatedData }) => {
  await updateDoc(doc(db, 'Address', id), updatedData);
  return { id, updatedData };
});

// حذف عنوان
export const deleteAddress = createAsyncThunk('Address/delete', async (id) => {
  await deleteDoc(doc(db, 'Address', id));
  return id;
});

// جلب العناوين
export const fetchAddresses = createAsyncThunk('Address/fetch', async () => {
  const querySnapshot = await getDocs(collection(db, 'Address'));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
});

const AddressSlice = createSlice({
  name: 'Address',
  initialState: {
    Address: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.Address = action.payload;
        state.loading = false;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.Address.push(action.payload);
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        const index = state.Address.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) state.Address[index] = { ...state.Address[index], ...action.payload.updatedData };
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.Address = state.Address.filter((a) => a.id !== action.payload);
      });
  },
});

export default AddressSlice.reducer;
