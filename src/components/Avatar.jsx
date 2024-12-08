import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';

const Avatar = ( { isSpoken, text } ) => {
    const group = useRef();
    const { nodes, materials, animations } = useGLTF( 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb' );

    const { actions } = useAnimations( animations, group );

    useEffect( () => {
        // If the avatar has an "Idle" animation, play it by default
        if ( actions.Idle ) {
            actions.Idle.play();
        }
    }, [actions] );

    useFrame( ( state, delta ) => {
        if ( isSpoken && nodes.Head ) {
            // Animate jaw for speech
            nodes.Head.rotation.x = Math.sin( state.clock.elapsedTime * 15 ) * 0.1;
        }
    } );

    return (
        <group ref={ group } position={ [0, -1, 0] } scale={ [1.5, 1.5, 1.5] }>
            <primitive object={ nodes.Hips } />
            <skinnedMesh
                name="EyeLeft"
                geometry={ nodes.EyeLeft.geometry }
                material={ materials.Wolf3D_Eye }
                skeleton={ nodes.EyeLeft.skeleton }
                morphTargetDictionary={ nodes.EyeLeft.morphTargetDictionary }
                morphTargetInfluences={ nodes.EyeLeft.morphTargetInfluences }
            />
            <skinnedMesh
                name="EyeRight"
                geometry={ nodes.EyeRight.geometry }
                material={ materials.Wolf3D_Eye }
                skeleton={ nodes.EyeRight.skeleton }
                morphTargetDictionary={ nodes.EyeRight.morphTargetDictionary }
                morphTargetInfluences={ nodes.EyeRight.morphTargetInfluences }
            />
            <skinnedMesh
                name="Wolf3D_Head"
                geometry={ nodes.Wolf3D_Head.geometry }
                material={ materials.Wolf3D_Skin }
                skeleton={ nodes.Wolf3D_Head.skeleton }
                morphTargetDictionary={ nodes.Wolf3D_Head.morphTargetDictionary }
                morphTargetInfluences={ nodes.Wolf3D_Head.morphTargetInfluences }
            />
            <skinnedMesh
                name="Wolf3D_Teeth"
                geometry={ nodes.Wolf3D_Teeth.geometry }
                material={ materials.Wolf3D_Teeth }
                skeleton={ nodes.Wolf3D_Teeth.skeleton }
                morphTargetDictionary={ nodes.Wolf3D_Teeth.morphTargetDictionary }
                morphTargetInfluences={ nodes.Wolf3D_Teeth.morphTargetInfluences }
            />
        </group>
    );
};

export default Avatar;