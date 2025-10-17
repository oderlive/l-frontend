import React from 'react';
import {Provider} from "./context/MenuContext";
import Navbar from "./pages/Navbar/Navbar";
import Menu from "./pages/Menu/Menu";
import ModalJoin from "./shared/components/ModalJoin/ModalJoin";

function App() {
    return (
        <Provider>
            <Navbar />
            <Menu />
            <ModalJoin />
        </Provider>
    );
}

export default App;
