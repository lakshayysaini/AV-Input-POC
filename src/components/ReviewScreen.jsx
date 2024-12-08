import React from 'react';
import { FaVideo, FaMicrophone } from 'react-icons/fa';

const ReviewScreen = ( { answers } ) => {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Review Your Responses</h2>
            <div className="space-y-8">
                { answers.map( ( answer, index ) => (
                    <div key={ index } className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex items-center space-x-3 mb-4">
                            { answer.type === 'video' ? (
                                <FaVideo className="text-blue-500 text-xl" />
                            ) : (
                                <FaMicrophone className="text-blue-500 text-xl" />
                            ) }
                            <h3 className="text-xl font-semibold">Question { index + 1 }</h3>
                        </div>
                        <p className="text-gray-600 mb-4">{ answer.question }</p>
                        { answer.type === 'video' ? (
                            <video
                                src={ answer.response }
                                controls
                                className="w-full rounded-lg"
                            />
                        ) : (
                            <audio
                                src={ answer.response }
                                controls
                                className="w-full"
                            />
                        ) }
                    </div>
                ) ) }
            </div>
        </div>
    );
};

export default ReviewScreen;