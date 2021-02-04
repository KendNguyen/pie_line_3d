import * as React from 'react'
import * as THREE from 'three'
import {ReactThreeFiber} from 'react-three-fiber'
import {LineGeometry} from 'three/examples/jsm/lines/LineGeometry'
import {LineMaterial, LineMaterialParameters} from 'three/examples/jsm/lines/LineMaterial'
import {Line2} from 'three/examples/jsm/lines/Line2'
import {CurveModifier, CurveModifierRef} from "../modifiers/CurveModifier";

type Props = {
    points: [number, number, number][]
    color?: THREE.Color | string | number
    vertexColors?: [number, number, number][]
    lineWidth?: number
} & Omit<ReactThreeFiber.Object3DNode<Line2, typeof Line2>, 'args'> &
    Omit<ReactThreeFiber.Object3DNode<LineMaterial, [LineMaterialParameters]>,
        'color' | 'vertexColors' | 'resolution' | 'args'>

export const Line = React.forwardRef<Line2, Props>(function Line(
    // eslint-disable-next-line react/prop-types
    {points, color = 'black', vertexColors, lineWidth, dashed, ...rest},
    ref
) {
    const curveRef = React.useRef<CurveModifierRef>()
    const [line2] = React.useState(() => new Line2())
    const [lineMaterial] = React.useState(() => new LineMaterial())
    const [resolution] = React.useState(() => new THREE.Vector2(512, 512))

    const lineGeom = React.useMemo(() => {
        const geom = new LineGeometry()
        // eslint-disable-next-line react/prop-types
        geom.setPositions(points.flat())

        if (vertexColors) {
            // eslint-disable-next-line react/prop-types
            geom.setColors(vertexColors.flat())
        }

        return geom
    }, [points, vertexColors])

    React.useEffect(() => {
        line2.computeLineDistances()
    }, [line2])

    React.useLayoutEffect(() => {
        if (dashed) {
            lineMaterial.defines.USE_DASH = ''
        } else {
            // Setting lineMaterial.defines.USE_DASH to undefined is apparently not sufficient.
            delete lineMaterial.defines.USE_DASH
        }
        lineMaterial.needsUpdate = true
    }, [dashed, lineMaterial])

    const handlePos = React.useMemo(
        () =>
            // eslint-disable-next-line react/prop-types
            points.map((hand) => new THREE.Vector3(...hand)),
        []
    )


    const curve = React.useMemo(
        () => new THREE.CatmullRomCurve3(handlePos, true, 'centripetal'),
        [handlePos]
    )

    const line = React.useMemo(
        () => {
            new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(curve.getPoints(50)),
                new THREE.LineBasicMaterial({
                    color: 0xff0000,
                    opacity: 1
                })
            )
        },
        [curve]
    )

    return (
        <primitive dispose={undefined} object={line2} ref={ref} {...rest}>
            <primitive dispose={undefined} object={lineGeom} attach="geometry"/>
            <primitive
                dispose={undefined}
                object={lineMaterial}
                attach="material"
                color={color}
                vertexColors={Boolean(vertexColors)}
                resolution={resolution}
                linewidth={lineWidth}
                dashed={dashed}
                {...rest}
            />
        </primitive>
    )

    // return <>
    //     <CurveModifier ref={curveRef} curve={curve}>
    //         <mesh>
    //             <meshNormalMaterial attach="material"/>
    //             <primitive object={line}/>
    //         </mesh>
    //     </CurveModifier>
    // </>
})