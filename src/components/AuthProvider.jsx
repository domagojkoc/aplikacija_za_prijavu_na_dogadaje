import { createContext, createSignal, useContext, onMount } from "solid-js";
import { pb } from "../services/pocketbase";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider(props) {
    const [user, setUser] = createSignal(pb.authStore.model);
    const [loading, setLoading] = createSignal(true);

    const authActions = {
        login: async (email, password) => {
            try {
                await pb.collection('users').authWithPassword(email, password);
                setUser(pb.authStore.model);
                return true;
            } catch (err) {
                console.error("Login error:", err);
                return false;
            }
        },
        register: async (email, password) => {
            try {
                await pb.collection('users').create({
                    email,
                    password,
                    passwordConfirm: password
                });
                return true;
            } catch (err) {
                console.error("Registration error:", err);
                return false;
            }
        },
        logout: () => {
            pb.authStore.clear();
            setUser(null);
        }
    };
    onMount(() => {
        setLoading(false);
        
        // Osluškuj promjene autentikacije
        pb.authStore.onChange((token, model) => {
            setUser(model);
        });
    });

    return (
        <AuthContext.Provider value={{ user: user(), loading: loading(), ...authActions }}>
            {props.children}
        </AuthContext.Provider>
    );
}
