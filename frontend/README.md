# Frontend - Digitalize Farm Shop

This folder contains the React.js frontend client for the Digitalize Farm Shop.

---

## Requirements

- Node.js (v16+ recommended)
- npm or yarn

---

## Setup

1. Install dependencies:
    ```bash
    cd frontend
    npm install
    ```
    Configure environment variables:

    Copy .env.example to .env and update API base URLs if needed.
2. Running the app

    Development mode with hot reloading:
    ```bash
    npm start
    ```
    Build for production:
    ```bash
    npm run build
    ```
    Serve production build (e.g., with serve package or integrated with backend)

## Features

    Cash Desk UI: Enter items, weights/counts, print receipt

    Warehouse UI: Inventory status, create invoices

    Dashboard UI: Visualize sales, turnover, inventory data, users management

## Authentication Context (after a successfully frontend-backend implentation )
REACT_APP_API_URL=http://localhost:3000/api in .env or .env.development
```
import { AuthProvider } from "./context/AuthContext";

<AuthProvider>
    (here comes the Code for the main page)
</AuthProvider>
```
Login example:
```
const login = async (username, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const { token, user, role } = response.data;
      localStorage.setItem('token', token);
      setAuth({ token });
      setUser(username);
      setRoleContext(role);
      startTknExpTimer(token);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network error');
    }
  };
```
Logout Example:
const logout = (message) => {
    setModalMessage(message)
    setAuth(null);
    setUser("");
    setRoleContext("");
    localStorage.removeItem('token');
    clearTimeout(timeoutRef.current);
  };

For more info see the AuthContext.js
## Testing   
Add testing instructions here (if tests are implemented).
## License   
MIT License