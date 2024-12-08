import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Webcam from 'react-webcam';
import Avatar from '../components/Avatar';
import { questions } from '../utils/questions';

const TalkingAvatarPage = () => {
    const [isStarted, setIsStarted] = useState( false );
    const [currentQuestion, setCurrentQuestion] = useState( -1 );
    const [responses, setResponses] = useState( [] );
    const [isListening, setIsListening] = useState( false );
    const [transcript, setTranscript] = useState( '' );
    const recognitionRef = useRef( null );

    useEffect( () => {
        if ( window.SpeechRecognition || window.webkitSpeechRecognition ) {
            recognitionRef.current = new ( window.SpeechRecognition || window.webkitSpeechRecognition )();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = ( event ) => {
                const current = event.resultIndex;
                const transcript = event.results[current][0].transcript;
                setTranscript( transcript );
            };
        }

        return () => {
            if ( recognitionRef.current ) {
                recognitionRef.current.stop();
            }
        };
    }, [] );

    const startAssessment = async () => {
        try {
            await navigator.mediaDevices.getUserMedia( { video: true, audio: true } );
            setIsStarted( true );
            setCurrentQuestion( 0 );
        } catch ( error ) {
            console.error( 'Error accessing media devices:', error );
            alert( 'Please grant camera and microphone permissions to continue.' );
        }
    };

    const handleStartListening = () => {
        setIsListening( true );
        recognitionRef.current.start();
    };

    const handleStopListening = () => {
        setIsListening( false );
        recognitionRef.current.stop();
        setResponses( [...responses, transcript] );
        setTranscript( '' );

        setTimeout( () => {
            if ( currentQuestion < questions.length - 1 ) {
                setCurrentQuestion( prev => prev + 1 );
            }
        }, 1000 );
    };

    const renderContent = () => {
        if ( !isStarted ) {
            return (
                <div className="flex flex-col items-center justify-center h-screen">
                    <button
                        onClick={ startAssessment }
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Start Assessment
                    </button>
                </div>
            );
        }

        if ( currentQuestion >= questions.length ) {
            return (
                <div className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Assessment Review</h2>
                    { responses.map( ( response, index ) => (
                        <div key={ index } className="mb-6 bg-white p-4 rounded-lg shadow">
                            <p className="font-semibold mb-2">Question { index + 1 }: { questions[index] }</p>
                            <p className="text-gray-700">{ response }</p>
                        </div>
                    ) ) }
                </div>
            );
        }

        return (
            <div className="flex h-screen">
                <div className="w-1/2 h-full">
                    <Canvas className="w-full h-full">
                        <ambientLight intensity={ 0.5 } />
                        <pointLight position={ [10, 10, 10] } />
                        <Avatar isSpoken={ !isListening } />
                        <OrbitControls />
                    </Canvas>
                </div>
                <div className="w-1/2 p-8 bg-gray-50">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">Question { currentQuestion + 1 }</h2>
                        <p className="text-lg">{ questions[currentQuestion] }</p>
                    </div>

                    <div className="relative">
                        <Webcam
                            audio={ false }
                            className="w-full rounded-lg mb-4"
                            mirrored={ true }
                        />

                        <div className="mt-4">
                            { !isListening ? (
                                <button
                                    onClick={ handleStartListening }
                                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Start Speaking
                                </button>
                            ) : (
                                <button
                                    onClick={ handleStopListening }
                                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Stop Speaking
                                </button>
                            ) }
                        </div>

                        { transcript && (
                            <div className="mt-4 p-4 bg-white rounded-lg shadow">
                                <p className="text-gray-700">{ transcript }</p>
                            </div>
                        ) }
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            { renderContent() }
        </div>
    );
};

export default TalkingAvatarPage;