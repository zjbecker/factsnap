import { getDatabase, ref, set, onValue } from "firebase/database";


export function uploadAPIResults(apiResponse, userDetails, prevData, path) {

    // upload API results uploads the results from the API to firebase realtime database, along with the 
    // firebase path of the image associated with the results.

    const db = getDatabase()
    return set(ref(db, userDetails.uid), {
        posts: [
            { [`${(prevData.length + 1)}`]: { imgPath: path, results: processAPIResults(apiResponse) } },
            ...prevData

        ]
    });
}

function processAPIResults(apiResponse) {

    // Process API results removes errors and adds an index to each landmark result.  It is called by
    // upload API results
    let results = []
    apiResponse.forEach((entry, i) => {

        if (!entry.hasOwnProperty("error")) {
            entry.landmark.resultIndex = i
            results.push(entry.landmark)
        }
    })

    return results
}

export function getUserPreviousPosts(userDetails, setPrevData) {

    // get user previous posts takes all the users posts from firebase. This is needed
    // to add more posts and the length of this result determines the path of new posts (length + 1)
    // Also, there is probably a way of doing this which doesnt require reading all posts... maybe sort later?

    const db = getDatabase()

    const queryRef = ref(db, userDetails.uid);
    onValue(queryRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
            setPrevData(data.posts)
        }


    })

}