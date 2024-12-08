// Utility functions for handling media storage
export const storeMediaBlob = ( blob, type ) => {
    return new Promise( ( resolve ) => {
        const reader = new FileReader();
        reader.readAsDataURL( blob );
        reader.onloadend = () => {
            const base64data = reader.result;
            resolve( base64data );
        };
    } );
};

export const createMediaBlobFromBase64 = ( base64data ) => {
    const byteString = atob( base64data.split( ',' )[1] );
    const mimeString = base64data.split( ',' )[0].split( ':' )[1].split( ';' )[0];
    const ab = new ArrayBuffer( byteString.length );
    const ia = new Uint8Array( ab );

    for ( let i = 0; i < byteString.length; i++ ) {
        ia[i] = byteString.charCodeAt( i );
    }

    return new Blob( [ab], { type: mimeString } );
};