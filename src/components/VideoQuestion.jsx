import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import { FaVideo, FaStop } from 'react-icons/fa';

const VideoQuestion = ( { question, onComplete } ) => {
    const [isRecording, setIsRecording] = useState( false );
    const [recordedChunks, setRecordedChunks] = useState( [] );
    const [timeLeft, setTimeLeft] = useState( 60 );
    const mediaRecorderRef = useRef( null );
    const timerRef = useRef( null );

    const handleStartRecording = () => {
        setRecordedChunks( [] );
        setIsRecording( true );
        setTimeLeft( 60 );

        const stream = webcamRef.current.video.srcObject;
        const mediaRecorder = new MediaRecorder( stream );
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = ( event ) => {
            if ( event.data.size > 0 ) {
                setRecordedChunks( ( prev ) => [...prev, event.data] );
            }
        };

        mediaRecorder.start();

        timerRef.current = setInterval( () => {
            setTimeLeft( ( prev ) => {
                if ( prev <= 1 ) {
                    handleStopRecording();
                    return 0;
                }
                return prev - 1;
            } );
        }, 1000 );
    };

    const handleStopRecording = () => {
        clearInterval( timerRef.current );
        mediaRecorderRef.current.stop();
        setIsRecording( false );

        setTimeout( () => {
            const blob = new Blob( recordedChunks, { type: 'video/webm' } );
            const url = URL.createObjectURL( blob );
            onComplete( url );
        }, 100 );
    };

    const webcamRef = useRef( null );

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">{ question }</h2>
            <div className="relative">
                <Webcam
                    ref={ webcamRef }
                    audio={ true }
                    className="w-full rounded-lg shadow-lg"
                />
                { isRecording && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full">
                        { timeLeft }s
                    </div>
                ) }
            </div>
            <div className="mt-6 flex justify-center">
                { !isRecording ? (
                    <button
                        onClick={ handleStartRecording }
                        className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <FaVideo />
                        <span>Start Recording</span>
                    </button>
                ) : (
                    <button
                        onClick={ handleStopRecording }
                        className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <FaStop />
                        <span>Stop Recording</span>
                    </button>
                ) }
            </div>
        </div>
    );
};

export default VideoQuestion;