import * as React from "react"
import * as THREE from "three";
import {GridHelper} from "three";
import {TransformControls as TransformControlsImpl} from 'three/examples/jsm/controls/TransformControls'
import {CurveModifierRef, OrbitControls, PerspectiveCamera} from "../three";
import {data} from "../resource/json/original";
import _ from 'lodash'

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};
export const PipeLine = (props: Props) => {
    const curveRef = React.useRef<CurveModifierRef>()
    const orbitControls = React.useRef<OrbitControls>(null!)
    const transformControls = React.useRef<TransformControlsImpl>(null!)
    const gridHelper = React.useRef<GridHelper>(null!)
    const camera = React.useRef()
    // useHelper(camera, CameraHelper, 1, 'hotpink')

    // const pipeSpline = data.map<THREE.Vector3>(value => {
    //     return new THREE.Vector3(
    //         parseInt((value.N * 100).toString().slice(4, 8)),
    //         parseInt((value.E * 100).toString().slice(4, 8)),
    //         value.DEPTH / 100,
    //     )
    // });

    const pipeSpline = data.map<THREE.Vector3>(value => {
        return new THREE.Vector3(
            Math.abs((value.N - 947823) * 100),
            value.DEPTH / 10,
            Math.abs((value.E - 249131)),
        )
    });

    // const pipeSpline = [
    //     new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 1, 0),
    //     new THREE.Vector3(20, -1, 0), new THREE.Vector3(30, 1, 0),
    //     new THREE.Vector3(35, 1, 0), new THREE.Vector3(40, 2, 0),
    // ];

    console.log('ada', _.sortBy<THREE.Vector3>(pipeSpline, x => x.x));

    const curve = React.useMemo(
        () => new THREE.CatmullRomCurve3(_.sortBy<THREE.Vector3>(pipeSpline, x => x.x), false, 'centripetal', 1),
        // () => new THREE.CatmullRomCurve3(pipeSpline, false, 'centripetal', 1),
        [pipeSpline]
    )

    const mesh = React.useMemo(
        () => {
            const geometry = new THREE.TubeBufferGeometry(curve, 2000, 1, 100, false);
            return new THREE.Mesh(
                geometry,
                new THREE.MeshLambertMaterial({
                    color: 0xff0000,
                })
            ).add(
                new THREE.Mesh(
                    geometry,
                    new THREE.MeshBasicMaterial({
                        color: 0x000000, opacity: 0.3, wireframe: true, transparent: true
                    })
                )
            )
        },
        [curve]
    )

    return <>
        <PerspectiveCamera makeDefault={false} position={[3, 3, 3]} ref={camera}>
            {/*<mesh>*/}
            {/*    <Tube*/}
            {/*        args={[curve, 5000, 1, 100, false]}*/}
            {/*    />*/}
            {/*    <OrbitControls ref={orbitControls} zoomSpeed={1}/>*/}
            {/*    <gridHelper args={[20000, 1000]} ref={gridHelper}/>*/}
            {/*</mesh>*/}
            <primitive object={mesh}/>
            <OrbitControls ref={orbitControls} zoomSpeed={5}/>
            <gridHelper args={[20000, 1000]} ref={gridHelper}/>
        </PerspectiveCamera>
    </>
};