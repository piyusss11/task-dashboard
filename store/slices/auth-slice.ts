import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Load user from localStorage on app start
const loadUserFromStorage = (): User | null => {
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

// Async thunks for auth operations
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    // Simulating an API call coz we don't have a backend
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === "piyush@gmail.com" && password === "password") {
      const mockUser: User = {
        id: "1",
        name: "Piyush",
        email: "piyush@gmail.com",
      };

      localStorage.setItem("user", JSON.stringify(mockUser));
      return mockUser;
    }
    throw new Error("Invalid credentials");
  }
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    // Simulating an API call coz we don't have a backend
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
    };
    localStorage.setItem("user", JSON.stringify(mockUser));
    return mockUser;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...initialState,
    user: loadUserFromStorage(),
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Signup failed";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
