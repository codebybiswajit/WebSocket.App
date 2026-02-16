import { useState, useEffect, type CSSProperties } from 'react';
import { motion, type Variants } from 'framer-motion';

interface MousePosition {
    x: number;
    y: number;
}

interface Shape {
    size: number;
    top: string;
    left: string;
    delay: number;
}

const NotFound = () => {
    const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent): void => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const containerStyle: CSSProperties = {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    };

    const contentStyle: CSSProperties = {
        textAlign: 'center',
        position: 'relative',
        zIndex: 10,
    };

    const errorCodeStyle: CSSProperties = {
        fontSize: '180px',
        fontWeight: 900,
        color: '#fff',
        textShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        marginBottom: '20px',
        letterSpacing: '-5px',
        lineHeight: 1,
    };

    const titleStyle: CSSProperties = {
        fontSize: '36px',
        color: '#fff',
        marginBottom: '15px',
        fontWeight: 700,
    };

    const descriptionStyle: CSSProperties = {
        fontSize: '18px',
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: '40px',
        maxWidth: '500px',
        marginLeft: 'auto',
        marginRight: 'auto',
        lineHeight: '1.6',
    };

    const buttonStyle: CSSProperties = {
        display: 'inline-block',
        padding: '15px 40px',
        background: '#fff',
        color: '#667eea',
        textDecoration: 'none',
        borderRadius: '50px',
        fontWeight: 600,
        fontSize: '16px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
    };

    const floatingShapeStyle = (size: number, color: string): CSSProperties => ({
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        borderRadius: '50%',
        opacity: 0.1,
    });

    const glitchTextVariants: Variants = {
        initial: { opacity: 0, y: -50 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: 'easeOut',
            },
        },
    };

    const floatVariants: Variants = {
        animate: {
            y: [0, -20, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    const shapeVariants = (delay: number): Variants => ({
        animate: {
            x: [0, 30, -20, 40, 0],
            y: [0, -30, 20, 10, 0],
            rotate: [0, 90, 180, 270, 360],
            transition: {
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
                delay: delay,
            },
        },
    });

    const buttonVariants: Variants = {
        hover: {
            scale: 1.05,
            y: -3,
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
            transition: {
                duration: 0.3,
            },
        },
        tap: {
            scale: 0.95,
        },
    };

    const letterVariants: Variants = {
        initial: { opacity: 0, y: 50 },
        animate: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: 'easeOut',
            },
        }),
    };

    const orbitContainerStyle: CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '300px',
        height: '300px',
        marginLeft: '-150px',
        marginTop: '-150px',
        pointerEvents: 'none',
    };

    const orbitDotStyle: CSSProperties = {
        position: 'absolute',
        width: '20px',
        height: '20px',
        background: '#fff',
        borderRadius: '50%',
        opacity: 0.3,
        top: '50%',
        left: '50%',
        marginLeft: '-10px',
        marginTop: '-10px',
    };

    const shapes: Shape[] = [
        { size: 80, top: '20%', left: '10%', delay: 0 },
        { size: 60, top: '60%', left: '80%', delay: 3 },
        { size: 100, top: '70%', left: '15%', delay: 6 },
        { size: 50, top: '30%', left: '85%', delay: 9 },
        { size: 70, top: '50%', left: '50%', delay: 12 },
    ];

    const handleHomeClick = (): void => {
        window.location.href = '/';
    };

    return (
        <div style={containerStyle}>
            {/* Animated floating shapes */}
            {shapes.map((shape: Shape, index: number) => (
                <motion.div
                    key={index}
                    style={{
                        ...floatingShapeStyle(shape.size, '#fff'),
                        top: shape.top,
                        left: shape.left,
                    }}
                    variants={shapeVariants(shape.delay)}
                    animate="animate"
                />
            ))}

            {/* Parallax effect on main content */}
            <motion.div
                style={contentStyle}
                animate={{
                    x: mousePosition.x,
                    y: mousePosition.y,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 50,
                    damping: 20,
                }}
            >
                {/* Animated 404 */}
                <motion.div
                    style={errorCodeStyle}
                    variants={floatVariants}
                    animate="animate"
                >
                    {['4', '0', '4'].map((char: string, i: number) => (
                        <motion.span
                            key={i}
                            custom={i}
                            variants={letterVariants}
                            initial="initial"
                            animate="animate"
                            style={{ display: 'inline-block' }}
                        >
                            {char}
                        </motion.span>
                    ))}
                </motion.div>

                {/* Title */}
                <motion.h1
                    style={titleStyle}
                    variants={glitchTextVariants}
                    initial="initial"
                    animate="animate"
                >
                    Oops! Page Not Found
                </motion.h1>

                {/* Description */}
                <motion.p
                    style={descriptionStyle}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    The page you're looking for seems to have wandered off into the digital
                    wilderness. Don't worry, it happens to the best of us!
                </motion.p>

                {/* Animated Button */}
                <motion.button
                    style={buttonStyle}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    onClick={handleHomeClick}
                >
                    Take Me Home
                </motion.button>

                {/* Orbiting elements */}
                <motion.div style={orbitContainerStyle}>
                    {[0, 1, 2].map((i: number) => (
                        <motion.div
                            key={i}
                            style={orbitDotStyle}
                            animate={{
                                rotate: 360,
                                x: Math.cos((i * 2 * Math.PI) / 3) * 150,
                                y: Math.sin((i * 2 * Math.PI) / 3) * 150,
                            }}
                            transition={{
                                rotate: {
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: 'linear',
                                },
                                x: {
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: 'linear',
                                },
                                y: {
                                    duration: 10,
                                    repeat: Infinity,
                                    ease: 'linear',
                                },
                            }}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotFound;