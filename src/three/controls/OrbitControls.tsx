// @flow 
import * as React from 'react';
import {forwardRef, useEffect} from "react";
import {ReactThreeFiber, useThree, useFrame, Overwrite} from 'react-three-fiber'
import {OrbitControls as OrbitControlsImpl} from 'three/examples/jsm/controls/OrbitControls'
import useEffectfulState from "../useEffectfulState";

export type OrbitControls = Overwrite<ReactThreeFiber.Object3DNode<OrbitControlsImpl, typeof OrbitControlsImpl>,
    { target?: ReactThreeFiber.Vector3 }>


export const OrbitControls = forwardRef((props: OrbitControls = {enableDamping: true}, ref) => {
    const {camera, gl, invalidate} = useThree()
    const controls = useEffectfulState<OrbitControlsImpl>(
        () => new OrbitControlsImpl(camera, gl.domElement),
        [camera, gl],
        ref as any
    )

    useFrame(() => controls?.update())

    useEffect(() => {
        controls?.addEventListener?.('change', invalidate)
        return () => controls?.removeEventListener('change', invalidate)
    }, [controls, invalidate])

    return (
        <div>

        </div>
    );
})
