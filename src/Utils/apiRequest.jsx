
const apiRequest = async(requestType,path,body) => {
    const url = `${process.env.REACT_APP_BASE_URL}/doublefollowers/v1${path}`
    const requestOptions = {
        method : requestType,
        headers : {
            'Content-Type': 'application/json',
             accept : 'application/json'
        },
        credentials : "include"
    }
    if (body) {
        requestOptions.body = JSON.stringify(body)
    }
    try {
        const resp = await fetch(url,requestOptions)
        const data = await resp.json()
        return data
    } catch (error) {
        console.log(error)
        return error
    }
}
export default apiRequest
