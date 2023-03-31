import { getDatabase, ref, set } from "firebase/database";


export function uploadAPIResults(apiResponse, userDetails, prevData, path) {

    const db = getDatabase()

    return set(ref(db, userDetails.uid), {
        posts: [
            {[`${(prevData.length + 1)}`]: {imgPath : path, results: processAPIResults(apiResponse)}},
            ...prevData

        ]
    });
}



function processAPIResults(apiResponse) {

    let results = []


    apiResponse.forEach((entry, i) => {


        if (!entry.hasOwnProperty("error")) {
            entry.landmark.resultIndex = i
            results.push(entry.landmark)

        }
    })

    return results

}
