import { getDatabase, ref, set, onValue, get } from "firebase/database";
import { downloadImageUri } from "./storageUtils";


export function uploadAPIResults(apiResponse, userDetails, prevData, path) {

    
    // upload API results uploads the results from the API to firebase realtime database, along with the 
    // firebase path of the image associated with the results. It also returns the full uri of the image 
    // uploaded to storage so that it can be passed into state. 
    
    let imageUriFromStorage = ""
    const db = getDatabase()

    return downloadImageUri(path).then((uri) => {
        imageUriFromStorage = uri
        return set(ref(db, userDetails.uid), {

            posts: [
                { [`${(prevData.length + 1)}`]: { imgPath: path, results: processAPIResults(apiResponse), imgUri: imageUriFromStorage} },
                ...prevData
    
            ]
        })
        .then(() => {
            return imageUriFromStorage
        });

    })

}

function processAPIResults(apiResponse) {

    // Process API results removes errors and adds an index to each landmark result.  It is called by
    // upload API results
    let results = []
    
    apiResponse.forEach((entry, i) => {

        if (!entry.hasOwnProperty("error")) {
            entry.resultIndex = i
            results.push(entry)
        }
    })

    return results
}

export function getUserPostsData(userDetails) {

    // takes all the users posts from firebase. This is needed
    // to add more posts and the length of this result determines the path of new posts (length + 1)
    // Also, there is probably a way of doing this which doesnt require reading all posts... maybe sort later?

    const db = getDatabase()
    const queryRef = ref(db, (`${userDetails.uid}/posts`));
    return get(queryRef)
    .then( (snapshot) => {
        const results = snapshot.val()
        return results

    })
}