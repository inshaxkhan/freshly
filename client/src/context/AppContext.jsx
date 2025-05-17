import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {dummyProducts } from "../assets/assets"

export const AppContext = createContext();

export const AppContextProvider = ({children}) =>{

    const currency=import.meta.VITE_CURRENCY;
    const navigate = useNavigate();
    const [user, setUser]= useState(null);
    const [isSeller, setIsSeller]= useState(false);
    const [showUserLogin, setShowUserLogin]= useState(false);
    const [products, setProducts]= useState([]);
    const [cartItems, setCartItems]= useState([]);

    //fetch all products
    const fetchProducts=async()=>{
        setProducts( dummyProducts )
    }

    //add products to cart
    const addToCart=()=>{
        let cardData=structuredClone(cardItems);
        
    }


    useEffect(()=>{
        fetchProducts()
    },[])

    const value={ navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin, products, currency}
    
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext);
}