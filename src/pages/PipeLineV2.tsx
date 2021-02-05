import * as React from "react"
import * as THREE from "three";
import {CameraHelper, GridHelper} from "three";
import {TransformControls as TransformControlsImpl} from 'three/examples/jsm/controls/TransformControls'
import {CurveModifierRef, OrbitControls, useHelper} from "../three";
import {data} from "../resource/json/original";
import _ from 'lodash'
import {useFrame} from "react-three-fiber";

// eslint-disable-next-line @typescript-eslint/ban-types
type Props = {};
export const PipeLine = (props: Props) => {
    const curveRef = React.useRef<CurveModifierRef>()
    const orbitControls = React.useRef<OrbitControls>(null!)
    const transformControls = React.useRef<TransformControlsImpl>(null!)
    const gridHelper = React.useRef<GridHelper>(null!)
    const camera = React.useRef<THREE.PerspectiveCamera>(null!)

    const direction = new THREE.Vector3();
    const binormal = new THREE.Vector3();
    const normal = new THREE.Vector3();
    const lookAt = new THREE.Vector3();
    const position = new THREE.Vector3();

    // const pipeSpline = data.map<THREE.Vector3>(value => {
    //     return new THREE.Vector3(
    //         parseInt((value.N * 100).toString().slice(4, 8)),
    //         parseInt((value.E * 100).toString().slice(4, 8)),
    //         value.DEPTH / 100,
    //     )
    // });

    const pipeSpline = _.sortBy<THREE.Vector3>(
        data.map<THREE.Vector3>(value => {
            return new THREE.Vector3(
                Math.abs((value.N - 947823) * 100),
                value.DEPTH / 10,
                Math.abs((value.E - 249131)),
            )
        }), x => x.x);

    // const pipeSpline = [
    //     new THREE.Vector3(0, 0, 0), new THREE.Vector3(10, 1, 0),
    //     new THREE.Vector3(20, -1, 0), new THREE.Vector3(30, 1, 0),
    //     new THREE.Vector3(35, 1, 0), new THREE.Vector3(40, 2, 0),
    // ];


    const curve = React.useMemo(
        () => new THREE.CatmullRomCurve3(pipeSpline, false, 'centripetal', 1),
        // () => new THREE.CatmullRomCurve3(pipeSpline, false, 'centripetal', 1),
        [pipeSpline]
    )

    const mesh = React.useMemo(
        () => {
            const geometry = new THREE.TubeBufferGeometry(curve, 2000, 2, 100, false);
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
    useHelper(camera, CameraHelper, 1, 'hotpink')
    useFrame(state => {
        const time = Date.now();
        const looptime = 10 * 1000;
        const t = (time % looptime) / looptime;
        mesh.geometry.parameters.path.getPointAt(t, position)
        position.multiplyScalar(2);

        // interpolation
        const segments = mesh.geometry.tangents.length;
        const pickt = t * segments;
        const pick = Math.floor(pickt);
        const pickNext = (pick + 1) % segments;

        binormal.subVectors(mesh.geometry.binormals[pickNext], mesh.geometry.binormals[pick]);
        binormal.multiplyScalar(pickt - pick).add(mesh.geometry.binormals[pick]);

        mesh.geometry.parameters.path.getTangentAt(t, direction);
        const offset = 15;

        normal.copy(binormal).cross(direction);
        // we move on a offset on its binormal

        position.add(normal.clone().multiplyScalar(offset));

        if (camera.current) {
            camera.current.position.copy(position);
        }

        mesh.geometry.parameters.path.getPointAt((t + 30 / mesh.geometry.parameters.path.getLength()) % 1, lookAt);
        lookAt.multiplyScalar(2);
        camera.current.matrix.lookAt(camera.current.position, lookAt, normal);
        camera.current.quaternion.setFromRotationMatrix(camera.current.matrix);

    });
    console.log(' mesh.geometry', mesh.geometry);
    return <>
        <perspectiveCamera position={pipeSpline[0]} ref={camera}>
            {/*<mesh>*/}
            {/*    <Tube*/}
            {/*        args={[curve, 5000, 1, 100, false]}*/}
            {/*    />*/}
            {/*    <OrbitControls ref={orbitControls} zoomSpeed={1}/>*/}
            {/*    <gridHelper args={[20000, 1000]} ref={gridHelper}/>*/}
            {/*</mesh>*/}
        </perspectiveCamera>
        <primitive object={mesh}/>
        <OrbitControls ref={orbitControls} zoomSpeed={5}/>
        <gridHelper args={[200000, 1000]} ref={gridHelper}/>
    </>
};