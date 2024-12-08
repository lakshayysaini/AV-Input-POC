import { useState } from 'react';
import PermissionModal from '../components/PermissionModal';
import VideoQuestion from '../components/VideoQuestion';
import AudioQuestion from '../components/AudioQuestion';
import ReviewScreen from '../components/ReviewScreen';
import '../App.css';

const questions = [
    {
        id: 1,
        type: 'video',
        question: 'Please introduce yourself and tell us about your background.',
    },
    {
        id: 2,
        type: 'video',
        question: 'What are your greatest strengths and how do you apply them?',
    },
    {
        id: 3,
        type: 'audio',
        question: 'Describe a challenging situation you\'ve faced and how you handled it.',
    },
    {
        id: 4,
        type: 'audio',
        question: 'What are your career goals for the next five years?',
    },
];

function MainAVPage() {
    const [permissionsGranted, setPermissionsGranted] = useState( false );
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState( 0 );
    const [answers, setAnswers] = useState( [] );
    const [isComplete, setIsComplete] = useState( false );

    const handlePermissionsGranted = () => {
        setPermissionsGranted( true );
    };

    const handleAnswerComplete = ( response ) => {
        const newAnswers = [...answers, {
            question: questions[currentQuestionIndex].question,
            type: questions[currentQuestionIndex].type,
            response
        }];
        setAnswers( newAnswers );

        if ( currentQuestionIndex < questions.length - 1 ) {
            setCurrentQuestionIndex( currentQuestionIndex + 1 );
        } else {
            setIsComplete( true );
            // Store in localStorage
            localStorage.setItem( 'quizAnswers', JSON.stringify( newAnswers ) );
        }
    };

    if ( !permissionsGranted ) {
        return <PermissionModal onGrantPermissions={ handlePermissionsGranted } />;
    }

    if ( isComplete ) {
        return <ReviewScreen answers={ answers } />;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto py-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="text-2xl font-bold">Interview Questions</h1>
                                <span className="text-gray-500">
                                    Question { currentQuestionIndex + 1 } of { questions.length }
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={ {
                                        width: `${ ( ( currentQuestionIndex + 1 ) / questions.length ) * 100 }%`,
                                    } }
                                />
                            </div>
                        </div>

                        { currentQuestion.type === 'video' ? (
                            <VideoQuestion
                                question={ currentQuestion.question }
                                onComplete={ handleAnswerComplete }
                            />
                        ) : (
                            <AudioQuestion
                                question={ currentQuestion.question }
                                onComplete={ handleAnswerComplete }
                            />
                        ) }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainAVPage;