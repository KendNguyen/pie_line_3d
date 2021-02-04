import * as React from "react"
import {Box, ContactShadows, Line, OrbitControls, TransformControls} from "../three";
import {TransformControls as TransformControlsImpl} from "three/examples/jsm/controls/TransformControls";
import {GridHelper} from "three";
import {PipeLine} from "./PipeLine";

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};


export const BaseLine = (props: Props) => {
    const orbitControls = React.useRef<OrbitControls>(null!)
    const transformControls = React.useRef<TransformControlsImpl>(null!)
    const gridHelper = React.useRef<GridHelper>(null!)
    const colors = new Array(5).fill(0).map(() => [Math.random(), Math.random(), Math.random()]) as [
        number,
        number,
        number
    ][]

    React.useEffect(() => {
        if (transformControls.current) {
            const {current: controls} = transformControls
            const callback = (event: any) => (orbitControls.current.enabled = !event.value)
            controls.addEventListener('dragging-changed', callback)
            return () => controls.removeEventListener('dragging-changed', callback)
        }
    })

    return (
        <>
            <TransformControls ref={transformControls} mode={'translate'} showX={true} showY={true} showZ={true}>
                <Box>
                    <Line
                        points={[
                            [0, 0, 0], [1.12312, 1, 0],
                            [12, 5, 0], [24, -2, 0],
                            [36, 4, 0],
                        ]}
                        position={[0, 0, 0]}
                        vertexColors={colors}
                        linewidth={10}
                    />
                    {/*<meshBasicMaterial attach="material" wireframe/>*/}
                    <ContactShadows
                        position={[0, 0, 0]}
                        width={2000}
                        height={2000}
                        far={20}
                        rotation={[Math.PI / 2, 0, 0]}/>
                </Box>
            </TransformControls>
            <OrbitControls ref={orbitControls} zoomSpeed={1}/>
            <gridHelper args={[2000, 100]} ref={gridHelper}/>
        </>
    )
};