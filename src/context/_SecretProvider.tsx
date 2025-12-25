import {createContext, useState} from "react";
import {Secret} from "../components/model/Secret.tsx";

const initState = new Secret();

const SecretContext = createContext(initState);

const SecretContextProvider = ({ children }) => {
  const [state, setState] = useState(initState);

  return (
    <SecretContext.Provider value={[state, setState]}>
      {children}
    </SecretContext.Provider>
  );
};

export { SecretContext, SecretContextProvider };
