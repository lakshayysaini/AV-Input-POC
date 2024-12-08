import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import WaveSurfer from 'wavesurfer.js';
import { storeMediaBlob } from '../utils/mediaStorage';

const AudioQuestion = ({ question, onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
    const audioContextRef = useRef( null );
    const analyserRef = useRef( null );
    const dataArrayRef = useRef( null );
    const animationFrameRef = useRef( null );

  useEffect(() => {
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4F46E5',
      progressColor: '#818CF8',
      cursorColor: '#C7D2FE',
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 1,
      height: 100,
      barGap: 3,
    });

      return () => {
          wavesurferRef.current.destroy();
          if ( audioContextRef.current ) {
              audioContextRef.current.close();
          }
          if ( animationFrameRef.current ) {
              cancelAnimationFrame( animationFrameRef.current );
          }
      };
  }, []);

    const drawWaveform = () => {
        if ( !analyserRef.current || !wavesurferRef.current ) return;

        analyserRef.current.getByteTimeDomainData( dataArrayRef.current );
        const values = Array.from( dataArrayRef.current ).map( v => ( v / 128.0 ) - 1.0 );

        wavesurferRef.current.setWaveform( values, 48000 );
        animationFrameRef.current = requestAnimationFrame( drawWaveform );
    };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Set up audio context and analyser
        audioContextRef.current = new ( window.AudioContext || window.webkitAudioContext )();
        const source = audioContextRef.current.createMediaStreamSource( stream );
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048;
        source.connect( analyserRef.current );

        dataArrayRef.current = new Uint8Array( analyserRef.current.frequencyBinCount );

        const mediaRecorder = new MediaRecorder( stream, {
            mimeType: 'audio/webm;codecs=opus'
        } );
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      setIsRecording(true);
      setTimeLeft(60);
        mediaRecorder.start( 100 );
        drawWaveform();

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleStopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone');
    }
  };

    const handleStopRecording = async () => {
    clearInterval(timerRef.current);
        if ( animationFrameRef.current ) {
            cancelAnimationFrame( animationFrameRef.current );
        }
        if ( audioContextRef.current ) {
            audioContextRef.current.close();
        }

    mediaRecorderRef.current.stop();
    setIsRecording(false);

        // Wait for the last chunk
        setTimeout( async () => {
            const blob = new Blob( chunksRef.current, { type: 'audio/webm' } );
            const base64data = await storeMediaBlob( blob, 'audio' );
            onComplete( base64data );
        }, 200 );
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{question}</h2>
      <div className="bg-gray-50 p-6 rounded-lg">
        <div ref={waveformRef} className="mb-4" />
        <div className="flex justify-center">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaMicrophone />
              <span>Start Recording</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="flex items-center space-x-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              <FaStop />
              <span>Stop Recording ({timeLeft}s)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioQuestion;