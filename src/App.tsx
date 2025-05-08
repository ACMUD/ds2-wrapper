import { useState, useEffect, useRef } from 'react';
import * as React from "react";

const ChevronDownIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const App: React.FC = () => {
    const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
    const [hasError, setHasError] = useState<boolean>(false);
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [scrollY, setScrollY] = useState<number>(0);
    const [activeLogoIndex, setActiveLogoIndex] = useState<number>(0);

    const iframeContainerRef = useRef<HTMLDivElement | null>(null);
    const mainContainerRef = useRef<HTMLDivElement | null>(null);
    const iframeUrl = "https://xmaux-ds-acmud.hf.space";

    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
        }

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => setDarkMode(e.matches);
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!iframeLoaded) {
                setHasError(true);
            }
        }, 10000);

        return () => clearTimeout(timeoutId);
    }, [iframeLoaded]);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const updateContainerHeight = () => {
            if (mainContainerRef.current) {
                mainContainerRef.current.style.minHeight = `${window.innerHeight * 2}px`;
            }
        };

        updateContainerHeight();
        window.addEventListener('resize', updateContainerHeight);

        return () => {
            window.removeEventListener('resize', updateContainerHeight);
        };
    }, []);

    useEffect(() => {
        const updateIframeHeight = () => {
            if (iframeContainerRef.current) {
                const viewportHeight = window.innerHeight;
                const isFullscreen = scrollY > 150;

                if (isFullscreen) {
                    iframeContainerRef.current.style.height = `${viewportHeight}px`;
                } else {
                    iframeContainerRef.current.style.height = `${Math.min(500, viewportHeight * 0.7)}px`;
                }
            }
        };

        updateIframeHeight();
        window.addEventListener('resize', updateIframeHeight);

        return () => {
            window.removeEventListener('resize', updateIframeHeight);
        };
    }, [scrollY]);

    const handleIframeLoad = (): void => {
        setIframeLoaded(true);
        setHasError(false);
    };

    const handleIframeError = (): void => {
        setHasError(true);
    };

    const retryLoading = (): void => {
        setHasError(false);
        setIframeLoaded(false);
    };

    const openInNewTab = (): void => {
        window.open(iframeUrl, '_blank');
    };

    const headerOpacity = Math.max(0, 1 - scrollY / 150);
    const isFullscreen = scrollY > 150;
    const headerVisible = headerOpacity >= 0.1;

    const getOpacityClass = (opacity: number): string => {
        if (opacity > 0.9) return "opacity-100";
        if (opacity > 0.7) return "opacity-75";
        if (opacity > 0.5) return "opacity-50";
        if (opacity > 0.2) return "opacity-25";
        if (opacity > 0.1) return "opacity-10";
        return "opacity-0";
    };

    const toggleLogo = (): void => {
        setActiveLogoIndex(activeLogoIndex === 0 ? 1 : 0);
    };

    const logos = [
        "/pygroup.png",
        "/gidata.png"
    ];

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div
                ref={mainContainerRef}
                id="main-container"
                className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-screen"
            >
                <div className="relative w-full flex flex-col items-center px-4">
                    <div className="fixed top-4 right-4 z-50">
                        <div
                            className="p-3 rounded-full"
                        >
                            <img
                                src="/acmud.png"
                                className="md:w-20 md:h-20 w-10 h-10 rounded-full"
                            />
                        </div>
                    </div>

                    <div
                        className={`
                            w-full max-w-5xl bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 ease-in-out mt-4
                            ${getOpacityClass(headerOpacity)}
                            ${headerVisible ? 'visible p-4 md:p-6 mb-6 h-auto' : 'invisible p-0 mb-0 h-0'}
                            overflow-hidden transform ${scrollY > 0 ? 'scale-90' : 'scale-100'} -translate-y-0
                            border border-emerald-300 dark:border-green-700
                        `}
                    >
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
                            <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40">
                                <div
                                    className="absolute top-0 left-0 w-full h-full z-10 cursor-pointer transition-all duration-300 ease-in-out group"
                                    onClick={toggleLogo}
                                    onMouseEnter={() => setActiveLogoIndex(0)}
                                    onTouchStart={() => setActiveLogoIndex(0)}
                                    style={{
                                        transform: activeLogoIndex === 0 ? 'rotate(-5deg) translateY(0)' : 'rotate(-5deg) translateY(10px)',
                                        zIndex: activeLogoIndex === 0 ? 20 : 10
                                    }}
                                >
                                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-emerald-300 dark:border-emerald-400 w-full h-full transition-all duration-300 group-hover:rotate-0 group-hover:shadow-xl">
                                        <img
                                            src={logos[0]}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>

                                <div
                                    className="absolute top-0 left-0 w-full h-full cursor-pointer transition-all duration-300 ease-in-out group"
                                    onClick={toggleLogo}
                                    onMouseEnter={() => setActiveLogoIndex(1)}
                                    onTouchStart={() => setActiveLogoIndex(1)}
                                    style={{
                                        transform: activeLogoIndex === 1 ? 'rotate(5deg) translateY(0)' : 'rotate(5deg) translateY(10px)',
                                        zIndex: activeLogoIndex === 1 ? 20 : 10
                                    }}
                                >
                                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-emerald-300 dark:border-emerald-600 w-full h-full transition-all duration-300 group-hover:rotate-0 group-hover:shadow-xl">
                                        <img
                                            src={logos[1]}
                                            alt="Logo alternativo"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2 text-center sm:text-left transition-colors duration-300">
                                    <span className="text-emerald-600 dark:text-emerald-400">Introducción</span> a Ciencia de Datos
                                </h1>
                                <p className="text-gray-700 dark:text-gray-300 text-center sm:text-left transition-colors duration-300">
                                    Este notebook interactivo te servirá de guia para avanzar en tu aprendizaje en la ciencia de datos.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`
                            text-gray-600 dark:text-gray-400 text-center transition-all duration-300
                            ${getOpacityClass(headerOpacity)}
                            ${headerVisible ? 'h-auto mb-4' : 'h-0 mb-0'}
                            overflow-hidden
                        `}
                    >
                        <ChevronDownIcon className="w-8 h-8 mx-auto animate-bounce" />
                        <p>Haz scroll para expandir</p>
                    </div>

                    <div
                        ref={iframeContainerRef}
                        className={`
                            w-full max-w-5xl bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all duration-300 overflow-hidden
                            ${isFullscreen ? 'fixed top-0 left-0 right-0 w-full max-w-full z-30 rounded-none p-0' : 'relative'}
                            m-0 transition-all duration-300 ease-out border border-emerald-300 dark:border-emerald-600
                        `}
                    >
                        <div className={`
                            w-full h-full bg-gray-50 dark:bg-gray-800 transition-colors duration-300
                            ${isFullscreen ? 'rounded-none border-0' : 'rounded-md border-2'}
                            ${darkMode ? 'border-emerald-600' : 'border-emerald-300'}
                        `}>
                            {!hasError ? (
                                <iframe
                                    src={iframeUrl}
                                    className="w-full h-full border-0"
                                    onLoad={handleIframeLoad}
                                    onError={handleIframeError}
                                    title="Contenido externo"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center p-6">
                                    <div className="text-red-500 dark:text-red-400 mb-4 transition-colors duration-300">
                                        <svg
                                            className="w-16 h-16 mx-auto mb-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 text-center transition-colors duration-300">
                                            No se pudo cargar el contenido
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400 text-center mb-4 transition-colors duration-300">
                                            El contenido externo no se ha cargado correctamente.
                                            Por favor, intente nuevamente más tarde o abra el contenido en una nueva pestaña.
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                                        <button
                                            onClick={retryLoading}
                                            className="bg-emerald-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
                                        >
                                            Intentar nuevamente
                                        </button>
                                        <button
                                            onClick={openInNewTab}
                                            className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 border border-emerald-400 dark:border-emerald-600"
                                        >
                                            Abrir en nueva pestaña
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {!iframeLoaded && !hasError && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 p-4 rounded-full shadow-lg z-40">
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 dark:border-emerald-400 transition-colors duration-300"></div>
                                    <span className="ml-2 text-gray-600 dark:text-gray-300 font-medium transition-colors duration-300">Cargando...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="py-screen"></div>
                </div>
            </div>
        </div>
    );
};

export default App;