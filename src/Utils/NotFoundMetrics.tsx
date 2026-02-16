import React, { useEffect, useRef, type CSSProperties } from 'react';
import * as THREE from 'three';

const NotFoundThreeJS: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
            antialias: true,
        });
        rendererRef.current = renderer;
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Create multiple rotating cubes
        const cubes: THREE.Mesh[] = [];
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

        for (let i = 0; i < 50; i++) {
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color(`hsl(${Math.random() * 360}, 70%, 60%)`),
                transparent: true,
                opacity: 0.7,
            });

            const cube = new THREE.Mesh(geometry, material);
            cube.position.x = (Math.random() - 0.5) * 10;
            cube.position.y = (Math.random() - 0.5) * 10;
            cube.position.z = (Math.random() - 0.5) * 10;
            cube.rotation.x = Math.random() * Math.PI;
            cube.rotation.y = Math.random() * Math.PI;

            scene.add(cube);
            cubes.push(cube);
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            cubes.forEach((cube, index) => {
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;

                // Floating effect
                cube.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
            });

            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cubes.forEach((cube) => {
                cube.geometry.dispose();
                (cube.material as THREE.Material).dispose();
            });
            renderer.dispose();
        };
    }, []);

    const containerStyle: CSSProperties = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    };

    const canvasStyle: CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
    };

    const contentStyle: CSSProperties = {
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
    };

    const errorCodeStyle: CSSProperties = {
        fontSize: '180px',
        fontWeight: 900,
        background: 'linear-gradient(135deg, #00f5ff 0%, #ff00ff 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '20px',
        letterSpacing: '20px',
        animation: 'pulse 2s ease-in-out infinite',
        filter: 'drop-shadow(0 0 20px rgba(0, 245, 255, 0.5))',
    };

    const titleStyle: CSSProperties = {
        fontSize: '48px',
        color: '#fff',
        marginBottom: '20px',
        fontWeight: 700,
        textShadow: '0 0 10px rgba(0, 245, 255, 0.5)',
    };

    const descriptionStyle: CSSProperties = {
        fontSize: '20px',
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: '40px',
        maxWidth: '600px',
        marginLeft: 'auto',
        marginRight: 'auto',
        lineHeight: '1.8',
    };

    const buttonStyle: CSSProperties = {
        padding: '18px 50px',
        background: 'linear-gradient(135deg, #00f5ff 0%, #ff00ff 100%)',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: '50px',
        fontWeight: 700,
        fontSize: '18px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(0, 245, 255, 0.3)',
        transition: 'all 0.3s ease',
    };

    const keyframes = `
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
  `;

    return (
        <>
            <style>{keyframes}</style>
            <div style={containerStyle}>
                {/* Three.js Canvas */}
                <canvas ref={canvasRef} style={canvasStyle} />

                <div style={contentStyle}>
                    <div style={errorCodeStyle}>404</div>

                    <h1 style={titleStyle}>Enter the Matrix</h1>

                    <p style={descriptionStyle}>
                        You've stumbled into a dimension where this page doesn't exist.
                        Time to return to reality!
                    </p>

                    <button
                        style={buttonStyle}
                        onClick={() => window.location.href = '/'}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 245, 255, 0.5)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1) translateY(0)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 245, 255, 0.3)';
                        }}
                    >
                        Exit the Matrix
                    </button>
                </div>
            </div>
        </>
    );
};

export default NotFoundThreeJS;