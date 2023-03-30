import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';


export const uploadImage = async (image, setUploaded) => {


    /* This function uploads images to firebase storage. For now, the path (storage ref) is a placeholder -
    this will need updating when we want to encorporate user functionality */

    // resisedImage compresses the image to get it under google APIs max size threshold (1MB)

    const resizedImage = await manipulateAsync(
        image,
        [{resize: {width: 1000}}],
        { compress: 1, format: SaveFormat.PNG }
    );


    // const blob loads the image from memory into a form that can be uploaded

    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function () {
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        
        xhr.open('GET', resizedImage.uri, true);
        xhr.send(null);
    })

    // This last bit is where the actual uploading is performed

    const storage = getStorage()
    const storageRef = ref(storage, `placeholder/${Math.random()}.jpg`)

    uploadBytes(storageRef, blob).then((snapshot) => {
        setUploaded(true)
        console.log("uploaded")
    })

}

export const downloadImageUri = (path) => {   // CURRENTLY UNUSED

    /* This function is used to get the actual uri of the stored image.  We need to pass it a path,
    which will be stored in realtime database and saved at the same time we save the image. */

    const storage = getStorage()
    return getDownloadURL(ref(storage, path))
        .then((url) => {
            console.log(url)
            return url
        })
        .catch((error) => {
            console.log(error)
        })


}

