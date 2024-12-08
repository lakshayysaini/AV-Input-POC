import React from 'react';
import { FaVideo, FaMicrophone } from 'react-icons/fa';

const PermissionModal = ( { onGrantPermissions } ) => {
    const handleRequestPermissions = async () => {
        try {
            await Promise.all( [
                navigator.mediaDevices.getUserMedia( { video: true } ),
                navigator.mediaDevices.getUserMedia( { audio: true } )
            ] );
            onGrantPermissions();
        } catch ( error ) {
            alert( 'Please grant camera and microphone permissions to continue' );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold mb-6 text-center">Permission Required</h2>
                <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <FaVideo className="text-2xl text-blue-500" />
                        <div>
                            <h3 className="font-semibold">Camera Access</h3>
                            <p className="text-sm text-gray-600">Required for video responses</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <FaMicrophone className="text-2xl text-blue-500" />
                        <div>
                            <h3 className="font-semibold">Microphone Access</h3>
                            <p className="text-sm text-gray-600">Required for audio responses</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={ handleRequestPermissions }
                    className="w-full mt-6 bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Grant Permissions
                </button>
            </div>
        </div>
    );
};

export default PermissionModal;