
import React from "react"

const UserContext = React.createContext("defaultValue")

const UserProvider = ({ children }) => {
    const [userDetails, setUserDetails] = React.useState({uid: "test"})


    return (
        <UserContext.Provider value={{
            userDetails, setUserDetails
        }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }