import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { UserCredential, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "@firebase";

export interface User {
    id: string;
    email: string;
    name: string;
    username: string;
    age?: number;
    gender?: 'male' | 'female';
    role?: 'helper' | 'seeker';
    score?: number;
    goal?: string;
    streak?: number;
}

interface UserUpdate {
    age?: number;
    gender?: 'male' | 'female';
    role?: 'helper' | 'seeker';
    score?: number;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean | undefined;
    refreshUser: () => Promise<void>;
    userUpdate: (userId: string, data: UserUpdate) => Promise<void | String>;
    signin: (email: string, password: string) => Promise<UserCredential | String>;
    signup: (email: string, password: string, name: string, username: string) => Promise<UserCredential | String>;
    signout: () => Promise<void | String>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
    
    const updateLocalUser = useCallback(async (userId: string) => {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
            let data = docSnap.data();
            setUser(prevUser => {
                if (prevUser?.id === userId && prevUser.email === data.email && prevUser.name === data.name && prevUser.username === data.username && prevUser.age === data.age && prevUser.gender === data.gender && prevUser.role === data.role && prevUser.score === data.score) {
                    return prevUser;
                }
    
                return {
                    id: userId,
                    email: data.email,
                    name: data.name,
                    username: data.username,
                    age: data.age,
                    gender: data.gender,
                    role: data.role,
                    score: data.score
                };
            });
        } else {
            throw new Error(`No user document for user ID ${userId}`);
        }
    }, []);

    const refreshUser = async () => {
        setIsLoading(true);
        if (user) {
            await updateLocalUser(user.id);
        }
        setIsLoading(false);
    }
    
    const userUpdate = async (userId: string, data: UserUpdate): Promise<void | String> => {
        setIsLoading(true);
        try {
            const userRef = doc(db, "users", userId);
            await setDoc(userRef, { ...data }, { merge: true });
    
            await updateLocalUser(userId);
        } catch (error) {
            console.log(error);
            return (error as Error).message;
        } finally {
            setIsLoading(false);
        }
    }
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsLoading(true);
                setIsAuthenticated(true);
                try {
                    await updateLocalUser(user.uid);
                } catch (error) {
                    console.error("Failed to update user data:", error);
                    setIsAuthenticated(false); 
                }
                setIsLoading(false);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        })
    
        return () => unsubscribe();
    }, []);

    const signin = async (email: string, password: string): Promise<UserCredential | String> => {
        setIsLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            await updateLocalUser(response.user.uid);
            return response;
        } catch (error) {
            console.log(error);
            return (error as Error).message;
        } finally {
            setIsLoading(false);
        }
    }

    const signup = async (email: string, password: string, name: string, username: string): Promise<UserCredential | String> => {
        setIsLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", response.user.uid), {
                userId: response.user.uid,
                email,
                name,
                username
            });

            return response;
        } catch (error) {
            console.log(error);
            return (error as Error).message;
        } finally {
            setIsLoading(false);
        }
    }

    const signout = async (): Promise<void | String> => {
        setIsLoading(true);
        try {
            await signOut(auth);
        } catch (error) {
            console.log(error);
            return (error as Error).message;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated,
            signin,
            signup,
            signout,
            userUpdate,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType => {
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error('useAuth must be used within an AuthContextProvider');
    }

    return value;
}
