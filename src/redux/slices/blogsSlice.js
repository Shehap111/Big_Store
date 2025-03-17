import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

// **تحميل جميع المقالات**
export const loadBlogs = createAsyncThunk('blogs/loadBlogs', async (_, { getState }) => {
  const blogsRef = collection(db, 'blogs');
  const blogsSnap = await getDocs(blogsRef);
  const { language } = getState().language;

  return blogsSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toMillis() || null, // ✅ تحويل `Timestamp` إلى milliseconds
      title: data.title?.[language] || data.title?.en || 'Untitled',
      content: data.content?.[language] || data.content?.en || '',
    };
  });
});

// **تحميل مقال واحد**
export const loadSingleBlog = createAsyncThunk('blogs/loadSingleBlog', async (id, { getState }) => {
  const blogRef = doc(db, 'blogs', id);
  const blogSnap = await getDoc(blogRef);
  const { language } = getState().language;

  if (blogSnap.exists()) {
    const data = blogSnap.data();
    return {
      id: blogSnap.id,
      ...data,
      createdAt: data.createdAt?.toMillis() || null, // ✅ تحويل `Timestamp` إلى milliseconds
      title: data.title?.[language] || data.title?.en || 'Untitled',
      content: data.content?.[language] || data.content?.en || '',
    };
  }
  throw new Error('Blog not found');
});

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: {
    items: [],
    singleBlog: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSingleBlog(state) {
      state.singleBlog = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(loadSingleBlog.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadSingleBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.singleBlog = action.payload;
      })
      .addCase(loadSingleBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSingleBlog } = blogsSlice.actions;
export default blogsSlice.reducer;
