import {createContext, useContext, useEffect} from "react"
import useFetch from "./hooks/useFetch"
import { getCurrentUser } from "./db/apiAuth"

const urlContext = createContext()

const UrlProvider = ({children}) => {
    const {data:user, loading, fn:fetchUser} = useFetch(getCurrentUser)

    const isAuthenticated = user?.role === "authenticated"

    useEffect(() => {
        fetchUser()
    },[])

    const value = {
        user,
        loading,
        fetchUser,
        isAuthenticated
    }

    return <urlContext.Provider value={value}>
        {children}
    </urlContext.Provider>
}

export const UrlState = () => {
    return useContext(urlContext)
}

export default UrlProvider