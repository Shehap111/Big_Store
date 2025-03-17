// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    uid: '', // إضافة uid هنا
    name: '',
    email: '',
    phone: '',
    photoURL: '',
  },
  reducers: {
    setUser: (state, action) => {
      return { ...state, ...action.payload }; // تحديث الحالة مع البيانات الجديدة
    },
    clearUser: () => {
      return { uid: '', name: '', email: '', phone: '', photoURL: '' }; // إعادة تعيين كل الحقول بما في ذلك uid
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
