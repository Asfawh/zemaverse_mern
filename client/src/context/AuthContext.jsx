import { createContext, useEffect, useReducer } from "react";
export const AuthContext = createContext({
    user: null,
    dispatch: function () {},
});

function getValidStoredUser() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const tokenParts = user?.token?.split('.');

        if (tokenParts?.length !== 3) {
            return null;
        }

        const base64Payload = tokenParts[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/')
            .padEnd(Math.ceil(tokenParts[1].length / 4) * 4, '=');
        const payload = JSON.parse(atob(base64Payload));

        if (!payload.exp || payload.exp * 1000 <= Date.now()) {
            return null;
        }

        return user;
    } catch {
        return null;
    }
}

function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return { user: action.payload };
        case 'LOGOUT':
            return { user: null };
        default:
            console.error(`Unexpected action type: ${action.type}`);
            return state;
    }
}

function AuthProvider({ children  }){
    const [state, dispatch] = useReducer(authReducer, { user: null });

    useEffect(() => {
        const user = getValidStoredUser();

        if(user) {
            dispatch({ type: 'LOGIN', payload: user });
        } else {
            localStorage.removeItem('user');
        }
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
