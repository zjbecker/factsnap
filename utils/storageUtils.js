import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { requestInfoAPI } from "./axios"


export const uploadImage = async (image, userDetails = {uid: "test"}, postNo, path) => {


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
    const storageRef = ref(storage, `${userDetails.uid}/${postNo}.jpg`)

    return uploadBytes(storageRef, blob).then((snapshot) => {


        return downloadImageUri(path)
            .then((uri) => {
                return requestInfoAPI(uri)
                // return {   // test data in place of api
                //     data: [
                //         {
                //             error: "404: Wiki"
                //         },
                //         {
                //             landmark: {
                //                 extract: "The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.",
                //                 img_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/320px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
                //                 title: "FAKE DATA LOL"
                //             }
                //         },
                //         {
                //             landmark: {
                //                 extract: "This place is quite fun",
                //                 img_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/320px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
                //                 title: "Legoland"
                //             }
                //         }
                //     ]
                // }

            })

    })

}

export const downloadImageUri = (path) => { 

    /* This function is used to get the actual uri of the stored image.  We need to pass it a path,
    which will be stored in realtime database and saved at the same time we save the image. This
    result is also what is passed to the API */

    const storage = getStorage()
    return getDownloadURL(ref(storage, path))
        .then((url) => {
            return url
        })
        .catch((error) => {
            console.log(error)
        })


}

