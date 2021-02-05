import React from 'react';
import './App.css';
import {Canvas} from "react-three-fiber";
import {PipeLine} from "./pages/PipeLine";

const App = () => (
    <div className="App" style={{display: "flex", height: '900px'}}>
        <Canvas
            pixelRatio={window.devicePixelRatio}
            shadowMap={true}
        >
            <PipeLine/>
            <ambientLight intensity={0.8}/>
            <pointLight intensity={1} position={[0, 6, 0]}/>
        </Canvas>
    </div>
);

export default App;
