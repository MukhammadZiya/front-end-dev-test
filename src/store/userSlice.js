import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const loadInitialState = () => {
  const savedUsers = localStorage.getItem("users");
  if (savedUsers) {
    return JSON.parse(savedUsers);
  }
  // Return hierarchical data structure
  return [
    {
      id: 1,
      name: "Assembly Line",
      email: "assembly@factory.com",
      phone: "123-456-7890",
      parentId: null,
    }, 
    {
      id: 2,
      name: "Robot Arm A",
      email: "robot.a@factory.com",
      phone: "123-456-7891",
      parentId: 1, 
    },
    {
      id: 3,
      name: "Robot Arm B",
      email: "robot.b@factory.com",
      phone: "123-456-7892",
      parentId: 1,
    },
    {
      id: 4,
      name: "Packaging",
      email: "packaging@factory.com",
      phone: "123-456-7893",
      parentId: null,
    }, 
    {
      id: 5,
      name: "Conveyor Belt",
      email: "conveyor@factory.com",
      phone: "123-456-7894",
      parentId: 4,
    }, 
  ];
};

const initialState = {
  users: loadInitialState(),
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
      // Save to localStorage
      localStorage.setItem("users", JSON.stringify(state.users));
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
        // Save to localStorage
        localStorage.setItem("users", JSON.stringify(state.users));
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
      // Save to localStorage
      localStorage.setItem("users", JSON.stringify(state.users));
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setLoading,
  setError,
} = userSlice.actions;

export default userSlice.reducer;
