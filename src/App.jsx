import React from 'react';
import {Provider} from "./context/MenuContext";
import Navbar from "./shared/components/Navbar/Navbar";
import Menu from "./shared/components/Menu/Menu";

function App() {
    return (
        <Provider>
            <Navbar />
            <Menu />
        </Provider>
    );
}

export default App;
