import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { storeMediaBlob } from '../utils/mediaStorage';

const AudioQuestion = ({ question, onComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
    const canvasRef = useRef( null );
    const audioContextRef = useRef( null );
    const analyserRef = useRef( null );
    const animationFrameRef = useRef( null );

  useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext( '2d' );

      // Set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      return () => {
        if ( audioContextRef.current ) {
            audioContextRef.current.close();
        }
        if ( animationFrameRef.current ) {
            cancelAnimationFrame( animationFrameRef.current );
        }
    };
  }, []);

    const drawWaveform = () => {
      if ( !analyserRef.current || !canvasRef.current ) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext( '2d' );
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array( bufferLength );

      analyserRef.current.getByteTimeDomainData( dataArray );

      ctx.fillStyle = 'rgb(240, 240, 240)';
      ctx.fillRect( 0, 0, canvas.width, canvas.height );
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#4F46E5';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for ( let i = 0; i < bufferLength; i++ ) {
          const v = dataArray[i] / 128.0;
          const y = ( v * canvas.height ) / 2;

          if ( i === 0 ) {
              ctx.moveTo( x, y );
          } else {
              ctx.lineTo( x, y );
          }

          x += sliceWidth;
      }

      ctx.lineTo( canvas.width, canvas.height / 2 );
      ctx.stroke();

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
          <div className="bg-gray-50 p-6 rounded-lg relative">
              { isRecording && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full">
                      { timeLeft }s
                  </div>
              ) }
              <canvas
                  ref={ canvasRef }
                  className="w-full h-[100px] mb-4 rounded border border-gray-200"
              />
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
                              <span>Stop Recording</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioQuestion;