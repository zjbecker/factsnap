import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { requestInfoAPI } from "./axios"


export const uploadImageAndRequestAPI = async (image, userDetails = { uid: "test" }, postNo, path) => {

    /* This function uploads images to firebase storage. For now, the path (storage ref) is a placeholder -
    this will need updating when we want to encorporate user functionality. */

    // resisedImage compresses the image to get it under google APIs max size threshold (1MB)
    // This is just a guess figure at the moment, can be refined with testing.

    const resizedImage = await manipulateAsync(
        image,
        [{ resize: { width: 1000 } }],
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

              // This bit sends the image to the backend.  There is also test data commented out here, 
              // which can replace the requestAPI line in order to not use google megabux credits and
              // reduce response time whilst testing.
              
                return requestInfoAPI(uri)
                // return {   // test data in place of api
                //     data: [
                //         {
                //           coordinates: {
                //             latitude: 51.508039,
                //             longitude: -0.128069
                //           },
                //           landmark: {
                //             extract: "Trafalgar Square is a public square in the City of Westminster, Central London, established in the early 19th century around the area formerly known as Charing Cross. The Square's name commemorates the Battle of Trafalgar, the British naval victory in the Napoleonic Wars over France and Spain that took place on 21 October 1805 off the coast of Cape Trafalgar.",
                //             img_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Trafalgar_Square%2C_London_2_-_Jun_2009.jpg/320px-Trafalgar_Square%2C_London_2_-_Jun_2009.jpg",
                //             title: "Trafalgar Square"
                //           },
                //           score: 0.8443822264671326
                //         },
                //         {
                //           coordinates: {
                //             latitude: 51.508928999999995,
                //             longitude: -0.128299
                //           },
                //           landmark: {
                //             extract: "The National Gallery is an art museum in Trafalgar Square in the City of Westminster, in Central London, England. Founded in 1824, in Trafalgar Square since 1838, it houses a collection of over 2,300 paintings dating from the mid-13th century to 1900. The current Director of the National Gallery is Gabriele Finaldi.",
                //             img_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Galer%C3%ADa_Nacional%2C_Londres%2C_Inglaterra%2C_2014-08-07%2C_DD_035.JPG/320px-Galer%C3%ADa_Nacional%2C_Londres%2C_Inglaterra%2C_2014-08-07%2C_DD_035.JPG",
                //             title: "National Gallery"
                //           },
                //           score: 0.27103060483932495
                //         }
                //       ]
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

export const extractImageUrisFromPosts = (postsData) => {

  /* This function is currently unused, it was used to retreive image URIs for all of a user's posts,
  but now full uris are stored in the realtime dabase and retreived directly. Delete later if still unused*/

    const promises = []

    postsData.forEach((post) => {
        const promise = Promise.resolve(downloadImageUri(post.imgPath))
        promises.push(promise)
    })

    return Promise.all(promises)
}

