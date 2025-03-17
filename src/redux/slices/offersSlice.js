import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

// **تحميل جميع العروض**
export const loadOffers = createAsyncThunk('offers/loadOffers', async (_, { getState }) => {
  const offersRef = collection(db, 'offers');
  const offersSnap = await getDocs(offersRef);

  return offersSnap.docs.map((doc) => {
    const offerData = doc.data();
    return {
      id: doc.id,
      ...offerData,
       createdAt: offerData.createdAt?.toDate().toISOString(),
      products: offerData.products.map(product => ({
        ...product,
        createdAt: product.createdAt?.toMillis(),
      }))
    };
  });
});

// **تحميل عرض واحد**
export const loadSingleOffer = createAsyncThunk('offers/loadSingleOffer', async (id, { getState }) => {
  const offerRef = doc(db, 'offers', id);
  const offerSnap = await getDoc(offerRef);

  if (offerSnap.exists()) {
    const offerData = offerSnap.data();
    return {
      id: offerSnap.id,
      ...offerData,
       createdAt: offerData.createdAt?.toDate().toISOString(),
      products: offerData.products.map(product => ({
        ...product,
        createdAt: product.createdAt?.toMillis(),
      }))
    };
  }
  throw new Error('Offer not found');
});

const offersSlice = createSlice({
  name: 'offers',
  initialState: {
    items: [],
    singleOffer: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSingleOffer(state) {
      state.singleOffer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadOffers.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(loadSingleOffer.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadSingleOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.singleOffer = action.payload;
      })
      .addCase(loadSingleOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSingleOffer } = offersSlice.actions;
export default offersSlice.reducer;
