import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createSculptureWithGeometry, sculptToThreeJSMaterial } from 'shader-park-core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { environments } from '../environments';

export function ShaderParkPreview({ code, geometry, environment = 'plain', environmentParams = {} }) {
    const containerRef = useRef();
    const sceneRef = useRef();
    const rendererRef = useRef();
    const cameraRef = useRef();
    const controlsRef = useRef();
    const sculptureRef = useRef();
    const animationFrameRef = useRef();
    const timeRef = useRef(0);
    const resizeObserverRef = useRef(null);
    const environmentRef = useRef(null);

    useEffect(() => {
        // Setup scene
        sceneRef.current = new THREE.Scene();
        sceneRef.current.background = new THREE.Color(0x000000);
        
        // Setup camera
        cameraRef.current = new THREE.PerspectiveCamera(
            75,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );
        cameraRef.current.position.z = 4;

        // Setup renderer
        rendererRef.current = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true,
            shadowMap: true,
            shadowMapType: THREE.PCFSoftShadowMap
        });
        rendererRef.current.setPixelRatio(window.devicePixelRatio);
        rendererRef.current.setSize(
            containerRef.current.clientWidth,
            containerRef.current.clientHeight
        );
        rendererRef.current.setClearColor(new THREE.Color(0x000000), 0);
        containerRef.current.appendChild(rendererRef.current.domElement);

        // Setup controls
        controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
        controlsRef.current.enableDamping = true;
        controlsRef.current.dampingFactor = 0.25;
        controlsRef.current.zoomSpeed = 0.5;
        controlsRef.current.rotateSpeed = 0.5;

        // Handle resize
        const handleResize = () => {
            if (!containerRef.current) return;
            
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            
            if (width === 0 || height === 0) return;

            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(width, height, false);
        };
        
        // Setup ResizeObserver for container size changes
        resizeObserverRef.current = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.target === containerRef.current) {
                    handleResize();
                }
            }
        });
        
        resizeObserverRef.current.observe(containerRef.current);
        window.addEventListener('resize', handleResize);

        // Initialize environment
        if (environment && environments[environment]) {
            try {
                environmentRef.current = new environments[environment].component(
                    sceneRef.current,
                    rendererRef.current
                );
            } catch (error) {
                console.error('Error initializing environment:', error);
            }
        }

        // Animation
        const animate = () => {
            timeRef.current += 0.01;
            animationFrameRef.current = requestAnimationFrame(animate);
            
            if (sculptureRef.current) {
                sculptureRef.current.material.uniforms.time.value = timeRef.current;
            }
            
            // Update environment
            if (environmentRef.current) {
                environmentRef.current.update(timeRef.current);
            }
            
            controlsRef.current.update();
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };
        animate();

        // Initial sculpture setup
        const defaultGeometry = new THREE.SphereGeometry(1, 45, 45);
        const defaultCode = 'sphere(1.0)';
        try {
            const material = sculptToThreeJSMaterial(defaultCode);
            sculptureRef.current = new THREE.Mesh(defaultGeometry, material);
            sculptureRef.current.position.y = 2;
            sculptureRef.current.castShadow = true;
            sculptureRef.current.receiveShadow = true;
            sceneRef.current.add(sculptureRef.current);
        } catch (error) {
            console.error('Error creating initial sculpture:', error);
        }

        // Cleanup
        return () => {
            resizeObserverRef.current?.disconnect();
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameRef.current);
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
            if (sculptureRef.current) {
                sceneRef.current.remove(sculptureRef.current);
            }
            containerRef.current?.removeChild(rendererRef.current.domElement);
            if (environmentRef.current) {
                environmentRef.current.dispose();
            }
        };
    }, []);

    // Update sculpture when code changes
    useEffect(() => {
        if (!sceneRef.current || !code) return;

        try {
            if (sculptureRef.current) {
                sceneRef.current.remove(sculptureRef.current);
            }

            const material = sculptToThreeJSMaterial(code);
            const defaultGeometry = new THREE.SphereGeometry(1, 45, 45);
            sculptureRef.current = new THREE.Mesh(geometry || defaultGeometry, material);
            sculptureRef.current.position.y = 2;
            sculptureRef.current.castShadow = true;
            sculptureRef.current.receiveShadow = true;
            sceneRef.current.add(sculptureRef.current);
        } catch (error) {
            console.error('Error updating sculpture:', error);
        }
    }, [code, geometry]);

    // Update environment when it changes
    useEffect(() => {
        if (!sceneRef.current || !rendererRef.current) return;

        if (environmentRef.current) {
            environmentRef.current.dispose();
        }

        if (environment && environments[environment]) {
            try {
                environmentRef.current = new environments[environment].component(
                    sceneRef.current,
                    rendererRef.current
                );
            } catch (error) {
                console.error('Error updating environment:', error);
            }
        }
    }, [environment]);

    // Update environment when params change
    useEffect(() => {
        if (environmentRef.current && Object.keys(environmentParams).length > 0) {
            environmentRef.current.updateParams(environmentParams);
        }
    }, [environmentParams]);

    return (
        <div 
            ref={containerRef} 
            className="w-full h-full bg-gray-900"
            style={{ 
                position: 'relative',
                overflow: 'hidden'
            }}
        />
    );
}
